import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
} from "react-icons/si"
import { getSkills, defaultSkills } from "@/lib/supabase"
import { useSkillsQuery } from "@/hooks/usePortfolioQueries"
import type { Skill } from "@/types/supabase"

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { data: dbSkills, isError, refetch } = useSkillsQuery()

  const skills = dbSkills && dbSkills.length > 0 ? dbSkills : defaultSkills

  const renderIcon = (name: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      SiReact: <SiReact size={42} className="text-[#61DAFB]" />,
      SiNextdotjs: <SiNextdotjs size={42} className="text-white" />,
      SiVuedotjs: <SiVuedotjs size={42} className="text-[#42B883]" />,
      SiTypescript: <SiTypescript size={42} className="text-[#3178C6]" />,
      SiJavascript: <SiJavascript size={42} className="text-[#F7DF1E]" />,
      SiTailwindcss: <SiTailwindcss size={42} className="text-[#38BDF8]" />,
      SiRedux: <SiRedux size={42} className="text-[#764ABC]" />,
      SiReactquery: <SiReactquery size={42} className="text-[#FF4154]" />,
      SiShadcnui: <SiShadcnui size={42} className="text-white" />,
      SiFramer: <SiFramer size={42} className="text-white" />,
      SiVite: <SiVite size={42} className="text-[#646CFF]" />,
      SiExpo: <SiExpo size={42} className="text-white" />,
      SiAndroid: <SiAndroid size={42} className="text-[#3DDC84]" />,
      SiApple: <SiApple size={42} className="text-white" />,
      SiNodedotjs: <SiNodedotjs size={42} className="text-[#339933]" />,
      SiExpress: <SiExpress size={42} className="text-white" />,
      SiLaravel: <SiLaravel size={42} className="text-[#FF2D20]" />,
      SiSocketdotio: <SiSocketdotio size={42} className="text-white" />,
      SiZod: <SiZod size={42} className="text-[#3E67B1]" />,
      SiPython: <SiPython size={42} className="text-[#3776AB]" />,
      SiFastapi: <SiFastapi size={42} className="text-[#009688]" />,
      SiMongodb: <SiMongodb size={42} className="text-[#47A248]" />,
      SiPostgresql: <SiPostgresql size={42} className="text-[#4169E1]" />,
      SiPrisma: <SiPrisma size={42} className="text-[#0C344B]" />,
      SiSupabase: <SiSupabase size={42} className="text-[#3ECF8E]" />,
      SiFirebase: <SiFirebase size={42} className="text-[#FFCA28]" />,
      SiCloudinary: <SiCloudinary size={42} className="text-[#3448C5]" />,
      SiDocker: <SiDocker size={42} className="text-[#2496ED]" />,
      SiGit: <SiGit size={42} className="text-[#F05032]" />,
      SiGithub: <SiGithub size={42} className="text-white" />,
      SiFigma: <SiFigma size={42} className="text-[#F24E1E]" />,
      SiStripe: <SiStripe size={42} className="text-[#635BFF]" />,
    }
    return iconMap[name] || <SiReact size={42} className="text-green-400" />
  }

  const filteredSkills = skills.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center mb-6 space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
          ⚡ Tech Stack & Ecosystem
        </span>
        <motion.h2
          className="text-4xl font-extrabold text-white tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-green-400">
            Technical Stack
          </span>
        </motion.h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Technologies and tools I use to architect scalable web apps, mobile solutions, and cloud infrastructure.
        </p>
      </div>

      {/* Skills Showcase Grid (7-Column Layout without filters) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4 mt-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id || skill.name || index}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-center transition-transform group-hover:scale-110">
              {renderIcon(skill.icon_name)}
            </div>
            <p className="mt-2 text-xs font-bold text-gray-300 group-hover:text-green-400 transition-colors text-center truncate w-full">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

