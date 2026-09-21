import type {
  Project,
  Skill,
  JourneyItem,
  ContactLink,
  ProfileSettings,
  FloatingCard,
  Service,
} from "@/types/api"

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "")
const TOKEN_KEY = "portfolio_admin_token"
export const isApiConfigured = Boolean(API_URL)

type ApiError = { message: string }
type ApiResult<T = unknown> = { data: T | null; error: ApiError | null; count?: number }

async function request<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(init.headers)
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json")
  if (authenticated) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }
  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  const payload = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.error?.message || `Request failed (${response.status})`)
  return payload?.data as T
}

class ResourceQuery<T = any> implements PromiseLike<ApiResult<T>> {
  private readonly resource: string
  private action: "select" | "insert" | "update" | "delete" = "select"
  private body: unknown
  private filter?: { field: string; value: unknown }
  private wantsSingle = false
  private wantsCount = false

  constructor(resource: string) { this.resource = resource }
  select(_columns = "*", options?: { count?: string }): this { this.wantsCount = options?.count === "exact"; return this }
  insert(body: unknown): this { this.action = "insert"; this.body = body; return this }
  update(body: unknown): this { this.action = "update"; this.body = body; return this }
  delete(): this { this.action = "delete"; return this }
  eq(field: string, value: unknown): this { this.filter = { field, value }; return this }
  order(_field: string, _options?: { ascending?: boolean }): this { return this }
  limit(_value: number): this { return this }
  single(): this { this.wantsSingle = true; return this }
  maybeSingle(): this { this.wantsSingle = true; return this }

