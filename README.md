# 🦆 GeekyGoose Compliance

> **Get Compliant Fast** - AI-Powered Compliance Automation Platform for SMB + Internal IT Teams

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## ✨ Features

### 🤖 **AI-Powered Compliance Scanning**
- **Two-Step Document Analysis**: First scan and summarize, then map to controls
- **Structured Output Processing**: Reliable AI responses with fallback handling  
- **Automated Evidence Analysis**: Upload policies, screenshots, and documents
- **Smart Gap Detection**: AI identifies what's missing and why
- **Compliance Scoring**: Pass/Partial/Fail ratings with confidence levels
- **Citation Tracking**: Direct references to evidence supporting each finding

### 📊 **Comprehensive Reporting**
- **Executive Dashboards**: High-level compliance overview with visual metrics
- **Detailed Gap Analysis**: Specific remediation actions prioritized by risk
- **Export Capabilities**: CSV reports for audits and stakeholder reviews
- **Progress Tracking**: Monitor compliance improvements over time

### 🔧 **Framework Support**
- **Essential Eight**: Complete implementation with all 8 controls
- **Extensible Architecture**: Ready for ISO 27001, NIST CSF, CIS Controls
- **Maturity Levels**: Support for progressive compliance requirements
- **Multi-Tenant**: Organization-scoped data and controls

### 📁 **Document Management**
- **Evidence Linking**: Connect documents to specific controls and requirements
- **Secure Storage**: Encrypted at rest with signed download URLs
- **Multi-Format Support**: PDF, DOCX, TXT, PNG, JPG with OCR capabilities
- **Audit Trail**: Complete history of document uploads and changes

### 📋 **Control Templates & Policy Generation**
- **Template Creation**: Create reusable templates for compliance controls
- **Company Information**: Customizable fields for company-specific data collection
- **Evidence Requirements**: Define what evidence is needed for each control
- **Template Filling**: Streamlined process for users to complete compliance documentation
- **Policy Generation**: Download completed policies as professional Word documents
- **Submission Management**: View, download, and delete completed template submissions
- **Submission Tracking**: Monitor template submissions and approval status

## 🏗️ Architecture

### **Frontend** (Next.js 16.1.1)
- **App Router**: Modern Next.js routing with TypeScript
- **Tailwind CSS + shadcn/ui**: Beautiful, accessible components
- **Server Actions**: Optimized data mutations
- **TanStack Query**: Efficient client-side data fetching

### **Backend** (FastAPI)
- **Python 3.11**: Modern async/await patterns
- **PostgreSQL**: Relational data with full ACID compliance
- **MinIO**: S3-compatible object storage for documents
- **Redis**: Background job queue for AI processing

### **AI Processing**
- **Ollama Integration**: Local LLM support with large context windows (32K+ tokens)
- **OpenAI Compatible**: Support for GPT-4 and other models
- **Structured Output**: JSON schema validation for reliable results
- **Document Extraction**: PDF, DOCX parsing with OCR fallback
- **High-Memory Optimization**: Configured for 16GB+ systems with comprehensive document analysis

### **Infrastructure**
- **Docker Compose**: Complete development environment
- **Background Workers**: Celery for async document processing
- **Multi-tenant**: Organization-scoped data isolation
- **Audit Logging**: Immutable compliance trail

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- 8GB+ RAM (for AI models)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/geekygoose-compliance.git
cd geekygoose-compliance
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# - OPENAI_API_KEY (optional, for GPT-4 support)
# - OLLAMA_ENDPOINT (for local AI models)
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# Check services are running
docker-compose ps
```

### 4. Initialize Database
```bash
# Run database initialization and create tables
docker-compose exec api python init_db.py

