import { NextRequest, NextResponse } from 'next/server';

// Server-side: reach the API container directly. INTERNAL_API_URL is set in compose.
const INTERNAL_API =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  // Require a valid Bearer token — the backend performs full JWT validation.
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const requirementCode = formData.get('requirement_code') as string | null;
    const validationPrompt = formData.get('validation_prompt') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!requirementCode) {
      return NextResponse.json({ error: 'No requirement code provided' }, { status: 400 });
    }

    // Forward the file and context to the real backend AI validator.
    const backendForm = new FormData();
    backendForm.append('file', file);
    backendForm.append('requirement_code', requirementCode);
    if (validationPrompt) {
      backendForm.append('validation_prompt', validationPrompt);
    }

    const response = await fetch(`${INTERNAL_API}/ai/validate-evidence`, {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: backendForm,
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Backend evidence validation failed:', response.status, detail);
      return NextResponse.json(
        { error: 'Evidence validation is unavailable. Please try again later.' },
        { status: 502 },
      );
    }

    // Backend already returns { outcome, confidence, rationale, findings, recommendations, file_info }
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Evidence validation error:', error);
    return NextResponse.json({ error: 'Failed to validate evidence' }, { status: 500 });
  }
}