  async execute(): Promise<ApiResult<T>> {
    try {
      let data: T | null = null
      let count: number | undefined
      if (this.action === "select") {
        const query = this.filter ? `?field=${encodeURIComponent(this.filter.field)}&value=${encodeURIComponent(String(this.filter.value))}` : ""
        const response = await fetch(`${API_URL}/admin/${this.resource}${query}`, { headers: authHeaders() })
        const payload = await response.json().catch(() => null)
        if (!response.ok) throw new Error(payload?.error?.message || `Request failed (${response.status})`)
        data = payload.data
        count = this.wantsCount ? payload.count : undefined
      } else if (this.action === "insert") {
        data = await request(`/admin/${this.resource}`, { method: "POST", body: JSON.stringify(this.body) }, true)
      } else {
        if (!this.filter || this.filter.field !== "id") throw new Error("An id filter is required")
        data = await request(`/admin/${this.resource}/${this.filter.value}`, {
          method: this.action === "update" ? "PATCH" : "DELETE",
          body: this.action === "update" ? JSON.stringify(this.body) : undefined,
        }, true)
      }
      if (this.wantsSingle) data = Array.isArray(data) ? data[0] ?? null : data
      return { data, error: null, count }
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : "Request failed" } }
    }
  }

  then<TResult1 = ApiResult<T>, TResult2 = never>(
    onfulfilled?: ((value: ApiResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const apiClient = {
  from: <T = any>(resource: string) => new ResourceQuery<T>(resource),
  auth: {
    async signInWithPassword(credentials: { email: string; password: string }) {
      try {
        const data = await request<{ token: string; user: { id: string; email: string } }>("/auth/login", { method: "POST", body: JSON.stringify(credentials) })
        localStorage.setItem(TOKEN_KEY, data.token)
        return { data: { session: { user: data.user } }, error: null }
      } catch (error) {
        return { data: { session: null }, error: { message: error instanceof Error ? error.message : "Login failed" } }
      }
    },
    async getSession() {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) return { data: { session: null } }
      try {
        const data = await request<{ user: { id: string; email: string } }>("/auth/me", {}, true)
        return { data: { session: { user: data.user } } }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        return { data: { session: null } }
      }
    },
    async signOut() { localStorage.removeItem(TOKEN_KEY); return { error: null } },
    async updateUser(input: { password: string; currentPassword?: string }) {
      try {
        await request("/auth/password", { method: "PATCH", body: JSON.stringify(input) }, true)
        return { error: null }
      } catch (error) { return { error: { message: error instanceof Error ? error.message : "Password update failed" } } }
    },
  },
}

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
  // Frontend
  { id: "1", name: "React", category: "Frontend", icon_name: "SiReact", color: "text-[#61DAFB]", proficiency: 95, display_order: 1 },
  { id: "2", name: "Next.js", category: "Frontend", icon_name: "SiNextdotjs", color: "text-white", proficiency: 92, display_order: 2 },
  { id: "3", name: "TypeScript", category: "Frontend", icon_name: "SiTypescript", color: "text-[#3178C6]", proficiency: 90, display_order: 3 },
  { id: "4", name: "JavaScript", category: "Frontend", icon_name: "SiJavascript", color: "text-[#F7DF1E]", proficiency: 95, display_order: 4 },
  { id: "5", name: "Tailwind CSS", category: "Frontend", icon_name: "SiTailwindcss", color: "text-[#38BDF8]", proficiency: 95, display_order: 5 },
  { id: "6", name: "Vue.js", category: "Frontend", icon_name: "SiVuedotjs", color: "text-[#42B883]", proficiency: 85, display_order: 6 },
  { id: "7", name: "Redux", category: "Frontend", icon_name: "SiRedux", color: "text-[#764ABC]", proficiency: 88, display_order: 7 },
  { id: "8", name: "Vite", category: "Frontend", icon_name: "SiVite", color: "text-[#646CFF]", proficiency: 90, display_order: 8 },
  { id: "9", name: "HTML5", category: "Frontend", icon_name: "SiHtml5", color: "text-[#E34F26]", proficiency: 98, display_order: 9 },
  { id: "10", name: "CSS3", category: "Frontend", icon_name: "SiCss3", color: "text-[#1572B6]", proficiency: 95, display_order: 10 },

  // Backend
  { id: "11", name: "Node.js", category: "Backend", icon_name: "SiNodedotjs", color: "text-[#339933]", proficiency: 92, display_order: 11 },
  { id: "12", name: "Express.js", category: "Backend", icon_name: "SiExpress", color: "text-white", proficiency: 92, display_order: 12 },
  { id: "13", name: "Golang", category: "Backend", icon_name: "SiGo", color: "text-[#00ADD8]", proficiency: 82, display_order: 13 },
  { id: "14", name: "NestJS", category: "Backend", icon_name: "SiNestjs", color: "text-[#E0234E]", proficiency: 85, display_order: 14 },
  { id: "15", name: "Laravel", category: "Backend", icon_name: "SiLaravel", color: "text-[#FF2D20]", proficiency: 84, display_order: 15 },
  { id: "16", name: "Python", category: "Backend", icon_name: "SiPython", color: "text-[#3776AB]", proficiency: 85, display_order: 16 },
  { id: "17", name: "FastAPI", category: "Backend", icon_name: "SiFastapi", color: "text-[#009688]", proficiency: 80, display_order: 17 },
  { id: "18", name: "GraphQL", category: "Backend", icon_name: "SiGraphql", color: "text-[#E10098]", proficiency: 82, display_order: 18 },

  // Database
  { id: "19", name: "PostgreSQL", category: "Database", icon_name: "SiPostgresql", color: "text-[#4169E1]", proficiency: 90, display_order: 19 },
  { id: "20", name: "MongoDB", category: "Database", icon_name: "SiMongodb", color: "text-[#47A248]", proficiency: 92, display_order: 20 },
  { id: "21", name: "Supabase", category: "Database", icon_name: "SiSupabase", color: "text-[#3ECF8E]", proficiency: 90, display_order: 21 },
  { id: "22", name: "Firebase", category: "Database", icon_name: "SiFirebase", color: "text-[#FFCA28]", proficiency: 85, display_order: 22 },
  { id: "23", name: "Redis", category: "Database", icon_name: "SiRedis", color: "text-[#DC382D]", proficiency: 80, display_order: 23 },
  { id: "24", name: "Prisma", category: "Database", icon_name: "SiPrisma", color: "text-[#2D3748]", proficiency: 88, display_order: 24 },

  // Mobile
  { id: "25", name: "React Native (Expo)", category: "Mobile", icon_name: "SiExpo", color: "text-white", proficiency: 90, display_order: 25 },
  { id: "26", name: "Flutter", category: "Mobile", icon_name: "SiFlutter", color: "text-[#02569B]", proficiency: 78, display_order: 26 },
  { id: "27", name: "Android", category: "Mobile", icon_name: "SiAndroid", color: "text-[#3DDC84]", proficiency: 80, display_order: 27 },

  // Tools & DevOps
  { id: "28", name: "Git & GitHub", category: "Tools", icon_name: "SiGit", color: "text-[#F05032]", proficiency: 95, display_order: 28 },
  { id: "29", name: "Docker", category: "Tools", icon_name: "SiDocker", color: "text-[#2496ED]", proficiency: 85, display_order: 29 },
  { id: "30", name: "Linux", category: "Tools", icon_name: "SiLinux", color: "text-[#FCC624]", proficiency: 88, display_order: 30 },
  { id: "31", name: "Figma", category: "Tools", icon_name: "SiFigma", color: "text-[#F24E1E]", proficiency: 85, display_order: 31 },
  { id: "32", name: "AWS", category: "Tools", icon_name: "SiAmazonwebservices", color: "text-[#FF9900]", proficiency: 75, display_order: 32 },
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
  avatar_url: "https://res.cloudinary.com/dxxovha85/image/upload/v1789989345/portfolio/avatars/mjywjpe5wqqxialzbgi3.jpg",
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

export const defaultServices: Service[] = [
  {
    id: "1",
    title: "Full-Stack Web App Development",
    description: "Building responsive, fast, and accessible web applications using React, Next.js, and TypeScript.",
    icon_name: "Globe",
    stack: "React • Next.js • TypeScript • Tailwind CSS",
    contact_url: "https://sam-nu-fawn.vercel.app/contact",
    display_order: 1,
    is_active: true,
  },
  {
    id: "2",
    title: "Cross-Platform Mobile Apps",
    description: "Developing iOS and Android mobile apps from a single codebase using React Native and Expo.",
    icon_name: "Smartphone",
    stack: "React Native • Expo • TypeScript • Mobile UI",
    contact_url: "https://sam-nu-fawn.vercel.app/contact",
    display_order: 2,
    is_active: true,
  },
  {
    id: "3",
    title: "Backend & API Architecture",
    description: "Designing scalable REST and GraphQL APIs, database schemas, and microservices.",
    icon_name: "Server",
    stack: "Node.js • Express • Golang • PostgreSQL • MongoDB",
    contact_url: "https://sam-nu-fawn.vercel.app/contact",
    display_order: 3,
    is_active: true,
  },
  {
    id: "4",
    title: "Ethiopian Payment Integration",
    description: "Integrating localized digital payments and identity verification with Telebirr, Chapa, and Fayda.",
    icon_name: "CreditCard",
    stack: "Telebirr • Fayda SDK • Chapa • Payment APIs",
    contact_url: "https://sam-nu-fawn.vercel.app/contact",
    display_order: 4,
    is_active: true,
  },
]

// DATA FETCHERS WITH FALLBACKS
export async function getServices(): Promise<Service[]> {
  try {
    const data = await request<Service[]>("/public/services")
    return data?.length ? data : defaultServices
  } catch {
    return defaultServices
  }
}
export async function getProjects(): Promise<Project[]> {
  try {
    const data = await request<Project[]>("/public/projects")
    return data?.length ? data : defaultProjects
  } catch {
    return defaultProjects
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const data = await request<Skill[]>("/public/skills")
    return data?.length ? data : defaultSkills
  } catch {
    return defaultSkills
  }
}

export async function getJourney(): Promise<JourneyItem[]> {
  try {
    const data = await request<JourneyItem[]>("/public/journey")
    return data?.length ? data : defaultJourney
  } catch {
    return defaultJourney
  }
}

export async function getContactLinks(): Promise<ContactLink[]> {
  try {
    const data = await request<ContactLink[]>("/public/contact-links")
    return data?.length ? data : defaultContactLinks
  } catch {
    return defaultContactLinks
  }
}

export async function getAdminContactLinks(): Promise<ContactLink[]> {
  try {
    const res = await apiClient.from<ContactLink[]>("contact_links").select("*")
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data
    }
    return await getContactLinks()
  } catch {
    return await getContactLinks()
  }
}

export async function getFloatingCards(): Promise<FloatingCard[]> {
  try {
    const data = await request<FloatingCard[]>("/public/floating-cards")
    return data?.length ? data : defaultFloatingCards
  } catch {
    return defaultFloatingCards
  }
}

export async function getAdminFloatingCards(): Promise<FloatingCard[]> {
  try {
    const res = await apiClient.from<FloatingCard[]>("floating_cards").select("*")
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data
    }
    return await getFloatingCards()
  } catch {
    return await getFloatingCards()
  }
}