# Seed with Essential Eight framework
docker-compose exec api python run_seed.py
```

### 5. Access Application
- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001

## 📖 User Guide

### 🎯 **Getting Started**
1. **Upload Evidence**: Go to Documents → Upload your policies, screenshots, configs
2. **Link to Controls**: Navigate to Controls → Select a control → Link your evidence
3. **Run AI Scan**: Click "Start AI Scan" to analyze evidence against requirements
4. **Review Results**: See compliance status, gaps, and recommended actions
5. **Generate Reports**: Export compliance reports for audits and reviews

### 📋 **Using Templates**
1. **Create Templates**: Go to Templates → Create Template → Define company fields and evidence requirements
2. **Fill Templates**: Select a template → Fill Template → Enter company information and upload evidence
3. **Download Policies**: Generate professional Word documents with filled company data
4. **Manage Submissions**: View completed templates on Submissions page with download and delete options
5. **Track Submissions**: Monitor template completion status and approval workflow
6. **Standardize Compliance**: Use templates to ensure consistent documentation across your organization

### 🔍 **Example Workflow: MFA Compliance**
1. Upload your MFA policy document (PDF)
2. Upload screenshots of MFA configuration
3. Go to Controls → "EE-7: Multi-Factor Authentication"
4. Link your documents to the control
5. Run AI scan
6. Review gaps: "Missing hardware tokens" → Priority: HIGH
7. Export report for remediation planning

### 🏢 **Multi-Organization Support**
- Each organization has isolated data
- Role-based access control
- Shared frameworks, private evidence
- Cross-organization reporting (admin only)

## 🛠️ Development

### **Project Structure**
```
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── shared/       # Shared types and schemas
├── database/         # SQL migrations
├── docker-compose.yml
└── README.md
```

### **Local Development**
```bash
# Frontend (Next.js)
cd apps/web
npm install
npm run dev

# Backend (FastAPI)
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload

# Worker (Celery)
cd apps/api
celery -A celery_app worker --loglevel=info
```

### **Testing**
```bash
# API scanner tests
cd apps/api
python test_scanner.py

# Frontend tests (if available)
cd apps/web
npm test
```

### **Database Migrations**
```bash
# Create new migration
docker-compose exec api alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec api alembic upgrade head
```

## 🤖 AI Configuration

### **Ollama (Recommended for Privacy)**
```bash
# Install Ollama locally
curl -fsSL https://ollama.com/install.sh | sh

# Pull recommended models for 16GB+ RAM systems
ollama pull qwen2.5:14b          # Best for comprehensive analysis (16GB+ RAM)
ollama pull llama3.1:8b          # Good balance of speed and quality
ollama pull mistral:7b           # Fast and efficient

# Configure in .env
OLLAMA_ENDPOINT=http://localhost:11434
OLLAMA_MODEL=qwen2.5:14b         # Large model with 32K context window
OLLAMA_CONTEXT_SIZE=32768        # Maximize context for comprehensive analysis
AI_PROVIDER=ollama

