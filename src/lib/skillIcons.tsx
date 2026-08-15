import React from "react"
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiFigma,
  SiPrisma,
  SiRedux,
  SiDocker,
  SiGithub,
  SiVite,
  SiFramer,
  SiFirebase,
  SiJavascript,
  SiVuedotjs,
  SiLaravel,
  SiReactquery,
  SiSupabase,
  SiShadcnui,
  SiSocketdotio,
  SiCloudinary,
  SiStripe,
  SiZod,
  SiExpo,
  SiAndroid,
  SiApple,
  SiPython,
  SiFastapi,
  SiGo,
  SiNestjs,
  SiRust,
  SiCplusplus,
  SiDotnet,
  SiOpenjdk,
  SiKotlin,
  SiSwift,
  SiFlutter,
  SiDart,
  SiGraphql,
  SiRedis,
  SiMysql,
  SiKubernetes,
  SiAmazonwebservices,
  SiLinux,
  SiUbuntu,
  SiNginx,
  SiHtml5,
  SiCss3,
  SiSvelte,
  SiAngular,
  SiRuby,
  SiPhp,
} from "react-icons/si"
import { Code2 } from "lucide-react"

export interface IconPreset {
  icon_name: string
  label: string
  color: string
}

export const SKILL_ICON_SUGGESTIONS: IconPreset[] = [
  { icon_name: "SiGo", label: "Go / Golang", color: "text-[#00ADD8]" },
  { icon_name: "SiNestjs", label: "NestJS", color: "text-[#E0234E]" },
  { icon_name: "SiReact", label: "React", color: "text-[#61DAFB]" },
  { icon_name: "SiNextdotjs", label: "Next.js", color: "text-white" },
  { icon_name: "SiTypescript", label: "TypeScript", color: "text-[#3178C6]" },
  { icon_name: "SiJavascript", label: "JavaScript", color: "text-[#F7DF1E]" },
  { icon_name: "SiNodedotjs", label: "Node.js", color: "text-[#339933]" },
  { icon_name: "SiExpress", label: "Express", color: "text-white" },
  { icon_name: "SiPython", label: "Python", color: "text-[#3776AB]" },
  { icon_name: "SiFastapi", label: "FastAPI", color: "text-[#009688]" },
  { icon_name: "SiPostgresql", label: "PostgreSQL", color: "text-[#4169E1]" },
  { icon_name: "SiMongodb", label: "MongoDB", color: "text-[#47A248]" },
  { icon_name: "SiSupabase", label: "Supabase", color: "text-[#3ECF8E]" },
  { icon_name: "SiFirebase", label: "Firebase", color: "text-[#FFCA28]" },
  { icon_name: "SiDocker", label: "Docker", color: "text-[#2496ED]" },
  { icon_name: "SiTailwindcss", label: "Tailwind CSS", color: "text-[#38BDF8]" },
  { icon_name: "SiVuedotjs", label: "Vue.js", color: "text-[#42B883]" },
  { icon_name: "SiLaravel", label: "Laravel", color: "text-[#FF2D20]" },
  { icon_name: "SiGit", label: "Git", color: "text-[#F05032]" },
  { icon_name: "SiGithub", label: "GitHub", color: "text-white" },
  { icon_name: "SiPrisma", label: "Prisma", color: "text-[#2D3748]" },
  { icon_name: "SiRedux", label: "Redux", color: "text-[#764ABC]" },
  { icon_name: "SiVite", label: "Vite", color: "text-[#646CFF]" },
  { icon_name: "SiRust", label: "Rust", color: "text-[#DEA584]" },
  { icon_name: "SiCplusplus", label: "C++", color: "text-[#00599C]" },
  { icon_name: "SiDotnet", label: "C# / .NET", color: "text-[#512BD4]" },
  { icon_name: "SiOpenjdk", label: "Java", color: "text-[#007396]" },
  { icon_name: "SiKotlin", label: "Kotlin", color: "text-[#7F52FF]" },
  { icon_name: "SiSwift", label: "Swift", color: "text-[#F05138]" },
  { icon_name: "SiFlutter", label: "Flutter", color: "text-[#02569B]" },
  { icon_name: "SiGraphql", label: "GraphQL", color: "text-[#E10098]" },
  { icon_name: "SiRedis", label: "Redis", color: "text-[#DC382D]" },
  { icon_name: "SiMysql", label: "MySQL", color: "text-[#4479A1]" },
  { icon_name: "SiKubernetes", label: "Kubernetes", color: "text-[#326CE5]" },
  { icon_name: "SiAmazonwebservices", label: "AWS", color: "text-[#FF9900]" },
]

