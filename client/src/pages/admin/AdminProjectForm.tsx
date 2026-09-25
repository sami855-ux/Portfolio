import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, useOutletContext, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
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
  Zap,
  AlertTriangle,
  Lightbulb,
  Cpu,
  TrendingUp,
  ListPlus,
  Sparkles,
  Move,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
  Layers,
  FileText,
  ChevronRight,
  ChevronLeft,
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

/**
 * Parses raw text containing bullet points, numbered lists, dashes, or multi-line text
 * and returns clean, trimmed strings ready to fill into individual input fields.
 */
export function parseBulletPoints(text: string): string[] {
  if (!text) return []

  const lines = text.split(/\r?\n/)
  const result: string[] = []

  for (let rawLine of lines) {
    let line = rawLine.trim()
    if (!line) continue

    // Ignore comment-only lines if any
    if (line.startsWith("#") || line.startsWith("//")) continue

    // Strip common bullet prefixes:
    // e.g. "• ", "- ", "* ", "+ ", "⁃ ", "‣ ", "▪ ", "▫ ", "◦ ", "⦿ ", "→ ", "➢ ", "✔ ", "✓ "
    // or numbered: "1. ", "1) ", "1 - ", "1: ", "(1) ", "[1] "
    // or markdown task checkboxes: "- [ ] ", "- [x] ", "* [ ] "
    line = line.replace(
      /^(\s*(\d+[\.\)\:\-]\s*|\(\d+\)\s*|\[\d+\]\s*|[\-\*\+\•\⁃\‣\▪\▫\◦\⦿\→\➢\✔\✓]\s*|\[[ xX]?\]\s*))+/,
      ""
    ).trim()

    // Strip surrounding quotes if whole line is quoted
    if (
      (line.startsWith('"') && line.endsWith('"') && line.length >= 2) ||
      (line.startsWith("'") && line.endsWith("'") && line.length >= 2)
    ) {
      line = line.slice(1, -1).trim()
    }

    if (line) {
      result.push(line)
    }
  }

  return result
}

export type ProjectTab = "general" | "media" | "casestudy" | "architecture"

