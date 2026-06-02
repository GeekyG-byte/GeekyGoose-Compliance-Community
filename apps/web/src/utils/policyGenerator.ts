interface Template {
  id: string;
  name: string;
  description: string;
  control: {
    id: string;
    code: string;
    title: string;
    framework_name: string;
  };
  company_fields: Array<{
    field_name: string;
    field_type: string;
    required: boolean;
    placeholder?: string;
    description?: string;
    options?: string[];
  }>;
  evidence_requirements: Array<{
    requirement_code: string;
    evidence_type: string;
    description: string;
    required: boolean;
    ai_validation_prompt?: string;
  }>;
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');

export const generatePolicyDocument = (template: Template, companyName?: string) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const companyNameToUse = escapeHtml(companyName || '[COMPANY NAME]');
  
  const policyContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${template.control.code} - ${template.control.title} Policy</title>
    <style>
        @media print {
            @page { margin: 1in; }
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .no-print { display: none; }
        }
        @media screen {
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                max-width: 8.5in; 
                margin: 0 auto; 
                padding: 20px;
                background: white;
            }
        }
        
        h1 { color: #1a365d; border-bottom: 3px solid #3182ce; padding-bottom: 10px; }
        h2 { color: #2d3748; border-bottom: 1px solid #cbd5e0; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #4a5568; margin-top: 25px; }
        
        .header-info {
            background-color: #f7fafc;
            border: 1px solid #cbd5e0;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
        }
        
        .policy-section {
            margin: 25px 0;
            padding: 15px;
            border-left: 4px solid #3182ce;
            background-color: #f7fafc;
        }
        
        .evidence-requirement {
            background-color: #fffbeb;
            border: 1px solid #fed7aa;
            border-radius: 5px;
            padding: 12px;
            margin: 10px 0;
        }
        
        .required-tag {
            background-color: #dc2626;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.75em;
            font-weight: bold;
        }
        
        .optional-tag {
            background-color: #059669;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.75em;
            font-weight: bold;
        }
        
        .company-field {
            background-color: #e0f2fe;
            border: 1px solid #0891b2;
            border-radius: 3px;
            padding: 8px;
            margin: 8px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        th, td {
            border: 1px solid #cbd5e0;
            padding: 8px 12px;
            text-align: left;
        }
        
        th {
            background-color: #f7fafc;
            font-weight: bold;
        }
        
        .signature-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }
        
        .signature-box {
            border: 1px solid #cbd5e0;
            height: 60px;
            margin: 10px 0;
        }
        
        .print-button {
            background-color: #3182ce;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px 0;
        }
        
        .print-button:hover {
            background-color: #2c5aa0;
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="print-button" onclick="window.print()">Download as PDF / Print</button>
    </div>
    
    <h1>${template.control.code} - ${template.control.title}</h1>
    
    <div class="header-info">
        <table>
            <tr><td><strong>Organization:</strong></td><td>${companyNameToUse}</td></tr>
            <tr><td><strong>Framework:</strong></td><td>${template.control.framework_name}</td></tr>
            <tr><td><strong>Control Code:</strong></td><td>${template.control.code}</td></tr>
            <tr><td><strong>Document Date:</strong></td><td>${today}</td></tr>
            <tr><td><strong>Document Version:</strong></td><td>1.0</td></tr>
        </table>
    </div>

    <h2>1. Purpose and Scope</h2>
    <div class="policy-section">
        <p><strong>Purpose:</strong> This policy establishes the requirements and procedures for implementing ${template.control.title.toLowerCase()} within ${companyNameToUse}.</p>
        <p><strong>Description:</strong> ${template.description}</p>
        <p><strong>Scope:</strong> This policy applies to all employees, contractors, and third-party users who access ${companyNameToUse}'s information systems and data.</p>
    </div>

    <h2>2. Policy Statement</h2>
    <div class="policy-section">
        <p>${companyNameToUse} is committed to implementing and maintaining ${template.control.title.toLowerCase()} in accordance with ${template.control.framework_name} requirements. This policy ensures that appropriate controls are in place to:</p>
        <ul>
            <li>Protect organizational assets and data</li>
            <li>Maintain compliance with regulatory requirements</li>
            <li>Support business operations and continuity</li>
            <li>Minimize security risks and vulnerabilities</li>
        </ul>
    </div>

    <h2>3. Roles and Responsibilities</h2>
    <div class="policy-section">
        <h3>3.1 Management</h3>
        <ul>
            <li>Provide adequate resources for policy implementation</li>
            <li>Ensure regular review and updates to the policy</li>
            <li>Support enforcement and compliance activities</li>
        </ul>
        
        <h3>3.2 IT Security Team</h3>
        <ul>
            <li>Implement technical controls and configurations</li>
            <li>Monitor compliance with policy requirements</li>
            <li>Conduct regular assessments and audits</li>
        </ul>
        
        <h3>3.3 All Employees</h3>
        <ul>
            <li>Comply with all policy requirements</li>
            <li>Report security incidents and violations</li>
            <li>Participate in required training programs</li>
        </ul>
    </div>

    <h2>4. Implementation Requirements</h2>
    <div class="policy-section">
        <p>The following requirements must be implemented to ensure compliance with ${template.control.code}:</p>
        
        ${template.evidence_requirements.map((req, index) => `
            <div class="evidence-requirement">
                <h4>${req.requirement_code}: ${req.evidence_type.charAt(0).toUpperCase() + req.evidence_type.slice(1)} Requirement ${req.required ? '<span class="required-tag">REQUIRED</span>' : '<span class="optional-tag">OPTIONAL</span>'}</h4>
                <p>${req.description}</p>
                ${req.ai_validation_prompt ? `<p><strong>Validation Criteria:</strong> ${req.ai_validation_prompt}</p>` : ''}
            </div>
        `).join('')}
    </div>

    <h2>5. Organizational Information</h2>
    <div class="policy-section">
        <p>Complete the following organizational information for policy customization:</p>
        
        ${template.company_fields.map(field => `
            <div class="company-field">
                <strong>${field.field_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
                ${field.required ? '<span class="required-tag">REQUIRED</span>' : '<span class="optional-tag">OPTIONAL</span>'}
                <br>
                <em>${field.description}</em>
                <br>
                <input type="text" placeholder="${field.placeholder || `Enter ${field.field_name.replace('_', ' ')}`}" style="width: 100%; margin-top: 5px; padding: 5px; border: 1px solid #ccc;">
            </div>
        `).join('')}
    </div>

    <h2>6. Compliance and Monitoring</h2>
    <div class="policy-section">
        <p>Compliance with this policy is mandatory for all personnel. The organization will:</p>
        <ul>
            <li>Conduct regular assessments to verify implementation</li>
            <li>Monitor and log relevant activities</li>
            <li>Report compliance status to management</li>
            <li>Take corrective action when violations are identified</li>
        </ul>
    </div>

    <h2>7. Policy Review and Updates</h2>
    <div class="policy-section">
        <p>This policy will be reviewed annually or when significant changes occur to:</p>
        <ul>
            <li>Business operations or technology infrastructure</li>
            <li>Regulatory or compliance requirements</li>
            <li>Security threats or incident response procedures</li>
            <li>${template.control.framework_name} framework updates</li>
        </ul>
    </div>

    <div class="signature-section">
        <h2>8. Policy Approval</h2>
        <table style="margin-top: 20px;">
            <tr>
                <td style="width: 30%;"><strong>Policy Owner:</strong></td>
                <td style="width: 30%;"><strong>Date:</strong></td>
                <td style="width: 40%;"><strong>Signature:</strong></td>
            </tr>
            <tr>
                <td style="height: 50px;"></td>
                <td style="height: 50px;">${today}</td>
                <td style="height: 50px;"></td>
            </tr>
        </table>
        
        <table style="margin-top: 20px;">
            <tr>
                <td style="width: 30%;"><strong>Approved By:</strong></td>
                <td style="width: 30%;"><strong>Date:</strong></td>
                <td style="width: 40%;"><strong>Signature:</strong></td>
            </tr>
            <tr>
                <td style="height: 50px;"></td>
                <td style="height: 50px;"></td>
                <td style="height: 50px;"></td>
            </tr>
        </table>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #cbd5e0; text-align: center; color: #666; font-size: 0.9em;">
        <p>This document was generated from the ${template.control.framework_name} ${template.control.code} compliance template.</p>
        <p>Generated on: ${today}</p>
    </div>
</body>
</html>
  `;

  return policyContent;
};

export const downloadTemplateAsWord = (template: Template, companyName?: string, companyData?: Record<string, any>) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
  });

  const companyNameToUse = escapeHtml(companyName || '[COMPANY NAME]');

  // Generate Word document content using HTML format that Word can import
  const wordContent = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${template.control.code} - ${template.control.title} Policy</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>90</w:Zoom>
<w:DoNotPromptForConvert/>
<w:DoNotShowInsertionsAndDeletions/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page {
  margin: 1in;
}
body {
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  line-height: 1.5;
}
h1 {
  font-size: 18pt;
  font-weight: bold;
  color: #1a365d;
  border-bottom: 3px solid #3182ce;
  padding-bottom: 10pt;
}
h2 {
  font-size: 14pt;
  font-weight: bold;
  color: #2d3748;
  border-bottom: 1pt solid #cbd5e0;
  padding-bottom: 5pt;
  margin-top: 20pt;
}
h3 {
  font-size: 12pt;
  font-weight: bold;
  color: #4a5568;
  margin-top: 15pt;
}
h4 {
  font-size: 11pt;
  font-weight: bold;
  margin-top: 10pt;
}
.header-info {
  background-color: #f7fafc;
  border: 1pt solid #cbd5e0;
  padding: 10pt;
  margin: 15pt 0;
}
.policy-section {
  margin: 15pt 0;
  padding: 10pt;
  border-left: 4pt solid #3182ce;
  background-color: #f7fafc;
}
.evidence-requirement {
  background-color: #fffbeb;
  border: 1pt solid #fed7aa;
  padding: 8pt;
  margin: 8pt 0;
}
.company-field {
  background-color: #e0f2fe;
  border: 1pt solid #0891b2;
  padding: 6pt;
  margin: 6pt 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10pt 0;
}
th, td {
  border: 1pt solid #cbd5e0;
  padding: 6pt 8pt;
  text-align: left;
  vertical-align: top;
}
th {
  background-color: #f7fafc;
  font-weight: bold;
}
.required-tag {
  background-color: #dc2626;
  color: white;
  padding: 1pt 4pt;
  font-size: 8pt;
  font-weight: bold;
}
.optional-tag {
  background-color: #059669;
  color: white;
  padding: 1pt 4pt;
  font-size: 8pt;
  font-weight: bold;
}
.signature-section {
  margin-top: 30pt;
  page-break-inside: avoid;
}
ul, ol {
  margin: 8pt 0;
  padding-left: 20pt;
}
li {
  margin: 4pt 0;
}
</style>
</head>
<body>
    
<h1>${template.control.code} - ${template.control.title}</h1>

<div class="header-info">
    <table>
        <tr><td><strong>Organization:</strong></td><td>${companyNameToUse}</td></tr>
        <tr><td><strong>Framework:</strong></td><td>${template.control.framework_name}</td></tr>
        <tr><td><strong>Control Code:</strong></td><td>${template.control.code}</td></tr>
        <tr><td><strong>Document Date:</strong></td><td>${today}</td></tr>
        <tr><td><strong>Document Version:</strong></td><td>1.0</td></tr>
    </table>
</div>

<h2>1. Purpose and Scope</h2>
<div class="policy-section">
    <p><strong>Purpose:</strong> This policy establishes the requirements and procedures for implementing ${template.control.title.toLowerCase()} within ${companyNameToUse}.</p>
    <p><strong>Description:</strong> ${template.description}</p>
    <p><strong>Scope:</strong> This policy applies to all employees, contractors, and third-party users who access ${companyNameToUse}'s information systems and data.</p>
</div>

<h2>2. Policy Statement</h2>
<div class="policy-section">
    <p>${companyNameToUse} is committed to implementing and maintaining ${template.control.title.toLowerCase()} in accordance with ${template.control.framework_name} requirements. This policy ensures that appropriate controls are in place to:</p>
    <ul>
        <li>Protect organizational assets and data</li>
        <li>Maintain compliance with regulatory requirements</li>
        <li>Support business operations and continuity</li>
        <li>Minimize security risks and vulnerabilities</li>
    </ul>
</div>

<h2>3. Roles and Responsibilities</h2>
<div class="policy-section">
    <h3>3.1 Management</h3>
    <ul>
        <li>Provide adequate resources for policy implementation</li>
        <li>Ensure regular review and updates to the policy</li>
        <li>Support enforcement and compliance activities</li>
    </ul>
    
    <h3>3.2 IT Security Team</h3>
    <ul>
        <li>Implement technical controls and configurations</li>
        <li>Monitor compliance with policy requirements</li>
        <li>Conduct regular assessments and audits</li>
    </ul>
    
    <h3>3.3 All Employees</h3>
    <ul>
        <li>Comply with all policy requirements</li>
        <li>Report security incidents and violations</li>
        <li>Participate in required training programs</li>
    </ul>
</div>

<h2>4. Implementation Requirements</h2>
<div class="policy-section">
    <p>The following requirements must be implemented to ensure compliance with ${template.control.code}:</p>
    
    ${template.evidence_requirements.map((req, index) => `
        <div class="evidence-requirement">
            <h4>${req.requirement_code}: ${req.evidence_type.charAt(0).toUpperCase() + req.evidence_type.slice(1)} Requirement ${req.required ? '<span class="required-tag">REQUIRED</span>' : '<span class="optional-tag">OPTIONAL</span>'}</h4>
            <p>${req.description}</p>
            ${req.ai_validation_prompt ? `<p><strong>Validation Criteria:</strong> ${req.ai_validation_prompt}</p>` : ''}
        </div>
    `).join('')}
</div>

<h2>5. Organizational Information</h2>
<div class="policy-section">
    <p>Complete the following organizational information for policy customization:</p>
    
    ${template.company_fields.map(field => {
        const fieldValue = companyData && companyData[field.field_name] ? companyData[field.field_name] : '';
        return `
        <div class="company-field">
            <strong>${field.field_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
            ${field.required ? '<span class="required-tag">REQUIRED</span>' : '<span class="optional-tag">OPTIONAL</span>'}
            <br/>
            <em>${field.description}</em>
            <br/>
            ${fieldValue ? 
                `<span style="font-weight: bold; color: #2563eb; padding: 2pt 0; display: inline-block; margin-top: 5pt;">${fieldValue}</span>` : 
                `<span style="border-bottom: 1pt solid #000; display: inline-block; width: 300pt; margin-top: 5pt;">&nbsp;</span>`
            }
        </div>
        `;
    }).join('')}
</div>

<h2>6. Compliance and Monitoring</h2>
<div class="policy-section">
    <p>Compliance with this policy is mandatory for all personnel. The organization will:</p>
    <ul>
        <li>Conduct regular assessments to verify implementation</li>
        <li>Monitor and log relevant activities</li>
        <li>Report compliance status to management</li>
        <li>Take corrective action when violations are identified</li>
    </ul>
</div>

<h2>7. Policy Review and Updates</h2>
<div class="policy-section">
    <p>This policy will be reviewed annually or when significant changes occur to:</p>
    <ul>
        <li>Business operations or technology infrastructure</li>
        <li>Regulatory or compliance requirements</li>
        <li>Security threats or incident response procedures</li>
        <li>${template.control.framework_name} framework updates</li>
    </ul>
</div>

<div class="signature-section">
    <h2>8. Policy Approval</h2>
    <table style="margin-top: 15pt;">
        <tr>
            <td style="width: 30%;"><strong>Policy Owner:</strong></td>
            <td style="width: 30%;"><strong>Date:</strong></td>
            <td style="width: 40%;"><strong>Signature:</strong></td>
        </tr>
        <tr>
            <td style="height: 40pt;"></td>
            <td style="height: 40pt;">${today}</td>
            <td style="height: 40pt;"></td>
        </tr>
    </table>
    
    <table style="margin-top: 15pt;">
        <tr>
            <td style="width: 30%;"><strong>Approved By:</strong></td>
            <td style="width: 30%;"><strong>Date:</strong></td>
            <td style="width: 40%;"><strong>Signature:</strong></td>
        </tr>
        <tr>
            <td style="height: 40pt;"></td>
            <td style="height: 40pt;"></td>
            <td style="height: 40pt;"></td>
        </tr>
    </table>
</div>

<div style="margin-top: 20pt; padding-top: 15pt; border-top: 1pt solid #cbd5e0; text-align: center; color: #666; font-size: 10pt;">
    <p>This document was generated from the ${template.control.framework_name} ${template.control.code} compliance template.</p>
    <p>Generated on: ${today}</p>
</div>
</body>
</html>
  `;

  // Create blob with Word MIME type
  const blob = new Blob([wordContent], {
    type: 'application/msword'
  });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${template.control.code}_${template.control.title.replace(/[^a-zA-Z0-9]/g, '_')}_Policy.doc`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};