export async function getProfileSettings(): Promise<ProfileSettings> {
  try {
    return await request<ProfileSettings>("/public/profile") || defaultProfileSettings
  } catch {
    return defaultProfileSettings
  }
}

export async function updateProfileSettings(
  profile: Partial<ProfileSettings>
): Promise<{ success: boolean; error?: string; data?: ProfileSettings }> {
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

    const { data: existing } = await apiClient
      .from("profile_settings")
      .select("id")
      .limit(1)
      .maybeSingle()

    if (existing?.id) {
      const { data, error } = await apiClient
        .from("profile_settings")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .limit(1)
        .maybeSingle()

      if (error) {
        const { error: directErr } = await apiClient
          .from("profile_settings")
          .update(payload)
          .eq("id", existing.id)

        if (directErr) return { success: false, error: directErr.message }
        return { success: true, data: { ...profile, ...payload, id: existing.id } as ProfileSettings }
      }

      const updatedData = (data || { ...profile, ...payload, id: existing.id }) as ProfileSettings
      return { success: true, data: updatedData }
    } else {
      const { data, error } = await apiClient
        .from<ProfileSettings>("profile_settings")
        .insert([payload])
        .select()
        .limit(1)
        .maybeSingle()

      if (error) {
        const { error: directErr } = await apiClient
          .from("profile_settings")
          .insert([payload])

        if (directErr) return { success: false, error: directErr.message }
        return { success: true, data: { ...profile, ...payload } as ProfileSettings }
      }

      const insertedData = (data || { ...profile, ...payload }) as ProfileSettings
      return { success: true, data: insertedData }
    }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update profile settings" }
  }
}

