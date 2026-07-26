import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, Maximize2, X, ChevronLeft, ChevronRight, Layers } from "lucide-react"
import Header from "@/components/Header"
import { useEffect, useState } from "react"
import { Footer } from "./Footer"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

import { Skeleton } from "@/components/ui/skeleton"
import { useProjectsQuery } from "@/hooks/usePortfolioQueries"
import { defaultImg, parseProjectImages } from "./Projects"

export function MainProjects() {
  const [loaded, setLoaded] = useState(false)
  const { data: dbProjects, isLoading, isError, refetch } = useProjectsQuery()
  const [cardActiveImage, setCardActiveImage] = useState<Record<string | number, number>>({})
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

  // Use dynamic database projects only (no fallback data)
  const rawProjects = dbProjects || []
  const projectList = rawProjects.map((p, idx) => {
    const allImages = parseProjectImages(p as any)
    
    return {
      id: p.id || idx + 100,
      title: p.title,
      description: p.description,
      technologies: p.tags || [],
      features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Full Stack Architecture", "Interactive UI"],
      challenges: Array.isArray(p.challenges) ? p.challenges.join(". ") : p.challenges || "Optimizing data sync and UI responsiveness",
      solutions: Array.isArray(p.solutions) ? p.solutions.join(". ") : p.solutions || "Implemented caching and modular architecture",
      results: p.results || "Enhanced performance and user engagement",
      githubUrl: p.github || "",
      liveUrl: p.live || "",
      imageUrl: allImages[0],
      images: allImages,
      architecture: p.architecture || "",
    }
  })

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    setLoaded(true)
  }, [])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <>
      <div className="min-h-screen bg-[#1a1a1a] text-white py-20 px-4 sm:px-8">
        <Header />
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#3a5a40]/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0.3,
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
                transition: {
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto pt-16"
        >
          <div className="mb-12 text-left">
            <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white tracking-tight">
              Projects
            </h1>
            <p className="text-sm text-gray-400 mt-2 font-normal max-w-md">
              A collection of my technical work and case studies
            </p>
          </div>

          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between"
            >
              <span>Notice: Operating in fallback cache mode. Live updates could not be fetched from Supabase.</span>
              <button
                onClick={() => refetch()}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-xl transition-all cursor-pointer"
              >
                Retry
              </button>
            </motion.div>
          )}

          {isLoading ? (
            <div className="space-y-16">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={`${i % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                    <Skeleton className="h-[380px] w-full rounded-3xl bg-white/10" />
                  </div>
                  <div className={`${i % 2 === 0 ? "lg:order-2" : "lg:order-1"} space-y-4`}>
                    <Skeleton className="h-8 w-2/3 bg-white/10 rounded-xl" />
                    <Skeleton className="h-4 w-full bg-white/10 rounded-lg" />
                    <Skeleton className="h-4 w-4/5 bg-white/10 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <Skeleton className="h-20 w-full rounded-2xl bg-white/10" />
                      <Skeleton className="h-20 w-full rounded-2xl bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="space-y-24"
              variants={container}
              initial="hidden"
              animate={loaded ? "show" : "hidden"}
            >
              {projectList.map((project, index) => (
              <motion.section
                key={project.id}
                variants={item}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div
                  className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
                >
                  {(() => {
                    const currentActiveIdx = cardActiveImage[project.id] || 0
                    const activePhoto = project.images[currentActiveIdx] || project.imageUrl

                    return (
                      <div>
                        {/* Main Featured Showcase Window (Click to open full slider modal) */}
                        <motion.div
                          onClick={() =>
                            setSelectedImage({
                              images: project.images,
                              activeIdx: currentActiveIdx,
                              title: project.title,
                              github:
                                project.githubUrl && project.githubUrl.trim() !== "" && project.githubUrl.trim() !== "#"
                                  ? project.githubUrl
                                  : undefined,
                              live:
                                project.liveUrl && project.liveUrl.trim() !== "" && project.liveUrl.trim() !== "#"
                                  ? project.liveUrl
                                  : undefined,
                            })
                          }
                          className="relative h-[400px] sm:h-[420px] overflow-hidden rounded-3xl group/img shadow-2xl border border-white/10 bg-[#121214] cursor-pointer"
                          variants={imageVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                          whileHover="hover"
                        >
                          <img
                            src={activePhoto}
                            alt={project.title}
                            className="w-full h-full object-cover transition-all duration-500"
                          />

                          {/* Multi Image Indicator Badge */}
                          {project.images.length > 1 && (
                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-1.5 z-10 shadow-lg">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{currentActiveIdx + 1} / {project.images.length} photos</span>
                            </div>
                          )}

                          {/* Hover Overlay with Zoom Icon */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-outfit text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                              <Maximize2 className="w-4 h-4 text-emerald-400" /> Open Full Slider
                            </span>
                          </div>
                        </motion.div>

                        {/* Inline Gallery Thumbnails Selector Strip */}
                        {project.images.length > 1 && (
                          <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1">
                            {project.images.map((thumbUrl, imgIdx) => {
                              const isSelected = currentActiveIdx === imgIdx
                              return (
                                <button
                                  key={imgIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setCardActiveImage((prev) => ({ ...prev, [project.id]: imgIdx }))
                                  }}
                                  className={`relative h-16 w-24 rounded-2xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-emerald-400 ring-2 ring-emerald-500/40 scale-105 shadow-md shadow-emerald-500/10 opacity-100"
                                      : "border-white/10 opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <img src={thumbUrl} alt={`Thumbnail ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>

                <div
                  className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"} space-y-6`}
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {project.title}
                    </h2>
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                      Featured
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{project.description}</p>

                  <div>
                    <motion.h3
                      className="font-bold text-base text-white mb-3 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Key Features
                    </motion.h3>

                    <ul className="space-y-2">
                      {(Array.isArray(project.features)
                        ? project.features
                        : typeof project.features === "string"
                          ? (project.features as string).split("\n").filter((f) => f.trim().length > 0)
                          : []
                      ).map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300"
                        >
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#18181c]/60 p-4 rounded-2xl border border-white/5 space-y-1">
                      <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Challenges</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {Array.isArray(project.challenges)
                          ? project.challenges.join(". ")
                          : typeof project.challenges === "object" && project.challenges !== null
                            ? JSON.stringify(project.challenges)
                            : project.challenges || "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#18181c]/60 p-4 rounded-2xl border border-white/5 space-y-1">
                      <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">Solutions</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {Array.isArray(project.solutions)
                          ? project.solutions.join(". ")
                          : typeof project.solutions === "object" && project.solutions !== null
                            ? JSON.stringify(project.solutions)
                            : project.solutions || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons Row (Only render if valid URL exists and not empty/#) */}
                  <div className="pt-4 flex items-center gap-2.5">
                    {project.githubUrl &&
                      project.githubUrl.trim() !== "" &&
                      project.githubUrl.trim() !== "#" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-[#1c1c24] hover:bg-[#282834] text-gray-200 hover:text-white border border-white/10 shadow-md transition-all cursor-pointer flex items-center justify-center"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Github size={18} />
                              </motion.a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Source Code</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                    {project.liveUrl &&
                      project.liveUrl.trim() !== "" &&
                      project.liveUrl.trim() !== "#" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10 transition-all cursor-pointer flex items-center justify-center"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ExternalLink size={18} />
                              </motion.a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Live Demo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                  </div>
                </div>
              </motion.section>
            ))}
          </motion.div>
        )}
        </motion.div>
      </div>
      {/* Footer */}
      <Footer />

      {/* Modern Multi-Image Lightbox Slider Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#121216]/95 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col gap-3"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-outfit font-extrabold text-white tracking-tight">
                    {selectedImage.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                    {selectedImage.activeIdx + 1} / {selectedImage.images.length}
                  </span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Image Slider View */}
              <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-black/70 border border-white/5 flex items-center justify-center group/slider">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage.activeIdx}
                    src={selectedImage.images[selectedImage.activeIdx] || defaultImg}
                    alt={`${selectedImage.title} slide ${selectedImage.activeIdx + 1}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full h-full object-contain rounded-2xl select-none"
                  />
                </AnimatePresence>

                {/* Left & Right Slider Controls */}
                {selectedImage.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev
                            ? {
                                ...prev,
                                activeIdx:
                                  (prev.activeIdx - 1 + prev.images.length) % prev.images.length,
                              }
                            : null
                        )
                      }
                      className="absolute left-3 p-3 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md transition-all shadow-2xl cursor-pointer"
                      title="Previous Slide (Left Arrow)"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev
                            ? {
                                ...prev,
                                activeIdx: (prev.activeIdx + 1) % prev.images.length,
                              }
                            : null
                        )
                      }
                      className="absolute right-3 p-3 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md transition-all shadow-2xl cursor-pointer"
                      title="Next Slide (Right Arrow)"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Slider Bar */}
              {selectedImage.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {selectedImage.images.map((thumbUrl, idx) => {
                    const isActive = selectedImage.activeIdx === idx
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setSelectedImage((prev) => (prev ? { ...prev, activeIdx: idx } : null))
                        }
                        className={`relative w-16 h-12 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          isActive
                            ? "border-emerald-400 ring-2 ring-emerald-500/40 scale-105 opacity-100"
                            : "border-white/10 opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img src={thumbUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-400 font-mono">
                  Use Left/Right arrow keys to slide images
                </span>
                <div className="flex items-center gap-2">
                  {selectedImage.github && (
                    <a
                      href={selectedImage.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full bg-[#202028] hover:bg-[#2a2a34] text-white border border-white/10 text-xs font-outfit font-semibold flex items-center gap-2 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" /> View Code
                    </a>
                  )}
                  {selectedImage.live && (
                    <a
                      href={selectedImage.live}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-outfit font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MainProjects
