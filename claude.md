# claude.md — Get Compliant Fast (Compliance Automation Platform)



## 0) Mission

Build a web-based compliance automation platform for SMB + internal IT teams.

Name : Geeky Goose Compliance

Core value:

- Show a control (e.g., Essential Eight MFA).

- Let the user upload policy/docs/evidence.

- Automatically scan + score the evidence against the control requirements.

- Show what’s missing (gaps), why, and recommended next actions.

- Provide a review page that ties together: control → requirements → uploaded documents → extracted evidence → results → history.



The product must be usable with minimal human interaction and support multi-tenant orgs.



---



## 1) Product Scope (MVP → V1)

### MVP (must ship first)

1. Auth + org workspace (multi-tenant)

2. Framework: Essential Eight (start with MFA control + a handful more)

3. Control library page:

   - list controls, maturity levels, requirements, examples

4. Evidence upload:

   - pdf/docx/txt/png/jpg

   - tag to control + requirement(s)

5. Automated scanning:

   - extract text

   - map snippets to requirement checks

   - return pass/partial/fail + confidence + rationale

6. Review page:

   - control overview + requirements

   - all uploaded docs/evidence tied to control

   - scan results + gaps list + audit trail

7. Export:

   - control report (PDF) and/or CSV for evidence register



### V1 (after MVP)

- More frameworks (ISO 27001, NIST CSF, CIS)

- Evidence “request from owner” workflow

- Agentic suggestions: create missing policy template, generate remediation tasks

- Integrations: Microsoft 365 (Conditional Access), Intune, Defender, CrowdStrike, Meraki

- Ticketing (Jira/ServiceNow/JitBit)

- Continuous monitoring & drift alerts



---



## 2) Non-Functional Requirements

- Multi-tenant by design (org_id scoped everywhere)

- Strong audit logging (who uploaded/changed what + scan history)

- Secure file handling (encrypted at rest, signed URLs, malware scanning optional)

- Data privacy: no training on customer data; store minimal derived artifacts

- Fast UX: progressive results; background jobs for scanning

- Deterministic exports & repeatable scans (store prompt versions + model versions)



---



## 3) Architecture (recommended)

### Frontend

- Next.js (App Router) + TypeScript

- Tailwind + shadcn/ui

- Server actions for simple mutations

- TanStack Query for client-side data fetching where needed



### Backend

- FastAPI (Python) OR Next.js API routes (choose one; prefer FastAPI if you want scale + workers cleanly)

- Postgres for relational data

- Object storage for files (S3-compatible: AWS S3 / MinIO / Cloudflare R2)

- Queue/worker for scans (Celery + Redis, or Dramatiq, or Sidekiq equivalent if Node)



### AI / Document Processing

- Text extraction pipeline:

  - PDFs: pdfplumber / PyMuPDF

  - DOCX: python-docx

  - Images: OCR (Tesseract) when needed

- Chunking + embedding (pgvector) for “find evidence” retrieval

- LLM for requirement mapping + gap analysis:

  - Use a strict JSON schema output

  - Store citations: {doc_id, page, snippet offsets}



---



## 4) Data Model (Postgres)

Implement these tables (minimum fields shown; add timestamps everywhere):

- orgs(id, name, plan)

- users(id, org_id, email, name, role)

- frameworks(id, name, version)

- controls(id, framework_id, code, title, description)

- requirements(id, control_id, req_code, text, maturity_level, guidance)

- documents(id, org_id, filename, mime_type, storage_key, uploaded_by, sha256)

- document_pages(id, document_id, page_num, text)  // optional but recommended

- evidence_links(id, org_id, control_id, requirement_id, document_id, note)

- scans(id, org_id, control_id, status, model, prompt_version)

- scan_results(id, scan_id, requirement_id, outcome, confidence, rationale_json, citations_json)

- gaps(id, scan_id, requirement_id, gap_summary, recommended_actions_json)

- audit_logs(id, org_id, actor_user_id, action, entity_type, entity_id, meta_json)



Outcomes:

- PASS / PARTIAL / FAIL / NOT_FOUND



---



## 5) Key UX Flows

### A) Browse Controls

- Framework selector

- Control list (search + filters)

