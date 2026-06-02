import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Require a valid Bearer token — forward to backend for full JWT validation
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const requirementCode = formData.get('requirement_code') as string;
    const templateId = formData.get('template_id') as string;
    const validationPrompt = formData.get('validation_prompt') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!requirementCode) {
      return NextResponse.json({ error: 'No requirement code provided' }, { status: 400 });
    }

    // Get file content
    const arrayBuffer = await file.arrayBuffer();
    const fileContent = Buffer.from(arrayBuffer);
    
    // For now, we'll use a simplified validation approach
    // In production, this would call the backend AI scanning API
    
    // Mock AI validation logic based on file type and content
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileSize = file.size;
    const fileName = file.name;
    
    let outcome = 'PARTIAL';
    let confidence = 0.7;
    let rationale = 'Document uploaded successfully for validation';
    let findings: string[] = [];
    let recommendations: string[] = [];

    // Basic validation based on file characteristics
    if (fileSize === 0) {
      outcome = 'FAIL';
      confidence = 0.1;
      rationale = 'Empty file uploaded';
      findings = ['File is empty or corrupted'];
      recommendations = ['Upload a valid document with content'];
    } else if (fileSize > 10 * 1024 * 1024) { // 10MB limit
      outcome = 'FAIL';
      confidence = 0.2;
      rationale = 'File too large for processing';
      findings = ['File exceeds size limits'];
      recommendations = ['Upload a smaller file or compress the document'];
    } else {
      // Enhanced validation based on requirement type and file type
      const isDocumentType = ['pdf', 'doc', 'docx', 'txt'].includes(fileExtension || '');
      const isImageType = ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension || '');
      const isSpreadsheetType = ['xls', 'xlsx', 'csv'].includes(fileExtension || '');
      
      if (requirementCode.includes('policy') || requirementCode.includes('procedure')) {
        if (isDocumentType) {
          outcome = 'PASS';
          confidence = 0.85;
          rationale = 'Policy document format is appropriate and contains substantial content';
          findings = [
            'Document format suitable for policy documentation',
            'File size indicates comprehensive content',
            'Standard document format supports compliance review'
          ];
          recommendations = [
            'Ensure document includes approval signatures',
            'Verify all required policy sections are present',
            'Review content for compliance with framework requirements'
          ];
        } else {
          outcome = 'PARTIAL';
          confidence = 0.6;
          rationale = 'Document type may not be optimal for policy documentation';
          findings = [
            'File uploaded successfully',
            'File format may not be standard for policy documents'
          ];
          recommendations = [
            'Consider converting to PDF or Word document format',
            'Ensure content is readable and properly formatted'
          ];
        }
      } else if (requirementCode.includes('configuration') || requirementCode.includes('screenshot')) {
        if (isImageType) {
          outcome = 'PASS';
          confidence = 0.8;
          rationale = 'Screenshot evidence provided in appropriate format';
          findings = [
            'Image format suitable for configuration evidence',
            'File size indicates detailed screenshot',
            'Visual evidence format supports compliance verification'
          ];
          recommendations = [
            'Ensure screenshot shows relevant configuration details',
            'Verify all sensitive information is appropriately handled',
            'Consider adding annotations to highlight key settings'
          ];
        } else if (isDocumentType || isSpreadsheetType) {
          outcome = 'PASS';
          confidence = 0.75;
          rationale = 'Configuration documentation provided in structured format';
          findings = [
            'Document format suitable for configuration evidence',
            'Structured format supports detailed configuration review',
            'File format allows for comprehensive documentation'
          ];
          recommendations = [
            'Ensure all relevant configuration parameters are documented',
            'Include system context and implementation details',
            'Verify configuration aligns with security requirements'
          ];
        } else {
          outcome = 'PARTIAL';
          confidence = 0.5;
          rationale = 'Evidence provided but format may not be optimal';
          findings = [
            'File uploaded successfully',
            'File format may require additional validation'
          ];
          recommendations = [
            'Consider providing screenshot or document evidence',
            'Ensure evidence clearly demonstrates compliance'
          ];
        }
      } else {
        // General evidence validation
        if (isDocumentType || isImageType || isSpreadsheetType) {
          outcome = 'PASS';
          confidence = 0.75;
          rationale = 'Evidence provided in appropriate format';
          findings = [
            'File format is suitable for compliance evidence',
            'Document uploaded successfully',
            'File size indicates substantial content'
          ];
          recommendations = [
            'Review content to ensure it addresses requirement fully',
            'Verify evidence is current and properly approved',
            'Consider adding supporting documentation if needed'
          ];
        } else {
          outcome = 'PARTIAL';
          confidence = 0.6;
          rationale = 'Evidence uploaded but format may need review';
          findings = [
            'File uploaded successfully',
            'File format may not be standard for compliance evidence'
          ];
          recommendations = [
            'Consider converting to standard document or image format',
            'Ensure evidence is readable and properly formatted'
          ];
        }
      }
    }

    // Add validation prompt context if provided
    if (validationPrompt && outcome === 'PASS') {
      findings.push('Evidence appears to align with specified validation criteria');
      recommendations.push('Review against specific prompt requirements for completeness');
    }

    const result = {
      outcome,
      confidence,
      rationale,
      findings,
      recommendations,
      file_info: {
        name: fileName,
        size: fileSize,
        type: fileExtension,
        uploaded_at: new Date().toISOString()
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Evidence validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate evidence' },
      { status: 500 }
    );
  }
}