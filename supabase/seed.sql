-- ==========================================
-- SUPABASE SEED DATA FOR PORTFOLIO
-- Technical Stack (skills), Journey, & Profile Settings
-- ==========================================

-- Clean existing default entries if desired
-- TRUNCATE TABLE public.skills;

-- 1. SEED TECHNICAL STACK (public.skills)
INSERT INTO public.skills (name, category, icon_name, color, proficiency, display_order)
VALUES
  -- Frontend
  ('React', 'Frontend', 'SiReact', 'text-[#61DAFB]', 95, 1),
  ('Next.js', 'Frontend', 'SiNextdotjs', 'text-white', 92, 2),
  ('TypeScript', 'Frontend', 'SiTypescript', 'text-[#3178C6]', 90, 3),
  ('JavaScript', 'Frontend', 'SiJavascript', 'text-[#F7DF1E]', 95, 4),
  ('Tailwind CSS', 'Frontend', 'SiTailwindcss', 'text-[#38BDF8]', 95, 5),
  ('Vue.js', 'Frontend', 'SiVuedotjs', 'text-[#42B883]', 85, 6),
  ('Redux', 'Frontend', 'SiRedux', 'text-[#764ABC]', 88, 7),
  ('Vite', 'Frontend', 'SiVite', 'text-[#646CFF]', 90, 8),
  ('HTML5', 'Frontend', 'SiHtml5', 'text-[#E34F26]', 98, 9),
  ('CSS3', 'Frontend', 'SiCss3', 'text-[#1572B6]', 95, 10),

  -- Backend
  ('Node.js', 'Backend', 'SiNodedotjs', 'text-[#339933]', 92, 11),
  ('Express.js', 'Backend', 'SiExpress', 'text-white', 92, 12),
  ('Golang', 'Backend', 'SiGo', 'text-[#00ADD8]', 82, 13),
  ('NestJS', 'Backend', 'SiNestjs', 'text-[#E0234E]', 85, 14),
  ('Laravel', 'Backend', 'SiLaravel', 'text-[#FF2D20]', 84, 15),
  ('Python', 'Backend', 'SiPython', 'text-[#3776AB]', 85, 16),
  ('FastAPI', 'Backend', 'SiFastapi', 'text-[#009688]', 80, 17),
  ('GraphQL', 'Backend', 'SiGraphql', 'text-[#E10098]', 82, 18),

  -- Database
  ('PostgreSQL', 'Database', 'SiPostgresql', 'text-[#4169E1]', 90, 19),
  ('MongoDB', 'Database', 'SiMongodb', 'text-[#47A248]', 92, 20),
  ('Supabase', 'Database', 'SiSupabase', 'text-[#3ECF8E]', 90, 21),
  ('Firebase', 'Database', 'SiFirebase', 'text-[#FFCA28]', 85, 22),
  ('Redis', 'Database', 'SiRedis', 'text-[#DC382D]', 80, 23),
  ('Prisma', 'Database', 'SiPrisma', 'text-[#2D3748]', 88, 24),

  -- Mobile
  ('React Native (Expo)', 'Mobile', 'SiExpo', 'text-white', 90, 25),
  ('Flutter', 'Mobile', 'SiFlutter', 'text-[#02569B]', 78, 26),
  ('Android', 'Mobile', 'SiAndroid', 'text-[#3DDC84]', 80, 27),

  -- Tools
  ('Git & GitHub', 'Tools', 'SiGit', 'text-[#F05032]', 95, 28),
  ('Docker', 'Tools', 'SiDocker', 'text-[#2496ED]', 85, 29),
  ('Linux', 'Tools', 'SiLinux', 'text-[#FCC624]', 88, 30),
  ('Figma', 'Tools', 'SiFigma', 'text-[#F24E1E]', 85, 31),
  ('AWS', 'Tools', 'SiAmazonwebservices', 'text-[#FF9900]', 75, 32)
ON CONFLICT (id) DO NOTHING;
