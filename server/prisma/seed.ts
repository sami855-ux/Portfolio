import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config()

const db = new PrismaClient()

const initialProjects = [
  {
    title: "Learning Management System",
    description: "Online learning platform with authentication, course management, quizzes, and progress tracking.",
    category: "Full Stack",
    tags: ["React", "Prisma", "TypeScript", "Tailwind", "Redux", "Socket.io", "Shadcn"],
    github: "https://github.com/sami855-ux/LMS-Template.git",
    live: "http://lms-mini-app-ir5c-git-main-daniel-kumilachews-projects.vercel.app",
    featured: true,
  },
  {
    title: "Tax Payment Web App",
    description: "Online tax payment system with authentication, tax filing, admin dashboard, and payment integration.",
    category: "Full Stack",
    tags: ["Next.js", "Node.js", "MongoDB", "Cloudinary", "Stripe"],
    github: "https://github.com/sami855-ux/Tax-payment-Website.git",
    live: "https://tax-payment-website.vercel.app/",
    featured: true,
  },
  {
    title: "Jobs Marketplace (Itgram)",
    description: "Social job platform inspired by LinkedIn and Instagram with posts, job listings, real-time interactions, and messaging.",
    category: "Full Stack",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Express", "Tailwind"],
    github: "https://github.com/sami855-ux/Itgram-social-network.git",
    live: "https://itgram-social-network-w6pm.vercel.app/",
    featured: true,
  },
  {
    title: "Negari - Community Issue Reporting System",
    description: "AI-powered community reporting platform for submitting, tracking, and prioritizing public issues with real-time updates and admin management.",
    category: "Full Stack",
    tags: ["Next.js", "Node.js", "MongoDB", "Socket.io", "AI", "Tailwind"],
    github: "https://github.com/sami855-ux/Negari.git",
    live: "https://negari-ten.vercel.app/",
    featured: true,
  },
]