export async function submitContactMessage(msg: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await request("/public/messages", { method: "POST", body: JSON.stringify(msg) })
    return { success: true }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to send message" }
  }
}

export async function uploadImage(
  file: File,
  _bucketName: string = "portfolio-images",
  pathPrefix: string = "uploads"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("folder", `portfolio/${pathPrefix}`)
    const data = await request<{ url: string }>("/uploads/image", { method: "POST", body: formData }, true)
    return { success: true, url: data.url }
  } catch (err: unknown) {
    console.error("Cloudinary upload error:", err)
    return { success: false, error: err instanceof Error ? err.message : "Failed to upload image" }
  }
}

export async function uploadImages(
  files: File[],
  _bucketName: string = "portfolio-images",
  pathPrefix: string = "projects"
): Promise<{ success: boolean; urls: string[]; error?: string }> {
  if (!files || files.length === 0) {
    return { success: true, urls: [] }
  }

  try {
    const formData = new FormData()
    for (const file of files) {
      formData.append("images", file)
    }
    formData.append("folder", `portfolio/${pathPrefix}`)

    const data = await request<Array<{ url: string; publicId: string }>>("/uploads/images", {
      method: "POST",
      body: formData,
    }, true)

    const urls = (data || []).map((item) => item.url).filter(Boolean)
    return { success: true, urls }
  } catch (batchErr: unknown) {
    console.warn("Batch /uploads/images request failed, falling back to parallel /uploads/image:", batchErr)
    try {
      const uploadPromises = files.map((file) => uploadImage(file, _bucketName, pathPrefix))
      const results = await Promise.all(uploadPromises)
      const successfulUrls = results.filter((r) => r.success && r.url).map((r) => r.url as string)
      if (successfulUrls.length > 0) {
        return { success: true, urls: successfulUrls }
      }
      return { success: false, urls: [], error: batchErr instanceof Error ? batchErr.message : "Failed to upload images" }
    } catch (fallbackErr: unknown) {
      return { success: false, urls: [], error: fallbackErr instanceof Error ? fallbackErr.message : "Failed to upload images" }
    }
  }
}

export async function uploadCV(
  file: File,
  folder: string = "portfolio/documents"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)
    const data = await request<{ url: string }>("/uploads/document", { method: "POST", body: formData }, true)
    return { success: true, url: data.url }
  } catch (err: unknown) {
    console.warn("Server document upload endpoint failed, using direct data reader fallback:", err)
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve({ success: true, url: reader.result })
        } else {
          resolve({ success: false, error: "Failed to process document file" })
        }
      }
      reader.onerror = () => resolve({ success: false, error: "Failed to read document file" })
      reader.readAsDataURL(file)
    })
  }
}


