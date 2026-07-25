import { createClient } from "@supabase/supabase-js"
import type {
  Project,
  Skill,
  JourneyItem,
  ContactLink,
  Message,
  ProfileSettings,
} from "@/types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ghraybxwhooroumzgslx.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_qEI4-pI2AFKZwupIhxqncQ_jAEe_Kwq"

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
)

// INITIAL STATIC FALLBACK SEED DATA
export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Learning Management System",
    description:
      "Online learning platform with authentication, course management, quizzes, and progress tracking.",
    tags: [
      "React",
      "Prisma",
      "TypeScript",
      "Tailwind",
      "Redux",
      "Socket.io",
      "Shadcn",
    ],
    github: "https://github.com/sami855-ux/LMS-Template.git",
    live: "http://lms-mini-app-ir5c-git-main-daniel-kumilachews-projects.vercel.app",
    featured: true,
    category: "Full Stack",
  },
  {
    id: "2",
    title: "Tax Payment Web App",
    description:
      "Online tax payment system with authentication, tax filing, admin dashboard, and payment integration.",
    tags: ["Next.js", "Node.js", "MongoDB", "Cloudinary", "Stripe"],
    github: "https://github.com/sami855-ux/Tax-payment-Website.git",
    live: "https://tax-payment-website.vercel.app/",
    featured: true,
    category: "Full Stack",
  },
  {
    id: "3",
    title: "Jobs Marketplace (Itgram)",
    description:
      "Social job platform inspired by LinkedIn and Instagram with posts, job listings, real-time interactions, and messaging.",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Express", "Tailwind"],
    github: "https://github.com/sami855-ux/Itgram-social-network.git",
    live: "https://itgram-social-network-w6pm.vercel.app/",
    featured: true,
    category: "Full Stack",
  },
  {
    id: "4",
    title: "Negari - Community Issue Reporting System",
    description:
      "AI-powered community reporting platform for submitting, tracking, and prioritizing public issues with real-time updates and admin management.",
    tags: ["Next.js", "Node.js", "MongoDB", "Socket.io", "AI", "Tailwind"],
    github: "https://github.com/sami855-ux/Negari.git",
    live: "https://negari-ten.vercel.app/",
    featured: true,
    category: "Full Stack",
  },
]

export const defaultSkills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", icon_name: "SiReact", color: "text-[#61DAFB]" },
  { id: "2", name: "Next.js", category: "Frontend", icon_name: "SiNextdotjs", color: "text-white" },
  { id: "3", name: "Vue.js", category: "Frontend", icon_name: "SiVuedotjs", color: "text-[#42B883]" },
  { id: "4", name: "TypeScript", category: "Frontend", icon_name: "SiTypescript", color: "text-[#3178C6]" },
  { id: "5", name: "JavaScript", category: "Frontend", icon_name: "SiJavascript", color: "text-[#F7DF1E]" },
  { id: "6", name: "Tailwind CSS", category: "Frontend", icon_name: "SiTailwindcss", color: "text-[#38BDF8]" },
  { id: "7", name: "Node.js", category: "Backend", icon_name: "SiNodedotjs", color: "text-[#339933]" },
  { id: "8", name: "Express.js", category: "Backend", icon_name: "SiExpress", color: "text-white" },
  { id: "9", name: "Laravel", category: "Backend", icon_name: "SiLaravel", color: "text-[#FF2D20]" },
  { id: "10", name: "MongoDB", category: "Database", icon_name: "SiMongodb", color: "text-[#47A248]" },
  { id: "11", name: "PostgreSQL", category: "Database", icon_name: "SiPostgresql", color: "text-[#4169E1]" },
  { id: "12", name: "Supabase", category: "Database", icon_name: "SiSupabase", color: "text-[#3ECF8E]" },
  { id: "13", name: "React Native (Expo)", category: "Mobile", icon_name: "SiExpo", color: "text-white" },
  { id: "14", name: "Git & GitHub", category: "Tools", icon_name: "SiGit", color: "text-[#F05032]" },
  { id: "15", name: "Docker", category: "Tools", icon_name: "SiDocker", color: "text-[#2496ED]" },
]

