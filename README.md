# GeekyGoose Compliance

> **Get Compliant Fast** — AI-Powered Compliance Automation for SMB + Internal IT Teams

![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)
![Version](https://img.shields.io/badge/version-0.4.0-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## Features

### AI-Powered Compliance Scanning
- **Two-step document analysis** — scan and summarise, then map to controls
- **Dual vision validation** — run OpenAI and Ollama in parallel, only link when both agree
- **Multi-format support** — PDF, DOCX, TXT, PNG, JPG with OCR fallback
- **Smart gap detection** — AI identifies missing evidence and explains why
- **Confidence scoring** — Pass / Partial / Fail ratings with per-result confidence levels
- **Citation tracking** — direct references to the evidence behind each finding

### Compliance Frameworks
- **Essential Eight** — all 8 controls with maturity level support
- **Extensible** — architecture ready for ISO 27001, NIST CSF, CIS Controls, SOC 2

### Document & Evidence Management
- **Evidence linking** — connect documents to specific controls and requirements
- **Secure storage** — MinIO object storage with signed download URLs
- **SHA-256 deduplication** — content-addressed storage with integrity verification
- **Audit trail** — complete history of uploads and evidence decisions

### Template & Policy Generation
- Create reusable compliance templates with company-specific fields
- Fill templates and download completed policies as Word documents
- Submission tracking and approval workflow

### Security (OWASP-hardened)
- JWT authentication with bcrypt password hashing
- First-run setup wizard — no default credentials
- API key encryption at rest (Fernet symmetric encryption)
- SSRF protection on all user-supplied URLs
- Full org-scoped data isolation — users only see their own organisation's data
- Security headers middleware (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting and request size validation

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│  Next.js 15 · TypeScript · Tailwind CSS                │
│  JWT stored in cookie + localStorage                   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────────┐
│  Nginx  (rate limiting · security headers · TLS term.)  │
└───────────┬───────────────────────┬─────────────────────┘
            │                       │
┌───────────▼──────────┐ ┌──────────▼──────────────────────┐
│  FastAPI (Python)    │ │  Celery Workers                 │
│  JWT middleware      │ │  - Document text extraction     │
│  Org-scoped queries  │ │  - AI compliance scanning       │
│  SSRF validation     │ │  - Background retry logic       │
└──┬────────┬──────────┘ └────────────────────────────────┘
   │        │
┌──▼──┐  ┌──▼──────────────────────────────────────────────┐
│ PG  │  │  MinIO  (S3-compatible object storage)          │
│ DB  │  └─────────────────────────────────────────────────┘
└─────┘
   │
┌──▼────────────────────────────────────────────────────────┐
│  AI Engine                                                │
│  Ollama (local, privacy-first)  /  OpenAI API            │
│  Optional: dual-vision mode (both must agree to link)    │
└───────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Docker and Docker Compose
- 8 GB+ RAM (16 GB+ recommended if using local Ollama models)

### 1. Clone

```bash
git clone https://github.com/q7technology/GeekyGoose-Compliance-Community.git
cd GeekyGoose-Compliance-Community
```

### 2. Generate secrets

```bash
# JWT signing key
python3 -c "import secrets; print(secrets.token_hex(32))"

# Fernet encryption key (for API keys stored in the database)
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values. The required keys are:

```env
# ── Database ────────────────────────────────────────────
DATABASE_URL=postgresql://gguser:STRONG_PASSWORD@db:5432/geekygoose

# ── Authentication (required) ──────────────────────────
JWT_SECRET_KEY=<output of secrets.token_hex(32)>
ENCRYPTION_KEY=<output of Fernet.generate_key()>

# ── Object storage ─────────────────────────────────────
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=your_access_key        # change from default
MINIO_SECRET_KEY=your_secret_key_min20  # change from default
MINIO_BUCKET=geekygoose-docs
MINIO_USE_SSL=false                     # set true in production

# ── AI provider (pick one) ─────────────────────────────
AI_PROVIDER=ollama
OLLAMA_ENDPOINT=http://host.docker.internal:11434
OLLAMA_MODEL=qwen2.5:14b
OLLAMA_VISION_MODEL=qwen2-vl
OLLAMA_CONTEXT_SIZE=32768

# AI_PROVIDER=openai
# OPENAI_API_KEY is stored in the database via Settings page,
# encrypted with ENCRYPTION_KEY. Set here only as a fallback.
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4o-mini

# ── Frontend ───────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:8000
INTERNAL_API_URL=http://api:8000        # used by Next.js middleware (server-side)
```

### 4. Start services

```bash
docker compose up -d
docker compose ps   # confirm all containers are healthy
```

### 5. Initialise the database

```bash
docker compose exec api python init_db.py
docker compose exec api python run_seed.py   # loads Essential Eight framework
```

### 6. First-run setup

Open **http://localhost:3000** in your browser. Because no users exist yet, you will be automatically redirected to the **Setup** page.

Fill in:
- Organisation name
- Your name
- Email address
- Password (minimum 8 characters)

Click **Create admin account**. You are logged in immediately and redirected to the dashboard. The setup page will never appear again once an account exists.

### 7. Access points

| Service | URL | Notes |
|---|---|---|
| Web app | http://localhost:3000 | Main UI |
| API docs | http://localhost:8000/docs | Swagger UI (disable in production) |
| MinIO console | http://localhost:9001 | Object storage admin |

---

## Authentication

### First login
The setup wizard (`/setup`) creates the first admin account. All subsequent users are added via the API or (future) admin UI.

### Logging in
Navigate to **http://localhost:3000/login** with your email and password. A JWT is stored in a cookie (`gg_token`) and `localStorage`. All API requests include this token automatically.

### API access
```bash
# Log in and capture the token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword"}' \
  | jq -r .access_token)

# Use the token
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/documents
```

### Registering additional users
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "Acme Corp",
    "name": "Jane Smith",
    "email": "jane@acme.com",
    "password": "strongpassword"
  }'
```

---

## AI Configuration

### Ollama (local, privacy-first)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull qwen2.5:14b    # text analysis (16 GB+ RAM)
ollama pull qwen2-vl       # vision / image analysis
```

```env
AI_PROVIDER=ollama
OLLAMA_ENDPOINT=http://host.docker.internal:11434
OLLAMA_MODEL=qwen2.5:14b
OLLAMA_VISION_MODEL=qwen2-vl
OLLAMA_CONTEXT_SIZE=32768   # increase to 65536 on 32 GB+ systems
```

### OpenAI

Configure via the **Settings → AI** page in the UI. The API key is encrypted with your `ENCRYPTION_KEY` before being stored in the database — it is never logged or returned in API responses.

```env
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
OPENAI_VISION_MODEL=gpt-4o
```

### Dual vision validation

Enable in **Settings → AI** to have both OpenAI and Ollama independently analyse each document. A control link is only created when both models agree on the same control. Requires both providers to be configured.

- Best for: critical documents, regulatory submissions, final audits
- Trade-off: 2× processing time, requires OpenAI credits + Ollama running

---

## User Guide

### Getting started
1. **Upload evidence** — Documents → Upload your policies, screenshots, and config exports
2. **Link to controls** — Controls → select a control → link your evidence
3. **Run AI scan** — click "Start AI Scan" to analyse evidence against requirements
4. **Review results** — see compliance status, gaps, confidence scores, and citations
5. **Generate reports** — export for audits and stakeholder reviews

### Templates & policy generation
1. Templates → Create Template → define company fields and evidence requirements
2. Fill Template → enter company information and upload supporting evidence
3. Download the completed policy as a Word document
4. Track submissions on the Submissions page

### Example workflow: MFA compliance
1. Upload your MFA policy (PDF) and configuration screenshots
2. Controls → "EE-7: Multi-Factor Authentication" → Link documents
3. Run AI scan
4. Review gap: "Hardware token policy not documented — Priority: HIGH"
5. Export report for remediation tracking

---

## Project Structure

```
GeekyGoose-Compliance/
├── apps/
│   ├── api/                    # FastAPI backend (Python)
│   │   ├── main.py             # API routes and application setup
│   │   ├── auth.py             # JWT authentication and password hashing
│   │   ├── crypto.py           # Fernet encryption for secrets at rest
│   │   ├── middleware.py       # Security, logging, and error middleware
│   │   ├── models.py           # SQLAlchemy database models
│   │   ├── ai_scanner.py       # AI compliance scanning engine
│   │   ├── storage.py          # MinIO object storage client
│   │   ├── worker_tasks.py     # Celery background tasks
│   │   └── requirements.txt
│   └── web/                    # Next.js frontend (TypeScript)
│       └── src/
│           ├── app/
│           │   ├── setup/      # First-run admin setup page
│           │   ├── login/      # Login page
│           │   ├── controls/   # Controls library
│           │   ├── documents/  # Document management
│           │   ├── reports/    # Compliance reporting
│           │   └── settings/   # AI provider settings
│           ├── components/
│           │   ├── LayoutShell.tsx   # Conditional sidebar rendering
│           │   ├── Sidebar.tsx
│           │   └── ...
│           ├── middleware.ts   # Setup check and auth redirect
│           └── utils/
│               └── api.ts      # Authenticated API client
├── nginx/
│   └── nginx.conf              # Rate limiting, security headers, TLS
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## Production Deployment

### Security checklist

- [ ] `JWT_SECRET_KEY` set to a random 64-character hex string
- [ ] `ENCRYPTION_KEY` set to a Fernet key (see Quick Start step 2)
- [ ] MinIO credentials changed from defaults
- [ ] Database password is strong and unique
- [ ] HTTPS/TLS configured in Nginx (uncomment SSL block in `nginx/nginx.conf`)
- [ ] `NEXT_PUBLIC_API_URL` points to your public API domain
- [ ] FastAPI Swagger UI disabled (set `docs_url=None` or restrict via Nginx)
- [ ] MinIO console restricted to admin IPs (uncomment allow/deny in `nginx.conf`)
- [ ] Firewall rules in place — only ports 80/443 exposed publicly

### Environment (production)

```env
DATABASE_URL=postgresql://gguser:STRONG_PASSWORD@db:5432/geekygoose_prod
JWT_SECRET_KEY=<64-char hex>
ENCRYPTION_KEY=<Fernet key>
MINIO_ENDPOINT=storage.yourdomain.com:9000
MINIO_ACCESS_KEY=prod_access_key
MINIO_SECRET_KEY=prod_secret_key_min20_chars
MINIO_USE_SSL=true
AI_PROVIDER=ollama
OLLAMA_ENDPOINT=http://host.docker.internal:11434
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
INTERNAL_API_URL=http://api:8000
NODE_ENV=production
```

### Scaling

```yaml
# docker-compose.prod.yml excerpt
services:
  api:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Development

### Local setup

```bash
# Backend
cd apps/api
pip install -r requirements.txt
JWT_SECRET_KEY=dev-only-key ENCRYPTION_KEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())") \
  uvicorn main:app --reload

