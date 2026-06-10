import { NextRequest, NextResponse } from 'next/server';

interface Control {
  code: string;
  title: string;
  framework: string;
}

export async function POST(request: NextRequest) {
  try {
    // Require a valid Bearer token — the backend performs full JWT validation
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const controlsJson = formData.get('controls') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const controls: Control[] = controlsJson ? JSON.parse(controlsJson) : [];

    // Prepare prompt for vision AI
    const visionPrompt = `You are analyzing a screenshot or image for compliance evidence mapping.

Carefully examine this image and identify what it shows. Look for:
- Operating system update/patch screens (Windows Update, Software Update, etc.)
- Application update dialogs
- Security settings configurations
- Microsoft Office macro settings
- Multi-factor authentication (MFA) screens
- Backup/recovery dashboards
- Application control settings
- Browser security settings
- Any other compliance-related configuration screens

Based on what you see in the image, map it to the most relevant compliance control(s) from this list:

${controls.map((c: Control) => `${c.code}: ${c.title} (${c.framework})`).join('\n')}

Provide your analysis in JSON format:
{
  "suggestions": [
    {
      "control_code": "EE-X",
      "control_title": "Control Title",
      "framework_name": "Essential Eight",
      "confidence": 0.95,
      "reasoning": "Detailed explanation of what you see in the image and why it maps to this control"
    }
  ]
}

Important guidelines:
- EE-6 (Patch Operating Systems): If the image shows OS update screens, Windows Update, system patches, or OS version information
- EE-2 (Patch Applications): If the image shows application update dialogs or software updates
- EE-3 (Configure Microsoft Office Macro Settings): Only if the image shows Office macro settings or security configurations
- EE-5 (Multi-Factor Authentication): If the image shows MFA setup, login with 2FA, or authentication settings
- EE-7 (Backup Data): If the image shows backup configurations, recovery points, or backup dashboards
- EE-1 (Application Control): If the image shows application whitelisting, AppLocker, or execution policies
- EE-4 (User Application Hardening): If the image shows browser security settings or application hardening configs

Be specific about what you see in the image. Limit to top 3 most relevant matches, ordered by confidence.`;

    // Try to call backend AI service with vision capabilities
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.INTERNAL_API_URL || 'http://localhost:8000';

    // Call backend vision AI endpoint, forwarding the caller's auth token
    const backendFormData = new FormData();
    backendFormData.append('image', file);
    backendFormData.append('prompt', visionPrompt);

    const response = await fetch(`${apiUrl}/api/ai/analyze-image`, {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: backendFormData,
    });

    if (response.ok) {
      const result = await response.json();
      // Backend should return the analysis directly
      return NextResponse.json({
        response: typeof result.response === 'string' ? result.response : JSON.stringify(result)
      });
    }

    // Surface a real error instead of returning fabricated analysis
    const detail = await response.text();
    console.error('Backend vision AI failed:', response.status, detail);
    return NextResponse.json(
      { error: 'Image analysis is unavailable. Please try again later.' },
      { status: 502 }
    );

  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