const initialSkills = [
  // Frontend
  { name: "React", category: "Frontend", iconName: "SiReact", color: "text-[#61DAFB]", proficiency: 95, displayOrder: 1 },
  { name: "Next.js", category: "Frontend", iconName: "SiNextdotjs", color: "text-white", proficiency: 92, displayOrder: 2 },
  { name: "TypeScript", category: "Frontend", iconName: "SiTypescript", color: "text-[#3178C6]", proficiency: 90, displayOrder: 3 },
  { name: "JavaScript", category: "Frontend", iconName: "SiJavascript", color: "text-[#F7DF1E]", proficiency: 95, displayOrder: 4 },
  { name: "Tailwind CSS", category: "Frontend", iconName: "SiTailwindcss", color: "text-[#38BDF8]", proficiency: 95, displayOrder: 5 },
  { name: "Vue.js", category: "Frontend", iconName: "SiVuedotjs", color: "text-[#42B883]", proficiency: 85, displayOrder: 6 },
  { name: "Redux", category: "Frontend", iconName: "SiRedux", color: "text-[#764ABC]", proficiency: 88, displayOrder: 7 },
  { name: "Vite", category: "Frontend", iconName: "SiVite", color: "text-[#646CFF]", proficiency: 90, displayOrder: 8 },
  { name: "HTML5", category: "Frontend", iconName: "SiHtml5", color: "text-[#E34F26]", proficiency: 98, displayOrder: 9 },
  { name: "CSS3", category: "Frontend", iconName: "SiCss3", color: "text-[#1572B6]", proficiency: 95, displayOrder: 10 },

  // Backend
  { name: "Node.js", category: "Backend", iconName: "SiNodedotjs", color: "text-[#339933]", proficiency: 92, displayOrder: 11 },
  { name: "Express.js", category: "Backend", iconName: "SiExpress", color: "text-white", proficiency: 92, displayOrder: 12 },
  { name: "Golang", category: "Backend", iconName: "SiGo", color: "text-[#00ADD8]", proficiency: 82, displayOrder: 13 },
  { name: "NestJS", category: "Backend", iconName: "SiNestjs", color: "text-[#E0234E]", proficiency: 85, displayOrder: 14 },
  { name: "Laravel", category: "Backend", iconName: "SiLaravel", color: "text-[#FF2D20]", proficiency: 84, displayOrder: 15 },
  { name: "Python", category: "Backend", iconName: "SiPython", color: "text-[#3776AB]", proficiency: 85, displayOrder: 16 },
  { name: "FastAPI", category: "Backend", iconName: "SiFastapi", color: "text-[#009688]", proficiency: 80, displayOrder: 17 },
  { name: "GraphQL", category: "Backend", iconName: "SiGraphql", color: "text-[#E10098]", proficiency: 82, displayOrder: 18 },

  // Database
  { name: "PostgreSQL", category: "Database", iconName: "SiPostgresql", color: "text-[#4169E1]", proficiency: 90, displayOrder: 19 },
  { name: "MongoDB", category: "Database", iconName: "SiMongodb", color: "text-[#47A248]", proficiency: 92, displayOrder: 20 },
  { name: "Supabase", category: "Database", iconName: "SiSupabase", color: "text-[#3ECF8E]", proficiency: 90, displayOrder: 21 },
  { name: "Firebase", category: "Database", iconName: "SiFirebase", color: "text-[#FFCA28]", proficiency: 85, displayOrder: 22 },
  { name: "Redis", category: "Database", iconName: "SiRedis", color: "text-[#DC382D]", proficiency: 80, displayOrder: 23 },
  { name: "Prisma", category: "Database", iconName: "SiPrisma", color: "text-[#2D3748]", proficiency: 88, displayOrder: 24 },

  // Mobile
  { name: "React Native (Expo)", category: "Mobile", iconName: "SiExpo", color: "text-white", proficiency: 90, displayOrder: 25 },
  { name: "Flutter", category: "Mobile", iconName: "SiFlutter", color: "text-[#02569B]", proficiency: 78, displayOrder: 26 },
  { name: "Android", category: "Mobile", iconName: "SiAndroid", color: "text-[#3DDC84]", proficiency: 80, displayOrder: 27 },

  // Tools
  { name: "Git & GitHub", category: "Tools", iconName: "SiGit", color: "text-[#F05032]", proficiency: 95, displayOrder: 28 },
  { name: "Docker", category: "Tools", iconName: "SiDocker", color: "text-[#2496ED]", proficiency: 85, displayOrder: 29 },
  { name: "Linux", category: "Tools", iconName: "SiLinux", color: "text-[#FCC624]", proficiency: 88, displayOrder: 30 },
  { name: "Figma", category: "Tools", iconName: "SiFigma", color: "text-[#F24E1E]", proficiency: 85, displayOrder: 31 },
  { name: "AWS", category: "Tools", iconName: "SiAmazonwebservices", color: "text-[#FF9900]", proficiency: 75, displayOrder: 32 },
]

const initialJourney = [
  {
    title: "Introduction",
    description: "Full-stack developer with 3+ years of experience designing and building scalable web and mobile applications using React, Next.js, Vue.js, Laravel, Node.js, PostgreSQL, and React Native (Expo). Experienced across the full development lifecycle, from UI/UX implementation to backend architecture and real-time systems.",
    iconName: "User",
    side: "left",
    color: "text-blue-500",
    displayOrder: 1,
  },
  {
    title: "Education",
    description: "Software engineering degree from Debre Brihan University (2022-2026). Graduated with honors. and have certificates from udemy for fundamental programming and Artificial Intelligence and alison for MERN stack development.",
    dateRange: "2022 - 2025",
    iconName: "GraduationCap",
    side: "right",
    color: "text-green-500",
    displayOrder: 2,
  },
  {
    title: "Internship",
    description: "Interned at Efuye Gela as a Full-Stack Developer and worked as a Frontend Developer at Melfan Tech. Built and contributed to several production-level applications, including a Learning Management System (LMS), a social media platform with interactive features, and an online tax payment system.",
    dateRange: "2018 - 2020",
    iconName: "Briefcase",
    side: "left",
    color: "text-yellow-500",
    displayOrder: 3,
  },
  {
    title: "Currently",
    description: "Building a Node.js package tailored for Ethiopia, integrating Telebirr and Fayda to simplify digital payments. Actively developing web and mobile applications using React, Next.js, React Native (Expo), Node.js, and PostgreSQL.",
    dateRange: "2020 - Present",
    iconName: "Code",
    side: "right",
    color: "text-orange-500",
    displayOrder: 4,
  },
  {
    title: "Future Goals",
    description: "Continuously learning and growing as a developer, with a dedicated focus on the AI sector. Building personal and open-source projects that incorporate machine learning and intelligent features.",
    iconName: "Rocket",
    side: "left",
    color: "text-purple-500",
    displayOrder: 5,
  },
  {
    title: "Development Philosophy",
    description: "I believe in clean, maintainable code and user-centric design. Performance and accessibility should never be afterthoughts.",
    iconName: "TreePine",
    side: "right",
    color: "text-red-500",
    displayOrder: 6,
  },
  {
    title: "Work Style",
    description: "Agile practitioner who thrives in collaborative environments. Strong believer in documentation and knowledge sharing.",
    iconName: "Users",
    side: "left",
    color: "text-pink-500",
    displayOrder: 7,
  },
]