- Control detail page:

  - what it is

  - why it matters

  - requirement checklist (by maturity level)

  - “Upload evidence” CTA

  - “Run scan” CTA



### B) Upload Evidence

- Drag/drop

- Choose control + optionally link to requirement(s)

- After upload: show extracted text preview (first N chars) + pages



### C) Run Scan

- Create scan job for a control

- Worker pulls:

  - control + requirements

  - linked documents + extracted text

  - relevant snippets via retrieval

- LLM outputs JSON

- Store results + gaps



### D) Review Page (most important)

For a given control:

- Left: requirements list + status badges

- Right: evidence viewer:

  - documents

  - citations highlight (snippet)

- Gaps panel:

  - missing items, what would satisfy them

  - actions list with copy-to-task support

- History:

  - previous scans, deltas, who changed evidence



---



## 6) LLM Prompting & Schemas (strict)

### Requirement mapping prompt rules

- Input: control metadata + requirement list + retrieved snippets

- Output MUST be valid JSON matching schema:

  - requirements: [{requirement_id, outcome, confidence, rationale, citations:[{document_id, page_num, quote}]}]

  - gaps: [{requirement_id, summary, recommended_actions:[{title, detail, priority}]}]

- No extra keys. No commentary. JSON only.

- Confidence 0.0–1.0

- Citations must be short quotes (max 30 words each)



Store:

- prompt_version

- model id

- raw_output

- parsed_output



---



## 7) Security & Compliance

- Row-level org scoping enforced server-side

- Signed URLs for downloads, time-limited

- Virus scanning optional for MVP but leave hook

- Rate limiting on upload + scan endpoints

- Encrypt secrets (env + vault-ready)

- Audit logs are immutable (append-only)



---



## 8) Local Dev Setup

Provide a docker-compose for:

- postgres

- redis

- minio (S3-compatible)

- app frontend

- api backend

- worker



Include:

- `.env.example`

- Makefile or npm scripts:

  - dev

  - migrate

  - seed

  - worker



---



## 9) Deliverables Claude must produce

1. Full repo scaffold with:

   - /apps/web (Next.js)

   - /apps/api (FastAPI) OR /apps/web/api (if Node-only)

   - /packages/shared (types, schemas)

2. Database migrations (SQL or Prisma/Alembic)

3. Document extraction pipeline

4. Worker queue + scan processing

5. Control library seeded with Essential Eight (at least 5 controls + MFA fully detailed)

6. UI:

   - Controls list

   - Control detail

   - Upload evidence

   - Review page

7. Export:

   - PDF report per control

   - CSV evidence register

8. Tests:

   - at least unit tests for extraction + schema validation

9. Basic deployment notes (Docker + reverse proxy)



---



## 10) Build Order (do not skip)

1. Repo scaffold + env

2. Auth + org scoping

3. Framework/control/requirement schema + seed Essential Eight

4. Upload + object storage + document text extraction

5. Link evidence to controls/requirements

6. Scanning worker + LLM integration + strict JSON schema validation

7. Review page with citations + gap list

8. Export PDF/CSV

9. Hardening + audit logs + rate limits



---



## 11) Definition of Done

- User can pick “Essential Eight → MFA”, upload a policy + screenshot evidence, run scan, and see:

  - per-requirement outcomes

  - citations pointing to uploaded docs

  - a gap list with recommended actions

  - a page showing control + uploaded policy/doc + evidence together

- All data is org-scoped

- Exports generate correctly

- Scan results are repeatable and versioned



---



## 12) Style + Quality Rules

- Keep UI clean and simple; no clutter.

- Prefer “explain what’s missing” over vague scores.

- Never hallucinate: if evidence not found, outcome is NOT_FOUND/FAIL with low confidence.

- Every requirement result must include either citations OR an explicit “no evidence found” rationale.

- All endpoints must validate org ownership.

- Add helpful logs for extraction and scanning.



---



## 13) Nice-to-have (only after MVP works)

- “Generate policy template” per control

- Evidence request emails

- Continuous checks via integrations (M365/Intune)

- Control maturity tracking dashboard



---



## 14) Repo Conventions

- Use TypeScript types + shared zod schemas.

- Use `eslint` + `prettier`.

- Use semantic commits.

- Keep secrets out of git.



END.