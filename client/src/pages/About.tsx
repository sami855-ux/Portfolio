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
        return <GraduationCap className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors duration-300" />
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors duration-300" />
      case "Code":
        return <Code className="w-4 h-4 text-teal-400 group-hover:text-white transition-colors duration-300" />
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

  return (
    <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="text-center mb-16 sm:mb-20 space-y-2">
        <motion.h2
          className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight font-outfit"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Timeline &amp;{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Milestones.
          </span>
        </motion.h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          A progression of engineering milestones, leadership experiences, education, and technical evolution.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative">
        {/* Subtle Central Hairline */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none" />

        {isLoading ? (
          <div className="space-y-10">
            {Array.from({ length: 4 }).map((_, idx) => {
              const isRightSkeleton = idx % 2 === 0
              return (
                <div key={idx} className="relative flex items-center md:odd:flex-row-reverse">
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <Skeleton className="w-10 h-10 rounded-2xl bg-white/10" />
                  </div>
                  <div
                    className={`w-full md:w-1/2 pl-20 sm:pl-24 md:pl-0 ${
                      isRightSkeleton ? "md:pl-16 lg:pl-20" : "md:pr-16 lg:pr-20"
                    }`}
                  >
                    <div
                      className={`p-6 sm:p-8 bg-white/[0.02] border-0 space-y-3 ${
                        isRightSkeleton
                          ? "rounded-l-3xl rounded-r-none"
                          : "max-md:rounded-l-3xl max-md:rounded-r-none md:rounded-r-3xl md:rounded-l-none"
                      }`}
                    >
                      <div className="flex justify-between items-center pb-2">
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
          <div className="space-y-12">
            {sortedItems.map((item, index) => {
              const isRight = index % 2 === 0
              const stepNumber = String(index + 1).padStart(2, "0")

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`relative flex items-center ${
                    isRight ? "md:flex-row" : "md:flex-row-reverse"
                  } group`}
                >
                  {/* Apple Squircle Node Icon */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-11 h-11 rounded-2xl bg-[#141418] border-0 shadow-lg shadow-black/40 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                      {renderIcon(item.icon_name)}
                    </div>
                  </div>

                  {/* Content Container with gap & flat edge on opposite side */}
                  <div
                    className={`w-full md:w-1/2 pl-20 sm:pl-24 md:pl-0 ${
                      isRight ? "md:pl-16 lg:pl-20" : "md:pr-16 lg:pr-20"
                    }`}
                  >
                    <div
                      className={`p-6 sm:p-8 bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-xl border-0 shadow-xl transition-all duration-300 flex flex-col justify-between group/card ${
                        isRight
                          ? "rounded-l-3xl rounded-r-none"
                          : "max-md:rounded-l-3xl max-md:rounded-r-none md:rounded-r-3xl md:rounded-l-none"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-400">
                              #{stepNumber}
                            </span>
                            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight font-outfit">
                              {item.title}
                            </h3>
                          </div>
                          {item.date_range && (
                            <span className="text-xs text-zinc-400 font-mono font-normal bg-white/[0.04] px-3 py-1 rounded-full">
                              {item.date_range}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-zinc-400 leading-relaxed font-normal">
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
