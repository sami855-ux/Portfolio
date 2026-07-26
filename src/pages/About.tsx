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
import { useJourneyQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"
import type { JourneyItem } from "@/types/supabase"

export function About() {
  const { data: dbItems, isLoading } = useJourneyQuery()
  const items = dbItems || []

  // Sort items strictly by display_order
  const sortedItems = [...items].sort((a, b) => {
    const orderA = a.display_order ?? 999
    const orderB = b.display_order ?? 999
    return orderA - orderB
  })

  const renderIcon = (name?: string) => {
    switch (name) {
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-green-400 group-hover:text-white transition-colors duration-300" />
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors duration-300" />
      case "Code":
        return <Code className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors duration-300" />
      case "Rocket":
        return <Rocket className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors duration-300" />
      case "TreePine":
        return <TreePine className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors duration-300" />
      case "Users":
        return <Users className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors duration-300" />
      default:
        return <User className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors duration-300" />
    }
  }

  const getDynamicHoverGradient = (iconName?: string, colorClass?: string) => {
    switch (iconName) {
      case "GraduationCap":
        return "group-hover:from-emerald-600 group-hover:to-teal-400 group-hover:shadow-emerald-500/40"
      case "Briefcase":
        return "group-hover:from-amber-500 group-hover:to-orange-500 group-hover:shadow-amber-500/40"
      case "Code":
        return "group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:shadow-cyan-500/40"
      case "Rocket":
        return "group-hover:from-purple-600 group-hover:to-pink-500 group-hover:shadow-purple-500/40"
      case "TreePine":
        return "group-hover:from-rose-500 group-hover:to-red-600 group-hover:shadow-rose-500/40"
      case "Users":
        return "group-hover:from-indigo-600 group-hover:to-sky-500 group-hover:shadow-indigo-500/40"
      default:
        if (colorClass?.includes("green")) return "group-hover:from-emerald-600 group-hover:to-teal-400 group-hover:shadow-emerald-500/40"
        if (colorClass?.includes("yellow") || colorClass?.includes("amber")) return "group-hover:from-amber-500 group-hover:to-orange-500 group-hover:shadow-amber-500/40"
        if (colorClass?.includes("purple")) return "group-hover:from-purple-600 group-hover:to-pink-500 group-hover:shadow-purple-500/40"
        if (colorClass?.includes("red") || colorClass?.includes("rose")) return "group-hover:from-rose-500 group-hover:to-red-600 group-hover:shadow-rose-500/40"
        if (colorClass?.includes("pink")) return "group-hover:from-pink-500 group-hover:to-rose-500 group-hover:shadow-pink-500/40"
        return "group-hover:from-fuchsia-600 group-hover:to-indigo-600 group-hover:shadow-fuchsia-500/40"
    }
  }

  return (
    <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-14 space-y-2">
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
        <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto">
          A timeline of my professional growth, key achievements, education, and engineering philosophy.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* Subtle Central Line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-green-500/20 via-emerald-500/30 to-blue-500/20 rounded-full pointer-events-none" />

        {isLoading ? (
          <div className="space-y-10">
            {Array.from({ length: 5 }).map((_, idx) => {
              const isRightSkeleton = idx % 2 === 1
              return (
                <div key={idx} className="relative flex items-center md:odd:flex-row-reverse">
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
                  </div>
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:group-odd:pr-14 md:group-even:pl-14">
                    <div className={`p-6 md:p-7 border bg-[#161616]/90 border-[#262626] space-y-3 ${
                      isRightSkeleton
                        ? "rounded-3xl rounded-r-none"
                        : "rounded-3xl md:rounded-l-none md:rounded-r-3xl max-md:rounded-r-none max-md:rounded-l-3xl"
                    }`}>
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <Skeleton className="h-5 w-32 bg-white/10" />
                        <Skeleton className="h-4 w-20 rounded-full bg-white/10" />
                      </div>
                      <Skeleton className="h-3.5 w-full bg-white/10" />
                      <Skeleton className="h-3.5 w-4/5 bg-white/10" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-10">
            {sortedItems.map((item, index) => {
              const isRight = index % 2 === 0
              const stepNumber = String(index + 1).padStart(2, "0")

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`relative flex items-center ${
                    isRight ? "md:flex-row" : "md:flex-row-reverse"
                  } group`}
                >
                  {/* Central Node Icon (Subtle Hover scale) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="p-1 rounded-full bg-[#121214]/80 border border-white/10">
                      <div className={`p-2.5 rounded-full bg-[#18181c] border border-white/10 text-white group-hover:bg-gradient-to-br ${getDynamicHoverGradient(item.icon_name, item.color)} group-hover:scale-105 transition-all duration-300 flex items-center justify-center`}>
                        {renderIcon(item.icon_name)}
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                      isRight ? "md:pl-14" : "md:pr-14"
                    }`}
                  >
                    <div className={`p-6 md:p-8 border bg-gradient-to-br from-[#1d1d21]/70 via-[#18181b]/70 to-[#121214]/75 backdrop-blur-md text-white shadow-none border-[#2e2e34] transition-all duration-300 flex flex-col justify-between relative overflow-hidden group/card ${
                      isRight
                        ? "rounded-3xl rounded-r-none"
                        : "rounded-3xl md:rounded-l-none md:rounded-r-3xl max-md:rounded-r-none max-md:rounded-l-3xl"
                    }`}>
                      {/* Top Ambient Highlight */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              #{stepNumber}
                            </span>
                            <h3 className="text-base md:text-lg font-extrabold text-white tracking-tight leading-snug">
                              {item.title}
                            </h3>
                          </div>
                          {item.date_range && (
                            <span className="text-[11px] text-gray-300 font-mono font-medium bg-[#24242a] border border-[#33333d] px-3 py-1 rounded-full">
                              {item.date_range}
                            </span>
                          )}
                        </div>

                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
