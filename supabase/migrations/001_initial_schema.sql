-- ============================================================================
-- STEM x TEB Technikum — Initial Database Schema
-- ============================================================================

-- Custom enum types
CREATE TYPE project_category AS ENUM ('robotyka', 'mechatronika', 'programowanie', 'inne');
CREATE TYPE project_status AS ENUM ('draft', 'published');
CREATE TYPE partner_type AS ENUM ('partner', 'sponsor');
CREATE TYPE media_type AS ENUM ('image', 'presentation', 'video');

-- ============================================================================
-- MEMBERS
-- ============================================================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  bio_pl TEXT,
  bio_en TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_slug ON members (slug);
CREATE INDEX idx_members_visible ON members (is_visible) WHERE is_visible = TRUE;

-- ============================================================================
-- GROUPS
-- ============================================================================
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  description_pl TEXT,
  description_en TEXT,
  is_permanent BOOLEAN NOT NULL DEFAULT TRUE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_groups_slug ON groups (slug);

-- ============================================================================
-- PROJECTS
-- ============================================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_pl TEXT NOT NULL,
  title_en TEXT,
  short_desc_pl TEXT NOT NULL,
  short_desc_en TEXT,
  full_desc_pl TEXT,
  full_desc_en TEXT,
  category project_category NOT NULL DEFAULT 'inne',
  github_repo TEXT,
  website_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT DEFAULT 0,
  popularity INT NOT NULL DEFAULT 0,
  is_group_project BOOLEAN NOT NULL DEFAULT FALSE,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  status project_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_slug ON projects (slug);
CREATE INDEX idx_projects_status ON projects (status) WHERE status = 'published';
CREATE INDEX idx_projects_category ON projects (category);
CREATE INDEX idx_projects_featured ON projects (is_featured) WHERE is_featured = TRUE;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- PROJECT_MEMBERS (junction)
-- ============================================================================
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role_in_project TEXT,
  display_order INT NOT NULL DEFAULT 0,
  UNIQUE (project_id, member_id)
);

-- ============================================================================
-- PROJECT_MEDIA
-- ============================================================================
CREATE TABLE project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type media_type NOT NULL DEFAULT 'image',
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_media_project ON project_media (project_id);

-- ============================================================================
-- GROUP_MEMBERS (junction)
-- ============================================================================
CREATE TABLE group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role TEXT,
  PRIMARY KEY (group_id, member_id)
);

-- ============================================================================
-- PARTNERS (also used for sponsors via type column)
-- ============================================================================
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  description_pl TEXT,
  description_en TEXT,
  type partner_type NOT NULL DEFAULT 'partner',
  tier TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_type ON partners (type);
CREATE INDEX idx_partners_visible ON partners (is_visible) WHERE is_visible = TRUE;

-- ============================================================================
-- AWARDS
-- ============================================================================
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_pl TEXT NOT NULL,
  title_en TEXT,
  description_pl TEXT,
  description_en TEXT,
  date DATE,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- CONTACT_MESSAGES
-- ============================================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_unread ON contact_messages (is_read) WHERE is_read = FALSE;

-- ============================================================================
-- SITE_SETTINGS (key-value store)
-- ============================================================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', TRUE),
  ('project-media', 'project-media', TRUE),
  ('logos', 'logos', TRUE);
