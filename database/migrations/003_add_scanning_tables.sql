-- Add scanning and AI-related tables
-- Migration: 003_add_scanning_tables.sql

-- Document pages for storing extracted text
CREATE TABLE document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_num INTEGER NOT NULL,
    text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(document_id, page_num)
);

-- Evidence links between documents and controls/requirements
CREATE TABLE evidence_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(org_id, control_id, requirement_id, document_id)
);

-- Scans for tracking AI analysis jobs
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    model VARCHAR(100),
    prompt_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Scan results for individual requirement assessments
CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('PASS', 'PARTIAL', 'FAIL', 'NOT_FOUND')),
    confidence VARCHAR(10) NOT NULL,
    rationale_json TEXT,
    citations_json TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(scan_id, requirement_id)
);

-- Gaps identified during scanning
CREATE TABLE gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    gap_summary TEXT NOT NULL,
    recommended_actions_json TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs for tracking all changes
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    meta_json TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_document_pages_document_id ON document_pages(document_id);
CREATE INDEX idx_evidence_links_org_id ON evidence_links(org_id);
CREATE INDEX idx_evidence_links_control_id ON evidence_links(control_id);
CREATE INDEX idx_evidence_links_document_id ON evidence_links(document_id);
CREATE INDEX idx_scans_org_id ON scans(org_id);
CREATE INDEX idx_scans_control_id ON scans(control_id);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scan_results_scan_id ON scan_results(scan_id);
CREATE INDEX idx_scan_results_requirement_id ON scan_results(requirement_id);
CREATE INDEX idx_gaps_scan_id ON gaps(scan_id);
CREATE INDEX idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Trigger to update updated_at timestamp on evidence_links
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_evidence_links_updated_at 
    BEFORE UPDATE ON evidence_links 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scans_updated_at 
    BEFORE UPDATE ON scans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE document_pages IS 'Stores extracted text content from documents by page';
COMMENT ON TABLE evidence_links IS 'Links documents as evidence for specific controls and requirements';
COMMENT ON TABLE scans IS 'Tracks AI scanning jobs for compliance assessment';
COMMENT ON TABLE scan_results IS 'Results of AI analysis for individual requirements';
COMMENT ON TABLE gaps IS 'Compliance gaps identified during scanning with recommendations';
COMMENT ON TABLE audit_logs IS 'Audit trail of all system changes for compliance tracking';