export const defaultJourney: JourneyItem[] = [
  {
    id: "1",
    title: "Introduction",
    description:
      "Full-stack developer with 3+ years of experience designing and building scalable web and mobile applications using React, Next.js, Vue.js, Laravel, Node.js, PostgreSQL, and React Native (Expo). Experienced across the full development lifecycle, from UI/UX implementation to backend architecture and real-time systems.",
    icon_name: "User",
    side: "left",
    color: "text-blue-500",
  },
  {
    id: "2",
    title: "Education",
    description:
      "Software engineering degree from Debre Brihan University (2022-2026). Graduated with honors. and have certificates from udemy for fundamental programming and Artificial Intelligence and alison for MERN stack development.",
    date_range: "2022 - 2025",
    icon_name: "GraduationCap",
    side: "right",
    color: "text-green-500",
  },
  {
    id: "3",
    title: "Internship",
    description:
      "Interned at Efuye Gela as a Full-Stack Developer and worked as a Frontend Developer at Melfan Tech. Built and contributed to several production-level applications, including a Learning Management System (LMS), a social media platform with interactive features, and an online tax payment system.",
    date_range: "2018 - 2020",
    icon_name: "Briefcase",
    side: "left",
    color: "text-yellow-500",
  },
  {
    id: "4",
    title: "Currently",
    description:
      "Building a Node.js package tailored for Ethiopia, integrating Telebirr and Fayda to simplify digital payments. Actively developing web and mobile applications using React, Next.js, React Native (Expo), Node.js, and PostgreSQL.",
    date_range: "2020 - Present",
    icon_name: "Code",
    side: "right",
    color: "text-orange-500",
  },
  {
    id: "5",
    title: "Future Goals",
    description:
      "Continuously learning and growing as a developer, with a dedicated focus on the AI sector. Building personal and open-source projects that incorporate machine learning and intelligent features.",
    icon_name: "Rocket",
    side: "left",
    color: "text-purple-500",
  },
  {
    id: "6",
    title: "Development Philosophy",
    description:
      "I believe in clean, maintainable code and user-centric design. Performance and accessibility should never be afterthoughts.",
    icon_name: "TreePine",
    side: "right",
    color: "text-red-500",
  },
  {
    id: "7",
    title: "Work Style",
    description:
      "Agile practitioner who thrives in collaborative environments. Strong believer in documentation and knowledge sharing.",
    icon_name: "Users",
    side: "left",
    color: "text-pink-500",
  },
]

export const defaultContactLinks: ContactLink[] = [
  { id: "1", name: "GitHub", url: "https://github.com/sami855-ux", icon_name: "github", display_order: 1, is_active: true },
  { id: "2", name: "LinkedIn", url: "https://www.linkedin.com/in/samiux855/", icon_name: "linkedin", display_order: 2, is_active: true },
  { id: "3", name: "Instagram", url: "https://www.instagram.com/samii_211912/", icon_name: "instagram", display_order: 3, is_active: true },
  { id: "4", name: "Telegram", url: "https://t.me/Sami_hhtt", icon_name: "telegram", display_order: 4, is_active: true },
]

export const defaultProfileSettings: ProfileSettings = {
  id: "1",
  full_name: "Samuel Tale",
  hero_title: "Full Stack Web and Mobile Developer",
  hero_description:
    "Turning ideas into sleek, fast, and responsive websites for web and mobile.",
  about_bio:
    "Full-stack developer with 3+ years of experience designing and building scalable web and mobile applications using React, Next.js, Vue.js, Laravel, Node.js, PostgreSQL, and React Native (Expo).",
  email: "samueltale855@gmail.com",
  phone: "+251 900 000 000",
  location: "Debre Berhan / Addis Ababa, Ethiopia",
  resume_url: "",
  avatar_url: "",
}

export const defaultFloatingCards: FloatingCard[] = [
  {
    id: "1",
    name: "samitale86@gmail.com",
    title: "+251 978109304",
    position: "top-2/3 -right-5",
    is_active: true,
    display_order: 1,
  },
  {
    id: "2",
    name: "Big Tech lover",
    title: "Programmer",
    position: "top-1/6 -right-5",
    is_active: true,
    display_order: 2,
  },
  {
    id: "3",
    name: "Samuel 'The Bug Whisperer' Tale",
    title: "Chief Coffee Consumer",
    position: "top-[25%] left-[20%]",
    is_active: true,
    display_order: 3,
  },
]

