import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Globe, Plus, Edit, Trash2, ExternalLink, Github, Upload, Image as ImageIcon } from "lucide-react"

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

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminProjects() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [isEditingProject, setIsEditingProject] = useState<Project | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  // Delete Alert Dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id?: string
    title?: string
    isLoading: boolean
    isError: boolean
    errorMessage?: string
  }>({ open: false, isLoading: false, isError: false })

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error("Error loading projects:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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

    if (isSupabaseConfigured) {
      if (isEditingProject.id && !isEditingProject.id.startsWith("demo")) {
        await supabase.from("projects").update(isEditingProject).eq("id", isEditingProject.id)
      } else {
        const { id, ...newProj } = isEditingProject
        await supabase.from("projects").insert([newProj])
      }
    }

    if (isEditingProject.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === isEditingProject.id ? isEditingProject : p))
      )
    } else {
      const newProj = { ...isEditingProject, id: Date.now().toString() }
      setProjects((prev) => [...prev, newProj])
    }

    setShowSheet(false)
    setIsEditingProject(null)
    triggerToast("Project saved successfully!")
    loadHeaderData()
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
    try {
      if (isSupabaseConfigured && !deleteDialog.id.startsWith("demo")) {
        const { error } = await supabase.from("projects").delete().eq("id", deleteDialog.id)
        if (error) throw new Error(error.message)
      }
      setProjects((prev) => prev.filter((p) => p.id !== deleteDialog.id))
      triggerToast("Project deleted successfully.")
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: any) {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects Manager</h2>
          <p className="text-xs text-gray-400 mt-1">
            Add, edit, and organize portfolio showcase projects
          </p>
        </div>
        <Button
          onClick={() => {
            setIsEditingProject({
              title: "",
              description: "",
              tags: [],
              github: "",
              live: "",
              image: "",
              category: "Full Stack",
              featured: true,
            })
            setShowSheet(true)
          }}
          className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-xs cursor-pointer shadow-md shadow-green-500/20"
        >
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-[#202020] border-none rounded-3xl overflow-hidden space-y-3 flex flex-col justify-between shadow-2xl"
          >
            {/* Project Image Banner */}
            <div className="relative h-48 bg-[#181818] overflow-hidden flex items-center justify-center border-none">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImageIcon className="w-9 h-9 opacity-40 text-green-500" />
                  <span className="text-[11px] font-semibold">No Image Provided</span>
                </div>
              )}

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] uppercase font-extrabold text-green-400 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border-none">
                  {p.category || "Project"}
                </span>
                {p.featured && (
                  <span className="text-[10px] font-extrabold text-slate-950 bg-green-500 px-2.5 py-0.5 rounded-full shadow-md">
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 pt-2 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-white">{p.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#161616] text-gray-300 px-2.5 py-1 rounded-lg border-none"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Case Study Snippets */}
                {((p.features && p.features.length > 0) || p.results) && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px]">
                    {p.features && p.features.length > 0 && (
                      <span className="bg-[#161616] text-green-400 font-semibold px-2.5 py-1 rounded-lg">
                        ⚡ {p.features.length} Features Defined
                      </span>
                    )}
                    {p.results && (
                      <span className="bg-[#161616] text-blue-400 font-semibold px-2.5 py-1 rounded-lg truncate max-w-[220px]">
                        📈 {p.results}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-none mt-4">
                <div className="flex items-center gap-2 text-gray-400">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-[#161616] hover:text-white hover:bg-[#282828] transition-colors"
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
                      className="p-2.5 rounded-xl bg-[#161616] hover:text-white hover:bg-[#282828] transition-colors"
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
                    onClick={() => {
                      setIsEditingProject(p)
                      setShowSheet(true)
                    }}
                    className="bg-[#161616] border-none hover:bg-[#282828] text-gray-300 text-xs rounded-xl px-4 py-2 cursor-pointer font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => promptDeleteProject(p)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none text-xs rounded-xl px-3.5 py-2 cursor-pointer font-semibold"
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
          <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#191919] p-6 sm:p-8 border-l border-[#282828]">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
                {isEditingProject.id ? "Edit Project Details" : "Create New Project"}
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-400">
                Update project title, description, cover media, tech stack, and external links below.
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSaveProject} className="space-y-6 pt-4">
              {/* Cover Image Upload Section */}
              <div className="bg-[#202020] border-none p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Project Cover Image
                  </label>
                  <span className="text-[11px] text-gray-500">Device Upload or Direct Web URL</span>
                </div>

                <div className="h-44 w-full rounded-2xl bg-[#161616] border border-[#333] overflow-hidden flex items-center justify-center relative shadow-inner">
                  {isEditingProject.image ? (
                    <img
                      src={isEditingProject.image}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ImageIcon className="w-9 h-9 opacity-40 text-green-500" />
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
                    className="w-full bg-[#262626] hover:bg-[#323232] text-gray-200 text-xs font-bold rounded-2xl h-11 border-none flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4 text-green-500" /> Upload Local Image
                  </Button>

                  {isEditingProject.image ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditingProject({ ...isEditingProject, image: "" })}
                      className="w-full h-11 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-2xl border-none cursor-pointer"
                    >
                      Remove Image
                    </Button>
                  ) : (
                    <span className="text-[11px] text-gray-500 self-center text-center">
                      Select a file from computer/phone
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">Image URL Address</label>
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

              {/* Case Study & Architecture Details (Landing Page) */}
              <div className="bg-[#202020] border-none p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Detailed Case Study & Architecture
                  </h3>
                  <span className="text-[11px] text-green-400 font-semibold">Landing Page Showcase</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Key Features (One per line)
                  </label>
                  <Textarea
                    rows={3}
                    value={isEditingProject.features?.join("\n") || ""}
                    onChange={(e) =>
                      setIsEditingProject({
                        ...isEditingProject,
                        features: e.target.value.split("\n").filter((f) => f.trim().length > 0),
                      })
                    }
                    placeholder={`Course creation and enrollment\nInteractive quizzes and assessments\nReal-time notifications`}
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl p-3.5 leading-relaxed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Engineering Challenges
                  </label>
                  <Textarea
                    rows={2}
                    value={isEditingProject.challenges || ""}
                    onChange={(e) =>
                      setIsEditingProject({ ...isEditingProject, challenges: e.target.value })
                    }
                    placeholder="e.g. Ensuring real-time progress tracking and scalability for high traffic..."
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl p-3.5 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Technical Solutions & Architecture
                  </label>
                  <Textarea
                    rows={2}
                    value={isEditingProject.solutions || ""}
                    onChange={(e) =>
                      setIsEditingProject({ ...isEditingProject, solutions: e.target.value })
                    }
                    placeholder="e.g. Implemented Redux Toolkit state sync with Socket.io web sockets and MongoDB indexing..."
                    className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-2xl p-3.5 leading-relaxed"
                  />
                </div>

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
                  className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs rounded-2xl h-12 px-7 border-none cursor-pointer shadow-lg shadow-green-500/20"
                >
                  Save Project Settings
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

