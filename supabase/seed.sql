-- ============================================================================
-- STEM x TEB Technikum — Seed Data
-- ============================================================================

-- Site settings
INSERT INTO site_settings (key, value) VALUES
  ('homepage_projects_count', '{"count": 3}'::jsonb),
  ('site_title', '{"pl": "STEM x TEB Technikum", "en": "STEM x TEB Technikum"}'::jsonb),
  ('site_description', '{"pl": "Koło technologiczne STEM przy TEB Technikum w Warszawie.", "en": "STEM technology club at TEB Technikum in Warsaw."}'::jsonb),
  ('contact_email', '{"email": "stem@teb.pl"}'::jsonb),
  ('social_links', '{"github": "https://github.com/STEM-TEB"}'::jsonb);

-- Member: Szymon Sosnowski
INSERT INTO members (id, slug, name, nickname, avatar_url, bio_pl, bio_en, github_url, role, display_order, is_visible)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Szymon-Sosnowski',
  'Szymon Sosnowski',
  'Kamciosz',
  NULL,
  'Uczeń TEB Technikum w Warszawie, pasjonat programowania i nowoczesnych technologii webowych. Twórca TEB App — progresywnej aplikacji webowej dla szkoły. Specjalizuje się w full-stack development z wykorzystaniem React, Next.js i Node.js.',
  'TEB Technikum student in Warsaw, passionate about programming and modern web technologies. Creator of TEB App — a progressive web application for school. Specializes in full-stack development using React, Next.js, and Node.js.',
  'https://github.com/Kamciosz',
  'member',
  1,
  TRUE
);

-- Group: Web Team
INSERT INTO groups (id, slug, name, description_pl, description_en, is_permanent, is_visible)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'web-team',
  'Web Team',
  'Zespół odpowiedzialny za tworzenie aplikacji webowych i stron internetowych. Specjalizujemy się w React, Next.js i nowoczesnych technologiach frontendowych.',
  'Team responsible for creating web applications and websites. We specialize in React, Next.js, and modern frontend technologies.',
  TRUE,
  TRUE
);

-- Add Szymon to Web Team
INSERT INTO group_members (group_id, member_id, role)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Leader'
);

-- Project: TEB App
INSERT INTO projects (id, slug, title_pl, title_en, short_desc_pl, short_desc_en, full_desc_pl, full_desc_en, category, github_repo, is_featured, display_order, status)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'teb-app',
  'TEB App',
  'TEB App',
  'Progresywna aplikacja webowa dla szkoły TEB Technikum.',
  'Progressive web app for TEB Technikum school.',
  'TEB App to progresywna aplikacja webowa stworzona z myślą o uczniach TEB Technikum w Warszawie. Aplikacja integruje plan lekcji, system ocen i ogłoszenia szkolne w jednym, wygodnym miejscu dostępnym z każdego urządzenia. Zbudowana z użyciem nowoczesnych technologii webowych, zapewnia szybkość działania i możliwość pracy offline.',
  'TEB App is a progressive web application designed for TEB Technikum students in Warsaw. The app integrates class schedules, grades, and school announcements in one convenient place accessible from any device. Built with modern web technologies, it ensures fast performance and offline capability.',
  'programowanie',
  'https://github.com/Kamciosz/teb-app-production',
  TRUE,
  1,
  'published'
);

-- Link Szymon to TEB App
INSERT INTO project_members (project_id, member_id, role_in_project, display_order)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Full-Stack Developer',
  1
);
