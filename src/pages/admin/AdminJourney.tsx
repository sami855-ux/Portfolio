import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Briefcase, GraduationCap, Code, Rocket, User, Users, TreePine, Calendar, Search, Milestone, GripVertical, ArrowUp, ArrowDown } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog } from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  supabase,
  isSupabaseConfigured,
  getJourney,
} from "@/lib/supabase"
import type { JourneyItem } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

const AVAILABLE_ICONS = [
  { name: "Briefcase", icon: Briefcase, label: "Work" },
  { name: "GraduationCap", icon: GraduationCap, label: "Education" },
  { name: "Code", icon: Code, label: "Tech" },
  { name: "Rocket", icon: Rocket, label: "Launch" },
  { name: "User", icon: User, label: "Personal" },
  { name: "Users", icon: Users, label: "Team" },
  { name: "TreePine", icon: TreePine, label: "Philosophy" },
]

export default function AdminJourney() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([])
  const [isEditingJourney, setIsEditingJourney] = useState<JourneyItem | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

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
      const data = await getJourney()
      setJourneyItems(data)
    } catch (err) {
      console.error("Error loading journey:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    const updated = [...journeyItems]
    const [draggedItem] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, draggedItem)
    setDraggedIndex(index)
    setJourneyItems(updated)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const moveMilestone = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= journeyItems.length) return
    const updated = [...journeyItems]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setJourneyItems(updated)
  }

  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingJourney) return

    setIsSaving(true)
    const isNew = !isEditingJourney.id || isEditingJourney.id.startsWith("demo")
    const toastId = toast.loading(isNew ? "Creating new milestone..." : "Saving milestone changes...")

    try {
      if (isSupabaseConfigured) {
        if (isEditingJourney.id && !isEditingJourney.id.startsWith("demo")) {
          const { error } = await supabase
            .from("journey_timeline")
            .update(isEditingJourney)
            .eq("id", isEditingJourney.id)
          if (error) throw error
        } else {
          const { id, ...newItem } = isEditingJourney
          const { data, error } = await supabase.from("journey_timeline").insert([newItem]).select().single()
          if (error) throw error
          if (data) {
            isEditingJourney.id = data.id
          }
        }
      }

      if (isEditingJourney.id) {
        setJourneyItems((prev) => {
          const exists = prev.some((j) => j.id === isEditingJourney.id)
          if (exists) return prev.map((j) => (j.id === isEditingJourney.id ? isEditingJourney : j))
          return [...prev, isEditingJourney]
        })
      } else {
        const newItem = { ...isEditingJourney, id: Date.now().toString() }
        setJourneyItems((prev) => [...prev, newItem])
      }

      setShowSheet(false)
      setIsEditingJourney(null)
      toast.success(isNew ? "Milestone created successfully!" : "Milestone updated successfully!", { id: toastId })
      loadHeaderData()
    } catch (err: any) {
      console.error("Save journey error:", err)
      toast.error("Failed to save milestone: " + (err?.message || "Unknown error"), { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const promptDeleteJourney = (item: JourneyItem) => {
    setDeleteDialog({
      open: true,
      id: item.id,
      title: item.title,
      isLoading: false,
      isError: false,
    })
  }

  const confirmDeleteJourney = async () => {
    if (!deleteDialog.id) return
    setDeleteDialog((prev) => ({ ...prev, isLoading: true, isError: false }))
    const toastId = toast.loading("Deleting milestone...")
    try {
      if (isSupabaseConfigured && !deleteDialog.id.startsWith("demo")) {
        const { error } = await supabase.from("journey_timeline").delete().eq("id", deleteDialog.id)
        if (error) throw error
      }
      setJourneyItems((prev) => prev.filter((j) => j.id !== deleteDialog.id))
      toast.success("Milestone deleted successfully.", { id: toastId })
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: any) {
      toast.error(err.message || "Failed to delete milestone.", { id: toastId })
      setDeleteDialog((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: err.message || "Failed to delete milestone. Please try again.",
      }))
    }
  }

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-green-400" />
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-amber-400" />
      case "Code":
        return <Code className="w-4 h-4 text-cyan-400" />
      case "Rocket":
        return <Rocket className="w-4 h-4 text-purple-400" />
      case "TreePine":
        return <TreePine className="w-4 h-4 text-emerald-400" />
      case "Users":
        return <Users className="w-4 h-4 text-rose-400" />
      default:
        return <User className="w-4 h-4 text-blue-400" />
    }
  }

  const filteredItems = journeyItems.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.date_range && j.date_range.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading career journey timeline...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Suite Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Career Journey Timeline</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Curate career milestones, education, internships, and engineering goals
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setIsEditingJourney({ title: "", description: "", date_range: "", icon_name: "Briefcase", side: "left" })
            setShowSheet(true)
          }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs cursor-pointer shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Milestone
        </Button>
      </div>

      {/* Interactive Draggable Experience Cards Grid */}
      {journeyItems.length === 0 ? (
        <div className="bg-[#181818] border border-[#262626] rounded-3xl p-10 text-center space-y-3">
          <p className="text-sm text-gray-400">No career milestones added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journeyItems.map((j, idx) => (
            <motion.div
              key={j.id || idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`bg-[#1b1b1b] border p-6 rounded-3xl space-y-4 shadow-xl transition-all duration-300 group flex flex-col justify-between select-none ${
                draggedIndex === idx
                  ? "border-green-500 bg-[#1e2b20] opacity-75 scale-[0.98] shadow-2xl shadow-green-500/20"
                  : "border-[#262626] hover:border-green-500/40"
              }`}
            >
              <div className="space-y-3">
                {/* Card Top Meta Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Drag Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-green-400 shrink-0"
                      title="Click and drag to reorder milestones"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-mono text-green-500 font-bold shrink-0">
                      #{idx + 1}
                    </span>

                    <div className="w-8 h-8 rounded-xl bg-[#141414] border border-[#282828] flex items-center justify-center shrink-0 group-hover:border-green-500/30 transition-colors">
                      {renderIcon(j.icon_name)}
                    </div>

                    {j.date_range && (
                      <span className="text-[11px] text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                        {j.date_range}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Arrow Buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveMilestone(idx, idx - 1)}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === journeyItems.length - 1}
                      onClick={() => moveMilestone(idx, idx + 1)}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-default"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingJourney(j)
                        setShowSheet(true)
                      }}
                      className="bg-[#141414] border border-[#282828] hover:border-green-500/40 text-gray-300 hover:text-green-400 text-xs rounded-xl h-8 px-3 cursor-pointer transition-all ml-1"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => promptDeleteJourney(j)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs rounded-xl h-8 px-2.5 cursor-pointer transition-colors"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-white group-hover:text-green-400 transition-colors leading-snug">
                  {j.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {j.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Milestone Edit / Create Shadcn Sheet Drawer */}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        {isEditingJourney && (
          <SheetContent side="right" className="w-full sm:max-w-md bg-[#181818] p-6 sm:p-8 border-l border-[#282828] overflow-y-auto no-scrollbar">
            <SheetHeader className="pb-4 border-b border-[#262626]">
              <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                {isEditingJourney.id ? "Edit Journey Milestone" : "Add Journey Milestone"}
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-400">
                Configure milestone title, date range, icon theme, and details.
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSaveJourney} className="space-y-5 pt-6">
              {/* Milestone Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Milestone Title / Role
                </label>
                <Input
                  value={isEditingJourney.title}
                  onChange={(e) =>
                    setIsEditingJourney({ ...isEditingJourney, title: e.target.value })
                  }
                  required
                  placeholder="e.g. Software Engineering Degree, Full Stack Developer"
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Date Range / Year
                </label>
                <Input
                  value={isEditingJourney.date_range || ""}
                  onChange={(e) =>
                    setIsEditingJourney({ ...isEditingJourney, date_range: e.target.value })
                  }
                  placeholder="e.g. 2022 - 2026, 2023 - Present"
                  required
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5 font-mono"
                />
              </div>

              {/* Icon Theme Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Icon Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((ic) => {
                    const IconComp = ic.icon
                    const isSelected = isEditingJourney.icon_name === ic.name
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setIsEditingJourney({ ...isEditingJourney, icon_name: ic.name })}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-green-500/20 border-green-500 text-green-400 font-bold shadow-md shadow-green-500/10"
                            : "bg-[#141414] border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#383838]"
                        }`}
                      >
                        <IconComp className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">{ic.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Milestone Details & Description
                </label>
                <Textarea
                  rows={4}
                  value={isEditingJourney.description}
                  onChange={(e) =>
                    setIsEditingJourney({ ...isEditingJourney, description: e.target.value })
                  }
                  required
                  placeholder="Describe your achievements, responsibilities, degree honors, or key contributions..."
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl p-3.5 leading-relaxed"
                />
              </div>

              <SheetFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSheet(false)}
                  className="bg-[#252525] border-none hover:bg-[#303030] text-gray-300 text-xs font-bold rounded-xl h-11 px-4 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs rounded-xl h-11 px-6 border-none cursor-pointer shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Milestone...</span>
                    </>
                  ) : (
                    <span>Save Milestone</span>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        )}
      </Sheet>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        variant="danger"
        title="Delete Milestone?"
        description={`Are you sure you want to delete "${deleteDialog.title || "this milestone"}"? This action cannot be undone.`}
        confirmText="Delete Milestone"
        cancelText="Cancel"
        onConfirm={confirmDeleteJourney}
        onCancel={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        isLoading={deleteDialog.isLoading}
        loadingText="Deleting milestone..."
        isError={deleteDialog.isError}
        errorTitle="Deletion Failed"
        errorMessage={deleteDialog.errorMessage}
      />
    </motion.div>
  )
}
