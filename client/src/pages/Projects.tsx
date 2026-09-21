import { useState, useRef, useEffect } from "react"
import { Github, ExternalLink, Maximize2, ChevronLeft, ChevronRight, Layers, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
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
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        {/* Apple-style Section Header */}
        <div className="text-center mb-16 sm:mb-20 space-y-3">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight font-outfit">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Work.
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Engineered applications, intuitive interfaces, and production software designed for performance and scale.
          </p>
        </div>

        {isError && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 text-amber-300 text-sm flex items-center justify-between max-w-4xl mx-auto">
            <span>Notice: Displaying cached projects catalog.</span>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-full transition-all cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[460px] rounded-[28px] bg-white/[0.02] p-6 flex flex-col justify-between overflow-hidden">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-full bg-white/10" />
                  <Skeleton className="h-6 w-3/4 bg-white/10 rounded-xl" />
                  <Skeleton className="h-3.5 w-full bg-white/10 rounded-lg" />
                </div>
                <Skeleton className="h-52 w-full rounded-2xl bg-white/10 my-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                  <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {projectList.map((project, index) => {
              const allImgs = parseProjectImages(project)
              const activePhotoIdx = activeCardPhotos[index] || 0
              const activePhoto = allImgs[activePhotoIdx] || allImgs[0]

              return (
                <motion.div key={project.id || index} variants={itemVariants} className="w-full flex">
                  {/* Apple Product Bento Card */}
                  <div className="w-full flex flex-col justify-between group rounded-[28px] bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl p-6 sm:p-7 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 border-0 relative">
                    {/* Top: Eyebrow + Title & Circular Action Triggers */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[11px] font-mono font-medium text-emerald-400/90 tracking-wider uppercase">
                            Case Study #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300 font-outfit">
                            {project.title}
                          </h3>
                        </div>

                        {/* Apple-style circular glass buttons */}
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          {project.github && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={project.github} target="_blank">
                                    <span className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.16] backdrop-blur-md text-zinc-300 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105">
                                      <Github className="w-4 h-4" />
                                    </span>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 text-zinc-200 border-none text-xs rounded-xl px-2.5 py-1">
                                  <p>Source Code</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {project.live && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={project.live} target="_blank">
                                    <span className="w-9 h-9 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 backdrop-blur-md text-emerald-400 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105">
                                      <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-900 text-zinc-200 border-none text-xs rounded-xl px-2.5 py-1">
                                  <p>Live Demo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                        {project.description}
                      </p>
                    </div>

                    {/* Center: Large Cinematic Showcase Window */}
                    <div
                      onClick={() => {
                        setSelectedImage({
                          images: allImgs,
                          activeIdx: activePhotoIdx,
                          title: project.title,
                          github: project.github && project.github !== "#" ? project.github : undefined,
                          live: project.live && project.live !== "#" ? project.live : undefined,
                        })
                      }}
                      className="relative aspect-[16/10] sm:h-56 w-full overflow-hidden rounded-2xl bg-black/60 my-5 group/img cursor-pointer shadow-inner"
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
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                        />
                      </AnimatePresence>

                      {/* Multi-image indicator badge */}
                      {allImgs.length > 1 && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-medium flex items-center gap-1.5 z-10">
                          <Layers className="w-3 h-3 text-emerald-400" />
                          <span>{activePhotoIdx + 1}/{allImgs.length}</span>
                        </div>
                      )}

                      {/* Dots Switcher */}
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
                                activePhotoIdx === dotIdx ? "w-5 bg-white shadow-sm" : "w-1.5 bg-white/40 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Cyclic Navigation Arrows */}
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
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center cursor-pointer"
                            title="Previous"
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
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center cursor-pointer"
                            title="Next"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-[1px]">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/60 text-white font-outfit text-xs font-medium flex items-center gap-1.5 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Expand
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Apple Minimalist Tech Stack Pills */}
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.tags || []).slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-[11px] font-medium tracking-tight rounded-full bg-white/[0.04] text-zinc-300 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* View All Projects Button */}
        <div className="mt-16 sm:mt-20 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider shadow-xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="h-4 w-4 text-zinc-950" />
          </Link>
        </div>
      </motion.div>

      {/* Lightbox Slider Modal */}
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
    </section>
  )
}

export default Projects