# For systems with more RAM, you can increase context size:
# OLLAMA_CONTEXT_SIZE=65536       # 64K context (requires 32GB+ RAM)
# OLLAMA_CONTEXT_SIZE=131072      # 128K context (requires 64GB+ RAM)
```

**💡 Context Window Benefits:**
- **Larger Documents**: Analyze complete policy documents without truncation
- **Batch Processing**: Process multiple files together for better context
- **Comprehensive Analysis**: AI can consider full document relationships
- **Better Accuracy**: More context leads to more accurate compliance mapping

### **OpenAI API**
```bash
# Configure in .env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
AI_PROVIDER=openai
```

## 📋 Supported Compliance Frameworks

### ✅ **Essential Eight** (Complete)
- **EE-1**: Application Control
- **EE-2**: Patch Applications  
- **EE-3**: Configure Microsoft Office Macro Settings
- **EE-4**: User Application Hardening
- **EE-5**: Restrict Administrative Privileges
- **EE-6**: Patch Operating Systems
- **EE-7**: Multi-Factor Authentication
- **EE-8**: Regular Backups

### 🔜 **Coming Soon**
- **ISO 27001**: Information Security Management
- **NIST CSF**: Cybersecurity Framework
- **CIS Controls**: Center for Internet Security
- **SOC 2**: Service Organization Control 2
- **PCI DSS**: Payment Card Industry Data Security

## 🔒 Security & Privacy

### **Data Protection**
- **Encryption at Rest**: All documents encrypted in MinIO
- **Secure Communications**: HTTPS/TLS for all API calls
- **Access Controls**: Role-based permissions with audit trails
- **Data Isolation**: Multi-tenant architecture with organization scoping

### **AI Privacy**
- **Local Processing**: Use Ollama for on-premises AI
- **No Training**: Customer data never used for model training
- **Minimal Storage**: Only compliance results stored, not full document content
- **Audit Trail**: Complete log of all AI interactions and decisions

### **Compliance**
- **SOC 2 Ready**: Audit logging and access controls
- **GDPR Compatible**: Data minimization and deletion capabilities
- **HIPAA Considerations**: PHI handling with proper safeguards
- **Audit Trail**: Immutable compliance history for regulators

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Process**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests and ensure they pass
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint + Prettier**: Automated code formatting
- **Semantic Commits**: Conventional commit format
- **Test Coverage**: Maintain >80% coverage
- **Documentation**: Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI**: High-performance Python web framework
- **Next.js**: React framework for production applications  
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautifully designed components
- **Ollama**: Local LLM inference server
- **Essential Eight**: Australian Cyber Security Centre framework

## 📞 Support

### **Documentation**
- **API Docs**: http://localhost:8000/docs
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Network Architecture**: [docs/NETWORK_ARCHITECTURE.md](docs/NETWORK_ARCHITECTURE.md)


### **Commercial Support**
- **Enterprise Licenses**: Coming soon
- **Custom Frameworks**: Add your industry-specific requirements
- **Professional Services**: Implementation and training available
- **SLA Support**: As-IS

## 📅 Changelog

### **v0.3.0** - Enhanced File Processing & Infrastructure Improvements (December 2025)

#### 🆕 **New Features**
- **Enhanced Image Processing with OCR**: Complete picture scanning capability with text extraction
  - **Multi-Format Support**: PNG, JPG, GIF, BMP, TIFF, WebP image processing
  - **OCR Text Extraction**: Tesseract integration for automatic text recognition from images
  - **Visual Evidence Analysis**: AI can analyze screenshots, configuration images, and policy scans
  - **Batch Image Upload**: Upload multiple images simultaneously for comprehensive analysis
  - **Smart Content Detection**: AI identifies compliance-relevant content in visual documents

- **Improved File Upload System**: Sequential processing for better reliability
  - **Multi-File Selection**: Select multiple files at once for batch processing
  - **Sequential Upload**: One-at-a-time upload to prevent connection timeout issues
  - **Enhanced Progress Tracking**: Real-time feedback during multi-file uploads
  - **Better Error Handling**: Robust error recovery and user feedback
  - **Connection Stability**: Prevents socket hang-up errors during large uploads

- **Fixed Document Download System**: Reliable file retrieval and storage
  - **Fixed Storage Integration**: Corrected MinIO storage method calls
  - **Enhanced Error Logging**: Detailed logging for troubleshooting download issues
  - **Reliable File Access**: Proper file content retrieval from object storage
  - **Better Error Messages**: Clear feedback when downloads fail

#### 🔧 **Technical Improvements**
- **Next.js 16.1.1 Upgrade**: Latest React 19 compatibility and performance improvements
  - **React 19**: Updated to latest React version with new features
  - **ESLint 9**: Modern linting configuration for better code quality
  - **Dependency Optimization**: Moved dev dependencies to production for deployment
  - **Improved Build Performance**: Faster builds and better development experience

- **Enhanced AI Processing**: More reliable AI responses and better JSON handling
  - **Completions-Only API**: Switched from chat to completions format for Ollama integration
  - **Improved JSON Parsing**: Better handling of AI responses with strict JSON validation
  - **Increased Content Length**: Extended AI response limits from 200 to 500 tokens
  - **Better Error Handling**: Graceful fallbacks when AI processing fails
  - **Simplified Prompts**: More effective AI prompts for better compliance analysis

- **Database Improvements**: Enhanced data integrity and relationship handling
  - **Fixed Foreign Key Constraints**: Proper cascade deletion for document relationships
  - **Better Error Handling**: Resolved database constraint violation errors
  - **Improved Data Consistency**: Proper cleanup of related records during deletions
  - **Enhanced Logging**: Better error tracking for database operations

#### 🎨 **UI/UX Enhancements**
- **Responsive Document Display**: Fixed overflow issues in document management
  - **Container Boundaries**: Documents properly contained within UI boundaries
  - **Text Truncation**: Long filenames and titles properly truncated with tooltips
  - **Mobile Responsive**: Better display on mobile and tablet devices
  - **Improved Layout**: Better spacing and visual hierarchy

- **Enhanced File Type Support**: Clear indication of supported formats
  - **Visual File Icons**: Different icons for PDF, Word, text, and image files
  - **Format Guidance**: Clear indication of supported file types and size limits
  - **OCR Indicators**: Visual feedback when OCR text extraction is used
  - **File Size Display**: Better formatting of file size information

#### 🐛 **Bug Fixes**
- Fixed document download failures due to incorrect storage method calls
- Resolved socket hang-up errors during multiple file uploads
- Fixed database foreign key constraint violations during document deletion
- Corrected AI JSON parsing warnings and response truncation issues
- Resolved Next.js 16.1.1 compatibility issues with dependencies
- Fixed overflow issues in document display containers
- Corrected OCR text extraction for various image formats

#### 🚀 **Performance Improvements**
- Sequential file upload reduces server load and connection timeouts
- Enhanced AI response processing with better content limits
- Improved database query efficiency for document operations
- Better memory management during large file processing
- Optimized image processing pipeline for OCR extraction

### **v0.2.1** - Enhanced Policy Generation & Submission Management (December 2025)

#### 🆕 **New Features**
- **Professional Word Document Export**: Download completed policy templates as formatted Word documents
  - **Filled Company Data**: All company information fields populated automatically in the Word document
  - **Professional Formatting**: Times New Roman font, proper margins, corporate document structure
  - **Microsoft Office Compatible**: Full compatibility with Word 2016+ and Office 365
  - **Signature Sections**: Built-in approval and signature areas for policy documentation

- **Complete Submission Management**: Comprehensive interface for managing completed templates
  - **📄 Download Word**: Download any completed submission as a formatted policy document
  - **🗑️ Delete Submissions**: Remove old or unwanted template submissions with confirmation
  - **Submission History**: View all completed templates with company details and validation status
  - **Persistent Storage**: All submissions saved locally with cross-session persistence

- **Enhanced AI Evidence Validation**: Improved real-time evidence analysis
  - **Backend API Integration**: New `/api/validate-evidence` endpoint for file analysis
  - **File Type Intelligence**: Smart validation based on evidence type (policy, configuration, screenshot)
  - **Enhanced Feedback**: Detailed findings and recommendations based on file content and format
  - **Fallback Processing**: Graceful handling when AI services are unavailable

#### 🔧 **Technical Improvements**
- **Next.js 15**: Updated to latest Next.js version for improved performance
- **Import Path Fixes**: Resolved module resolution issues across the application
- **JSON Serialization**: Fixed backend API JSON handling for reliable data processing
- **Error Handling**: Enhanced error handling for file uploads and API interactions
- **TypeScript Improvements**: Better type safety for template and submission interfaces

#### 🎨 **UI/UX Enhancements**
- **Action Buttons**: Clear download and delete actions on each submission
- **Visual Status Indicators**: Color-coded validation results with tooltips
- **Responsive Design**: Mobile-optimized submission management interface
- **Confirmation Dialogs**: User-friendly confirmation for destructive actions
- **Progress Feedback**: Real-time feedback during document generation and AI validation

#### 🐛 **Bug Fixes**
- Fixed template data not appearing in downloaded Word documents
- Resolved import path errors preventing build compilation
- Fixed AI validation not working with actual file uploads
- Corrected JSON parsing errors in backend API responses
- Resolved submission storage and retrieval issues

### **v0.2.0** - Template System & AI Validation (December 2025)

#### 🆕 **New Features**
- **Control Templates System**: Create reusable templates for compliance controls
  - Customizable company information fields (text, textarea, select, file inputs)
  - Evidence requirements definition with AI validation prompts
  - Template filling interface with real-time validation
  - Submission tracking and approval workflow

- **Essential Eight Templates**: Complete policy template system
  - **All 8 Controls Covered**: EE-1 through EE-8 with comprehensive templates
  - **Pre-built Templates**: Ready-to-use policy templates for each Essential Eight control
  - **Company-Specific Fields**: Tailored data collection for organization details
  - **Evidence Requirements**: Specific evidence types for each control requirement

- **AI-Powered Evidence Validation**: Real-time inspection of uploaded evidence
  - **Smart Analysis**: Custom AI prompts validate evidence against specific requirements
  - **Confidence Scoring**: AI provides confidence levels (60-95%) for validation results
  - **Detailed Findings**: Specific feedback on what was found in evidence documents
  - **Actionable Recommendations**: AI suggests improvements for better compliance
  - **Visual Feedback**: Color-coded status indicators (Passed/Warning/Failed)

#### 🔧 **Technical Improvements**
- **Navigation Enhancement**: Added Templates to sidebar navigation
- **Data Persistence**: Templates stored in localStorage with proper state management
- **Template Generation**: One-click generation from Essential Eight controls
- **Duplicate Prevention**: Prevents creating multiple templates for the same control
- **Form Validation**: Comprehensive validation for template fields and evidence uploads

#### 🎨 **UI/UX Enhancements**
- **Essential Eight Section**: Dedicated page for browsing and generating Essential Eight templates
- **Template Preview**: View template structure before generation
- **Progress Indicators**: Real-time feedback during AI validation
- **Responsive Design**: Mobile-friendly template forms and validation displays
- **Loading States**: Proper loading indicators for AI processing

#### 📋 **Essential Eight Controls Implemented**
1. **EE-1**: Application Control - Prevent unauthorized application execution
2. **EE-2**: Patch Applications - Timely application security patching
3. **EE-3**: Configure Microsoft Office Macro Settings - Macro security controls
4. **EE-4**: User Application Hardening - Browser and application security
5. **EE-5**: Restrict Administrative Privileges - Privilege management
6. **EE-6**: Patch Operating Systems - OS security patching
7. **EE-7**: Multi-Factor Authentication - MFA for all users
8. **EE-8**: Regular Backups - Data backup and recovery procedures

#### 🤖 **AI Validation Examples**
- **Policy Documents**: Verifies presence of required sections, roles, procedures
- **Configuration Files**: Checks for proper security settings and controls
- **Reports**: Validates compliance metrics and evidence completeness
- **Screenshots**: Analyzes visual evidence for configuration verification

#### 💾 **Data Management**
- **Template Storage**: Browser-based persistence using localStorage
- **Cross-Session**: Templates persist between browser sessions
- **Template Sharing**: Foundation for future multi-user template sharing

### **v0.1.0** - Initial Release
- Core compliance management functionality
- Document upload and evidence linking
- AI scanning capabilities for compliance analysis
- Essential Eight framework support
- Basic reporting and gap analysis

---

<p align="center">
  Made with ❤️ for the compliance community<br>
  <strong>Get Compliant Fast with GeekyGoose! 🦆</strong>
</p>