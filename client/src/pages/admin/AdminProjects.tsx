import { useState, useEffect } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Trash2, ExternalLink, Github, Image as ImageIcon, Search, Folder, FolderGit2, Layers, Star, Zap, Network, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

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
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
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
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Project
        </Button>
      </div>

      {/* Filter & Search Bar - Modern Glassmorphism Design */}
      <div className="bg-[#18181b]/80 backdrop-blur-xl border border-[#27272a] p-4 rounded-3xl space-y-3.5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/70" />
            <Input
              type="text"
              placeholder="Search projects by title, tech stack tags, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#121214] border-[#27272a] focus:border-emerald-500/50 rounded-2xl text-xs text-white placeholder:text-zinc-500 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-[#121214] px-3.5 py-2 rounded-2xl border border-[#27272a] shrink-0 self-start md:self-auto">
            <Folder className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Showing <strong className="text-white">
                {projects.filter((p) => {
                  const matchesCat = categoryFilter === "All" || p.category === categoryFilter
                  const q = searchQuery.toLowerCase().trim()
                  const matchesQuery =
                    !q ||
                    p.title.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.tags?.some((t) => t.toLowerCase().includes(q))
                  return matchesCat && matchesQuery
                }).length}
              </strong> of {projects.length} projects
            </span>
          </div>
        </div>

        {/* Category Filter Pills & Quick Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All", "Full Stack", "Frontend", "Backend", "Mobile", "AI / ML"].map((cat) => {
            const count = cat === "All"
              ? projects.length
              : projects.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${categoryFilter === cat
                    ? "bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "bg-[#121214] text-zinc-400 hover:text-white hover:bg-[#202023] border border-[#27272a]"
                  }`}
              >
                {cat}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${categoryFilter === cat ? "bg-slate-950/30 text-slate-950" : "bg-zinc-800 text-zinc-400"
                  }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {projects.filter((p) => {
        const matchesCat = categoryFilter === "All" || p.category === categoryFilter
        const q = searchQuery.toLowerCase().trim()
        const matchesQuery =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
        return matchesCat && matchesQuery
      }).length === 0 ? (
        <div className="bg-[#18181b]/50 border border-dashed border-[#27272a] rounded-3xl p-12 text-center space-y-3">
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
            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs rounded-xl border border-emerald-500/30 mt-2"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects
            .filter((p) => {
              const matchesCat = categoryFilter === "All" || p.category === categoryFilter
              const q = searchQuery.toLowerCase().trim()
              const matchesQuery =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags?.some((t) => t.toLowerCase().includes(q))
              return matchesCat && matchesQuery
            })
            .map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/projects/edit/${p.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    navigate(`/admin/projects/edit/${p.id}`)
                  }
                }}
                className="bg-gradient-to-b from-[#1c1c21] to-[#141417] border border-[#27272a] rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {/* Project Image Banner */}
                <div className="relative h-44 sm:h-52 bg-[#0d0d0f] overflow-hidden flex items-center justify-center border-b border-[#27272a]">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        objectPosition:
                          p.image_position || (p.id ? localStorage.getItem(`portfolio_project_cover_pos_${p.id}`) : null) || "50% 50%",
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                      <ImageIcon className="w-10 h-10 opacity-30 text-emerald-400" />
                      <span className="text-[11px] font-semibold">No Image Provided</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30 shadow-md">
                      {p.category || "Project"}
                    </span>
                    {p.featured && (
                      <span className="text-[10px] font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-green-300 px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-slate-950 stroke-none" /> FEATURED
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6 pt-3 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-white flex items-center justify-between">
                      <span>{p.title}</span>
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-[#0f0f12] text-zinc-300 px-2.5 py-1 rounded-lg border border-[#27272a]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Case Study Badges */}
                    {((p.features && p.features.length > 0) || (p.challenges && p.challenges.length > 0) || (p.solutions && p.solutions.length > 0) || p.results || p.architecture) && (
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px]">
                        {p.features && p.features.length > 0 && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-emerald-400" />
                            {Array.isArray(p.features) ? p.features.length : 1} Features
                          </span>
                        )}
                        {p.challenges && p.challenges.length > 0 && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            {Array.isArray(p.challenges) ? p.challenges.length : 1} Challenges
                          </span>
                        )}
                        {p.solutions && p.solutions.length > 0 && (
                          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <Lightbulb className="w-3 h-3 text-cyan-400" />
                            {Array.isArray(p.solutions) ? p.solutions.length : 1} Solutions
                          </span>
                        )}
                        {p.architecture && (
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <Network className="w-3 h-3 text-purple-400" />
                            Architecture
                          </span>
                        )}
                        {p.results && (
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 truncate max-w-[220px]">
                            <TrendingUp className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="truncate">{p.results}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#27272a] mt-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 rounded-xl bg-[#0f0f12] border border-[#27272a] hover:text-white hover:bg-[#202023] hover:border-zinc-500 transition-colors"
                          title={`GitHub: ${p.github}`}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 rounded-xl bg-[#0f0f12] border border-[#27272a] hover:text-white hover:bg-[#202023] hover:border-zinc-500 transition-colors"
                          title={`Live Demo: ${p.live}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
                        Edit details →
                      </span>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          promptDeleteProject(p)
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs rounded-xl px-3 py-2 cursor-pointer font-semibold transition-all"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
