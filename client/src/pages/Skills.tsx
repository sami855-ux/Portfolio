import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { renderSkillIcon } from "@/lib/skillIcons"
import { useSkillsQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { data: dbSkills, isLoading } = useSkillsQuery()

  const skills = dbSkills || []

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category).filter(Boolean))) as string[]
    return ["All", ...unique]
  }, [skills])

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => activeCategory === "All" || s.category === activeCategory)
  }, [skills, activeCategory])

  return (
    <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-x-clip">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] h-[350px] bg-emerald-500/[0.05] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16 space-y-2">
        <motion.h2
          className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight font-outfit"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          Technical{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Stack.
          </span>
        </motion.h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          Technologies and tools engineered to build resilient architectures, cross-platform apps, and cloud services.
        </p>
      </div>

      {/* Transparent Tabs Container (No Scroll, Responsive Wrap) */}
      {categories.length > 2 && (
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="flex flex-wrap justify-center items-center gap-1.5 p-1 rounded-full bg-transparent border-0 max-w-full">
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                    isActive ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 rounded-full bg-white shadow-md shadow-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Transparent Skills Grid with smaller, refined icons */}
      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2 bg-transparent border-0"
            >
              <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
          <AnimatePresence>
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id || skill.name || index}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                title={skill.name}
                className="flex items-center justify-center p-2 bg-transparent hover:bg-transparent transition-all duration-200 group hover:-translate-y-1 cursor-pointer border-0"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  {renderSkillIcon(skill.icon_name, skill.name, 34)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