/**
 * Maps a key (icon_name or normalized skill name) to a JSX Icon Component
 */
const createIconMap = (size: number, customClass?: string) => {
  const c = (defaultColorClass: string) => customClass || defaultColorClass

  const map: Record<string, React.ReactNode> = {
    // Go / Golang
    sigo: <SiGo size={size} className={c("text-[#00ADD8]")} />,
    go: <SiGo size={size} className={c("text-[#00ADD8]")} />,
    golang: <SiGo size={size} className={c("text-[#00ADD8]")} />,

    // NestJS
    sinestjs: <SiNestjs size={size} className={c("text-[#E0234E]")} />,
    nestjs: <SiNestjs size={size} className={c("text-[#E0234E]")} />,

    // React
    sireact: <SiReact size={size} className={c("text-[#61DAFB]")} />,
    react: <SiReact size={size} className={c("text-[#61DAFB]")} />,
    reactjs: <SiReact size={size} className={c("text-[#61DAFB]")} />,

    // Next.js
    sinextdotjs: <SiNextdotjs size={size} className={c("text-white")} />,
    nextjs: <SiNextdotjs size={size} className={c("text-white")} />,
    next: <SiNextdotjs size={size} className={c("text-white")} />,

    // Vue
    sivuedotjs: <SiVuedotjs size={size} className={c("text-[#42B883]")} />,
    vuejs: <SiVuedotjs size={size} className={c("text-[#42B883]")} />,
    vue: <SiVuedotjs size={size} className={c("text-[#42B883]")} />,

    // TypeScript
    sitypescript: <SiTypescript size={size} className={c("text-[#3178C6]")} />,
    typescript: <SiTypescript size={size} className={c("text-[#3178C6]")} />,
    ts: <SiTypescript size={size} className={c("text-[#3178C6]")} />,

    // JavaScript
    sijavascript: <SiJavascript size={size} className={c("text-[#F7DF1E]")} />,
    javascript: <SiJavascript size={size} className={c("text-[#F7DF1E]")} />,
    js: <SiJavascript size={size} className={c("text-[#F7DF1E]")} />,

    // Tailwind
    sitailwindcss: <SiTailwindcss size={size} className={c("text-[#38BDF8]")} />,
    tailwindcss: <SiTailwindcss size={size} className={c("text-[#38BDF8]")} />,
    tailwind: <SiTailwindcss size={size} className={c("text-[#38BDF8]")} />,

    // Redux
    siredux: <SiRedux size={size} className={c("text-[#764ABC]")} />,
    redux: <SiRedux size={size} className={c("text-[#764ABC]")} />,

    // React Query / TanStack
    sireactquery: <SiReactquery size={size} className={c("text-[#FF4154]")} />,
    reactquery: <SiReactquery size={size} className={c("text-[#FF4154]")} />,

    // Shadcn UI
    sishadcnui: <SiShadcnui size={size} className={c("text-white")} />,
    shadcn: <SiShadcnui size={size} className={c("text-white")} />,

    // Framer
    siframer: <SiFramer size={size} className={c("text-white")} />,
    framer: <SiFramer size={size} className={c("text-white")} />,

    // Vite
    sivite: <SiVite size={size} className={c("text-[#646CFF]")} />,
    vite: <SiVite size={size} className={c("text-[#646CFF]")} />,

    // Expo
    siexpo: <SiExpo size={size} className={c("text-white")} />,
    expo: <SiExpo size={size} className={c("text-white")} />,

    // Android
    siandroid: <SiAndroid size={size} className={c("text-[#3DDC84]")} />,
    android: <SiAndroid size={size} className={c("text-[#3DDC84]")} />,

    // Apple
    siapple: <SiApple size={size} className={c("text-white")} />,
    apple: <SiApple size={size} className={c("text-white")} />,
    ios: <SiApple size={size} className={c("text-white")} />,

    // Node.js
    sinodedotjs: <SiNodedotjs size={size} className={c("text-[#339933]")} />,
    nodejs: <SiNodedotjs size={size} className={c("text-[#339933]")} />,
    node: <SiNodedotjs size={size} className={c("text-[#339933]")} />,

    // Express
    siexpress: <SiExpress size={size} className={c("text-white")} />,
    express: <SiExpress size={size} className={c("text-white")} />,

    // Laravel
    silaravel: <SiLaravel size={size} className={c("text-[#FF2D20]")} />,
    laravel: <SiLaravel size={size} className={c("text-[#FF2D20]")} />,

    // Socket.io
    sisocketdotio: <SiSocketdotio size={size} className={c("text-white")} />,
    socketio: <SiSocketdotio size={size} className={c("text-white")} />,

    // Zod
    sizod: <SiZod size={size} className={c("text-[#3E67B1]")} />,
    zod: <SiZod size={size} className={c("text-[#3E67B1]")} />,

    // Python
    sipython: <SiPython size={size} className={c("text-[#3776AB]")} />,
    python: <SiPython size={size} className={c("text-[#3776AB]")} />,

    // FastAPI
    sifastapi: <SiFastapi size={size} className={c("text-[#009688]")} />,
    fastapi: <SiFastapi size={size} className={c("text-[#009688]")} />,

    // MongoDB
    simongodb: <SiMongodb size={size} className={c("text-[#47A248]")} />,
    mongodb: <SiMongodb size={size} className={c("text-[#47A248]")} />,
    mongo: <SiMongodb size={size} className={c("text-[#47A248]")} />,

    // PostgreSQL
    sipostgresql: <SiPostgresql size={size} className={c("text-[#4169E1]")} />,
    postgresql: <SiPostgresql size={size} className={c("text-[#4169E1]")} />,
    postgres: <SiPostgresql size={size} className={c("text-[#4169E1]")} />,

    // Prisma
    siprisma: <SiPrisma size={size} className={c("text-[#2D3748]")} />,
    prisma: <SiPrisma size={size} className={c("text-[#2D3748]")} />,

    // Supabase
    sisupabase: <SiSupabase size={size} className={c("text-[#3ECF8E]")} />,
    supabase: <SiSupabase size={size} className={c("text-[#3ECF8E]")} />,

    // Firebase
    sifirebase: <SiFirebase size={size} className={c("text-[#FFCA28]")} />,
    firebase: <SiFirebase size={size} className={c("text-[#FFCA28]")} />,

    // Cloudinary
    sicloudinary: <SiCloudinary size={size} className={c("text-[#3448C5]")} />,
    cloudinary: <SiCloudinary size={size} className={c("text-[#3448C5]")} />,

    // Docker
    sidocker: <SiDocker size={size} className={c("text-[#2496ED]")} />,
    docker: <SiDocker size={size} className={c("text-[#2496ED]")} />,

    // Git
    sigit: <SiGit size={size} className={c("text-[#F05032]")} />,
    git: <SiGit size={size} className={c("text-[#F05032]")} />,

    // GitHub
    sigithub: <SiGithub size={size} className={c("text-white")} />,
    github: <SiGithub size={size} className={c("text-white")} />,

    // Figma
    sifigma: <SiFigma size={size} className={c("text-[#F24E1E]")} />,
    figma: <SiFigma size={size} className={c("text-[#F24E1E]")} />,

    // Stripe
    sistripe: <SiStripe size={size} className={c("text-[#635BFF]")} />,
    stripe: <SiStripe size={size} className={c("text-[#635BFF]")} />,

    // Rust
    sirust: <SiRust size={size} className={c("text-[#DEA584]")} />,
    rust: <SiRust size={size} className={c("text-[#DEA584]")} />,

    // C++
    sicplusplus: <SiCplusplus size={size} className={c("text-[#00599C]")} />,
    "c++": <SiCplusplus size={size} className={c("text-[#00599C]")} />,
    cpp: <SiCplusplus size={size} className={c("text-[#00599C]")} />,

    // C# / .NET
    sidotnet: <SiDotnet size={size} className={c("text-[#512BD4]")} />,
    "c#": <SiDotnet size={size} className={c("text-[#512BD4]")} />,
    csharp: <SiDotnet size={size} className={c("text-[#512BD4]")} />,
    dotnet: <SiDotnet size={size} className={c("text-[#512BD4]")} />,

    // Java
    siopenjdk: <SiOpenjdk size={size} className={c("text-[#007396]")} />,
    java: <SiOpenjdk size={size} className={c("text-[#007396]")} />,

    // Kotlin
    sikotlin: <SiKotlin size={size} className={c("text-[#7F52FF]")} />,
    kotlin: <SiKotlin size={size} className={c("text-[#7F52FF]")} />,

    // Swift
    siswift: <SiSwift size={size} className={c("text-[#F05138]")} />,
    swift: <SiSwift size={size} className={c("text-[#F05138]")} />,

    // Flutter
    siflutter: <SiFlutter size={size} className={c("text-[#02569B]")} />,
    flutter: <SiFlutter size={size} className={c("text-[#02569B]")} />,

    // Dart
    sidart: <SiDart size={size} className={c("text-[#0175C2]")} />,
    dart: <SiDart size={size} className={c("text-[#0175C2]")} />,

    // GraphQL
    sigraphql: <SiGraphql size={size} className={c("text-[#E10098]")} />,
    graphql: <SiGraphql size={size} className={c("text-[#E10098]")} />,

    // Redis
    siredis: <SiRedis size={size} className={c("text-[#DC382D]")} />,
    redis: <SiRedis size={size} className={c("text-[#DC382D]")} />,

    // MySQL
    simysql: <SiMysql size={size} className={c("text-[#4479A1]")} />,
    mysql: <SiMysql size={size} className={c("text-[#4479A1]")} />,

    // Kubernetes
    sikubernetes: <SiKubernetes size={size} className={c("text-[#326CE5]")} />,
    kubernetes: <SiKubernetes size={size} className={c("text-[#326CE5]")} />,
    k8s: <SiKubernetes size={size} className={c("text-[#326CE5]")} />,

    // AWS
    siamazonwebservices: <SiAmazonwebservices size={size} className={c("text-[#FF9900]")} />,
    aws: <SiAmazonwebservices size={size} className={c("text-[#FF9900]")} />,

    // Linux
    silinux: <SiLinux size={size} className={c("text-[#FCC624]")} />,
    linux: <SiLinux size={size} className={c("text-[#FCC624]")} />,

    // Ubuntu
    siubuntu: <SiUbuntu size={size} className={c("text-[#E95420]")} />,
    ubuntu: <SiUbuntu size={size} className={c("text-[#E95420]")} />,

    // NGINX
    singinx: <SiNginx size={size} className={c("text-[#009639]")} />,
    nginx: <SiNginx size={size} className={c("text-[#009639]")} />,

    // HTML / CSS
    sihtml5: <SiHtml5 size={size} className={c("text-[#E34F26]")} />,
    html: <SiHtml5 size={size} className={c("text-[#E34F26]")} />,
    html5: <SiHtml5 size={size} className={c("text-[#E34F26]")} />,
    sicss3: <SiCss3 size={size} className={c("text-[#1572B6]")} />,
    css: <SiCss3 size={size} className={c("text-[#1572B6]")} />,
    css3: <SiCss3 size={size} className={c("text-[#1572B6]")} />,

    // Svelte / Angular / Ruby / PHP
    sisvelte: <SiSvelte size={size} className={c("text-[#FF3E00]")} />,
    svelte: <SiSvelte size={size} className={c("text-[#FF3E00]")} />,
    siangular: <SiAngular size={size} className={c("text-[#DD0031]")} />,
    angular: <SiAngular size={size} className={c("text-[#DD0031]")} />,
    siruby: <SiRuby size={size} className={c("text-[#CC342D]")} />,
    ruby: <SiRuby size={size} className={c("text-[#CC342D]")} />,
    rails: <SiRuby size={size} className={c("text-[#CC342D]")} />,
    siphp: <SiPhp size={size} className={c("text-[#777BB4]")} />,
    php: <SiPhp size={size} className={c("text-[#777BB4]")} />,
  }

  return map
}

