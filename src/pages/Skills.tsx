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
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)
  const { data: dbSkills, isLoading } = useSkillsQuery()

  useEffect(() => {
    if (dbSkills && dbSkills.length > 0) {
      setSkills(dbSkills)
    }
  }, [dbSkills])

  const renderIcon = (name: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      SiReact: <SiReact size={32} className="text-[#61DAFB]" />,
      SiNextdotjs: <SiNextdotjs size={32} className="text-white" />,
      SiVuedotjs: <SiVuedotjs size={32} className="text-[#42B883]" />,
      SiTypescript: <SiTypescript size={32} className="text-[#3178C6]" />,
      SiJavascript: <SiJavascript size={32} className="text-[#F7DF1E]" />,
      SiTailwindcss: <SiTailwindcss size={32} className="text-[#38BDF8]" />,
      SiRedux: <SiRedux size={32} className="text-[#764ABC]" />,
      SiReactquery: <SiReactquery size={32} className="text-[#FF4154]" />,
      SiShadcnui: <SiShadcnui size={32} className="text-white" />,
      SiFramer: <SiFramer size={32} className="text-white" />,
      SiVite: <SiVite size={32} className="text-[#646CFF]" />,
      SiExpo: <SiExpo size={32} className="text-white" />,
      SiAndroid: <SiAndroid size={32} className="text-[#3DDC84]" />,
      SiApple: <SiApple size={32} className="text-white" />,
      SiNodedotjs: <SiNodedotjs size={32} className="text-[#339933]" />,
      SiExpress: <SiExpress size={32} className="text-white" />,
      SiLaravel: <SiLaravel size={32} className="text-[#FF2D20]" />,
      SiSocketdotio: <SiSocketdotio size={32} className="text-white" />,
      SiZod: <SiZod size={32} className="text-[#3E67B1]" />,
      SiPython: <SiPython size={32} className="text-[#3776AB]" />,
      SiFastapi: <SiFastapi size={32} className="text-[#009688]" />,
      SiMongodb: <SiMongodb size={32} className="text-[#47A248]" />,
      SiPostgresql: <SiPostgresql size={32} className="text-[#4169E1]" />,
      SiPrisma: <SiPrisma size={32} className="text-[#0C344B]" />,
      SiSupabase: <SiSupabase size={32} className="text-[#3ECF8E]" />,
      SiFirebase: <SiFirebase size={32} className="text-[#FFCA28]" />,
      SiCloudinary: <SiCloudinary size={32} className="text-[#3448C5]" />,
      SiDocker: <SiDocker size={32} className="text-[#2496ED]" />,
      SiGit: <SiGit size={32} className="text-[#F05032]" />,
      SiGithub: <SiGithub size={32} className="text-white" />,
      SiFigma: <SiFigma size={32} className="text-[#F24E1E]" />,
      SiStripe: <SiStripe size={32} className="text-[#635BFF]" />,
    }
    return iconMap[name] || <SiReact size={32} className="text-green-400" />
  }

  const filteredSkills = skills.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center mb-10 space-y-3">
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-blue-500">
            Technical Stack
          </span>
        </motion.h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Technologies and tools I use to architect scalable web apps, mobile solutions, and cloud infrastructure.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {["All", "Frontend", "Backend", "Database", "Mobile", "Tools"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-semibold px-4 py-2 rounded-2xl transition-all cursor-pointer border ${activeCategory === cat
                ? "bg-green-500 text-slate-950 font-medium border-green-500 shadow-lg shadow-green-500/20 scale-105"
                : "bg-[#181818]/80 text-gray-400 hover:text-white border-[#262626] hover:bg-[#222]"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Showcase Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id || skill.name || index}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            className="group relative"
          >
            <div className="bg-[#1b1b1b]/80 border border-[#262626] group-hover:border-green-500/40 p-5 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-green-500/5 group-hover:-translate-y-1">
              <div
                className="p-3.5 rounded-2xl bg-[#121212] border border-[#222] group-hover:border-green-500/30 flex items-center justify-center transition-transform group-hover:scale-110"
              >
                {renderIcon(skill.icon_name)}
              </div>
              <p className="mt-3 text-xs font-bold text-gray-200 group-hover:text-green-400 transition-colors text-center">
                {skill.name}
              </p>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider font-normal mt-0.5">
                {skill.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

