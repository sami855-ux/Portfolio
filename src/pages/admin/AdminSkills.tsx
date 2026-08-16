import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Code2, Wrench, Database as DbIcon, Smartphone, Cpu, Filter, Terminal, Layers, Sparkles } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  supabase,
  isSupabaseConfigured,
  defaultSkills,
} from "@/lib/supabase"
import type { Skill } from "@/types/supabase"

import { useQueryClient } from "@tanstack/react-query"
import { useSkillsQuery, QUERY_KEYS } from "@/hooks/usePortfolioQueries"
import { renderSkillIcon, detectIconName, SKILL_ICON_SUGGESTIONS } from "@/lib/skillIcons"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

// Database Enum Skill Categories
const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "Mobile", "Tools"] as const

export default function AdminSkills() {
  const context = useOutletContext<AdminContext>()
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const queryClient = useQueryClient()
  const { data: dbSkills } = useSkillsQuery()

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isEditingSkill, setIsEditingSkill] = useState<Skill | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id?: string
    name?: string
    isLoading: boolean
    isError: boolean
    errorMessage?: string
  }>({ open: false, isLoading: false, isError: false })

  useEffect(() => {
    if (dbSkills) {
      setSkills(dbSkills)
      setLoading(false)
    }
  }, [dbSkills])

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingSkill || !isEditingSkill.name || !isEditingSkill.category) {
      toast.error("Please provide both skill name and category.")
      return
    }

    setIsSaving(true)
    const isNew = !isEditingSkill.id || !(isEditingSkill.id.length > 20 && isEditingSkill.id.includes("-"))
    const toastId = toast.loading(isNew ? "Creating new skill..." : "Saving skill updates...")

    const targetIconName = (isEditingSkill.icon_name && isEditingSkill.icon_name !== "SiReact" && isEditingSkill.icon_name !== "SiCode")
      ? isEditingSkill.icon_name
      : detectIconName(isEditingSkill.name)

    const skillToSave = {
      ...isEditingSkill,
      icon_name: targetIconName
    }

    try {
      if (isSupabaseConfigured) {
        const isUUID = skillToSave.id && skillToSave.id.length > 20 && skillToSave.id.includes("-")
        if (isUUID) {
          const { error: updateErr } = await supabase
            .from("skills")
            .update({
              name: skillToSave.name,
              category: skillToSave.category,
              icon_name: targetIconName,
              proficiency: skillToSave.proficiency || 90,
            })
            .eq("id", skillToSave.id)

          if (updateErr) throw new Error(updateErr.message)
        } else {
          const { id, ...newSkillData } = skillToSave
          const { data: inserted, error: insertErr } = await supabase
            .from("skills")
            .insert([{
              name: newSkillData.name,
              category: newSkillData.category,
              icon_name: targetIconName,
              proficiency: newSkillData.proficiency || 90,
              display_order: skills.length + 1,
            }])
            .select()

          if (insertErr) throw new Error(insertErr.message)

          if (inserted && inserted[0]) {
            setSkills((prev) => [...prev, inserted[0] as Skill])
            setShowSheet(false)
            setIsEditingSkill(null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
            toast.success("Skill created successfully!", { id: toastId })
            loadHeaderData()
            return
          }
        }
      }

      // Update state locally
      if (skillToSave.id) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skillToSave.id ? skillToSave : s))
        )
      } else {
        const newSkill = { ...skillToSave, id: Date.now().toString() }
        setSkills((prev) => [...prev, newSkill])
      }

      setShowSheet(false)
      setIsEditingSkill(null)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
      toast.success(isNew ? "Skill created successfully!" : "Skill updated successfully!", { id: toastId })
      loadHeaderData()
    } catch (err: any) {
      console.error("Save skill error:", err)
      toast.error("Failed to save skill: " + (err?.message || "Unknown error"), { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSeedDefaultSkills = async () => {
    const toastId = toast.loading("Seeding default Technical Stack data...")
    try {
      if (isSupabaseConfigured) {
        const payload = defaultSkills.map((s, idx) => ({
          name: s.name,
          category: s.category,
          icon_name: s.icon_name || detectIconName(s.name),
          proficiency: s.proficiency || 90,
          display_order: idx + 1,
        }))

        const { error } = await supabase.from("skills").insert(payload)
        if (error) {
          console.warn("Supabase insert error during seed:", error)
        }
      }

      setSkills(defaultSkills)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
      toast.success(`Successfully seeded ${defaultSkills.length} Technical Stack skills!`, { id: toastId })
      loadHeaderData()
    } catch (err: any) {
      console.error("Seed skills error:", err)
      toast.error("Failed to seed skills: " + (err?.message || "Unknown error"), { id: toastId })
    }
  }

  const promptDeleteSkill = (skill: Skill) => {
    setDeleteDialog({
      open: true,
      id: skill.id,
      name: skill.name,
      isLoading: false,
      isError: false,
    })
  }

  const confirmDeleteSkill = async () => {
    if (!deleteDialog.id) return
    setDeleteDialog((prev) => ({ ...prev, isLoading: true, isError: false }))
    const toastId = toast.loading("Deleting skill...")
    try {
      const isUUID = deleteDialog.id.length > 20 && deleteDialog.id.includes("-")
      if (isSupabaseConfigured && isUUID) {
        const { error } = await supabase.from("skills").delete().eq("id", deleteDialog.id)
        if (error) throw error
      }
      setSkills((prev) => prev.filter((s) => s.id !== deleteDialog.id))
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
      toast.success("Skill deleted successfully.", { id: toastId })
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: any) {
      toast.error(err.message || "Failed to delete skill.", { id: toastId })
      setDeleteDialog((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: err.message || "Failed to delete skill. Please try again.",
      }))
    }
  }

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
      case "Backend":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "Database":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case "Mobile":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "Tools":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20"
      default:
        return "bg-green-500/10 text-green-400 border-green-500/20"
    }
  }

  const getCategoryCardBorder = (category: string) => {
    switch (category) {
      case "Frontend":
        return "hover:border-cyan-500/40"
      case "Backend":
        return "hover:border-emerald-500/40"
      case "Database":
        return "hover:border-amber-500/40"
      case "Mobile":
        return "hover:border-purple-500/40"
      case "Tools":
        return "hover:border-rose-500/40"
      default:
        return "hover:border-green-500/40"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend":
        return <Code2 className="w-4 h-4 text-cyan-400" />
      case "Backend":
        return <Cpu className="w-4 h-4 text-emerald-400" />
      case "Database":
        return <DbIcon className="w-4 h-4 text-amber-400" />
      case "Mobile":
        return <Smartphone className="w-4 h-4 text-purple-400" />
      case "Tools":
        return <Wrench className="w-4 h-4 text-rose-400" />
      default:
        return <Terminal className="w-4 h-4 text-green-400" />
    }
  }

  const filteredSkills = skills.filter((s) => {
    return selectedCategory === "All" || s.category === selectedCategory
  })



  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading skills...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Technical Stack & Skills</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure tech stack items, database categories, and icons
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            onClick={handleSeedDefaultSkills}
            className="bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 font-semibold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs cursor-pointer transition-all hover:scale-[1.02]"
            title="Seed full technical stack dataset"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> Seed Default Stack
          </Button>
          <Button
            onClick={() => {
              setIsEditingSkill({ name: "", category: "Backend", icon_name: "" })
              setShowSheet(true)
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs cursor-pointer shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Skill
          </Button>
        </div>
      </div>


      {/* Filter Category Container */}
      <div className="flex items-center justify-between gap-3 bg-[#1b1b1b]/50 p-3 rounded-2xl border border-[#262626]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs text-gray-400 font-semibold px-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-green-400" /> Filter:
          </span>
          {["All", ...SKILL_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-green-500 text-slate-950 font-extrabold shadow-md shadow-green-500/20"
                  : "bg-[#141414] text-gray-400 hover:text-white hover:bg-[#222]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-[#181818] border border-[#262626] rounded-3xl p-10 text-center space-y-3">
          <p className="text-sm text-gray-400">No skills match your filter criteria.</p>
          <Button
            type="button"
            onClick={() => {
              setSelectedCategory("All")
            }}
            className="bg-[#242424] hover:bg-[#303030] text-xs text-white rounded-xl h-8 px-3"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((s) => (
            <div
              key={s.id}
              className={`bg-[#1b1b1b] border border-[#262626] ${getCategoryCardBorder(
                s.category
              )} p-4 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-xl transition-all group`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center shrink-0">
                  {renderSkillIcon(s.icon_name, s.name, 22)}
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm group-hover:text-green-400 transition-colors">
                    {s.name}
                  </div>
                  <span
                    className={`text-[10px] border uppercase tracking-wider font-normal px-2 py-0.5 rounded-full inline-block ${getCategoryBadgeStyle(
                      s.category
                    )}`}
                  >
                    {s.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsEditingSkill(s)
                    setShowSheet(true)
                  }}
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-xl cursor-pointer transition-colors"
                  title="Edit Skill"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => promptDeleteSkill(s)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl cursor-pointer transition-colors"
                  title="Delete Skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skill Edit / Create Shadcn Sheet Drawer */}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        {isEditingSkill && (
          <SheetContent side="right" className="w-full sm:max-w-md bg-[#181818] p-6 sm:p-8 border-l border-[#282828] overflow-y-auto no-scrollbar">
            <SheetHeader className="pb-4 border-b border-[#262626]">
              <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                {isEditingSkill.id ? "Edit Technical Skill" : "Add Technical Skill"}
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-400">
                Specify skill title, database enum category, and SimpleIcons identifier.
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSaveSkill} className="space-y-6 pt-6">
              {/* Skill Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Skill Name
                </label>
                <Input
                  value={isEditingSkill.name}
                  onChange={(e) => {
                    const newName = e.target.value
                    const autoDetected = detectIconName(newName)
                    setIsEditingSkill({
                      ...isEditingSkill,
                      name: newName,
                      icon_name: autoDetected !== "SiCode" ? autoDetected : (isEditingSkill.icon_name || autoDetected),
                    })
                  }}
                  required
                  placeholder="e.g. Golang, NestJS, React.js, Docker"
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5"
                />
              </div>

              {/* Database Enum Category Selection with Shadcn UI Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center justify-between">
                  <span>Category (Database Enum)</span>
                  <span className="text-[10px] text-green-400 font-mono font-semibold">DB Schema Enum</span>
                </label>
                <Select
                  value={isEditingSkill.category}
                  onValueChange={(val) =>
                    setIsEditingSkill({ ...isEditingSkill, category: val })
                  }
                >
                  <SelectTrigger className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5">
                    <SelectValue placeholder="Select Database Enum Category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Live Icon Preview & Selection */}
              <div className="bg-[#141414] p-3.5 rounded-2xl border border-[#262626] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center shrink-0">
                    {renderSkillIcon(isEditingSkill.icon_name, isEditingSkill.name, 28)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Active Icon Preview</span>
                      <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">
                        {isEditingSkill.icon_name || detectIconName(isEditingSkill.name)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Auto-detected from skill name or selected below
                    </p>
                  </div>
                </div>

                {/* Quick Preset Icon Chips */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">
                    Quick Icon Presets
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                    {SKILL_ICON_SUGGESTIONS.map((preset) => {
                      const isSelected = isEditingSkill.icon_name === preset.icon_name
                      return (
                        <button
                          key={preset.icon_name}
                          type="button"
                          onClick={() =>
                            setIsEditingSkill({
                              ...isEditingSkill,
                              icon_name: preset.icon_name,
                            })
                          }
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-[10px] transition-all cursor-pointer ${
                            isSelected
                              ? "bg-green-500/20 border-green-500 text-green-400 font-bold"
                              : "bg-[#181818] border-[#282828] text-gray-400 hover:text-white hover:border-[#383838]"
                          }`}
                        >
                          {renderSkillIcon(preset.icon_name, preset.label, 14)}
                          <span className="truncate">{preset.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Icon Identifier Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  SimpleIcons Identifier Key
                </label>
                <Input
                  value={isEditingSkill.icon_name || ""}
                  onChange={(e) =>
                    setIsEditingSkill({ ...isEditingSkill, icon_name: e.target.value })
                  }
                  placeholder="e.g. SiGo, SiNestjs, SiReact, SiPython"
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5 font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">Refers to standard SimpleIcons icon identifier.</p>
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
                      <span>Saving Skill...</span>
                    </>
                  ) : (
                    <span>Save Skill</span>
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
        title="Delete Skill?"
        description={`Are you sure you want to delete "${deleteDialog.name || "this skill"}"? This action cannot be undone.`}
        confirmText="Delete Skill"
        cancelText="Cancel"
        onConfirm={confirmDeleteSkill}
        onCancel={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        isLoading={deleteDialog.isLoading}
        loadingText="Deleting skill..."
        isError={deleteDialog.isError}
        errorTitle="Deletion Failed"
        errorMessage={deleteDialog.errorMessage}
      />
    </motion.div>
  )
}