export default function AdminProjectForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get("tab") as ProjectTab | null
  const [activeTab, setActiveTab] = useState<ProjectTab>(
    tabParam && ["general", "media", "casestudy", "architecture"].includes(tabParam)
      ? tabParam
      : "general"
  )

  const handleTabChange = (newTab: ProjectTab) => {
    setActiveTab(newTab)
    setSearchParams(
      (prev) => {
        const updated = new URLSearchParams(prev)
        updated.set("tab", newTab)
        return updated
      },
      { replace: true }
    )
  }

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
    image_position: "50% 50%",
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

  const [showBulkChallenges, setShowBulkChallenges] = useState(false)
  const [bulkChallengesText, setBulkChallengesText] = useState("")

  const [showBulkSolutions, setShowBulkSolutions] = useState(false)
  const [bulkSolutionsText, setBulkSolutionsText] = useState("")

  // Bullet Points Paste States for the 3 dynamic list sections
  const [showBulletPasteFeatures, setShowBulletPasteFeatures] = useState(false)
  const [bulletInputFeatures, setBulletInputFeatures] = useState("")

  const [showBulletPasteChallenges, setShowBulletPasteChallenges] = useState(false)
  const [bulletInputChallenges, setBulletInputChallenges] = useState("")

  const [showBulletPasteSolutions, setShowBulletPasteSolutions] = useState(false)
  const [bulletInputSolutions, setBulletInputSolutions] = useState("")

  // Cover Image Placement & Drag Repositioning States (Upwork style)
  const [showCardOverlay, setShowCardOverlay] = useState(false)
  const dragContainerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 50,
    initY: 50,
  })

  const parsePosition = (posStr?: string): { x: number; y: number } => {
    if (!posStr) return { x: 50, y: 50 }
    const parts = posStr.trim().split(/\s+/)
    const xVal = parseFloat(parts[0])
    const yVal = parseFloat(parts[1] || parts[0])
    return {
      x: isNaN(xVal) ? 50 : Math.max(0, Math.min(100, Math.round(xVal))),
      y: isNaN(yVal) ? 50 : Math.max(0, Math.min(100, Math.round(yVal))),
    }
  }

  const currentPos = parsePosition(project.image_position)

  const updatePosition = (x: number, y: number) => {
    const clampedX = Math.max(0, Math.min(100, Math.round(x)))
    const clampedY = Math.max(0, Math.min(100, Math.round(y)))
    setProject((prev) => ({
      ...prev,
      image_position: `${clampedX}% ${clampedY}%`,
    }))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    isDraggingRef.current = true
    const pos = parsePosition(project.image_position)
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
    }
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {}
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !dragContainerRef.current) return
    const rect = dragContainerRef.current.getBoundingClientRect()
    const dx = e.clientX - dragStartRef.current.startX
    const dy = e.clientY - dragStartRef.current.startY

    // Invert delta: dragging down shifts viewport down (showing upper image, lower Y%)
    const deltaXPct = -(dx / rect.width) * 100
    const deltaYPct = -(dy / rect.height) * 100

    updatePosition(dragStartRef.current.initX + deltaXPct, dragStartRef.current.initY + deltaYPct)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

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

        const savedPos = targetProj.id ? localStorage.getItem(`portfolio_project_cover_pos_${targetProj.id}`) : null
        const coverPosition = targetProj.image_position || savedPos || "50% 50%"

        setProject({
          ...targetProj,
          image: targetProj.image || rawImages[0] || "",
          images: rawImages,
          image_position: coverPosition,
          tags: Array.isArray(targetProj.tags) ? targetProj.tags : [],
          features: rawFeatures.length > 0 ? rawFeatures : [""],
          challenges: rawChallenges.length > 0 ? rawChallenges : [""],
          solutions: rawSolutions.length > 0 ? rawSolutions : [""],
          architecture: typeof targetProj.architecture === "string" ? targetProj.architecture : "",
        })

        setBulkFeaturesText(rawFeatures.join("\n"))
        setBulkChallengesText(rawChallenges.join("\n"))
        setBulkSolutionsText(rawSolutions.join("\n"))
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

  // Dynamic Array Field Handlers: Features
  const addFeature = () => {
    setProject((prev) => {
      const nextIdx = (prev.features || []).length
      setTimeout(() => {
        const el = document.getElementById(`features-input-${nextIdx}`)
        el?.focus()
      }, 20)
      return {
        ...prev,
        features: [...(prev.features || []), ""],
      }
    })
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

  // Dynamic Array Field Handlers: Challenges
  const addChallenge = () => {
    setProject((prev) => {
      const nextIdx = (prev.challenges || []).length
      setTimeout(() => {
        const el = document.getElementById(`challenges-input-${nextIdx}`)
        el?.focus()
      }, 20)
      return {
        ...prev,
        challenges: [...(prev.challenges || []), ""],
      }
    })
  }

  const updateChallenge = (index: number, val: string) => {
    const updated = [...(project.challenges || [])]
    updated[index] = val
    setProject({ ...project, challenges: updated })
  }

  const removeChallenge = (index: number) => {
    const updated = (project.challenges || []).filter((_, i) => i !== index)
    setProject({ ...project, challenges: updated })
  }

  // Dynamic Array Field Handlers: Solutions
  const addSolution = () => {
    setProject((prev) => {
      const nextIdx = (prev.solutions || []).length
      setTimeout(() => {
        const el = document.getElementById(`solutions-input-${nextIdx}`)
        el?.focus()
      }, 20)
      return {
        ...prev,
        solutions: [...(prev.solutions || []), ""],
      }
    })
  }

  const updateSolution = (index: number, val: string) => {
    const updated = [...(project.solutions || [])]
    updated[index] = val
    setProject({ ...project, solutions: updated })
  }

  const removeSolution = (index: number) => {
    const updated = (project.solutions || []).filter((_, i) => i !== index)
    setProject({ ...project, solutions: updated })
  }

  // Handle applying bullet points to state
  const handleApplyBulletPoints = (
    field: "features" | "challenges" | "solutions",
    rawText: string,
    mode: "replace" | "append" = "replace"
  ) => {
    const parsed = parseBulletPoints(rawText)
    if (parsed.length === 0) {
      toast.error("No bullet points or text found to fill.")
      return
    }

    setProject((prev) => {
      let updated: string[] = []
      if (mode === "append") {
        const existing = (prev[field] || []).filter(Boolean)
        updated = [...existing, ...parsed]
      } else {
        updated = parsed
      }
      return {
        ...prev,
        [field]: updated.length > 0 ? updated : [""],
      }
    })

    if (field === "features") {
      setShowBulletPasteFeatures(false)
      setBulletInputFeatures("")
      setShowBulkFeatures(false)
    } else if (field === "challenges") {
      setShowBulletPasteChallenges(false)
      setBulletInputChallenges("")
      setShowBulkChallenges(false)
    } else if (field === "solutions") {
      setShowBulletPasteSolutions(false)
      setBulletInputSolutions("")
      setShowBulkSolutions(false)
    }

    toast.success(`Filled ${parsed.length} ${field} from bullet points!`)
  }

  // Handle direct paste inside any itemized input field
  const handleItemPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: "features" | "challenges" | "solutions",
    startIndex: number
  ) => {
    const pastedText = e.clipboardData.getData("text")
    if (!pastedText) return

    // If pasted text contains multiple lines OR starts with a bullet point character
    const hasMultipleLines = pastedText.includes("\n")
    const hasBulletPrefix = /^[\-\*\+\•\⁃\‣\▪\▫\◦\⦿\→\➢\✔\✓\d+\.]/m.test(pastedText.trim())

    if (hasMultipleLines || hasBulletPrefix) {
      const parsed = parseBulletPoints(pastedText)
      if (parsed.length > 1 || (parsed.length === 1 && hasBulletPrefix)) {
        e.preventDefault()
        setProject((prev) => {
          const current = [...(prev[field] || [])]
          current.splice(startIndex, 1, ...parsed)
          return {
            ...prev,
            [field]: current.filter(Boolean).length > 0 ? current.filter(Boolean) : [""],
          }
        })
        toast.success(`Pasted & filled ${parsed.length} ${field} item(s)!`)
      }
    }
  }

  // Handle keyboard navigation: Enter to add new input below & focus it, Backspace on empty to remove
  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "features" | "challenges" | "solutions",
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const input = e.currentTarget
      const cursor = input.selectionStart ?? input.value.length
      const currentVal = input.value
      const leftPart = currentVal.slice(0, cursor)
      const rightPart = currentVal.slice(cursor)

      setProject((prev) => {
        const list = [...(prev[field] || [])]
        list[index] = leftPart
        list.splice(index + 1, 0, rightPart)
        return { ...prev, [field]: list }
      })

      setTimeout(() => {
        const nextId = `${field}-input-${index + 1}`
        const nextEl = document.getElementById(nextId) as HTMLInputElement | null
        if (nextEl) {
          nextEl.focus()
          nextEl.setSelectionRange(0, 0)
        }
      }, 20)
    } else if (e.key === "Backspace" && e.currentTarget.value === "") {
      setProject((prev) => {
        const list = [...(prev[field] || [])]
        if (list.length > 1) {
          e.preventDefault()
          list.splice(index, 1)
          setTimeout(() => {
            const prevId = `${field}-input-${Math.max(0, index - 1)}`
            const prevEl = document.getElementById(prevId) as HTMLInputElement | null
            if (prevEl) {
              prevEl.focus()
              prevEl.setSelectionRange(prevEl.value.length, prevEl.value.length)
            }
          }, 20)
          return { ...prev, [field]: list }
        }
        return prev
      })
    }
  }

  // Persist through the authenticated portfolio API.
  const saveProjectToApi = async (projPayload: Project, isUpdate: boolean) => {
    const { id: projId, created_at, ...dataToSave } = projPayload

    if (projId) {
      try {
        localStorage.setItem(`portfolio_project_images_${projId}`, JSON.stringify(projPayload.images || []))
        localStorage.setItem(`portfolio_project_cover_pos_${projId}`, projPayload.image_position || "50% 50%")
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
        image_position: project.image_position || "50% 50%",
        features: cleanFeatures,
        challenges: cleanChallenges,
        solutions: cleanSolutions,
        architecture: (project.architecture || "").trim(),
        results: (project.results || "").trim(),
      }

      if (isApiConfigured) {
        const savedRes = await saveProjectToApi(updatedProject, isEditing)
        if (savedRes?.id) {
          updatedProject.id = savedRes.id
          try {
            localStorage.setItem(`portfolio_project_images_${savedRes.id}`, JSON.stringify(cleanImages))
            localStorage.setItem(`portfolio_project_cover_pos_${savedRes.id}`, updatedProject.image_position || "50% 50%")
          } catch (e) { }
        }
      } else if (updatedProject.id) {
        try {
          localStorage.setItem(`portfolio_project_images_${updatedProject.id}`, JSON.stringify(cleanImages))
          localStorage.setItem(`portfolio_project_cover_pos_${updatedProject.id}`, updatedProject.image_position || "50% 50%")
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

    const tabsList = [
      {
        id: "general" as const,
        label: "General & Tech",
        icon: FileText,
        badge: project.tags.length > 0 ? `${project.tags.length}` : undefined,
      },
      {
        id: "media" as const,
        label: "Media & Cover",
        icon: ImageIcon,
        badge: galleryList.length > 0 ? `${galleryList.length}` : undefined,
      },
      {
        id: "casestudy" as const,
        label: "Case Study & Bullets",
        icon: AlertTriangle,
        badge:
          (project.challenges || []).filter(Boolean).length +
          (project.solutions || []).filter(Boolean).length +
          (project.features || []).filter(Boolean).length > 0
            ? `${
                (project.challenges || []).filter(Boolean).length +
                (project.solutions || []).filter(Boolean).length +
                (project.features || []).filter(Boolean).length
              }`
            : undefined,
      },
      {
        id: "architecture" as const,
        label: "Architecture & Results",
        icon: Cpu,
        badge: project.results ? "✓" : undefined,
      },
    ]

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 w-full"
      >
        {/* Apple Frosted Glass Sticky Action Top Header */}
        <div className="sticky top-16 sm:top-20 z-40 bg-[#121215]/90 backdrop-blur-3xl border-0 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/projects")}
              className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-0 transition-colors cursor-pointer shrink-0 shadow-sm"
              title="Back to Projects"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate font-outfit">
                {isEditing ? `Edit: ${project.title || "Project"}` : "New Portfolio Project"}
              </h1>
              <p className="text-[11px] text-zinc-400 truncate">
                {isEditing ? "Update project details, cover placement, and technical case study" : "Curate and publish a new engineering showcase"}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/projects")}
              className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-0 text-xs font-semibold rounded-xl h-9 px-4 cursor-pointer flex-1 sm:flex-initial justify-center shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl h-9 px-5 cursor-pointer shadow-lg shadow-white/10 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95 flex-1 sm:flex-initial border-0"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEditing ? "Save Changes" : "Publish Project"}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Apple iOS Full-Width Grid Tabs (Zero Horizontal Scroll) */}
        <div className="bg-white/[0.035] backdrop-blur-3xl border-0 p-1.5 rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
          {tabsList.map((tab) => {
            const isActive = activeTab === tab.id
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer w-full text-center border-0 ${
                  isActive ? "text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAdminProjectFormTab"
                    className="absolute inset-0 rounded-xl bg-white shadow-md shadow-white/10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5 min-w-0">
                  <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-zinc-950" : "text-zinc-400"}`} />
                  <span className="truncate">{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 min-w-[18px] text-center border-0 ${
                        isActive
                          ? "bg-zinc-950/15 text-zinc-950 font-bold"
                          : "bg-white/[0.08] text-zinc-300"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Tabbed Form Contents */}
        <form onSubmit={handleSubmit} className="text-xs">
          <AnimatePresence mode="wait">
            {/* TAB 1: GENERAL & TECH */}
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Section 1: Overview */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between pb-1">
                    <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" /> Project Identity & Overview
                    </h2>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border-0 font-medium shadow-sm">
                      Step 1 of 4
                    </span>
                  </div>

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
                        className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-sm rounded-xl h-11 px-4 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-zinc-300 mb-1.5">Category</label>
                      <Select
                        value={project.category || "Full Stack"}
                        onValueChange={(val) => setProject({ ...project, category: val })}
                      >
                        <SelectTrigger className="w-full bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-11 px-3.5 transition-all shadow-inner">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900/95 backdrop-blur-2xl border-0 shadow-2xl text-white rounded-xl">
                          {CATEGORY_OPTIONS.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-white/[0.035] border-0 shadow-inner rounded-xl">
                      <div>
                        <label className="font-semibold text-white block flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Featured Showcase
                        </label>
                        <p className="text-[10px] text-zinc-500">Highlight in featured work carousel</p>
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
                      placeholder="Brief description of the project, problem solved, and technical scope..."
                      required
                      rows={3}
                      className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl p-3.5 leading-relaxed transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Section 2: Links */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest pb-1 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" /> Links & Repositories
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
                        className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-10 px-3.5 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-zinc-300" /> GitHub Repository URL
                      </label>
                      <Input
                        value={project.github || ""}
                        onChange={(e) => setProject({ ...project, github: e.target.value })}
                        placeholder="https://github.com/user/repo"
                        className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-10 px-3.5 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Technologies */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest pb-1 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-purple-400" /> Technologies & Tech Stack ({project.tags.length})
                  </h2>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 min-h-[42px] bg-white/[0.035] p-3 rounded-xl border-0 shadow-inner items-center">
                      {project.tags.length === 0 && (
                        <span className="text-zinc-500 italic">No tags added yet. Choose from presets below or type a custom tag.</span>
                      )}
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-emerald-500/15 text-emerald-400 border-0 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
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
                        className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-10 px-3.5 transition-all shadow-inner"
                      />
                      <Button
                        type="button"
                        onClick={() => addTag(newTagInput)}
                        className="bg-white/[0.07] hover:bg-white/[0.14] text-zinc-200 text-xs font-semibold rounded-xl h-10 px-4 shrink-0 border-0 shadow-sm cursor-pointer"
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
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border-0 transition-all cursor-pointer shadow-sm ${
                              isSelected
                                ? "bg-emerald-500 text-slate-950 font-bold shadow-emerald-500/20"
                                : "bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.09]"
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

                {/* Stepper to Tab 2 */}
                <div className="pt-4 flex items-center justify-end">
                  <Button
                    type="button"
                    onClick={() => handleTabChange("media")}
                    className="bg-white/[0.07] hover:bg-white/[0.14] text-white text-xs font-semibold rounded-xl h-10 px-5 flex items-center gap-2 cursor-pointer border-0 shadow-sm"
                  >
                    <span>Next: Media & Placement</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: MEDIA & PLACEMENT */}
            {activeTab === "media" && (
              <motion.div
                key="media"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Section: Multiple Images & Gallery */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between pb-1">
                    <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Multiple Screenshots & Gallery ({galleryList.length} total)
                    </h2>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border-0 font-medium shadow-sm">
                      Step 2 of 4
                    </span>
                  </div>

                  {/* Add Image URL Input & File Upload Button */}
                  <div className="space-y-4 bg-white/[0.035] p-4 sm:p-5 rounded-2xl border-0 shadow-inner">
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
                        className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-10 px-3.5 flex-1 transition-all shadow-inner"
                      />
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          onClick={addImageUrl}
                          className="bg-white/[0.07] hover:bg-white/[0.14] text-white text-xs font-bold rounded-xl h-10 px-4 cursor-pointer flex-1 sm:flex-initial justify-center border-0 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add URL
                        </Button>
                        <label className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border-0 text-xs font-bold px-4 h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 sm:flex-initial whitespace-nowrap shadow-sm">
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
                        <label className="bg-white/[0.07] hover:bg-white/[0.14] text-zinc-300 hover:text-white border-0 text-xs font-semibold px-3.5 h-10 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors flex-1 sm:flex-initial whitespace-nowrap shadow-sm" title="Upload and set primary cover directly">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryList.map((imgUrl, idx) => {
                          const isPrimaryCover = project.image === imgUrl || (idx === 0 && !project.image)
                          return (
                            <div
                              key={idx}
                              className={`relative group aspect-video rounded-2xl overflow-hidden border-0 ${
                                isPrimaryCover
                                  ? "ring-2 ring-emerald-400 shadow-2xl"
                                  : "shadow-lg"
                              } bg-black/60`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery ${idx + 1}`}
                                loading="lazy"
                                decoding="async"
                                style={{
                                  objectPosition: isPrimaryCover ? (project.image_position || "50% 50%") : "50% 50%",
                                }}
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
                      <p className="text-xs text-zinc-500 italic bg-white/[0.025] p-6 rounded-2xl border-0 shadow-inner text-center">
                        No images added yet. Upload files or paste image URLs above to showcase multiple project screenshots.
                      </p>
                    )}
                  </div>
                </div>

                {/* Section: Upwork-Style Cover Placement Studio */}
                {galleryList.length > 0 && (
                  <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Move className="w-4 h-4 text-emerald-400" />
                          <h3 className="font-bold text-sm text-white">Cover Image Placement Studio</h3>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Click and drag the image inside the 16:10 frame to adjust the focal point on the front-end cards.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowCardOverlay(!showCardOverlay)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border-0 shadow-sm ${
                            showCardOverlay
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/[0.06] text-zinc-400 hover:text-white"
                          }`}
                          title="Toggle card mockup overlay"
                        >
                          {showCardOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showCardOverlay ? "Hide Card Overlay" : "Show Card Overlay"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updatePosition(50, 50)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] text-zinc-400 border-0 hover:text-white hover:bg-white/[0.12] flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                          title="Reset to center (50% 50%)"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Drag Repositioner Stage (16:10 Aspect Ratio) */}
                    <div className="max-w-2xl mx-auto space-y-3">
                      <div
                        ref={dragContainerRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="relative aspect-[16/10] sm:h-72 w-full overflow-hidden rounded-2xl bg-black border-0 cursor-grab active:cursor-grabbing select-none shadow-[0_24px_60px_rgba(0,0,0,0.85)] group touch-none"
                      >
                        <img
                          src={project.image || galleryList[0]}
                          alt="Cover Placement Preview"
                          draggable={false}
                          style={{ objectPosition: `${currentPos.x}% ${currentPos.y}%` }}
                          className="w-full h-full object-cover pointer-events-none select-none transition-[object-position] duration-75"
                        />

                        {/* 3x3 Grid Overlay (Rule of thirds guide) */}
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 group-hover:opacity-35 transition-opacity">
                          <div className="border-r border-b border-white/40" />
                          <div className="border-r border-b border-white/40" />
                          <div className="border-b border-white/40" />
                          <div className="border-r border-b border-white/40" />
                          <div className="border-r border-b border-white/40" />
                          <div className="border-b border-white/40" />
                          <div className="border-r border-b border-white/40" />
                          <div className="border-r border-b border-white/40" />
                          <div />
                        </div>

                        {/* Floating reposition pill */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/85 backdrop-blur-md text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full border-0 shadow-2xl flex items-center gap-2">
                          <Move className="w-3 h-3 text-emerald-400" />
                          <span>Drag image to reposition</span>
                          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md border-0">
                            {currentPos.x}% , {currentPos.y}%
                          </span>
                        </div>

                        {/* Live Frontend Card Mockup Overlay */}
                        {showCardOverlay && (
                          <div className="absolute inset-0 pointer-events-none p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-t from-black/85 via-transparent to-black/60">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full border-0 shadow-md">
                                {project.category || "Case Study #01"}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-300 bg-black/70 px-2.5 py-0.5 rounded-full border-0 shadow-md">
                                Card Window (16:10)
                              </span>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-white font-bold text-base sm:text-lg drop-shadow-md truncate font-outfit">
                                {project.title || "Project Title"}
                              </h4>
                              <p className="text-zinc-300 text-xs line-clamp-1 drop-shadow">
                                {project.description || "Project overview on the portfolio card..."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Presets and Precision Placement */}
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {[
                          { label: "Top", x: 50, y: 0 },
                          { label: "Upper Third", x: 50, y: 25 },
                          { label: "Center", x: 50, y: 50 },
                          { label: "Lower Third", x: 50, y: 75 },
                          { label: "Bottom", x: 50, y: 100 },
                        ].map((preset) => {
                          const isActive = currentPos.x === preset.x && currentPos.y === preset.y
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => updatePosition(preset.x, preset.y)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border-0 shadow-sm ${
                                isActive
                                  ? "bg-emerald-500 text-slate-950 font-bold scale-105 shadow-emerald-500/20"
                                  : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12] hover:text-white"
                              }`}
                            >
                              {preset.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stepper Controls */}
                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("general")}
                    className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-0 text-xs font-semibold rounded-xl h-10 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to General
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleTabChange("casestudy")}
                    className="bg-white/[0.07] hover:bg-white/[0.14] text-white text-xs font-semibold rounded-xl h-10 px-5 flex items-center gap-2 cursor-pointer border-0 shadow-sm"
                  >
                    <span>Next: Case Study & Bullets</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: CASE STUDY & BULLETS */}
            {activeTab === "casestudy" && (
              <motion.div
                key="casestudy"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Section: Key Features */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
                    <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> Key Features List
                    </h2>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowBulletPasteFeatures(!showBulletPasteFeatures)}
                        className={`text-[11px] font-semibold cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-0 transition-all shadow-sm ${
                          showBulletPasteFeatures
                            ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                            : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400"
                        }`}
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>{showBulletPasteFeatures ? "Hide Paste Box" : "Paste Bullet Points"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!showBulkFeatures) {
                            setBulkFeaturesText((project.features || []).filter(Boolean).join("\n"))
                          } else {
                            const lines = bulkFeaturesText.split("\n").map((s) => s.trim()).filter(Boolean)
                            setProject((prev) => ({ ...prev, features: lines.length > 0 ? lines : [""] }))
                          }
                          setShowBulkFeatures(!showBulkFeatures)
                        }}
                        className="text-[11px] text-zinc-400 hover:text-white font-medium cursor-pointer px-2 py-1"
                      >
                        {showBulkFeatures ? "Itemized Mode" : "Raw Text"}
                      </button>
                    </div>
                  </div>

                  {/* Paste Bullet Points Box for Features */}
                  {showBulletPasteFeatures && (
                    <div className="bg-[#16161b] border-0 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border-0 flex items-center justify-center text-emerald-400 shrink-0">
                            <ListPlus className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Paste Bullet Points</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              Paste a list with bullet points (<code className="text-emerald-400">•</code>, <code className="text-emerald-400">-</code>, <code className="text-emerald-400">*</code>, or numbers). It automatically strips bullets and fills each into an input field below.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBulletPasteFeatures(false)}
                          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <Textarea
                        value={bulletInputFeatures}
                        onChange={(e) => setBulletInputFeatures(e.target.value)}
                        placeholder={`• Next.js 14 App Router & React Server Components\n• Real-time WebSocket event synchronization\n• TanStack Query state caching & optimistic updates\n- Responsive dark mode UI design`}
                        rows={5}
                        className="bg-black/60 border-0 outline-none focus:ring-1 focus:ring-emerald-400/50 text-zinc-200 text-xs rounded-xl p-3.5 leading-relaxed placeholder:text-zinc-600 font-normal shadow-inner"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5">
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {parseBulletPoints(bulletInputFeatures).length} bullet point(s) detected
                        </span>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBulletPasteFeatures(false)}
                            className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 text-xs rounded-xl h-8 px-3 border-0 shadow-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyBulletPoints("features", bulletInputFeatures, "append")}
                            className="bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 text-xs rounded-xl h-8 px-3 border-0 shadow-sm"
                          >
                            Append to Existing
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyBulletPoints("features", bulletInputFeatures, "replace")}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl h-8 px-4 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 border-0"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Fill Input Fields
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

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
                      className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl p-3.5 leading-relaxed transition-all shadow-inner"
                    />
                  ) : (
                    <div className="space-y-2.5">
                      {(project.features || []).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 text-center text-zinc-500 font-mono text-[11px]">{idx + 1}.</span>
                          <Input
                            id={`features-input-${idx}`}
                            value={feat}
                            onChange={(e) => updateFeature(idx, e.target.value)}
                            onKeyDown={(e) => handleItemKeyDown(e, "features", idx)}
                            onPaste={(e) => handleItemPaste(e, "features", idx)}
                            placeholder={`Feature #${idx + 1} (press Enter to add another)`}
                            className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-10 px-3.5 flex-1 transition-all shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addFeature}
                        className="w-full bg-white/[0.035] hover:bg-white/[0.08] border-0 text-zinc-300 text-xs font-medium rounded-xl h-9 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add Feature Item
                      </Button>
                    </div>
                  )}
                </div>

                {/* Section: Engineering Challenges */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
                    <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Engineering Challenges
                    </h2>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowBulletPasteChallenges(!showBulletPasteChallenges)}
                        className={`text-[11px] font-semibold cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-0 transition-all shadow-sm ${
                          showBulletPasteChallenges
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                            : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-400"
                        }`}
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>{showBulletPasteChallenges ? "Hide Paste Box" : "Paste Bullet Points"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!showBulkChallenges) {
                            setBulkChallengesText((project.challenges || []).filter(Boolean).join("\n"))
                          } else {
                            const lines = bulkChallengesText.split("\n").map((s) => s.trim()).filter(Boolean)
                            setProject((prev) => ({ ...prev, challenges: lines.length > 0 ? lines : [""] }))
                          }
                          setShowBulkChallenges(!showBulkChallenges)
                        }}
                        className="text-[11px] text-zinc-400 hover:text-white font-medium cursor-pointer px-2 py-1"
                      >
                        {showBulkChallenges ? "Itemized Mode" : "Raw Text"}
                      </button>
                    </div>
                  </div>

                  {/* Paste Bullet Points Box for Challenges */}
                  {showBulletPasteChallenges && (
                    <div className="bg-[#16161b] border-0 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border-0 flex items-center justify-center text-amber-400 shrink-0">
                            <ListPlus className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Paste Bullet Points</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              Paste challenges with bullet points (<code className="text-amber-400">•</code>, <code className="text-amber-400">-</code>, <code className="text-amber-400">*</code>, or numbers). It automatically strips bullets and fills each into an input field below.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBulletPasteChallenges(false)}
                          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <Textarea
                        value={bulletInputChallenges}
                        onChange={(e) => setBulletInputChallenges(e.target.value)}
                        placeholder={`• High database query latency during concurrency spikes\n• Frequent WebSocket client disconnects on unstable networks\n• Memory leakage during background image processing`}
                        rows={5}
                        className="bg-black/60 border-0 outline-none focus:ring-1 focus:ring-amber-400/50 text-zinc-200 text-xs rounded-xl p-3.5 leading-relaxed placeholder:text-zinc-600 font-normal shadow-inner"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5">
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {parseBulletPoints(bulletInputChallenges).length} bullet point(s) detected
                        </span>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBulletPasteChallenges(false)}
                            className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 text-xs rounded-xl h-8 px-3 border-0 shadow-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyBulletPoints("challenges", bulletInputChallenges, "append")}
                            className="bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 text-xs rounded-xl h-8 px-3 border-0 shadow-sm"
                          >
                            Append to Existing
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyBulletPoints("challenges", bulletInputChallenges, "replace")}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl h-8 px-4 flex items-center gap-1.5 shadow-md shadow-amber-500/20 border-0"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Fill Input Fields
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showBulkChallenges ? (
                    <Textarea
                      value={bulkChallengesText}
                      onChange={(e) => {
                        setBulkChallengesText(e.target.value)
                        const lines = e.target.value.split("\n").filter(Boolean)
                        setProject({ ...project, challenges: lines })
                      }}
                      placeholder="One challenge per line..."
                      rows={4}
                      className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-amber-400/40 text-white text-xs rounded-xl p-3.5 leading-relaxed transition-all shadow-inner"
                    />
                  ) : (
                    <div className="space-y-2.5">
                      {(project.challenges || []).map((chal, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 text-center text-zinc-500 font-mono text-[11px]">{idx + 1}.</span>
                          <Input
                            id={`challenges-input-${idx}`}
                            value={chal}
                            onChange={(e) => updateChallenge(idx, e.target.value)}
                            onKeyDown={(e) => handleItemKeyDown(e, "challenges", idx)}
                            onPaste={(e) => handleItemPaste(e, "challenges", idx)}
                            placeholder={`Challenge #${idx + 1} (press Enter to add another)`}
                            className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-amber-400/40 text-white text-xs rounded-xl h-10 px-3.5 flex-1 transition-all shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => removeChallenge(idx)}
                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove challenge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addChallenge}
                        className="w-full bg-white/[0.035] hover:bg-white/[0.08] border-0 text-zinc-300 text-xs font-medium rounded-xl h-9 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" /> Add Challenge Item
                      </Button>
                    </div>
                  )}
                </div>

                {/* Section: Architectural Solutions */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
                    <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-400" /> Architectural Solutions
                    </h2>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowBulletPasteSolutions(!showBulletPasteSolutions)}
                        className={`text-[11px] font-semibold cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-0 transition-all shadow-sm ${
                          showBulletPasteSolutions
                            ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                            : "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400"
                        }`}
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>{showBulletPasteSolutions ? "Hide Paste Box" : "Paste Bullet Points"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!showBulkSolutions) {
                            setBulkSolutionsText((project.solutions || []).filter(Boolean).join("\n"))
                          } else {
                            const lines = bulkSolutionsText.split("\n").map((s) => s.trim()).filter(Boolean)
                            setProject((prev) => ({ ...prev, solutions: lines.length > 0 ? lines : [""] }))
                          }
                          setShowBulkSolutions(!showBulkSolutions)
                        }}
                        className="text-[11px] text-zinc-400 hover:text-white font-medium cursor-pointer px-2 py-1"
                      >
                        {showBulkSolutions ? "Itemized Mode" : "Raw Text"}
                      </button>
                    </div>
                  </div>

                  {/* Paste Bullet Points Box for Solutions */}
                  {showBulletPasteSolutions && (
                    <div className="bg-[#16161b] border-0 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border-0 flex items-center justify-center text-cyan-400 shrink-0">
                            <ListPlus className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Paste Bullet Points</h4>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              Paste solutions with bullet points (<code className="text-cyan-400">•</code>, <code className="text-cyan-400">-</code>, <code className="text-cyan-400">*</code>, or numbers). It automatically strips bullets and fills each into an input field below.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBulletPasteSolutions(false)}
                          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <Textarea
                        value={bulletInputSolutions}
                        onChange={(e) => setBulletInputSolutions(e.target.value)}
                        placeholder={`• Implemented Redis caching with 60s TTL and cache invalidation hooks\n• Added exponential backoff retry jitter on client reconnection\n• Utilized sharp stream pipelines with off-thread garbage collection`}
                        rows={5}
                        className="bg-black/60 border-0 outline-none focus:ring-1 focus:ring-cyan-400/50 text-zinc-200 text-xs rounded-xl p-3.5 leading-relaxed placeholder:text-zinc-600 font-normal shadow-inner"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5">
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {parseBulletPoints(bulletInputSolutions).length} bullet point(s) detected
                        </span>
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBulletPasteSolutions(false)}
                            className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 text-xs rounded-xl h-8 px-3 border-0 shadow-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyBulletPoints("solutions", bulletInputSolutions, "append")}
                            className="bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 text-xs rounded-xl h-8 px-3 border-0 shadow-sm"
                          >
                            Append to Existing
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyBulletPoints("solutions", bulletInputSolutions, "replace")}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl h-8 px-4 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 border-0"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Fill Input Fields
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showBulkSolutions ? (
                    <Textarea
                      value={bulkSolutionsText}
                      onChange={(e) => {
                        setBulkSolutionsText(e.target.value)
                        const lines = e.target.value.split("\n").filter(Boolean)
                        setProject({ ...project, solutions: lines })
                      }}
                      placeholder="One solution per line..."
                      rows={4}
                      className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-cyan-400/40 text-white text-xs rounded-xl p-3.5 leading-relaxed transition-all shadow-inner"
                    />
                  ) : (
                    <div className="space-y-2.5">
                      {(project.solutions || []).map((sol, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 text-center text-zinc-500 font-mono text-[11px]">{idx + 1}.</span>
                          <Input
                            id={`solutions-input-${idx}`}
                            value={sol}
                            onChange={(e) => updateSolution(idx, e.target.value)}
                            onKeyDown={(e) => handleItemKeyDown(e, "solutions", idx)}
                            onPaste={(e) => handleItemPaste(e, "solutions", idx)}
                            placeholder={`Solution #${idx + 1} (press Enter to add another)`}
                            className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-cyan-400/40 text-white text-xs rounded-xl h-10 px-3.5 flex-1 transition-all shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => removeSolution(idx)}
                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove solution"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addSolution}
                        className="w-full bg-white/[0.035] hover:bg-white/[0.08] border-0 text-zinc-300 text-xs font-medium rounded-xl h-9 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add Solution Item
                      </Button>
                    </div>
                  )}
                </div>

                {/* Stepper Controls */}
                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("media")}
                    className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-0 text-xs font-semibold rounded-xl h-10 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Media
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleTabChange("architecture")}
                    className="bg-white/[0.07] hover:bg-white/[0.14] text-white text-xs font-semibold rounded-xl h-10 px-5 flex items-center gap-2 cursor-pointer border-0 shadow-sm"
                  >
                    <span>Next: Architecture & Impact</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 4: ARCHITECTURE & IMPACT */}
            {activeTab === "architecture" && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Section: Architecture & Results */}
                <div className="relative rounded-[28px] bg-white/[0.025] backdrop-blur-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-0 space-y-6 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between pb-1">
                    <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" /> System Architecture & Production Impact
                    </h2>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border-0 font-medium shadow-sm">
                      Step 4 of 4
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <label className="block font-medium text-zinc-300">
                      System Architecture Flow
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Specify pipeline nodes separated by arrows (e.g. <code className="text-emerald-400">React -&gt; Node.js -&gt; PostgreSQL</code>). It automatically generates a visual architectural graph for the case study.
                    </p>
                    <Textarea
                      value={project.architecture || ""}
                      onChange={(e) => setProject({ ...project, architecture: e.target.value })}
                      placeholder={`React -> Node.js -> PostgreSQL`}
                      rows={3}
                      className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl p-3.5 font-mono transition-all shadow-inner"
                    />

                    {project.architecture && (
                      <div className="flex flex-wrap items-center gap-2 bg-white/[0.035] p-3.5 rounded-xl border-0 shadow-inner">
                        {project.architecture.split(/->|→/).map((node, nIdx, arr) => (
                          <div key={nIdx} className="flex items-center gap-2">
                            <div className="bg-white/[0.08] border-0 text-emerald-300 text-xs font-mono px-3 py-1.5 rounded-lg shadow-sm">
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

                  <div className="space-y-2 pt-2">
                    <label className="block font-medium text-zinc-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Measurable Results & Impact
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Highlight business outcome, scalability performance, or user milestones achieved.
                    </p>
                    <Input
                      value={project.results || ""}
                      onChange={(e) => setProject({ ...project, results: e.target.value })}
                      placeholder="e.g. Scaled to 10k+ monthly users with 99.9% uptime"
                      className="bg-white/[0.05] hover:bg-white/[0.07] focus:bg-white/[0.09] border-0 outline-none focus:ring-1 focus:ring-emerald-400/40 text-white text-xs rounded-xl h-10 px-3.5 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Final Stepper Controls */}
                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTabChange("casestudy")}
                    className="bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-0 text-xs font-semibold rounded-xl h-10 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Case Study
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl h-10 px-6 flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10 active:scale-95 transition-all border-0"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>{isEditing ? "Save & Publish Changes" : "Publish Project Showcase"}</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    )
}