/**
 * Detects best icon_name based on skill name
 */
export function detectIconName(skillName: string): string {
  if (!skillName) return "SiCode"
  const clean = skillName.trim().toLowerCase()

  if (clean.includes("golang") || clean === "go" || clean.includes("go lang") || clean.includes("go (")) return "SiGo"
  if (clean.includes("nest")) return "SiNestjs"
  if (clean.includes("react native") || clean.includes("expo")) return "SiExpo"
  if (clean.includes("react")) return "SiReact"
  if (clean.includes("next")) return "SiNextdotjs"
  if (clean.includes("vue")) return "SiVuedotjs"
  if (clean.includes("typescript") || clean === "ts") return "SiTypescript"
  if (clean.includes("javascript") || clean === "js") return "SiJavascript"
  if (clean.includes("tailwind")) return "SiTailwindcss"
  if (clean.includes("node")) return "SiNodedotjs"
  if (clean.includes("express")) return "SiExpress"
  if (clean.includes("python")) return "SiPython"
  if (clean.includes("fastapi")) return "SiFastapi"
  if (clean.includes("postgres")) return "SiPostgresql"
  if (clean.includes("mongo")) return "SiMongodb"
  if (clean.includes("supabase")) return "SiSupabase"
  if (clean.includes("firebase")) return "SiFirebase"
  if (clean.includes("docker")) return "SiDocker"
  if (clean.includes("laravel")) return "SiLaravel"
  if (clean.includes("git")) return "SiGit"
  if (clean.includes("rust")) return "SiRust"
  if (clean.includes("c++") || clean.includes("cpp")) return "SiCplusplus"
  if (clean.includes("c#") || clean.includes("csharp") || clean.includes("dotnet")) return "SiDotnet"
  if (clean.includes("java") && !clean.includes("javascript")) return "SiOpenjdk"
  if (clean.includes("kotlin")) return "SiKotlin"
  if (clean.includes("swift")) return "SiSwift"
  if (clean.includes("flutter")) return "SiFlutter"
  if (clean.includes("graphql")) return "SiGraphql"
  if (clean.includes("redis")) return "SiRedis"
  if (clean.includes("mysql")) return "SiMysql"
  if (clean.includes("k8s") || clean.includes("kubernetes")) return "SiKubernetes"
  if (clean.includes("aws") || clean.includes("amazon")) return "SiAmazonwebservices"
  if (clean.includes("linux")) return "SiLinux"
  if (clean.includes("prisma")) return "SiPrisma"
  if (clean.includes("redux")) return "SiRedux"
  if (clean.includes("vite")) return "SiVite"
  if (clean.includes("stripe")) return "SiStripe"
  if (clean.includes("figma")) return "SiFigma"

  return "SiCode"
}

/**
 * Renders an icon element given an iconName or skillName
 */
export function renderSkillIcon(
  iconName?: string,
  skillName?: string,
  size = 42,
  className?: string
): React.ReactNode {
  const map = createIconMap(size, className)

  if (iconName) {
    const key = iconName.trim().toLowerCase()
    if (map[key]) return map[key]
  }

  if (skillName) {
    const key = skillName.trim().toLowerCase()
    if (map[key]) return map[key]

    const autoDetected = detectIconName(skillName).toLowerCase()
    if (map[autoDetected]) return map[autoDetected]
  }

  // Generic fallback if icon is completely unknown (NO LONGER defaults to React logo!)
  return (
    <div className={`flex items-center justify-center ${className || "text-emerald-400"}`}>
      <Code2 size={size} />
    </div>
  )
}
