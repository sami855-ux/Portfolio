import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion, Reorder } from "framer-motion"
import { Globe, Plus, Edit, Trash2, ExternalLink, Github, Upload, Image as ImageIcon, GripVertical, ArrowUp, ArrowDown, Search, Folder, FolderGit2, Layers, Star, CheckCircle2, Terminal, Cpu, Code2, Wand2 } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  supabase,
  isSupabaseConfigured,
  getProjects,
} from "@/lib/supabase"
import type { Project } from "@/types/supabase"

import { AlertDialog } from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"

import { useQueryClient } from "@tanstack/react-query"
import { useProjectsQuery, QUERY_KEYS } from "@/hooks/usePortfolioQueries"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminProjects() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const queryClient = useQueryClient()
  const { data: dbProjects, isLoading: isQueryLoading } = useProjectsQuery()

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isEditingProject, setIsEditingProject] = useState<Project | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  // Architecture UI View Mode ("gui" | "code")
  const [archViewMode, setArchViewMode] = useState<"gui" | "code">("gui")

  // Quick bulk text helpers
  const [bulkFeaturesText, setBulkFeaturesText] = useState("")
  const [showBulkFeatures, setShowBulkFeatures] = useState(false)

  const [bulkChallengesText, setBulkChallengesText] = useState("")
  const [showBulkChallenges, setShowBulkChallenges] = useState(false)

  const [bulkSolutionsText, setBulkSolutionsText] = useState("")
  const [showBulkSolutions, setShowBulkSolutions] = useState(false)

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

  // Drag states
  const [draggedFeatureIndex, setDraggedFeatureIndex] = useState<number | null>(null)
  const [draggedChallengeIndex, setDraggedChallengeIndex] = useState<number | null>(null)
  const [draggedSolutionIndex, setDraggedSolutionIndex] = useState<number | null>(null)

  // Features Move & Drag Handlers
  const moveFeature = (fromIndex: number, toIndex: number) => {
    if (!isEditingProject?.features) return
    if (toIndex < 0 || toIndex >= isEditingProject.features.length) return
    const updated = [...isEditingProject.features]
    const [movedItem] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, movedItem)
    setIsEditingProject({ ...isEditingProject, features: updated })
  }

  const handleFeatureDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFeatureIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleFeatureDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedFeatureIndex === null || draggedFeatureIndex === index) return
    const updated = [...(isEditingProject?.features || [])]
    const [draggedItem] = updated.splice(draggedFeatureIndex, 1)
    updated.splice(index, 0, draggedItem)
    setDraggedFeatureIndex(index)
    setIsEditingProject((prev) => (prev ? { ...prev, features: updated } : null))
  }

  const handleFeatureDragEnd = () => {
    setDraggedFeatureIndex(null)
  }

  // Challenges Move & Drag Handlers
  const moveChallenge = (fromIndex: number, toIndex: number) => {
    const current = Array.isArray(isEditingProject?.challenges)
      ? isEditingProject!.challenges
      : typeof isEditingProject?.challenges === "string"
      ? isEditingProject!.challenges.split("\n").filter(Boolean)
      : []
    if (toIndex < 0 || toIndex >= current.length) return
    const updated = [...current]
    const [movedItem] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, movedItem)
    setIsEditingProject({ ...isEditingProject!, challenges: updated })
  }

  const handleChallengeDragStart = (e: React.DragEvent, index: number) => {
    setDraggedChallengeIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleChallengeDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedChallengeIndex === null || draggedChallengeIndex === index) return
    const current = Array.isArray(isEditingProject?.challenges)
      ? isEditingProject!.challenges
      : typeof isEditingProject?.challenges === "string"
      ? isEditingProject!.challenges.split("\n").filter(Boolean)
      : []
    const updated = [...current]
    const [draggedItem] = updated.splice(draggedChallengeIndex, 1)
    updated.splice(index, 0, draggedItem)
    setDraggedChallengeIndex(index)
    setIsEditingProject((prev) => (prev ? { ...prev, challenges: updated } : null))
  }

  const handleChallengeDragEnd = () => {
    setDraggedChallengeIndex(null)
  }

  // Solutions Move & Drag Handlers
  const moveSolution = (fromIndex: number, toIndex: number) => {
    const current = Array.isArray(isEditingProject?.solutions)
      ? isEditingProject!.solutions
      : typeof isEditingProject?.solutions === "string"
      ? isEditingProject!.solutions.split("\n").filter(Boolean)
      : []
    if (toIndex < 0 || toIndex >= current.length) return
    const updated = [...current]
    const [movedItem] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, movedItem)
    setIsEditingProject({ ...isEditingProject!, solutions: updated })
  }

  const handleSolutionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSolutionIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleSolutionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedSolutionIndex === null || draggedSolutionIndex === index) return
    const current = Array.isArray(isEditingProject?.solutions)
      ? isEditingProject!.solutions
      : typeof isEditingProject?.solutions === "string"
      ? isEditingProject!.solutions.split("\n").filter(Boolean)
      : []
    const updated = [...current]
    const [draggedItem] = updated.splice(draggedSolutionIndex, 1)
    updated.splice(index, 0, draggedItem)
    setDraggedSolutionIndex(index)
    setIsEditingProject((prev) => (prev ? { ...prev, solutions: updated } : null))
  }

  const handleSolutionDragEnd = () => {
    setDraggedSolutionIndex(null)
  }

  const parseToArray = (val: any): string[] => {
    if (Array.isArray(val)) return val
    if (typeof val === "string") {
      const lines = val.split("\n").map((s) => s.trim()).filter(Boolean)
      return lines.length > 0 ? lines : []
    }
    return []
  }

  const openEditProject = (project?: Project) => {
    if (project) {
      const rawFeatures = parseToArray(project.features)
      const rawChallenges = parseToArray(project.challenges)
      const rawSolutions = parseToArray(project.solutions)

      setIsEditingProject({
        ...project,
        features: rawFeatures.length > 0 ? rawFeatures : [""],
        challenges: rawChallenges.length > 0 ? rawChallenges : [""],
        solutions: rawSolutions.length > 0 ? rawSolutions : [""],
        architecture: typeof project.architecture === "string" ? project.architecture : "",
      })
      setBulkFeaturesText(rawFeatures.join("\n"))
      setBulkChallengesText(rawChallenges.join("\n"))
      setBulkSolutionsText(rawSolutions.join("\n"))
    } else {
      setIsEditingProject({
        title: "",
        description: "",
        tags: [],
        github: "",
        live: "",
        image: "",
        category: "Full Stack",
        featured: true,
        features: [""],
        challenges: [""],
        solutions: [""],
        architecture: "",
        results: "",
      })
      setBulkFeaturesText("")
      setBulkChallengesText("")
      setBulkSolutionsText("")
    }
    setShowBulkFeatures(false)
    setShowBulkChallenges(false)
    setShowBulkSolutions(false)
    setShowSheet(true)
  }

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isEditingProject) return
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setIsEditingProject({ ...isEditingProject, image: reader.result })
        triggerToast("Project cover image loaded from device!")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingProject) return
    setIsSaving(true)

    const isNew = !isEditingProject.id || isEditingProject.id.startsWith("demo")
    const toastId = toast.loading(isNew ? "Creating new project..." : "Saving project changes...")

    try {
      // Clean features, challenges, solutions arrays
      const cleanFeatures = (isEditingProject.features || [])
        .map((f) => (typeof f === "string" ? f.trim() : f))
        .filter(Boolean)

      const rawChallenges = Array.isArray(isEditingProject.challenges)
        ? isEditingProject.challenges
        : typeof isEditingProject.challenges === "string"
        ? (isEditingProject.challenges as string).split("\n")
        : []
      const cleanChallenges = rawChallenges
        .map((c) => (typeof c === "string" ? c.trim() : c))
        .filter(Boolean)

      const rawSolutions = Array.isArray(isEditingProject.solutions)
        ? isEditingProject.solutions
        : typeof isEditingProject.solutions === "string"
        ? (isEditingProject.solutions as string).split("\n")
        : []
      const cleanSolutions = rawSolutions
        .map((s) => (typeof s === "string" ? s.trim() : s))
        .filter(Boolean)

      const updatedProject: Project = {
        ...isEditingProject,
        features: cleanFeatures,
        challenges: cleanChallenges,
        solutions: cleanSolutions,
      }

      if (isSupabaseConfigured) {
        if (updatedProject.id && !updatedProject.id.startsWith("demo")) {
          const { error } = await supabase.from("projects").update(updatedProject).eq("id", updatedProject.id)
          if (error) throw new Error(error.message)
        } else {
          const { id, ...newProj } = updatedProject
          const { data, error } = await supabase.from("projects").insert([newProj]).select().single()
          if (error) throw new Error(error.message)
          if (data) {
            updatedProject.id = data.id
          }
        }
      }

      if (updatedProject.id) {
        setProjects((prev) => {
          const exists = prev.some((p) => p.id === updatedProject.id)
          if (exists) {
            return prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          }
          return [...prev, updatedProject]
        })
      } else {
        const newProj = { ...updatedProject, id: Date.now().toString() }
        setProjects((prev) => [...prev, newProj])
      }

      setShowSheet(false)
      setIsEditingProject(null)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })
      toast.success(isNew ? "Project created successfully!" : "Project updated successfully!", { id: toastId })
      loadHeaderData()
    } catch (err: any) {
      console.error("Save project error:", err)
      toast.error(err?.message || "Failed to save project. Please try again.", { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

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
      if (isSupabaseConfigured && !deleteDialog.id.startsWith("demo")) {
        const { error } = await supabase.from("projects").delete().eq("id", deleteDialog.id)
        if (error) throw new Error(error.message)
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteDialog.id))
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })
      toast.success("Project deleted successfully.", { id: toastId })
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project.", { id: toastId })
      setDeleteDialog((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: err.message || "Failed to delete project. Please try again.",
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
          onClick={() => openEditProject()}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs cursor-pointer shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Project
        </Button>
      </div>

      {/* Category Filter Controls */}
      <div className="flex items-center justify-between gap-3 bg-[#1b1b1b]/50 p-3 rounded-2xl border border-[#262626]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 no-scrollbar">
          {["All", "Full Stack", "Frontend", "Backend", "Mobile", "AI / ML"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-green-500 text-slate-950 font-bold shadow-md shadow-green-500/20"
                  : "bg-[#161616] text-gray-400 hover:text-white hover:bg-[#252525]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects
          .filter((p) => categoryFilter === "All" || p.category === categoryFilter)
          .map((p) => (
          <div
            key={p.id}
            className="bg-[#1b1b1b] border border-[#262626] hover:border-green-500/40 rounded-3xl overflow-hidden space-y-3 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-300 group"
          >
            {/* Project Image Banner */}
            <div className="relative h-48 bg-[#141414] overflow-hidden flex items-center justify-center border-b border-[#242424]">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImageIcon className="w-9 h-9 opacity-30 text-green-500" />
                  <span className="text-[11px] font-semibold">No Image Provided</span>
                </div>
              )}

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] uppercase font-medium text-green-400 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/20 shadow-md">
                  {p.category || "Project"}
                </span>
                {p.featured && (
                  <span className="text-[10px] font-medium text-slate-950 bg-gradient-to-r from-green-400 to-emerald-400 px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950 stroke-none" /> FEATURED
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 pt-2 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">{p.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#141414] text-gray-300 px-2.5 py-1 rounded-lg border border-[#262626]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Case Study Badges */}
                {((p.features && p.features.length > 0) || p.results || p.architecture) && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px]">
                    {p.features && p.features.length > 0 && (
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        ⚡ {Array.isArray(p.features) ? p.features.length : 1} Features List
                      </span>
                    )}
                    {p.architecture && (
                      <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold px-2.5 py-1 rounded-lg">
                        🏛️ Architecture Defined
                      </span>
                    )}
                    {p.results && (
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold px-2.5 py-1 rounded-lg truncate max-w-[220px]">
                        📈 {p.results}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#242424] mt-4">
                <div className="flex items-center gap-2 text-gray-400">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-[#141414] border border-[#282828] hover:text-white hover:bg-[#252525] hover:border-gray-600 transition-colors"
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
                      className="p-2.5 rounded-xl bg-[#141414] border border-[#282828] hover:text-white hover:bg-[#252525] hover:border-gray-600 transition-colors"
                      title={`Live Demo: ${p.live}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditProject(p)}
                    className="bg-[#141414] border border-[#282828] hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400 text-gray-300 text-xs rounded-xl px-4 py-2 cursor-pointer font-semibold transition-all"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => promptDeleteProject(p)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs rounded-xl px-3.5 py-2 cursor-pointer font-semibold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shadcn UI Sheet Drawer for Adding / Editing Projects */}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        {isEditingProject && (
          <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#181818] p-6 sm:p-8 border-l border-[#282828] overflow-y-auto no-scrollbar">
            <SheetHeader className="pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-green-500/20 to-emerald-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                    {isEditingProject.id ? "Edit Project Showcase" : "Create New Showcase Project"}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-gray-400">
                    Configure cover image, basic metadata, architecture, and case study key features.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form onSubmit={handleSaveProject} className="space-y-6 pt-6">
              {/* Cover Image Upload Section */}
              <div className="bg-[#1f1f1f] border border-[#2a2a2a] p-5 rounded-3xl space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Project Banner Image
                  </label>
                  <span className="text-[10px] text-green-400 font-mono">Cover Preview</span>
                </div>

                <div className="h-48 w-full rounded-2xl bg-[#141414] border border-[#2a2a2a] overflow-hidden flex items-center justify-center relative shadow-inner">
                  {isEditingProject.image ? (
                    <img
                      src={isEditingProject.image}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ImageIcon className="w-10 h-10 opacity-30 text-green-500" />
                      <span className="text-xs font-medium">No cover image uploaded</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="project-image-file-input"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileUpload}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => document.getElementById("project-image-file-input")?.click()}
                    className="w-full bg-[#262626] hover:bg-[#323232] text-gray-200 text-xs font-bold rounded-2xl h-11 border border-[#333] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-green-400" /> Upload Local Image
                  </Button>

                  {isEditingProject.image ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditingProject({ ...isEditingProject, image: "" })}
                      className="w-full h-11 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-2xl border border-red-500/20 cursor-pointer transition-all"
                    >
                      Remove Image
                    </Button>
                  ) : (
                    <span className="text-[11px] text-gray-500 self-center text-center">
                      Select a file from device or enter URL below
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">Direct Image URL</label>
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={isEditingProject.image || ""}
                    onChange={(e) =>
                      setIsEditingProject({ ...isEditingProject, image: e.target.value })
                    }
                    className="h-11 bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl px-3.5"
                  />
                </div>
              </div>

              {/* General Project Info */}
              <div className="bg-[#202020] border-none p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Basic Project Information
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Project Title</label>
                  <Input
                    value={isEditingProject.title}
                    onChange={(e) =>
                      setIsEditingProject({ ...isEditingProject, title: e.target.value })
                    }
                    required
                    placeholder="e.g. Learning Management System (LMS)"
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-sm rounded-2xl h-12 px-4 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description & Features</label>
                  <Textarea
                    rows={4}
                    value={isEditingProject.description}
                    onChange={(e) =>
                      setIsEditingProject({ ...isEditingProject, description: e.target.value })
                    }
                    required
                    placeholder="Explain what the application does, features, architecture, and tech choices..."
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-sm rounded-2xl p-4 leading-relaxed font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                    <Input
                      value={isEditingProject.category || ""}
                      onChange={(e) =>
                        setIsEditingProject({ ...isEditingProject, category: e.target.value })
                      }
                      placeholder="e.g. Full Stack / Mobile / AI"
                      className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-sm rounded-2xl h-12 px-4"
                    />
                  </div>

                  {/* Featured Status Toggle Switch */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Featured Status</label>
                    <button
                      type="button"
                      onClick={() =>
                        setIsEditingProject({
                          ...isEditingProject,
                          featured: !isEditingProject.featured,
                        })
                      }
                      className={`w-full h-12 rounded-2xl px-4 flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                        isEditingProject.featured
                          ? "bg-green-500 text-slate-950 shadow-lg shadow-green-500/20"
                          : "bg-[#141414] text-gray-400 border border-[#2a2a2a]"
                      }`}
                    >
                      <span>{isEditingProject.featured ? "⭐ Featured Project" : "Standard Project"}</span>
                      <span className={`w-3 h-3 rounded-full ${isEditingProject.featured ? "bg-slate-950" : "bg-gray-600"}`} />
                    </button>
                  </div>
                </div>

                {/* Tech Stack Tags with Quick Select Chips */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Tech Stack Tags (Comma Separated)
                  </label>
                  <Input
                    value={isEditingProject.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setIsEditingProject({
                        ...isEditingProject,
                        tags: e.target.value.split(",").map((t) => t.trim()),
                      })
                    }
                    placeholder="React, Next.js, Node.js, Tailwind, Supabase"
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-sm rounded-2xl h-12 px-4"
                  />

                  {/* Quick Add Tech Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2.5">
                    <span className="text-[10px] text-gray-500 font-semibold mr-1">Quick Add:</span>
                    {["React", "Next.js", "Node.js", "TypeScript", "Tailwind", "Supabase", "PostgreSQL", "MongoDB", "Prisma", "Express", "AI", "React Native"].map(
                      (tech) => {
                        const currentTags = isEditingProject.tags || []
                        const isSelected = currentTags.includes(tech)
                        return (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setIsEditingProject({
                                  ...isEditingProject,
                                  tags: currentTags.filter((t) => t !== tech),
                                })
                              } else {
                                setIsEditingProject({
                                  ...isEditingProject,
                                  tags: [...currentTags, tech],
                                })
                              }
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-green-500 text-slate-950"
                                : "bg-[#141414] text-gray-400 hover:text-white border border-[#2a2a2a]"
                            }`}
                          >
                            {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                          </button>
                        )
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="bg-[#202020] border-none p-5 rounded-3xl space-y-4">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  External Repositories & Live URLs
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-2">
                      <Github className="w-4 h-4 text-green-400" /> GitHub Repository URL
                    </label>
                    <Input
                      value={isEditingProject.github || ""}
                      onChange={(e) =>
                        setIsEditingProject({ ...isEditingProject, github: e.target.value })
                      }
                      placeholder="https://github.com/user/repo"
                      className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl h-11 px-4 font-mono"
                    />
                    {isEditingProject.github && (
                      <a
                        href={isEditingProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-green-400 hover:underline mt-1.5 font-mono truncate max-w-full"
                      >
                        <span className="truncate">Link: {isEditingProject.github}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" /> Live Application URL
                    </label>
                    <Input
                      value={isEditingProject.live || ""}
                      onChange={(e) =>
                        setIsEditingProject({ ...isEditingProject, live: e.target.value })
                      }
                      placeholder="https://my-app.vercel.app"
                      className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl h-11 px-4 font-mono"
                    />
                    {isEditingProject.live && (
                      <a
                        href={isEditingProject.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 hover:underline mt-1.5 font-mono truncate max-w-full"
                      >
                        <span className="truncate">Link: {isEditingProject.live}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Case Study, Architecture & Engineering */}
              <div className="bg-[#202020] border-none p-5 rounded-3xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Detailed Case Study & Architecture
                  </h3>
                  <span className="text-[11px] text-green-400 font-semibold">Project Showcase</span>
                </div>

                {/* Key Features (Dynamic Array List + Add Feature Button) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-300">
                      Key Features
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (showBulkFeatures) {
                            // Apply bulk multiline text into array
                            const parsed = bulkFeaturesText
                              .split("\n")
                              .map((f) => f.trim())
                              .filter(Boolean)
                            setIsEditingProject({
                              ...isEditingProject,
                              features: parsed.length > 0 ? parsed : [""],
                            })
                          } else {
                            setBulkFeaturesText(
                              (isEditingProject.features || []).filter(Boolean).join("\n")
                            )
                          }
                          setShowBulkFeatures(!showBulkFeatures)
                        }}
                        className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                      >
                        {showBulkFeatures ? "Switch to Itemized View" : "Paste Multiline Text"}
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          setIsEditingProject({
                            ...isEditingProject,
                            features: [...(isEditingProject.features || []), ""],
                          })
                        }
                        className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs h-7 px-3 rounded-xl border-none cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Feature
                      </Button>
                    </div>
                  </div>

                  {showBulkFeatures ? (
                    <Textarea
                      rows={4}
                      value={bulkFeaturesText}
                      onChange={(e) => {
                        setBulkFeaturesText(e.target.value)
                        const lines = e.target.value
                          .split("\n")
                          .map((f) => f.trim())
                          .filter(Boolean)
                        setIsEditingProject({
                          ...isEditingProject,
                          features: lines,
                        })
                      }}
                      placeholder={`Course creation and enrollment\nInteractive quizzes and assessments\nReal-time notifications`}
                      className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl p-3.5 leading-relaxed font-mono"
                    />
                  ) : (
                    <div className="space-y-2">
                      {(!isEditingProject.features || isEditingProject.features.length === 0) ? (
                        <div className="text-xs text-gray-500 italic bg-[#141414] p-3 rounded-2xl text-center border border-[#2a2a2a]">
                          No features added yet. Click "+ Add Feature" above to list key features.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {isEditingProject.features.map((feature, idx) => (
                            <div
                              key={idx}
                              draggable
                              onDragStart={(e) => handleFeatureDragStart(e, idx)}
                              onDragOver={(e) => handleFeatureDragOver(e, idx)}
                              onDragEnd={handleFeatureDragEnd}
                              className={`flex items-center gap-2 bg-[#141414] border p-1.5 px-3 rounded-2xl transition-all select-none ${
                                draggedFeatureIndex === idx
                                  ? "border-green-500 bg-[#1e2a21] opacity-70 scale-[0.98] shadow-lg shadow-green-500/10"
                                  : "border-[#2a2a2a] hover:border-[#383838]"
                              }`}
                            >
                              {/* Drag Handle */}
                              <div
                                className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-green-400 shrink-0"
                                title="Click and drag up/down to reorder features"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>

                              <span className="w-5 text-center text-xs font-mono text-green-500 font-bold shrink-0">
                                {idx + 1}.
                              </span>

                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const updated = [...(isEditingProject.features || [])]
                                  updated[idx] = e.target.value
                                  setIsEditingProject({
                                    ...isEditingProject,
                                    features: updated,
                                  })
                                }}
                                placeholder={`Feature #${idx + 1}`}
                                className="bg-[#191919] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-9 px-3 flex-1"
                              />

                              {/* Action Buttons: Move Up, Move Down, Delete */}
                              <div className="flex items-center gap-0.5 shrink-0">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveFeature(idx, idx - 1)}
                                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === isEditingProject.features!.length - 1}
                                  onClick={() => moveFeature(idx, idx + 1)}
                                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = isEditingProject.features!.filter((_, i) => i !== idx)
                                    setIsEditingProject({
                                      ...isEditingProject,
                                      features: updated,
                                    })
                                  }}
                                  className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer transition-colors ml-1"
                                  title="Remove feature item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Engineering Challenges (Dynamic Drag & Drop Array List) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-300">
                      Engineering Challenges
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (showBulkChallenges) {
                            const parsed = bulkChallengesText
                              .split("\n")
                              .map((c) => c.trim())
                              .filter(Boolean)
                            setIsEditingProject({
                              ...isEditingProject,
                              challenges: parsed.length > 0 ? parsed : [""],
                            })
                          } else {
                            const challengesArr = Array.isArray(isEditingProject.challenges)
                              ? isEditingProject.challenges
                              : typeof isEditingProject.challenges === "string"
                              ? isEditingProject.challenges.split("\n").filter(Boolean)
                              : []
                            setBulkChallengesText(challengesArr.join("\n"))
                          }
                          setShowBulkChallenges(!showBulkChallenges)
                        }}
                        className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                      >
                        {showBulkChallenges ? "Switch to Itemized View" : "Paste Multiline Text"}
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const current = Array.isArray(isEditingProject.challenges)
                            ? isEditingProject.challenges
                            : typeof isEditingProject.challenges === "string"
                            ? isEditingProject.challenges.split("\n").filter(Boolean)
                            : []
                          setIsEditingProject({
                            ...isEditingProject,
                            challenges: [...current, ""],
                          })
                        }}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs h-7 px-3 rounded-xl border border-amber-500/30 cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Challenge
                      </Button>
                    </div>
                  </div>

                  {showBulkChallenges ? (
                    <Textarea
                      rows={3}
                      value={bulkChallengesText}
                      onChange={(e) => {
                        setBulkChallengesText(e.target.value)
                        const lines = e.target.value
                          .split("\n")
                          .map((c) => c.trim())
                          .filter(Boolean)
                        setIsEditingProject({
                          ...isEditingProject,
                          challenges: lines,
                        })
                      }}
                      placeholder={`Ensuring real-time progress tracking under high load\nManaging distributed state synchronization`}
                      className="bg-[#141414] border border-[#2a2a2a] focus:border-amber-500 text-white text-xs rounded-2xl p-3.5 leading-relaxed"
                    />
                  ) : (
                    <div className="space-y-2">
                      {(!isEditingProject.challenges ||
                      (Array.isArray(isEditingProject.challenges) && isEditingProject.challenges.length === 0)) ? (
                        <div className="text-xs text-gray-500 italic bg-[#141414] p-3 rounded-2xl text-center border border-[#2a2a2a]">
                          No challenges added yet. Click "+ Add Challenge" above.
                        </div>
                      ) : (
                        (Array.isArray(isEditingProject.challenges)
                          ? isEditingProject.challenges
                          : typeof isEditingProject.challenges === "string"
                          ? (isEditingProject.challenges as string).split("\n").filter(Boolean)
                          : [""]
                        ).map((challenge, idx, arr) => (
                          <div
                            key={idx}
                            draggable
                            onDragStart={(e) => handleChallengeDragStart(e, idx)}
                            onDragOver={(e) => handleChallengeDragOver(e, idx)}
                            onDragEnd={handleChallengeDragEnd}
                            className={`flex items-center gap-2 bg-[#141414] border p-1.5 px-3 rounded-2xl transition-all select-none ${
                              draggedChallengeIndex === idx
                                ? "border-amber-500 bg-[#262017] opacity-70 scale-[0.98] shadow-lg shadow-amber-500/10"
                                : "border-[#2a2a2a] hover:border-[#383838]"
                            }`}
                          >
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-amber-400 shrink-0"
                              title="Click and drag up/down to reorder challenges"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <span className="w-5 text-center text-xs font-mono text-amber-400 font-bold shrink-0">
                              {idx + 1}.
                            </span>

                            <Input
                              value={challenge}
                              onChange={(e) => {
                                const current = [...arr]
                                current[idx] = e.target.value
                                setIsEditingProject({
                                  ...isEditingProject,
                                  challenges: current,
                                })
                              }}
                              placeholder={`Challenge #${idx + 1}`}
                              className="bg-[#191919] border border-[#2a2a2a] focus:border-amber-500 text-white text-xs rounded-xl h-9 px-3 flex-1"
                            />

                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveChallenge(idx, idx - 1)}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => moveChallenge(idx, idx + 1)}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = arr.filter((_, i) => i !== idx)
                                  setIsEditingProject({
                                    ...isEditingProject,
                                    challenges: current,
                                  })
                                }}
                                className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer transition-colors ml-1"
                                title="Remove challenge item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Technical Solutions (Dynamic Drag & Drop Array List) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-300">
                      Technical Solutions
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (showBulkSolutions) {
                            const parsed = bulkSolutionsText
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean)
                            setIsEditingProject({
                              ...isEditingProject,
                              solutions: parsed.length > 0 ? parsed : [""],
                            })
                          } else {
                            const solutionsArr = Array.isArray(isEditingProject.solutions)
                              ? isEditingProject.solutions
                              : typeof isEditingProject.solutions === "string"
                              ? isEditingProject.solutions.split("\n").filter(Boolean)
                              : []
                            setBulkSolutionsText(solutionsArr.join("\n"))
                          }
                          setShowBulkSolutions(!showBulkSolutions)
                        }}
                        className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                      >
                        {showBulkSolutions ? "Switch to Itemized View" : "Paste Multiline Text"}
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const current = Array.isArray(isEditingProject.solutions)
                            ? isEditingProject.solutions
                            : typeof isEditingProject.solutions === "string"
                            ? isEditingProject.solutions.split("\n").filter(Boolean)
                            : []
                          setIsEditingProject({
                            ...isEditingProject,
                            solutions: [...current, ""],
                          })
                        }}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-xs h-7 px-3 rounded-xl border border-blue-500/30 cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Solution
                      </Button>
                    </div>
                  </div>

                  {showBulkSolutions ? (
                    <Textarea
                      rows={3}
                      value={bulkSolutionsText}
                      onChange={(e) => {
                        setBulkSolutionsText(e.target.value)
                        const lines = e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                        setIsEditingProject({
                          ...isEditingProject,
                          solutions: lines,
                        })
                      }}
                      placeholder={`Implemented Redux Toolkit state sync with Socket.io web sockets\nOptimized query indexing and Redis caching layer`}
                      className="bg-[#141414] border border-[#2a2a2a] focus:border-blue-500 text-white text-xs rounded-2xl p-3.5 leading-relaxed"
                    />
                  ) : (
                    <div className="space-y-2">
                      {(!isEditingProject.solutions ||
                      (Array.isArray(isEditingProject.solutions) && isEditingProject.solutions.length === 0)) ? (
                        <div className="text-xs text-gray-500 italic bg-[#141414] p-3 rounded-2xl text-center border border-[#2a2a2a]">
                          No solutions added yet. Click "+ Add Solution" above.
                        </div>
                      ) : (
                        (Array.isArray(isEditingProject.solutions)
                          ? isEditingProject.solutions
                          : typeof isEditingProject.solutions === "string"
                          ? (isEditingProject.solutions as string).split("\n").filter(Boolean)
                          : [""]
                        ).map((solution, idx, arr) => (
                          <div
                            key={idx}
                            draggable
                            onDragStart={(e) => handleSolutionDragStart(e, idx)}
                            onDragOver={(e) => handleSolutionDragOver(e, idx)}
                            onDragEnd={handleSolutionDragEnd}
                            className={`flex items-center gap-2 bg-[#141414] border p-1.5 px-3 rounded-2xl transition-all select-none ${
                              draggedSolutionIndex === idx
                                ? "border-blue-500 bg-[#19232c] opacity-70 scale-[0.98] shadow-lg shadow-blue-500/10"
                                : "border-[#2a2a2a] hover:border-[#383838]"
                            }`}
                          >
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-blue-400 shrink-0"
                              title="Click and drag up/down to reorder solutions"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <span className="w-5 text-center text-xs font-mono text-blue-400 font-bold shrink-0">
                              {idx + 1}.
                            </span>

                            <Input
                              value={solution}
                              onChange={(e) => {
                                const current = [...arr]
                                current[idx] = e.target.value
                                setIsEditingProject({
                                  ...isEditingProject,
                                  solutions: current,
                                })
                              }}
                              placeholder={`Solution #${idx + 1}`}
                              className="bg-[#191919] border border-[#2a2a2a] focus:border-blue-500 text-white text-xs rounded-xl h-9 px-3 flex-1"
                            />

                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveSolution(idx, idx - 1)}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => moveSolution(idx, idx + 1)}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const current = arr.filter((_, i) => i !== idx)
                                  setIsEditingProject({
                                    ...isEditingProject,
                                    solutions: current,
                                  })
                                }}
                                className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer transition-colors ml-1"
                                title="Remove solution item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* System Architecture & Tech Design - Visual Categorized Pipeline Matrix Layout */}
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-5 space-y-4 shadow-xl">
                  {/* Header & Mode Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#242424]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 tracking-wide">
                          System Architecture Pipeline Matrix
                        </h4>
                        <p className="text-[10px] text-gray-400">Categorized Tech Stack Builder</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setArchViewMode(archViewMode === "gui" ? "code" : "gui")}
                      className="text-[10px] text-purple-300 hover:text-purple-200 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl transition-all font-mono cursor-pointer self-start sm:self-auto"
                    >
                      {archViewMode === "gui" ? "Switch to Multiline Editor" : "Switch to Pipeline Matrix"}
                    </button>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    <span className="text-gray-500 font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Wand2 className="w-3 h-3 text-purple-400" /> Presets:
                    </span>
                    {[
                      {
                        name: "MERN Stack",
                        text: `Frontend & UI: React, TypeScript, Redux, Tailwind CSS\nBackend & API: Node.js, Express, JWT Auth\nDatabase & Cache: MongoDB, Mongoose, Redis\nDevOps & Cloud: Vercel, Render, Docker`,
                      },
                      {
                        name: "Next.js + Supabase",
                        text: `Frontend & UI: Next.js 14, TypeScript, Tailwind CSS, Framer Motion\nBackend & API: Next.js Server Actions, REST API\nDatabase & Cache: Supabase PostgreSQL, RLS, Realtime\nDevOps & Cloud: Vercel, GitHub Actions`,
                      },
                      {
                        name: "Microservices Architecture",
                        text: `Frontend & UI: React, Next.js, Tailwind\nBackend & API: Express Gateway, gRPC Microservices\nDatabase & Cache: PostgreSQL, Prisma, Redis Pub/Sub\nDevOps & Cloud: Docker, Kubernetes, AWS, NGINX`,
                      },
                    ].map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() =>
                          setIsEditingProject({
                            ...isEditingProject,
                            architecture: tmpl.text,
                          })
                        }
                        className="bg-[#1a1a1a] hover:bg-purple-500/10 text-gray-300 hover:text-purple-300 border border-[#2a2a2a] hover:border-purple-500/30 px-2.5 py-1 rounded-xl shrink-0 transition-all font-mono cursor-pointer"
                      >
                        + {tmpl.name}
                      </button>
                    ))}
                  </div>

                  {archViewMode === "gui" ? (
                    /* Pipeline Matrix Cards Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {(() => {
                        const categories = [
                          { key: "Frontend & UI", label: "Frontend & UI", color: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400" },
                          { key: "Backend & API", label: "Backend & API", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" },
                          { key: "Database & Cache", label: "Database & Cache", color: "border-amber-500/30 bg-amber-500/5 text-amber-400" },
                          { key: "DevOps & Cloud", label: "DevOps & Cloud", color: "border-purple-500/30 bg-purple-500/5 text-purple-400" },
                        ]

                        const archText = isEditingProject.architecture || ""
                        const lines = archText.split("\n").filter((l) => l.trim().length > 0)
                        
                        // Map lines into categories
                        const catMap: { [key: string]: string[] } = {
                          "Frontend & UI": [],
                          "Backend & API": [],
                          "Database & Cache": [],
                          "DevOps & Cloud": [],
                        }

                        lines.forEach((line) => {
                          const colonIdx = line.indexOf(":")
                          if (colonIdx !== -1) {
                            const catName = line.slice(0, colonIdx).trim()
                            const techs = line.slice(colonIdx + 1).split(",").map((t) => t.trim()).filter(Boolean)
                            if (catMap[catName]) {
                              catMap[catName] = [...catMap[catName], ...techs]
                            } else {
                              // Match keyword
                              const lCat = catName.toLowerCase()
                              if (lCat.includes("front") || lCat.includes("ui")) catMap["Frontend & UI"].push(...techs)
                              else if (lCat.includes("back") || lCat.includes("api") || lCat.includes("server")) catMap["Backend & API"].push(...techs)
                              else if (lCat.includes("db") || lCat.includes("data") || lCat.includes("cache")) catMap["Database & Cache"].push(...techs)
                              else if (lCat.includes("cloud") || lCat.includes("devops") || lCat.includes("host")) catMap["DevOps & Cloud"].push(...techs)
                              else catMap[catName] = techs
                            }
                          }
                        })

                        const updateCategoryTechs = (catKey: string, newTechs: string[]) => {
                          catMap[catKey] = newTechs
                          const outputLines: string[] = []
                          Object.entries(catMap).forEach(([cName, tArr]) => {
                            if (tArr.length > 0) {
                              outputLines.push(`${cName}: ${tArr.join(", ")}`)
                            }
                          })
                          setIsEditingProject({
                            ...isEditingProject,
                            architecture: outputLines.join("\n"),
                          })
                        }

                        return categories.map((cat) => {
                          const techList = catMap[cat.key] || []
                          return (
                            <div
                              key={cat.key}
                              className={`p-3.5 rounded-2xl border ${cat.color} space-y-2.5 shadow-md flex flex-col justify-between`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold uppercase tracking-wider">
                                    {cat.label}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateCategoryTechs(cat.key, [...techList, "New Tech"])}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                                  >
                                    + Add Tech
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  {techList.length === 0 ? (
                                    <span className="text-[10px] text-gray-500 italic">No tech added yet</span>
                                  ) : (
                                    techList.map((t, tIdx) => (
                                      <div
                                        key={tIdx}
                                        className="flex items-center gap-1 bg-[#121212] border border-[#2a2a2a] px-2 py-1 rounded-xl text-xs"
                                      >
                                        <input
                                          value={t}
                                          onChange={(e) => {
                                            const updated = [...techList]
                                            updated[tIdx] = e.target.value
                                            updateCategoryTechs(cat.key, updated)
                                          }}
                                          className="bg-transparent border-none focus:outline-none text-white text-[11px] font-mono w-24"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = techList.filter((_, i) => i !== tIdx)
                                            updateCategoryTechs(cat.key, updated)
                                          }}
                                          className="text-gray-500 hover:text-red-400 text-[10px] cursor-pointer"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  ) : (
                    /* Multiline Text Editor Mode */
                    <div className="space-y-2 pt-1">
                      <Textarea
                        rows={5}
                        value={isEditingProject.architecture || ""}
                        onChange={(e) =>
                          setIsEditingProject({ ...isEditingProject, architecture: e.target.value })
                        }
                        placeholder={`Frontend & UI: React, Next.js, Tailwind CSS\nBackend & API: Node.js, Express, Socket.io\nDatabase & Cache: PostgreSQL, Supabase, Redis\nDevOps & Cloud: Vercel, Docker, GitHub Actions`}
                        className="bg-[#0c0c0c] border border-[#262626] focus:border-purple-500 text-purple-300 text-xs rounded-2xl p-4 leading-relaxed font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Measurable Results & Business Impact */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Measurable Results & Business Impact
                  </label>
                  <Input
                    value={isEditingProject.results || ""}
                    onChange={(e) =>
                      setIsEditingProject({ ...isEditingProject, results: e.target.value })
                    }
                    placeholder="e.g. Improved course completion rate by 42% and reduced admin overhead"
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl h-11 px-4"
                  />
                </div>
              </div>

              <SheetFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSheet(false)}
                  className="bg-[#252525] border-none hover:bg-[#303030] text-gray-300 text-xs font-bold rounded-2xl h-12 px-5 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs rounded-2xl h-12 px-7 border-none cursor-pointer shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <span>Save Project Settings</span>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        )}
      </Sheet>

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

