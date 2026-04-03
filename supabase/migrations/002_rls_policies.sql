-- ============================================================================
-- STEM x TEB Technikum — Row Level Security Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC READ policies (anonymous + authenticated)
-- ============================================================================

-- Members: visible only
CREATE POLICY "members_public_read" ON members
  FOR SELECT USING (is_visible = TRUE);

-- Projects: published only
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT USING (status = 'published');

-- Project members: readable if project is published
CREATE POLICY "project_members_public_read" ON project_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
        AND projects.status = 'published'
    )
  );

-- Project media: readable if project is published
CREATE POLICY "project_media_public_read" ON project_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_media.project_id
        AND projects.status = 'published'
    )
  );

-- Groups: visible only
CREATE POLICY "groups_public_read" ON groups
  FOR SELECT USING (is_visible = TRUE);

-- Group members: readable if group is visible
CREATE POLICY "group_members_public_read" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
        AND groups.is_visible = TRUE
    )
  );

-- Partners: visible only
CREATE POLICY "partners_public_read" ON partners
  FOR SELECT USING (is_visible = TRUE);

-- Awards: always public
CREATE POLICY "awards_public_read" ON awards
  FOR SELECT USING (TRUE);

-- Site settings: always public
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT USING (TRUE);

-- Contact messages: public INSERT only (anyone can submit)
CREATE POLICY "contact_messages_public_insert" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================================
-- ADMIN WRITE policies (authenticated users only)
-- ============================================================================

-- Helper: check if user is authenticated
-- In production you might check a custom admin role claim

CREATE POLICY "members_admin_all" ON members
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "projects_admin_all" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "project_members_admin_all" ON project_members
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "project_media_admin_all" ON project_media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "groups_admin_all" ON groups
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "group_members_admin_all" ON group_members
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "partners_admin_all" ON partners
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "awards_admin_all" ON awards
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "contact_messages_admin_all" ON contact_messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "site_settings_admin_all" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE policies
-- ============================================================================

-- Public read for all buckets
CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'project-media', 'logos'));

-- Authenticated upload/update/delete
CREATE POLICY "storage_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id IN ('avatars', 'project-media', 'logos')
  );

CREATE POLICY "storage_admin_update" ON storage.objects
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND bucket_id IN ('avatars', 'project-media', 'logos')
  );

CREATE POLICY "storage_admin_delete" ON storage.objects
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND bucket_id IN ('avatars', 'project-media', 'logos')
  );
