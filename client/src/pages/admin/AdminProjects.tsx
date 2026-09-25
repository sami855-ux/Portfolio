import { useState, useEffect, useMemo } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Trash2, ExternalLink, Github, Image as ImageIcon, Search, Folder, FolderGit2, Layers, Star, Zap, Network, TrendingUp, AlertTriangle, Lightbulb, ArrowUpRight } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  apiClient,
  isApiConfigured,
} from "@/lib/api"
import type { Project } from "@/types/api"

import { AlertDialog } from "@/components/ui/alert-dialog"

import { useQueryClient } from "@tanstack/react-query"
import { useProjectsQuery, QUERY_KEYS } from "@/hooks/usePortfolioQueries"
import { parseProjectImages } from "@/pages/Projects"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminProjects() {
  const navigate = useNavigate()
  const context = useOutletContext<AdminContext>()
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const queryClient = useQueryClient()
  const { data: dbProjects } = useProjectsQuery()

  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCardPhotos, setActiveCardPhotos] = useState<Record<string | number, number>>({})

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  // Categories for Apple Segmented Switcher
  const categories = useMemo(() => {
    const set = new Set<string>(["All", "Full Stack", "Frontend", "Backend", "Mobile", "AI / ML"])
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim())
    })
    return Array.from(set)
  }, [projects])

  // Filter projects by search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCat = categoryFilter === "All" || p.category === categoryFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      return matchesCat && matchesQuery
    })
  }, [projects, categoryFilter, searchQuery])

  // Delete Alert Dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id?: string
    title?: string
    isLoading: boolean
    isError: boolean
    errorMessage?: string
  }>({ open: false, isLoading: false, isError: false })

  useEffect(() => {
    if (dbProjects) {
      setProjects(dbProjects)
      setLoading(false)
    }
  }, [dbProjects])

  const promptDeleteProject = (project: Project) => {
    setDeleteDialog({
      open: true,
      id: project.id,
      title: project.title,
      isLoading: false,
      isError: false,
    })
  }

  const confirmDeleteProject = async () => {
    if (!deleteDialog.id) return
    setDeleteDialog((prev) => ({ ...prev, isLoading: true, isError: false }))
    const toastId = toast.loading("Deleting project...")
    try {
      if (isApiConfigured && !deleteDialog.id.startsWith("demo")) {
        const { error } = await apiClient.from("projects").delete().eq("id", deleteDialog.id)
        if (error) throw new Error(error.message)
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteDialog.id))
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })
      toast.success("Project deleted successfully.", { id: toastId })
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project."
      toast.error(msg, { id: toastId })
      setDeleteDialog((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: msg || "Failed to delete project. Please try again.",
      }))
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading projects...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Dashboard Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border-0 flex items-center justify-center text-emerald-400 shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Projects Manager</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Curate, showcase, and edit portfolio case studies & architecture
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate("/admin/projects/new")}
          className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-5 py-2.5 rounded-full flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-white/10 transition-all active:scale-95 w-full sm:w-auto shrink-0 border-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Project
        </Button>
      </div>

      {/* iOS Search Bar & Segmented Pill Switcher (Apple Design like /projects) */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* iOS Spotlight Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, technologies..."
              className="w-full pl-10 pr-14 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.08] text-white text-xs sm:text-sm placeholder:text-zinc-500 border-0 focus:ring-1 focus:ring-emerald-400/50 transition-all outline-none backdrop-blur-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Apple Minimalist Count Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
            <span>
              Showing <strong className="text-white">{filteredProjects.length}</strong> of {projects.length} projects
            </span>
          </div>
        </div>

        {/* iOS Segmented Control (Smooth Sliding Pill with Framer Motion) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-transparent border-0 max-w-full">
          {categories.map((cat) => {
            const count = cat === "All"
              ? projects.length
              : projects.filter((p) => p.category === cat).length
            const isActive = categoryFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`relative px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isActive ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAdminProjectCategory"
                    className="absolute inset-0 rounded-full bg-white shadow-md shadow-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono ${isActive ? "text-zinc-950/70" : "text-zinc-500"}`}>
                    {count}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white/[0.02] border-0 shadow-2xl rounded-3xl p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No portfolio projects match your active search filter "{searchQuery}" in category "{categoryFilter}".
          </p>
          <Button
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setCategoryFilter("All")
            }}
            className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs rounded-xl border-0 shadow-sm mt-2"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((p, index) => {
            const allImgs = parseProjectImages(p)
            const cardKey = p.id || index
            const activeIdx = activeCardPhotos[cardKey] || 0
            const activePhoto = allImgs[activeIdx] || allImgs[0]
            const hasMultiplePhotos = allImgs.length > 1

            return (
              <div
                key={p.id || index}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/projects/edit/${p.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    navigate(`/admin/projects/edit/${p.id}`)
                  }
                }}
                className="group relative w-full flex flex-col justify-between rounded-[32px] bg-gradient-to-b from-white/[0.05] via-white/[0.025] to-white/[0.01] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.36)] hover:bg-white/[0.05] border-0 transition-all duration-300 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/30 overflow-hidden"
              >
                {/* Apple Top Hairline Specular Reflection */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                {/* Top: Header, Eyebrow, Badges & Action Buttons */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border-0 shadow-sm">
                          {p.category || "Full Stack"}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border-0 flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-amber-400 stroke-none" /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight font-outfit truncate group-hover:text-emerald-300 transition-colors">
                        {p.title}
                      </h3>
                    </div>

                    {/* Apple-style Circular Glass Buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      {p.github && p.github !== "#" && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-sm border-0"
                          title={`Source Code: ${p.github}`}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {p.live && p.live !== "#" && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 transition-colors flex items-center justify-center cursor-pointer shadow-sm border-0"
                          title={`Live Demo: ${p.live}`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          promptDeleteProject(p)
                        }}
                        className="w-9 h-9 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-400 border-0 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>

                {/* Center: Apple Cinematic 16:10 Showcase Window */}
                <div className="relative aspect-[16/10] sm:h-52 w-full overflow-hidden rounded-2xl bg-black/70 my-4 shadow-inner border-0 flex items-center justify-center group/screen">
                  {activePhoto ? (
                    <img
                      src={activePhoto}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        objectPosition:
                          p.image_position ||
                          (p.id ? localStorage.getItem(`portfolio_project_cover_pos_${p.id}`) : null) ||
                          "50% 50%",
                      }}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <ImageIcon className="w-10 h-10 opacity-30 text-emerald-400" />
                      <span className="text-[11px] font-mono text-zinc-500">No Image Provided</span>
                    </div>
                  )}

                  {/* Subtle Apple gradient shadow at bottom for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Multi-photo Apple Indicator & Navigation Dots */}
                  {hasMultiplePhotos && (
                    <>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border-0 text-[10px] font-mono text-zinc-300 pointer-events-none shadow-md">
                        {activeIdx + 1} / {allImgs.length}
                      </div>

                      <div
                        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border-0 shadow-lg z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {allImgs.slice(0, 6).map((_, imgIdx) => (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveCardPhotos((prev) => ({
                                ...prev,
                                [cardKey]: imgIdx,
                              }))
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              activeIdx === imgIdx
                                ? "w-4 bg-emerald-400"
                                : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                            aria-label={`View photo ${imgIdx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Specs: Deliverable Badges, Tech Pills & Edit Affordance */}
                <div className="space-y-3 pt-1">
                  {/* Case Study Badges */}
                  {((p.features && p.features.length > 0) ||
                    (p.challenges && p.challenges.length > 0) ||
                    (p.solutions && p.solutions.length > 0) ||
                    p.results ||
                    p.architecture) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      {p.features && p.features.length > 0 && (
                        <span className="bg-emerald-500/15 text-emerald-400 border-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          {Array.isArray(p.features) ? p.features.length : 1} Features
                        </span>
                      )}
                      {p.challenges && p.challenges.length > 0 && (
                        <span className="bg-amber-500/15 text-amber-400 border-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          {Array.isArray(p.challenges) ? p.challenges.length : 1} Challenges
                        </span>
                      )}
                      {p.solutions && p.solutions.length > 0 && (
                        <span className="bg-cyan-500/15 text-cyan-400 border-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                          <Lightbulb className="w-3 h-3 text-cyan-400" />
                          {Array.isArray(p.solutions) ? p.solutions.length : 1} Solutions
                        </span>
                      )}
                      {p.architecture && (
                        <span className="bg-purple-500/15 text-purple-400 border-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                          <Network className="w-3 h-3 text-purple-400" />
                          Architecture
                        </span>
                      )}
                      {p.results && (
                        <span className="bg-blue-500/15 text-blue-400 border-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium truncate max-w-[200px] shadow-sm">
                          <TrendingUp className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate">{p.results}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Minimalist Apple Tech Stack Pills */}
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 5).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 text-[11px] font-mono tracking-tight rounded-full bg-white/[0.05] text-zinc-300 border-0 backdrop-blur-sm shadow-sm"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 5 && (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-white/[0.03] text-zinc-500 border-0">
                          +{p.tags.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Apple Footer Meta & Edit Invitation */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                      Case Study #{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      Edit Specification <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Alert Dialog with Loading & Error States */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        variant="danger"
        title="Delete Project?"
        description={`Are you sure you want to permanently delete "${deleteDialog.title || "this project"}"? This action cannot be undone.`}
        confirmText="Delete Project"
        cancelText="Keep Project"
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        isLoading={deleteDialog.isLoading}
        loadingText="Deleting project from database..."
        isError={deleteDialog.isError}
        errorTitle="Deletion Failed"
        errorMessage={deleteDialog.errorMessage}
      />
    </motion.div>
  )
}
