"""
Celery worker tasks for document processing and AI scanning.
"""
import json
import logging
from typing import List, Dict, Any
from celery_app import celery_app
from database import SessionLocal
from models import Document, DocumentPage, Scan, ScanResult, Gap, Requirement, Control, EvidenceLink
from text_extraction import text_extractor
from ai_scanner import compliance_scanner
from storage import storage

logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def extract_document_text(self, document_id: str):
    """
    Extract text from uploaded document and store in document_pages table.
    """
    db = SessionLocal()
    try:
        # Get document from database
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document {document_id} not found")
        
        logger.info(f"Starting text extraction for document {document.filename}")
        
        # Download file from storage
        file_content = storage.download_file(document.storage_key)
        
        # Extract text pages
        pages = text_extractor.extract_text(
            file_content, 
            document.filename, 
            document.mime_type
        )
        
        # Store extracted text in database
        for page_data in pages:
            doc_page = DocumentPage(
                document_id=document.id,
                page_num=page_data["page_num"],
                text=page_data["text"]
            )
            db.add(doc_page)
        
        db.commit()
        
        logger.info(f"Text extraction completed for document {document.filename}. Extracted {len(pages)} pages.")
        
        return {
            "status": "success",
            "document_id": str(document.id),
            "pages_extracted": len(pages)
        }
        
    except Exception as e:
        logger.error(f"Error extracting text for document {document_id}: {str(e)}")
        db.rollback()
        raise self.retry(exc=e, countdown=60, max_retries=3)
    finally:
        db.close()

@celery_app.task(bind=True)
def process_scan(self, scan_id: str):
    """
    Process a compliance scan using AI.
    """
    db = SessionLocal()
    try:
        # Get scan from database
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            raise ValueError(f"Scan {scan_id} not found")
        
        logger.info(f"Starting compliance scan {scan_id} for control {scan.control.code}")
        
        # Update scan status
        scan.status = 'processing'
        scan.model = 'gpt-4'
        scan.prompt_version = 'v1.0'
        db.commit()
        
        # Get control and requirements
        control = scan.control
        requirements = db.query(Requirement).filter(Requirement.control_id == control.id).all()
        
        # Get linked evidence documents
        evidence_links = db.query(EvidenceLink).filter(
            EvidenceLink.org_id == scan.org_id,
            EvidenceLink.control_id == control.id
        ).all()
        
        if not evidence_links:
            logger.warning(f"No evidence linked to control {control.code} for scan {scan_id}")
            scan.status = 'completed'
            db.commit()
            return {"status": "completed", "message": "No evidence to scan"}
        
        # Gather evidence text
        evidence_texts = []
        for link in evidence_links:
            document_pages = db.query(DocumentPage).filter(
                DocumentPage.document_id == link.document_id
            ).all()
            
            for page in document_pages:
                if page.text:
                    evidence_texts.append({
                        "document_id": str(link.document_id),
                        "document_name": link.document.filename,
                        "page_num": page.page_num,
                        "text": page.text
                    })
        
        # Run AI scan
        scan_results = compliance_scanner.scan_control(
            control=control,
            requirements=requirements,
            evidence_texts=evidence_texts
        )
        
        # Store scan results
        for result in scan_results["requirements"]:
            scan_result = ScanResult(
                scan_id=scan.id,
                requirement_id=result["requirement_id"],
                outcome=result["outcome"],
                confidence=str(result["confidence"]),
                rationale_json=json.dumps(result["rationale"]),
                citations_json=json.dumps(result["citations"])
            )
            db.add(scan_result)
        
        # Store gaps
        for gap in scan_results["gaps"]:
            gap_record = Gap(
                scan_id=scan.id,
                requirement_id=gap["requirement_id"],
                gap_summary=gap["summary"],
                recommended_actions_json=json.dumps(gap["recommended_actions"])
            )
            db.add(gap_record)
        
        # Update scan status
        scan.status = 'completed'
        db.commit()
        
        logger.info(f"Compliance scan {scan_id} completed successfully")
        
        return {
            "status": "success",
            "scan_id": str(scan.id),
            "requirements_processed": len(scan_results["requirements"]),
            "gaps_found": len(scan_results["gaps"])
        }
        
    except Exception as e:
        logger.error(f"Error processing scan {scan_id}: {str(e)}")
        # Update scan status to failed
        scan.status = 'failed'
        db.commit()
        db.rollback()
        raise self.retry(exc=e, countdown=60, max_retries=3)
    finally:
        db.close()

@celery_app.task
def cleanup_old_scans():
    """
    Cleanup old scan results (run periodically).
    """
    db = SessionLocal()
    try:
        # This could clean up scans older than 30 days, etc.
        # For now, just a placeholder
        logger.info("Cleanup task executed")
        return {"status": "success", "message": "Cleanup completed"}
    finally:
        db.close()