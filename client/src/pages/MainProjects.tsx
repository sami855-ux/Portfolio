import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, Github, Maximize2, ChevronLeft, ChevronRight, Layers, ArrowUpRight, Sparkles } from "lucide-react"
import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjectsQuery } from "@/hooks/usePortfolioQueries"
import { parseProjectImages } from "./Projects"
import { SleekLightbox } from "@/components/SleekLightbox"

export function MainProjects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { data: dbProjects, isLoading, isError, refetch } = useProjectsQuery()
  const [cardActiveImage, setCardActiveImage] = useState<Record<string | number, number>>({})
  const [selectedImage, setSelectedImage] = useState<{
    images: string[]
    activeIdx: number
    title: string
    github?: string
    live?: string
  } | null>(null)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  // Parse projects
  const rawProjects = dbProjects || []
  const allProjects = useMemo(() => {
    return rawProjects.map((p, idx) => {
      const allImages = parseProjectImages(p as any)
      return {
        id: p.id || idx + 100,
        title: p.title,
        description: p.description,
        technologies: p.tags || [],
        features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Full Stack Architecture", "High Performance UI"],
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
  }, [rawProjects])

  // Extract unique categories for iOS segmented switcher
  const categories = useMemo(() => {
    const set = new Set<string>()
    allProjects.forEach((p) => {
      p.technologies.forEach((t) => set.add(t))
    })
    return ["All", ...Array.from(set).slice(0, 5)]
  }, [allProjects])

  // Filter projects by search query and category
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === "All" || p.technologies.includes(selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [allProjects, searchQuery, selectedCategory])

  return (
    <>
      <Header />
      <div className="min-h-screen text-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-x-clip w-full">
        {/* Apple iOS ambient blurred aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90vw] max-w-[650px] h-[350px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto pt-6 sm:pt-12 w-full min-w-0">
          {/* iOS Large Title Header */}
          <div className="mb-10 sm:mb-14 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                App Store &amp; Engineering Archive
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-outfit break-words">
              Projects.
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-normal max-w-xl leading-relaxed">
              Engineered web applications, cross-platform mobile products, and scalable cloud solutions built with modern technology stacks.
            </p>
          </div>

          {/* iOS Search Bar & Segmented Pill Switcher */}
          <div className="mb-10 sm:mb-12 space-y-4">
            {/* iOS Spotlight Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, technologies..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.08] text-white text-xs sm:text-sm placeholder:text-zinc-500 border-0 focus:ring-1 focus:ring-emerald-400/50 transition-all outline-none backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* iOS Segmented Control (No Scroll, Responsive Wrap) */}
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-transparent border-0 max-w-full">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`relative px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                        isActive ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeProjectCategory"
                          className="absolute inset-0 rounded-full bg-white shadow-md shadow-white/10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {isError && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 text-amber-300 text-sm flex items-center justify-between">
              <span>Notice: Displaying cached portfolio projects catalog.</span>
              <button
                onClick={() => refetch()}
                className="px-3.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-full transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Apple Editorial Project Showcase (Card-Free with Hairline Dividers) */}
          {isLoading ? (
            <div className="divide-y divide-white/[0.08] border-t border-white/[0.08]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-12 sm:py-16 space-y-5">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/3 bg-white/10 rounded-xl" />
                    <Skeleton className="h-8 w-24 bg-white/10 rounded-full" />
                  </div>
                  <Skeleton className="h-44 sm:h-56 max-w-xl w-full rounded-2xl bg-white/10" />
                  <Skeleton className="h-4 w-2/3 bg-white/10 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl bg-white/[0.02]">
              <Sparkles className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No projects found</h3>
              <p className="text-xs text-zinc-400 mt-1">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.08] border-t border-white/[0.08]">
              {filteredProjects.map((project, index) => {
                const currentActiveIdx = cardActiveImage[project.id] || 0
                const activePhoto = project.images[currentActiveIdx] || project.imageUrl

                return (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="py-12 sm:py-20 first:pt-6 space-y-6 sm:space-y-8 w-full min-w-0"
                  >
                    {/* Project Header: Eyebrow, Title, Action CTAs & Narrative */}
                    <div className="space-y-3 w-full min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="space-y-1.5 min-w-0 max-w-2xl">
                          <span className="text-[11px] font-mono font-medium text-emerald-400 tracking-wider uppercase">
                            Case Study #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-outfit break-words">
                            {project.title}
                          </h2>
                        </div>

                        {/* iOS Action Buttons ("GET" Style Pill & Circular Code Trigger) */}
                        <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-1">
                          {project.githubUrl &&
                            project.githubUrl.trim() !== "" &&
                            project.githubUrl.trim() !== "#" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <a
                                      href={project.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                                    >
                                      <Github className="w-4 h-4" />
                                    </a>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-zinc-900 text-zinc-200 border-none text-xs rounded-xl px-2.5 py-1">
                                    <p>Source Code</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                          {project.liveUrl &&
                            project.liveUrl.trim() !== "" &&
                            project.liveUrl.trim() !== "#" && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-950" />
                              </a>
                            )}
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal max-w-3xl break-words">
                        {project.description}
                      </p>
                    </div>

                    {/* Compact Screen Preview Stage */}
                    <div className="space-y-3 max-w-xl w-full min-w-0">
                      <div
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
                        className="relative aspect-[16/10] sm:h-[260px] md:h-[280px] w-full overflow-hidden rounded-2xl bg-black/50 shadow-xl group/img cursor-pointer ring-1 ring-white/[0.08]"
                      >
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={currentActiveIdx}
                            src={activePhoto}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                          />
                        </AnimatePresence>

                        {/* Multi Image Badge */}
                        {project.images.length > 1 && (
                          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-medium flex items-center gap-1.5 z-10 shadow-lg">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            <span>{currentActiveIdx + 1}/{project.images.length}</span>
                          </div>
                        )}

                        {/* Cyclic Arrows */}
                        {project.images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCardActiveImage((prev) => ({
                                  ...prev,
                                  [project.id]:
                                    (currentActiveIdx - 1 + project.images.length) % project.images.length,
                                }))
                              }}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center cursor-pointer shadow-lg"
                              title="Previous photo"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCardActiveImage((prev) => ({
                                  ...prev,
                                  [project.id]: (currentActiveIdx + 1) % project.images.length,
                                }))
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center cursor-pointer shadow-lg"
                              title="Next photo"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Expand Lightbox Overlay */}
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-3.5 py-1.5 rounded-full bg-black/60 text-white font-outfit text-xs font-medium flex items-center gap-1.5 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Expand Lightbox
                          </span>
                        </div>
                      </div>

                      {/* iOS Image Switcher Thumbnails Strip (Responsive Wrap, No Scrollbar) */}
                      {project.images.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 max-w-full">
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
                                className={`relative h-10 w-16 rounded-lg overflow-hidden shrink-0 transition-all duration-300 cursor-pointer ${
                                  isSelected
                                    ? "ring-2 ring-emerald-400 opacity-100 scale-105"
                                    : "opacity-40 hover:opacity-100"
                                }`}
                              >
                                <img
                                  src={thumbUrl}
                                  alt={`Thumbnail ${imgIdx + 1}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Apple Tech Specs & Architectural Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-2 w-full min-w-0">
                      {/* Core Deliverables */}
                      {project.features && project.features.length > 0 && (
                        <div className="lg:col-span-5 space-y-3 min-w-0">
                          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                            Core Deliverables
                          </h3>
                          <ul className="space-y-2">
                            {(Array.isArray(project.features)
                              ? project.features
                              : typeof project.features === "string"
                                ? (project.features as string).split("\n").filter((f) => f.trim().length > 0)
                                : []
                            ).map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed break-words"
                              >
                                <span className="text-emerald-400 font-bold leading-none mt-1 shrink-0">•</span>
                                <span className="break-words">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Engineering Challenges, Solutions & Tech Pills */}
                      <div
                        className={`${
                          project.features && project.features.length > 0
                            ? "lg:col-span-7"
                            : "lg:col-span-12"
                        } space-y-5 sm:space-y-6 min-w-0`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-1.5 min-w-0">
                            <h4 className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider">
                              Engineering Challenges
                            </h4>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed break-words">
                              {Array.isArray(project.challenges)
                                ? project.challenges.join(". ")
                                : typeof project.challenges === "object" && project.challenges !== null
                                  ? JSON.stringify(project.challenges)
                                  : project.challenges || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1.5 min-w-0">
                            <h4 className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              Architectural Solutions
                            </h4>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed break-words">
                              {Array.isArray(project.solutions)
                                ? project.solutions.join(". ")
                                : typeof project.solutions === "object" && project.solutions !== null
                                  ? JSON.stringify(project.solutions)
                                  : project.solutions || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Tech Stack Pills */}
                        {project.technologies.length > 0 && (
                          <div className="pt-1">
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {project.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 sm:px-3 py-1 text-xs font-medium rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.06] break-words"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />

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
    </>
  )
}

export default MainProjects