# Frontend
cd apps/web
npm install
npm run dev

# Celery worker
cd apps/api
celery -A celery_app worker --loglevel=info
```

### Database migrations

```bash
docker compose exec api alembic revision --autogenerate -m "description"
docker compose exec api alembic upgrade head
```

### Running tests

```bash
cd apps/api
python test_scanner.py
```

---

## Supported Frameworks

| Framework | Status |
|---|---|
| Essential Eight | Complete (all 8 controls, maturity levels 1–3) |
| ISO 27001 | Planned |
| NIST CSF | Planned |
| CIS Controls | Planned |
| SOC 2 | Planned |
| PCI DSS | Planned |

---

## Security & Privacy

- **Authentication** — JWT (HS256) with bcrypt-hashed passwords; tokens expire after 24 hours
- **Authorisation** — all data queries scoped to the authenticated user's organisation
- **Secrets at rest** — AI API keys encrypted with Fernet before database storage
- **SSRF protection** — user-supplied endpoint URLs validated; cloud metadata addresses blocked
- **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options on all responses
- **Request validation** — 50 MB file size limit, MIME type verification via libmagic
- **Local AI option** — use Ollama to keep all document data on-premises; no data sent to third parties
- **No training** — customer documents are never used for model training

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes using conventional commits
4. Open a Pull Request with a clear description

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

---

## License

GeekyGoose Compliance is dual-licensed:

- **Community Edition** — [AGPLv3](LICENSE). Free to use, modify, and self-host. Network use requires source disclosure.
- **Commercial Edition** — contact us for a commercial licence if you need to embed this software in a proprietary product or require support SLAs.

See [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md) for details.
