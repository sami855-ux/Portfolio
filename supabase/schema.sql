-- SQL Schema for Samuel Tale Portfolio Database (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  github TEXT DEFAULT '',
  live TEXT DEFAULT '',
  image TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'Full Stack',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Frontend', -- Frontend, Backend, Database, Mobile, Tools
  icon_name TEXT NOT NULL DEFAULT 'SiReact',
  color TEXT DEFAULT 'text-blue-500',
  proficiency INTEGER DEFAULT 90,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. JOURNEY TIMELINE TABLE
CREATE TABLE IF NOT EXISTS public.journey_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_range TEXT DEFAULT '',
  icon_name TEXT DEFAULT 'User', -- User, GraduationCap, Briefcase, Code, Rocket, TreePine, Users
  side TEXT DEFAULT 'left', -- left or right
  color TEXT DEFAULT 'text-blue-500',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CONTACT & SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.contact_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- GitHub, LinkedIn, Telegram, Instagram, Facebook, Email, Phone, Location
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'github', -- github, linkedin, instagram, facebook, telegram, mail, phone, map-pin
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MESSAGES INBOX TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROFILE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.profile_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Samuel Tale',
  hero_title TEXT DEFAULT 'Full Stack Web and Mobile Developer',
  hero_description TEXT DEFAULT 'Turning ideas into sleek, fast, and responsive websites for web and mobile.',
  about_bio TEXT DEFAULT 'Full-stack developer with 3+ years of experience designing and building scalable web and mobile applications.',
  resume_url TEXT DEFAULT '',
  email TEXT DEFAULT 'samueltale855@gmail.com',
  phone TEXT DEFAULT '+251900000000',
  location TEXT DEFAULT 'Debre Berhan / Addis Ababa, Ethiopia',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public READ Access
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on journey_timeline" ON public.journey_timeline FOR SELECT USING (true);
CREATE POLICY "Allow public read on contact_links" ON public.contact_links FOR SELECT USING (true);
CREATE POLICY "Allow public read on profile_settings" ON public.profile_settings FOR SELECT USING (true);

-- Allow public INSERT on messages (for Contact Form)
CREATE POLICY "Allow public insert on messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Create Policies for Authenticated Admin Full Access
CREATE POLICY "Allow full access for authenticated users on projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on journey_timeline" ON public.journey_timeline FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on contact_links" ON public.contact_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on messages" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on profile_settings" ON public.profile_settings FOR ALL USING (auth.role() = 'authenticated');

-- SEED DATA

-- Seed Profile Settings
INSERT INTO public.profile_settings (full_name, hero_title, hero_description, about_bio, email, location)
VALUES (
  'Samuel Tale',
  'Full Stack Web and Mobile Developer',
  'Turning ideas into sleek, fast, and responsive websites for web and mobile.',
  'Full-stack developer with 3+ years of experience designing and building scalable web and mobile applications using React, Next.js, Vue.js, Laravel, Node.js, PostgreSQL, and React Native (Expo).',
  'samueltale855@gmail.com',
  'Debre Berhan / Addis Ababa, Ethiopia'
) ON CONFLICT DO NOTHING;

-- Seed Contact Links
INSERT INTO public.contact_links (name, url, icon_name, display_order) VALUES
  ('GitHub', 'https://github.com/sami855-ux', 'github', 1),
  ('LinkedIn', 'https://www.linkedin.com/in/samiux855/', 'linkedin', 2),
  ('Instagram', 'https://www.instagram.com/samii_211912/', 'instagram', 3),
  ('Telegram', 'https://t.me/Sami_hhtt', 'telegram', 4)
ON CONFLICT DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (title, description, tags, github, live, featured, category) VALUES
  (
    'Learning Management System',
    'Online learning platform with authentication, course management, quizzes, and progress tracking.',
    ARRAY['React', 'Prisma', 'TypeScript', 'Tailwind', 'Redux', 'Socket.io', 'Shadcn'],
    'https://github.com/sami855-ux/LMS-Template.git',
    'http://lms-mini-app-ir5c-git-main-daniel-kumilachews-projects.vercel.app',
    true,
    'Full Stack'
  ),
  (
    'Tax Payment Web App',
    'Online tax payment system with authentication, tax filing, admin dashboard, and payment integration.',
    ARRAY['Next.js', 'Node.js', 'MongoDB', 'Cloudinary', 'Stripe'],
    'https://github.com/sami855-ux/Tax-payment-Website.git',
    'https://tax-payment-website.vercel.app/',
    true,
    'Full Stack'
  ),
  (
    'Jobs Marketplace (Itgram)',
    'Social job platform inspired by LinkedIn and Instagram with posts, job listings, real-time interactions, and messaging.',
    ARRAY['React', 'Node.js', 'MongoDB', 'Socket.io', 'Express', 'Tailwind'],
    'https://github.com/sami855-ux/Itgram-social-network.git',
    'https://itgram-social-network-w6pm.vercel.app/',
    true,
    'Full Stack'
  ),
  (
    'Negari - Community Issue Reporting System',
    'AI-powered community reporting platform for submitting, tracking, and prioritizing public issues with real-time updates.',
    ARRAY['Next.js', 'Node.js', 'MongoDB', 'Socket.io', 'AI', 'Tailwind'],
    'https://github.com/sami855-ux/Negari.git',
    'https://negari-ten.vercel.app/',
    true,
    'Full Stack'
  )
ON CONFLICT DO NOTHING;
