import { useState } from "react"
import { motion } from "framer-motion"
import { renderSkillIcon } from "@/lib/skillIcons"
import { useSkillsQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { data: dbSkills, isLoading } = useSkillsQuery()

  const skills = dbSkills || []

  const filteredSkills = skills.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  )

  return (
    <div className="min-h-[70vh] flex flex-col justify-center max-w-5xl mx-auto px-4 py-8 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title */}
      <div className="text-center mb-4 space-y-1">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-white tracking-tight"
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
        <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto">
          Technologies and tools I use to architect scalable web apps, mobile solutions, and cloud infrastructure.
        </p>
      </div>

      {/* Skills Showcase Grid */}
      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-1.5 sm:gap-2 mt-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
              <Skeleton className="w-8 h-8 rounded-full bg-white/10" />
              <Skeleton className="mt-2 h-2.5 w-10 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-1.5 sm:gap-2 mt-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id || skill.name || index}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-center transition-transform group-hover:scale-105">
                {renderSkillIcon(skill.icon_name, skill.name, 42)}
              </div>
              <p className="mt-1 text-[11px] font-bold text-gray-300 group-hover:text-green-400 transition-colors text-center truncate w-full">
                {skill.name}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

