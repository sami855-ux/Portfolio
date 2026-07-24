-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROJECTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Fullstack',
  tags TEXT[] DEFAULT '{}',
  github TEXT DEFAULT '',
  live TEXT DEFAULT '',
  image TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  architecture TEXT DEFAULT '',
  results TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. SKILLS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Frontend', 'Backend', 'Database', 'Mobile', 'Tools')) NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'SiCode',
  color TEXT DEFAULT '#3ECF8E',
  proficiency INT DEFAULT 90,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. CAREER JOURNEY TIMELINE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.journey_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_range TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'Briefcase',
  side TEXT DEFAULT 'left',
  color TEXT DEFAULT '#3ECF8E',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 4. SOCIAL & CONTACT LINKS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.contact_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT DEFAULT 'github',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 5. CONTACT FORM MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT 'Portfolio Inquiry',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 6. PROFILE SETTINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profile_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Samuel Tale',
  hero_title TEXT NOT NULL DEFAULT 'Full-Stack Software Engineer',
  hero_description TEXT DEFAULT '',
  about_bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  email TEXT NOT NULL DEFAULT 'samuel@example.com',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT 'Addis Ababa, Ethiopia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allow everyone to view portfolio content)
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on journey_timeline" ON public.journey_timeline FOR SELECT USING (true);
CREATE POLICY "Allow public read on contact_links" ON public.contact_links FOR SELECT USING (true);
CREATE POLICY "Allow public read on profile_settings" ON public.profile_settings FOR SELECT USING (true);

-- Public Insert Policy for Contact Messages (Allow visitors to send messages)
CREATE POLICY "Allow public insert on messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Authenticated Full Admin Access Policies
CREATE POLICY "Allow admin all on projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on journey_timeline" ON public.journey_timeline FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on contact_links" ON public.contact_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on messages" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all on profile_settings" ON public.profile_settings FOR ALL USING (auth.role() = 'authenticated');
