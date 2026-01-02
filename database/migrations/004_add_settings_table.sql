-- Add Settings table for AI configuration
-- Migration: 004_add_settings_table.sql

-- Settings table (singleton pattern with id=1)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    ai_provider VARCHAR(50) DEFAULT 'ollama',
    openai_api_key VARCHAR(500),
    openai_model VARCHAR(100) DEFAULT 'gpt-4o-mini',
    openai_endpoint VARCHAR(500),
    ollama_endpoint VARCHAR(500) DEFAULT 'http://host.docker.internal:11434',
    ollama_model VARCHAR(100) DEFAULT 'qwen2.5:14b',
    ollama_context_size INTEGER DEFAULT 131072,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Insert default settings if table is empty
INSERT INTO settings (id, ai_provider, ollama_endpoint, ollama_model, ollama_context_size)
VALUES (1, 'ollama', 'http://host.docker.internal:11434', 'qwen2.5:14b', 131072)
ON CONFLICT (id) DO NOTHING;
