import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Github, ExternalLink } from "lucide-react"
import { motion, useInView } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useRef } from "react"
import { defaultProjects } from "@/lib/supabase"
import { Link } from "react-router-dom"
import { useProjectsQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"

export const defaultImg =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"

export const Projects = () => {
  const { data: dbProjects, isLoading, isError, refetch } = useProjectsQuery()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const rawList = dbProjects && dbProjects.length > 0 ? dbProjects : defaultProjects
  const projectList = [...rawList]
    .sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : Number(a.id) || 0
      const timeB = b.created_at ? new Date(b.created_at).getTime() : Number(b.id) || 0
      return timeB - timeA
    })
    .slice(0, 6)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen w-full py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
              Projects
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Things I've built to solve problems, explore ideas, and learn new
            technologies.
          </p>
        </div>

        {isError && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between max-w-4xl mx-auto">
            <span>Notice: Displaying offline cached projects catalog.</span>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-xl transition-all cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 w-full rounded-3xl bg-[#141416]/90 border border-white/5 p-0 flex flex-col justify-between overflow-hidden">
                <Skeleton className="h-44 w-full rounded-none bg-white/10" />
                <div className="space-y-2 p-5">
                  <Skeleton className="h-5 w-3/4 bg-white/10" />
                  <Skeleton className="h-3.5 w-full bg-white/10" />
                  <Skeleton className="h-3.5 w-4/5 bg-white/10" />
                </div>
                <div className="flex gap-2 p-5 pt-0">
                  <Skeleton className="h-7 w-20 rounded-xl bg-white/10" />
                  <Skeleton className="h-7 w-20 rounded-xl bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
          >
            {projectList.map((project, index) => (
              <motion.div key={index} variants={itemVariants} className="w-full flex justify-center">
                <div className="w-full h-full flex flex-col justify-between group rounded-2xl sm:rounded-3xl border-none bg-gradient-to-b from-[#18181c]/90 to-[#101014]/90 backdrop-blur-xl p-3.5 sm:p-4 shadow-2xl transition-all duration-300 relative">
                  {/* Header Row: Title & Action Triggers */}
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-medium text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            {index % 2 === 0 ? "Featured" : "Project"}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                      </div>

                      {/* Action Triggers with Tooltips */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {project.github && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link to={project.github} target="_blank">
                                  <span className="p-1.5 rounded-xl bg-[#22222a] hover:bg-[#2c2c36] text-gray-300 hover:text-white border border-white/10 shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer">
                                    <Github className="h-3.5 w-3.5" />
                                  </span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Code on GitHub</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {project.live && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link to={project.live} target="_blank">
                                  <span className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </span>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Live Demo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail Preview Window */}
                    <div className="relative h-40 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#0a0a0c] border border-white/5 my-2">
                      <img
                        src={project.image || defaultImg}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-40 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Description */}
                    <p className="line-clamp-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills at Card Bottom */}
                  <div className="pt-3 border-t border-white/5 mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tags || []).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="px-2.5 py-1 text-xs font-outfit font-semibold tracking-wide rounded-md border border-white/10 bg-white/5 text-gray-200 shadow-none"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-16 text-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link to="/Projects">
              <Button
                variant="ghost"
                className="px-8 py-6 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:via-teal-500/20 hover:to-blue-500/20 text-white border border-emerald-500/30 hover:border-emerald-400 font-outfit font-bold tracking-wide text-sm shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 gap-2.5 cursor-pointer"
              >
                <span>View All My Projects</span>
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Projects