const initialContactLinks = [
  { name: "GitHub", url: "https://github.com/sami855-ux", iconName: "github", displayOrder: 1, isActive: true },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/samiux855/", iconName: "linkedin", displayOrder: 2, isActive: true },
  { name: "Instagram", url: "https://www.instagram.com/samii_211912/", iconName: "instagram", displayOrder: 3, isActive: true },
  { name: "Telegram", url: "https://t.me/Sami_hhtt", iconName: "telegram", displayOrder: 4, isActive: true },
]

const initialFloatingCards = [
  { name: "samitale86@gmail.com", title: "+251 978109304", position: "top-2/3 -right-5", isActive: true, displayOrder: 1 },
  { name: "Big Tech lover", title: "Programmer", position: "top-1/6 -right-5", isActive: true, displayOrder: 2 },
  { name: "Samuel 'The Bug Whisperer' Tale", title: "Chief Coffee Consumer", position: "top-[25%] left-[20%]", isActive: true, displayOrder: 3 },
]

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 6) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (minimum 6 characters) are required")
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await db.admin.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } })

  if (!(await db.profileSettings.findFirst())) {
    await db.profileSettings.create({
      data: {
        fullName: "Samuel Tale",
        heroTitle: "Full Stack Web and Mobile Developer",
        heroDescription: "Turning ideas into sleek, fast, and responsive websites for web and mobile.",
        aboutBio: "Full-stack developer with 3+ years of experience designing and building scalable web and mobile applications using React, Next.js, Vue.js, Laravel, Node.js, PostgreSQL, and React Native (Expo).",
        email,
        location: "Debre Berhan / Addis Ababa, Ethiopia",
      },
    })
    console.log("Seeded profile settings")
  }

  if ((await db.project.count()) === 0) {
    for (const proj of initialProjects) {
      await db.project.create({ data: proj })
    }
    console.log(`Seeded ${initialProjects.length} projects`)
  }

  if ((await db.skill.count()) === 0) {
    for (const skill of initialSkills) {
      await db.skill.create({ data: skill })
    }
    console.log(`Seeded ${initialSkills.length} skills`)
  }

  if ((await db.journeyItem.count()) === 0) {
    for (const item of initialJourney) {
      await db.journeyItem.create({ data: item })
    }
    console.log(`Seeded ${initialJourney.length} journey items`)
  }

  if ((await db.contactLink.count()) === 0) {
    for (const link of initialContactLinks) {
      await db.contactLink.create({ data: link })
    }
    console.log(`Seeded ${initialContactLinks.length} contact links`)
  }

  if ((await db.floatingCard.count()) === 0) {
    for (const card of initialFloatingCards) {
      await db.floatingCard.create({ data: card })
    }
    console.log(`Seeded ${initialFloatingCards.length} floating cards`)
  }

  console.log("Database seeding completed successfully!")
}

main().finally(() => db.$disconnect())
