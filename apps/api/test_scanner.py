#!/usr/bin/env python3
"""
Test script for AI scanning functionality.
Tests text extraction and LLM scanning with mock data.
"""
import os
import json
from typing import Dict, List

# Mock control and requirements for testing
MOCK_CONTROL = {
    'id': 'test-control-id',
    'code': 'EE-7',
    'title': 'Multi-Factor Authentication',
    'description': 'Multi-factor authentication provides an additional layer of security, making it harder for attackers to gain access to systems and data even if they have compromised passwords.',
    'framework': {'name': 'Essential Eight'}
}

MOCK_REQUIREMENTS = [
    {
        'id': 'req-1',
        'req_code': 'EE-7.1',
        'text': 'Multi-factor authentication is used to authenticate all users when accessing important data repositories.',
        'maturity_level': 1,
        'guidance': 'Implement MFA for access to sensitive data repositories, file servers, and databases.'
    },
    {
        'id': 'req-2',
        'req_code': 'EE-7.2',
        'text': 'Multi-factor authentication is used to authenticate all privileged users and any other positions of trust when accessing any system.',
        'maturity_level': 2,
        'guidance': 'Extend MFA to all administrative accounts and privileged users across all systems.'
    }
]

MOCK_EVIDENCE = [
    {
        'document_id': 'doc-1',
        'document_name': 'MFA_Policy_2023.pdf',
        'page_num': 1,
        'text': '''
Multi-Factor Authentication Policy

1. Purpose
This policy establishes requirements for multi-factor authentication (MFA) to protect organizational systems and data.

2. Scope
This policy applies to:
- All users accessing corporate email systems (Office 365)
- All privileged users including administrators
- Access to file servers containing sensitive data
- VPN connections to corporate network

3. Requirements
3.1 MFA Implementation
All users must enable MFA when accessing:
- Office 365 email and SharePoint
- Administrative systems and servers
- Customer database systems
- Financial applications

3.2 Approved MFA Methods
- Microsoft Authenticator app (preferred)
- Hardware security keys (FIDO2)
- SMS codes (temporary measure only)

4. Compliance
MFA is mandatory for all privileged accounts and recommended for standard user accounts accessing sensitive systems.
        '''
    },
    {
        'document_id': 'doc-2', 
        'document_name': 'Azure_MFA_Screenshot.png',
        'page_num': 1,
        'text': '''
Azure Active Directory - Multi-Factor Authentication

Conditional Access Policy: MFA for All Users
Status: Enabled
Users: All users
Cloud apps: All cloud apps
Conditions: Any location
Access controls: Require multi-factor authentication

Policy Statistics:
- Total users covered: 156
- MFA enabled users: 156 (100%)
- Authentication methods:
  * Microsoft Authenticator: 142 users
  * Hardware keys: 14 users
  * SMS backup: 23 users
        '''
    }
]

def test_text_extraction():
    """Test the text extraction functionality."""
    print("Testing text extraction...")
    
    try:
        from text_extraction import text_extractor
        
        # Test with mock PDF content
        test_text = "This is a test PDF content for MFA policy implementation."
        mock_pdf_bytes = test_text.encode('utf-8')
        
        # This would normally fail without actual PDF bytes, but we can test the interface
        pages = text_extractor.extract_text(mock_pdf_bytes, 'test.pdf', 'application/pdf')
        print(f"✓ Text extraction interface works. Expected failure for mock data.")
        
    except Exception as e:
        print(f"✗ Text extraction error: {e}")

def test_ai_scanner():
    """Test the AI scanner with mock data."""
    print("\nTesting AI scanner...")
    
    # Check if OpenAI API key is available
    if not os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY') == 'your_openai_api_key_here':
        print("⚠️  OpenAI API key not configured. Skipping AI scanner test.")
        print("   Set OPENAI_API_KEY environment variable to test AI scanning.")
        return
    
    try:
        from ai_scanner import compliance_scanner
        
        # Create mock control object
        class MockControl:
            def __init__(self, data):
                self.id = data['id']
                self.code = data['code']
                self.title = data['title']
                self.description = data['description']
        
        class MockRequirement:
            def __init__(self, data):
                self.id = data['id']
                self.req_code = data['req_code']
                self.text = data['text']
                self.maturity_level = data['maturity_level']
                self.guidance = data['guidance']
        
        mock_control = MockControl(MOCK_CONTROL)
        mock_requirements = [MockRequirement(req) for req in MOCK_REQUIREMENTS]
        
        print("📡 Calling OpenAI API for compliance scanning...")
        results = compliance_scanner.scan_control(
            control=mock_control,
            requirements=mock_requirements,
            evidence_texts=MOCK_EVIDENCE
        )
        
        print("✓ AI scanning completed successfully!")
        print(f"   Requirements analyzed: {len(results.get('requirements', []))}")
        print(f"   Gaps identified: {len(results.get('gaps', []))}")
        
        # Print sample results
        if results.get('requirements'):
            print("\n📊 Sample Results:")
            for result in results['requirements'][:2]:  # Show first 2
                print(f"   {result.get('requirement_id')}: {result.get('outcome')} ({result.get('confidence'):.2f})")
                print(f"      Rationale: {result.get('rationale', '')[:100]}...")
        
    except Exception as e:
        print(f"✗ AI scanner error: {e}")

def test_celery_tasks():
    """Test Celery task definitions."""
    print("\nTesting Celery tasks...")
    
    try:
        from worker_tasks import extract_document_text, process_scan
        from celery_app import celery_app
        
        print("✓ Celery app and tasks imported successfully")
        print(f"   Broker: {celery_app.conf.broker_url}")
        print(f"   Backend: {celery_app.conf.result_backend}")
        
        # Test task signatures
        print("✓ Task signatures available:")
        print(f"   - extract_document_text")
        print(f"   - process_scan")
        
    except Exception as e:
        print(f"✗ Celery tasks error: {e}")

def test_database_models():
    """Test database model definitions."""
    print("\nTesting database models...")
    
    try:
        from models import (
            Framework, Control, Requirement, Document, DocumentPage,
            EvidenceLink, Scan, ScanResult, Gap, AuditLog
        )
        
        print("✓ All database models imported successfully:")
        models = [
            'Framework', 'Control', 'Requirement', 'Document', 'DocumentPage',
            'EvidenceLink', 'Scan', 'ScanResult', 'Gap', 'AuditLog'
        ]
        for model in models:
            print(f"   - {model}")
            
    except Exception as e:
        print(f"✗ Database models error: {e}")

def main():
    """Run all tests."""
    print("🧪 AI Scanning Implementation Test Suite")
    print("=" * 50)
    
    test_database_models()
    test_text_extraction()
    test_celery_tasks()
    test_ai_scanner()
    
    print("\n🏁 Test suite completed!")
    print("\nNext steps:")
    print("1. Set up database with Docker: docker-compose up -d postgres redis minio")
    print("2. Run migrations: psql -d geekygoose -f database/migrations/003_add_scanning_tables.sql")
    print("3. Seed data: python3 run_seed.py")
    print("4. Start API: uvicorn main:app --reload")
    print("5. Start worker: celery -A celery_app worker --loglevel=info")
    print("6. Start frontend: cd ../web && npm run dev")

if __name__ == "__main__":
    main()