// DATA FETCHERS WITH FALLBACKS
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return defaultProjects
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
    if (error || !data || data.length === 0) return defaultProjects
    return data as Project[]
  } catch {
    return defaultProjects
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured) return defaultSkills
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true })
    if (error || !data || data.length === 0) return defaultSkills
    return data as Skill[]
  } catch {
    return defaultSkills
  }
}

export async function getJourney(): Promise<JourneyItem[]> {
  if (!isSupabaseConfigured) return defaultJourney
  try {
    const { data, error } = await supabase
      .from("journey_timeline")
      .select("*")
      .order("display_order", { ascending: true })
    if (error || !data || data.length === 0) return defaultJourney
    return data as JourneyItem[]
  } catch {
    return defaultJourney
  }
}

export async function getContactLinks(): Promise<ContactLink[]> {
  if (!isSupabaseConfigured) return defaultContactLinks
  try {
    const { data, error } = await supabase
      .from("contact_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error || !data || data.length === 0) return defaultContactLinks
    return data as ContactLink[]
  } catch {
    return defaultContactLinks
  }
}

export async function getFloatingCards(): Promise<FloatingCard[]> {
  if (!isSupabaseConfigured) return defaultFloatingCards
  try {
    const { data, error } = await supabase
      .from("floating_cards")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error || !data || data.length === 0) return defaultFloatingCards
    return data as FloatingCard[]
  } catch {
    return defaultFloatingCards
  }
}

export async function getProfileSettings(): Promise<ProfileSettings> {
  if (!isSupabaseConfigured) return defaultProfileSettings
  try {
    const { data, error } = await supabase
      .from("profile_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
    if (error || !data) return defaultProfileSettings
    return data as ProfileSettings
  } catch {
    return defaultProfileSettings
  }
}

export async function updateProfileSettings(
  profile: Partial<ProfileSettings>
): Promise<{ success: boolean; error?: string; data?: ProfileSettings }> {
  if (!isSupabaseConfigured) {
    return { success: true, data: profile as ProfileSettings }
  }
  try {
    const payload = {
      full_name: profile.full_name,
      hero_title: profile.hero_title,
      hero_description: profile.hero_description,
      about_bio: profile.about_bio,
      email: profile.email,
      phone: profile.phone || "",
      location: profile.location || "",
      avatar_url: profile.avatar_url || "",
      resume_url: profile.resume_url || "",
    }

    const { data: existing } = await supabase
      .from("profile_settings")
      .select("id")
      .limit(1)
      .maybeSingle()

    if (existing?.id) {
      const { data, error } = await supabase
        .from("profile_settings")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .limit(1)
        .maybeSingle()

      if (error) {
        const { error: directErr } = await supabase
          .from("profile_settings")
          .update(payload)
          .eq("id", existing.id)

        if (directErr) return { success: false, error: directErr.message }
        return { success: true, data: { ...profile, ...payload, id: existing.id } as ProfileSettings }
      }

      const updatedData = data || ({ ...profile, ...payload, id: existing.id } as ProfileSettings)
      return { success: true, data: updatedData }
    } else {
      const { data, error } = await supabase
        .from("profile_settings")
        .insert([payload])
        .select()
        .limit(1)
        .maybeSingle()

      if (error) {
        const { error: directErr } = await supabase
          .from("profile_settings")
          .insert([payload])

        if (directErr) return { success: false, error: directErr.message }
        return { success: true, data: { ...profile, ...payload } as ProfileSettings }
      }

      const insertedData = data || ({ ...profile, ...payload } as ProfileSettings)
      return { success: true, data: insertedData }
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile settings" }
  }
}

export async function submitContactMessage(msg: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    console.log("Supabase not configured. Saved message locally:", msg)
    return { success: true }
  }
  try {
    const { error } = await supabase.from("messages").insert([
      {
        name: msg.name,
        email: msg.email,
        subject: msg.subject || "",
        message: msg.message,
        is_read: false,
      },
    ])
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send message" }
  }
}
