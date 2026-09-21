import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Github, ExternalLink, Maximize2, X, ChevronLeft, ChevronRight, Layers } from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { defaultProjects } from "@/lib/api"
import type { Project } from "@/types/api"
import { Link } from "react-router-dom"
import { useProjectsQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"
import { SleekLightbox } from "@/components/SleekLightbox"

export const defaultImg =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"

export const parseProjectImages = (p: Project): string[] => {
  let list: string[] = []
  if (Array.isArray(p.images) && p.images.length > 0) {
    list = p.images.filter(Boolean)
  } else if (typeof p.images === "string" && (p.images as string).trim().length > 0) {
    try {
      const parsed = JSON.parse(p.images as string)
      if (Array.isArray(parsed)) list = parsed.filter(Boolean)
      else list = (p.images as string).split(",").map((s) => s.trim()).filter(Boolean)
    } catch {
      list = (p.images as string).split(",").map((s) => s.trim()).filter(Boolean)
    }
  }

  if (p.id) {
    try {
      const local = localStorage.getItem(`portfolio_project_images_${p.id}`)
      if (local) {
        const parsedLocal = JSON.parse(local)
        if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
          list = Array.from(new Set([...list, ...parsedLocal])).filter(Boolean)
        }
      }
    } catch (e) { }
  }

  if (p.image && !list.includes(p.image)) {
    list.unshift(p.image)
  }
  return list.length > 0 ? list : [defaultImg]
}

export const Projects = () => {
  const { data: dbProjects, isLoading, isError, refetch } = useProjectsQuery()
  const [activeCardPhotos, setActiveCardPhotos] = useState<Record<number | string, number>>({})
  const [selectedImage, setSelectedImage] = useState<{
    images: string[]
    activeIdx: number
    title: string
    github?: string
    live?: string
  } | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Keyboard navigation for image slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === "ArrowLeft") {
        setSelectedImage((prev) =>
          prev
            ? {
              ...prev,
              activeIdx: (prev.activeIdx - 1 + prev.images.length) % prev.images.length,
            }
            : null
        )
      } else if (e.key === "ArrowRight") {
        setSelectedImage((prev) =>
          prev ? { ...prev, activeIdx: (prev.activeIdx + 1) % prev.images.length } : null
        )
      } else if (e.key === "Escape") {
        setSelectedImage(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage])

  const rawList = dbProjects || []
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
            variants={containerVariants}
            initial="hidden"
            animate="show"
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

                    {/* Thumbnail Preview Window (Click to open full cinema slider modal) */}
                    {(() => {
                      const allImgs = parseProjectImages(project)
                      const activePhotoIdx = activeCardPhotos[index] || 0
                      const activePhoto = allImgs[activePhotoIdx] || allImgs[0]

                      return (
                        <div
                          onClick={() => {
                            setSelectedImage({
                              images: allImgs,
                              activeIdx: activePhotoIdx,
                              title: project.title,
                              github:
                                project.github && project.github !== "#" && project.github.trim() !== ""
                                  ? project.github
                                  : undefined,
                              live:
                                project.live && project.live !== "#" && project.live.trim() !== ""
                                  ? project.live
                                  : undefined,
                            })
                          }}
                          className="relative h-44 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#0a0a0e] border border-white/10 my-2 group/img cursor-pointer shadow-lg"
                        >
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activePhotoIdx}
                              src={activePhoto}
                              alt={project.title}
                              initial={{ opacity: 0.8 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-44 object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                            />
                          </AnimatePresence>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e] via-transparent to-black/20 opacity-80 group-hover/img:opacity-30 transition-opacity duration-300 pointer-events-none" />

                          {/* Multi-image Count Indicator Pill */}
                          {allImgs.length > 1 && (
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#12121a]/80 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] font-bold flex items-center gap-1.5 z-10 shadow-xl">
                              <Layers className="w-3 h-3 text-emerald-400" />
                              <span>{activePhotoIdx + 1} / {allImgs.length}</span>
                            </div>
                          )}

                          {/* Dots Switcher for Multi-Image Projects */}
                          {allImgs.length > 1 && (
                            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                              {allImgs.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveCardPhotos((prev) => ({ ...prev, [index]: dotIdx }))
                                  }}
                                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    activePhotoIdx === dotIdx
                                      ? "w-6 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                      : "w-1.5 bg-white/40 hover:bg-white/90"
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Left & Right Minimalist Cyclic Arrows on Card Hover */}
                          {allImgs.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveCardPhotos((prev) => ({
                                    ...prev,
                                    [index]: (activePhotoIdx - 1 + allImgs.length) % allImgs.length,
                                  }))
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-20 cursor-pointer"
                                title="Previous photo"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveCardPhotos((prev) => ({
                                    ...prev,
                                    [index]: (activePhotoIdx + 1) % allImgs.length,
                                  }))
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-20 cursor-pointer"
                                title="Next photo"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Hover Overlay with Zoom Icon */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[1px]">
                            <span className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-white font-outfit text-xs font-medium flex items-center gap-1.5 shadow-lg transform translate-y-1 group-hover/img:translate-y-0 transition-transform duration-300">
                              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Expand
                            </span>
                          </div>
                        </div>
                      )
                    })()}

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
            <Link to="/projects">
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

      {/* Modern Multi-Image Lightbox Slider Modal */}
      <SleekLightbox
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        images={selectedImage?.images || []}
        activeIdx={selectedImage?.activeIdx || 0}
        onIndexChange={(newIdx) =>
          setSelectedImage((prev) => (prev ? { ...prev, activeIdx: newIdx } : null))
        }
        title={selectedImage?.title || ""}
        github={selectedImage?.github}
        live={selectedImage?.live}
      />
    </div>
  )
}

export default Projects
