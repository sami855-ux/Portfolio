import { useState, useEffect } from "react"
import {
  Briefcase,
  GraduationCap,
  Code,
  Rocket,
  User,
  Users,
  TreePine,
} from "lucide-react"
import { motion } from "framer-motion"
import { getJourney } from "@/lib/supabase"
import type { JourneyItem } from "@/types/supabase"

export function About() {
  const [items, setItems] = useState<JourneyItem[]>([])

  useEffect(() => {
    const loadJourney = async () => {
      try {
        const data = await getJourney()
        if (data && data.length > 0) setItems(data)
      } catch (err) {
        console.error("Error fetching public journey timeline:", err)
      }
    }
    loadJourney()
  }, [])

  const renderIcon = (name?: string) => {
    switch (name) {
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-green-400" />
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-amber-400" />
      case "Code":
        return <Code className="w-4 h-4 text-emerald-400" />
      case "Rocket":
        return <Rocket className="w-4 h-4 text-purple-400" />
      case "TreePine":
        return <TreePine className="w-4 h-4 text-rose-400" />
      case "Users":
        return <Users className="w-4 h-4 text-blue-400" />
      default:
        return <User className="w-4 h-4 text-cyan-400" />
    }
  }

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-14 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
          🚀 Career Journey & Experience
        </span>
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-blue-500">
            Timeline & Background
          </span>
        </motion.h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          A timeline of my professional growth, key achievements, education, and engineering philosophy.
        </p>
      </div>

      {/* Experience Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group"
          >
            <div className="h-full p-6 rounded-3xl border bg-[#181818]/90 backdrop-blur-md text-white shadow-xl border-[#262626] hover:border-green-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2.5 rounded-2xl border border-green-500/30 bg-green-500/10 flex items-center justify-center shrink-0">
                    {renderIcon(item.icon_name)}
                  </div>
                  {item.date_range && (
                    <span className="text-[11px] text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                      {item.date_range}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-green-400 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
