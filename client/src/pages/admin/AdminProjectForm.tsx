import { useState, useEffect } from "react"
import { useNavigate, useParams, useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Globe,
  Github,
  Image as ImageIcon,
  X,
  Star,
  CheckCircle2,
} from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import {
  apiClient,
  isApiConfigured,
  uploadImage,
  uploadImages,
} from "@/lib/api"
import type { Project } from "@/types/api"
import { useQueryClient } from "@tanstack/react-query"
import { useProjectsQuery, QUERY_KEYS } from "@/hooks/usePortfolioQueries"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

const CATEGORY_OPTIONS = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "AI / ML",
  "Cloud / DevOps",
  "Open Source",
]

const QUICK_TAG_PRESETS = [
  "React",
  "Golang",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Supabase",
  "NestJS",
  "Python",
  "FastAPI",
  "GraphQL",
  "Redis",
  "Vue.js",
  "React Native",
  "Laravel",
]

export default function AdminProjectForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const context = useOutletContext<AdminContext>()
  const loadHeaderData = context?.loadHeaderData || (() => {})
  const queryClient = useQueryClient()
  const { data: dbProjects } = useProjectsQuery()

  const isEditing = Boolean(id)

  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [newTagInput, setNewTagInput] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")

  // Form State
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    tags: [],
    github: "",
    live: "",
    image: "",
    images: [],
    category: "Full Stack",
    featured: true,
    features: [""],
    challenges: [""],
    solutions: [""],
    architecture: "",
    results: "",
  })

  const [showBulkFeatures, setShowBulkFeatures] = useState(false)
  const [bulkFeaturesText, setBulkFeaturesText] = useState("")

  const parseToArray = (val: any): string[] => {
    if (Array.isArray(val)) return val
    if (typeof val === "string") {
      const lines = val.split("\n").map((s) => s.trim()).filter(Boolean)
      return lines.length > 0 ? lines : []
    }
    return []
  }

  // Load project for editing
  useEffect(() => {
    if (!isEditing || !id) {
      setLoading(false)
      return
    }

    const loadProject = async () => {
      let targetProj: Project | undefined = dbProjects?.find((p) => p.id === id)

      if (!targetProj && isApiConfigured && !id.startsWith("demo")) {
        try {
          const { data, error } = await apiClient
            .from("projects")
            .select("*")
            .eq("id", id)
            .single()
          if (!error && data) {
            targetProj = data as Project
          }
        } catch (err) {
          console.error("Failed to load project from API:", err)
        }
      }

      if (targetProj) {
        const rawFeatures = parseToArray(targetProj.features)
        const rawChallenges = parseToArray(targetProj.challenges)
        const rawSolutions = parseToArray(targetProj.solutions)

        let rawImages: string[] = []
        if (Array.isArray(targetProj.images) && targetProj.images.length > 0) {
          rawImages = targetProj.images.filter(Boolean)
        } else if (typeof targetProj.images === "string" && (targetProj.images as string).trim().length > 0) {
          try {
            const parsed = JSON.parse(targetProj.images as string)
            if (Array.isArray(parsed)) rawImages = parsed.filter(Boolean)
            else rawImages = (targetProj.images as string).split(",").map((s) => s.trim()).filter(Boolean)
          } catch {
            rawImages = (targetProj.images as string).split(",").map((s) => s.trim()).filter(Boolean)
          }
        }

        if (targetProj.image && !rawImages.includes(targetProj.image)) {
          rawImages.unshift(targetProj.image)
        }

        if (targetProj.id) {
          try {
            const savedLocal = localStorage.getItem(`portfolio_project_images_${targetProj.id}`)
            if (savedLocal) {
              const parsedLocal = JSON.parse(savedLocal)
              if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
                rawImages = Array.from(new Set([...rawImages, ...parsedLocal])).filter(Boolean)
              }
            }
          } catch (e) { }
        }

        setProject({
          ...targetProj,
          image: targetProj.image || rawImages[0] || "",
          images: rawImages,
          tags: Array.isArray(targetProj.tags) ? targetProj.tags : [],
          features: rawFeatures.length > 0 ? rawFeatures : [""],
          challenges: rawChallenges.length > 0 ? rawChallenges : [""],
          solutions: rawSolutions.length > 0 ? rawSolutions : [""],
          architecture: typeof targetProj.architecture === "string" ? targetProj.architecture : "",
        })

        setBulkFeaturesText(rawFeatures.join("\n"))
      } else {
        toast.error("Project not found.")
        navigate("/admin/projects")
      }
      setLoading(false)
    }

    loadProject()
  }, [id, isEditing, dbProjects, navigate])

  // Cover Image Upload Handler (Uploads single cover banner)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const toastId = toast.loading("Uploading cover image...")
    try {
      const res = await uploadImage(file, "portfolio-images", "projects")
      if (res.success && res.url) {
        const newUrl = res.url as string
        setProject((prev) => {
          const currentImages = prev.images || (prev.image ? [prev.image] : [])
          const updatedImages = Array.from(new Set([newUrl, ...currentImages])).filter(Boolean)
          return {
            ...prev,
            image: newUrl,
            images: updatedImages,
          }
        })
        toast.success("Cover image uploaded and set!", { id: toastId })
      } else {
        toast.error(res.error || "Failed to upload cover image.", { id: toastId })
      }
    } catch (err: any) {
      toast.error("Failed to upload image: " + err.message, { id: toastId })
    } finally {
      e.target.value = ""
    }
  }

  // Gallery Images Upload Handler (Supports Multiple Files at Once)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const toastId = toast.loading(`Uploading ${files.length} image(s)...`)
    try {
      const res = await uploadImages(files, "portfolio-images", "projects")
      if (res.success && res.urls && res.urls.length > 0) {
        setProject((prev) => {
          const currentImages = prev.images || (prev.image ? [prev.image] : [])
          const combined = Array.from(new Set([...currentImages, ...res.urls])).filter(Boolean)
          return {
            ...prev,
            image: prev.image || combined[0] || "",
            images: combined,
          }
        })
        toast.success(`Uploaded and added ${res.urls.length} image(s) to gallery!`, { id: toastId })
      } else {
        toast.error(res.error || "Failed to upload images. Please check your network and try again.", { id: toastId })
      }
    } catch (err: any) {
      toast.error("Gallery upload failed: " + err.message, { id: toastId })
    } finally {
      e.target.value = ""
    }
  }

  // Add Direct Image URL to Gallery
  const addImageUrl = () => {
    const trimmed = newImageUrl.trim()
    if (!trimmed) return
    setProject((prev) => {
      const current = prev.images || (prev.image ? [prev.image] : [])
      if (current.includes(trimmed)) return prev
      const updated = Array.from(new Set([...current, trimmed])).filter(Boolean)
      return {
        ...prev,
        image: prev.image || trimmed,
        images: updated,
      }
    })
    setNewImageUrl("")
    toast.success("Image URL added to project gallery!")
  }

  // Remove Image from Gallery
  const removeImageFromGallery = (urlToRemove: string) => {
    setProject((prev) => {
      const remaining = (prev.images || []).filter((u) => u !== urlToRemove)
      const newCover = prev.image === urlToRemove ? remaining[0] || "" : prev.image
      return {
        ...prev,
        image: newCover,
        images: remaining,
      }
    })
    toast.success("Image removed from project gallery.")
  }

  // Tag Handlers
  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    if (project.tags.includes(trimmed)) return
    setProject((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }))
    setNewTagInput("")
  }

  const removeTag = (tag: string) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  // Dynamic Array Field Handlers
  const addFeature = () => {
    setProject((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }))
  }

  const updateFeature = (index: number, val: string) => {
    const updated = [...(project.features || [])]
    updated[index] = val
    setProject({ ...project, features: updated })
  }

  const removeFeature = (index: number) => {
    const updated = (project.features || []).filter((_, i) => i !== index)
    setProject({ ...project, features: updated })
  }

  // Persist through the authenticated portfolio API.
  const saveProjectToApi = async (projPayload: Project, isUpdate: boolean) => {
    const { id: projId, created_at, ...dataToSave } = projPayload

    if (projId) {
      try {
        localStorage.setItem(`portfolio_project_images_${projId}`, JSON.stringify(projPayload.images || []))
      } catch (e) { }
    }

    if (isUpdate && projId && !projId.startsWith("demo")) {
      const { error } = await apiClient.from("projects").update(dataToSave).eq("id", projId)
      if (!error) return { success: true, id: projId }

      console.warn("API update notice:", error.message)

      // Fallback update without images column if backend schema lacked it
      const { images, ...payloadNoImages } = dataToSave
      const { error: err2 } = await apiClient.from("projects").update(payloadNoImages).eq("id", projId)
      if (err2) throw new Error(err2.message)
      return { success: true, id: projId }
    } else {
      const { data, error } = await apiClient.from("projects").insert([dataToSave]).select().single()
      if (!error && data) return { success: true, id: data.id }

      console.warn("API insert notice:", error?.message)

      // Fallback insert without images column
      const { images, ...payloadNoImages } = dataToSave
      const { data: d2, error: err2 } = await apiClient.from("projects").insert([payloadNoImages]).select().single()
      if (err2) throw new Error(err2.message)
      return { success: true, id: d2?.id }
    }
  }

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!project.title.trim()) {
      toast.error("Please enter a project title.")
      return
    }

    if (!project.description.trim()) {
      toast.error("Please enter a project description.")
      return
    }

    setIsSaving(true)
    const isNew = !isEditing
    const toastId = toast.loading(isNew ? "Saving project..." : "Updating project...")

    try {
      const cleanFeatures = (project.features || [])
        .map((f) => (typeof f === "string" ? f.trim() : f))
        .filter(Boolean)

      const rawChallenges = parseToArray(project.challenges)
      const cleanChallenges = rawChallenges
        .map((c) => (typeof c === "string" ? c.trim() : c))
        .filter(Boolean)

      const rawSolutions = parseToArray(project.solutions)
      const cleanSolutions = rawSolutions
        .map((s) => (typeof s === "string" ? s.trim() : s))
        .filter(Boolean)

      const cleanImages = (project.images || []).map((img) => (typeof img === "string" ? img.trim() : img)).filter(Boolean)
      
      if (project.image && !cleanImages.includes(project.image.trim())) {
        cleanImages.unshift(project.image.trim())
      }

      const primaryCover = project.image || cleanImages[0] || ""

      const updatedProject: Project = {
        ...project,
        title: project.title.trim(),
        description: project.description.trim(),
        image: primaryCover,
        images: cleanImages,
        features: cleanFeatures,
        challenges: cleanChallenges,
        solutions: cleanSolutions,
      }

      if (isApiConfigured) {
        const savedRes = await saveProjectToApi(updatedProject, isEditing)
        if (savedRes?.id) {
          updatedProject.id = savedRes.id
          try {
            localStorage.setItem(`portfolio_project_images_${savedRes.id}`, JSON.stringify(cleanImages))
          } catch (e) { }
        }
      } else if (updatedProject.id) {
        try {
          localStorage.setItem(`portfolio_project_images_${updatedProject.id}`, JSON.stringify(cleanImages))
        } catch (e) { }
      }

      queryClient.setQueryData(QUERY_KEYS.projects, (old: Project[] | undefined) => {
        if (!old) return [updatedProject]
        const exists = old.some((p) => p.id === updatedProject.id)
        if (exists) {
          return old.map((p) => (p.id === updatedProject.id ? updatedProject : p))
        }
        return [updatedProject, ...old]
      })

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects })
      toast.success(isNew ? "Project created successfully!" : "Project updated successfully!", { id: toastId })
      loadHeaderData()
      navigate("/admin/projects")
    } catch (err: any) {
      console.error("Save project error:", err)
      toast.error(err?.message || "Failed to save project. Please try again.", { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-7 w-7 border-2 border-emerald-500 border-t-transparent" />
        <p className="text-xs text-zinc-500">Loading project...</p>
      </div>
    )
  }

  const galleryList = Array.from(
    new Set([
      ...(project.image ? [project.image] : []),
      ...(project.images || []),
    ])
  ).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-10 pb-20"
    >
      {/* Single Sticky Action Top Header */}
      <div className="sticky top-20 z-40 bg-[#121215]/95 backdrop-blur-xl border border-zinc-800/80 px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            title="Back to Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {isEditing ? "Edit Project" : "New Project"}
            </h1>
            <p className="text-[11px] text-zinc-400">
              {isEditing ? "Update project details and gallery" : "Create a new portfolio showcase"}
            </p>
          </div>
        </div>

        {/* ONLY ONE SET OF ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/projects")}
            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl h-9 px-5 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Save Changes" : "Publish Project"}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Clean Minimalist Form */}
      <form onSubmit={handleSubmit} className="space-y-10 text-xs">
        {/* Section 1: Overview */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800/60 pb-2">
            Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block font-medium text-zinc-300 mb-1.5">
                Project Title <span className="text-emerald-400">*</span>
              </label>
              <Input
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                placeholder="e.g. Antigravity AI Engine"
                required
                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-sm rounded-xl h-11 px-4"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1.5">Category</label>
              <Select
                value={project.category || "Full Stack"}
                onValueChange={(val) => setProject({ ...project, category: val })}
              >
                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl h-11 px-3.5">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/80 rounded-xl">
              <div>
                <label className="font-semibold text-white block flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> Featured Showcase
                </label>
                <p className="text-[10px] text-zinc-500">Showcase on home page</p>
              </div>
              <Switch
                checked={project.featured}
                onCheckedChange={(checked) =>
                  setProject({ ...project, featured: checked })
                }
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Short Description <span className="text-emerald-400">*</span>
            </label>
            <Textarea
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              placeholder="Brief description of the project and core goals..."
              required
              rows={3}
              className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl p-3.5 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Multiple Images & Gallery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Multiple Images & Gallery ({galleryList.length} total)
            </h2>
            <span className="text-[11px] text-emerald-400 font-mono">
              Multiple Screenshots Supported
            </span>
          </div>

          {/* Add Image URL Input & File Upload Button */}
          <div className="space-y-4 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block font-semibold text-zinc-200">
                Add Screenshots & Images to Gallery
              </label>
              <span className="text-[11px] text-zinc-400">
                Cloudinary Optimized
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addImageUrl()
                  }
                }}
                placeholder="Paste Image URL (https://...)..."
                className="bg-zinc-900/70 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl h-10 px-3.5 flex-1"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  onClick={addImageUrl}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl h-10 px-4 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add URL
                </Button>
                <label className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-4 h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Multiple Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
                <label className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/80 text-xs font-semibold px-3.5 h-10 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0" title="Upload and set primary cover directly">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cover Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Tip: You can select multiple images from your computer at once. The first or designated photo serves as the primary showcase banner.
            </p>
          </div>

          {/* Gallery Thumbnails Grid */}
          <div className="space-y-3">
            <label className="font-semibold text-zinc-300 block">
              Project Gallery ({galleryList.length} images)
            </label>

            {galleryList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryList.map((imgUrl, idx) => {
                  const isPrimaryCover = project.image === imgUrl || (idx === 0 && !project.image)
                  return (
                    <div
                      key={idx}
                      className={`relative group aspect-video rounded-2xl overflow-hidden border ${
                        isPrimaryCover
                          ? "border-emerald-500 ring-2 ring-emerald-500/20"
                          : "border-zinc-800"
                      } bg-black/60 shadow-lg`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Primary Cover Badge */}
                      {isPrimaryCover && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> COVER
                        </div>
                      )}

                      {/* Hover Overlay Action Controls */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {!isPrimaryCover && (
                          <button
                            type="button"
                            onClick={() => {
                              setProject((prev) => ({ ...prev, image: imgUrl }))
                              toast.success("Set as primary cover banner!")
                            }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-md"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImageFromGallery(imgUrl)}
                          className="bg-red-500/80 hover:bg-red-500 text-white text-[10px] font-bold p-2 rounded-xl cursor-pointer transition-colors shadow-md flex items-center gap-1"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/80 text-center">
                No images added yet. Upload files or paste image URLs above to showcase multiple project screenshots.
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Links */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800/60 pb-2">
            Links & Repositories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Live Demo URL
              </label>
              <Input
                value={project.live || ""}
                onChange={(e) => setProject({ ...project, live: e.target.value })}
                placeholder="https://app.vercel.app"
                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl h-10 px-3.5"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-zinc-300" /> GitHub Repo URL
              </label>
              <Input
                value={project.github || ""}
                onChange={(e) => setProject({ ...project, github: e.target.value })}
                placeholder="https://github.com/user/repo"
                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl h-10 px-3.5"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Tech Stack Tags */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800/60 pb-2">
            Technologies ({project.tags.length})
          </h2>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 min-h-[42px] bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/80 items-center">
              {project.tags.length === 0 && (
                <span className="text-zinc-500 italic">No tags added yet.</span>
              )}
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-emerald-400/60 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(newTagInput)
                  }
                }}
                placeholder="Add technology (e.g. Golang)..."
                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl h-10 px-3.5"
              />
              <Button
                type="button"
                onClick={() => addTag(newTagInput)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl h-10 px-4 shrink-0"
              >
                Add Tag
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_TAG_PRESETS.map((preset) => {
                const isSelected = project.tags.includes(preset)
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => (isSelected ? removeTag(preset) : addTag(preset))}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                        : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {preset}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Key Features */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Key Features List
            </h2>
            <button
              type="button"
              onClick={() => setShowBulkFeatures(!showBulkFeatures)}
              className="text-[11px] text-emerald-400 hover:underline font-medium cursor-pointer"
            >
              {showBulkFeatures ? "Itemized Mode" : "Bulk Paste Mode"}
            </button>
          </div>

          {showBulkFeatures ? (
            <Textarea
              value={bulkFeaturesText}
              onChange={(e) => {
                setBulkFeaturesText(e.target.value)
                const lines = e.target.value.split("\n").filter(Boolean)
                setProject({ ...project, features: lines })
              }}
              placeholder="One feature per line..."
              rows={4}
              className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl p-3.5"
            />
          ) : (
            <div className="space-y-2.5">
              {(project.features || []).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-zinc-500">{idx + 1}.</span>
                  <Input
                    value={feat}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder={`Feature #${idx + 1}`}
                    className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl h-10 px-3.5 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addFeature}
                className="w-full bg-zinc-900/30 border border-dashed border-zinc-800 hover:border-emerald-500/40 text-zinc-300 text-xs font-medium rounded-xl h-9 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add Feature Item
              </Button>
            </div>
          )}
        </div>

        {/* Section 6: Architecture */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800/60 pb-2">
            System Architecture Flow
          </h2>

          <Textarea
            value={project.architecture || ""}
            onChange={(e) => setProject({ ...project, architecture: e.target.value })}
            placeholder={`React -> Node.js -> PostgreSQL`}
            rows={3}
            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500 text-white text-xs rounded-xl p-3.5 font-mono"
          />

          {project.architecture && (
            <div className="flex flex-wrap items-center gap-2 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800">
              {project.architecture.split(/->|→/).map((node, nIdx, arr) => (
                <div key={nIdx} className="flex items-center gap-2">
                  <div className="bg-zinc-900 border border-zinc-700 text-emerald-300 text-xs font-mono px-3 py-1 rounded-lg">
                    {node.trim()}
                  </div>
                  {nIdx < arr.length - 1 && (
                    <span className="text-emerald-400 font-bold text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </motion.div>
  )
}
