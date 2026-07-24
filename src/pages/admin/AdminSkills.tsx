import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  supabase,
  isSupabaseConfigured,
  getSkills,
} from "@/lib/supabase"
import type { Skill } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminSkills() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [loading, setLoading] = useState(true)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isEditingSkill, setIsEditingSkill] = useState<Skill | null>(null)
  const [showModal, setShowModal] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getSkills()
      setSkills(data)
    } catch (err) {
      console.error("Error loading skills:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingSkill) return

    if (isSupabaseConfigured) {
      if (isEditingSkill.id && !isEditingSkill.id.startsWith("demo")) {
        await supabase.from("skills").update(isEditingSkill).eq("id", isEditingSkill.id)
      } else {
        const { id, ...newSkill } = isEditingSkill
        await supabase.from("skills").insert([newSkill])
      }
    }

    if (isEditingSkill.id) {
      setSkills((prev) =>
        prev.map((s) => (s.id === isEditingSkill.id ? isEditingSkill : s))
      )
    } else {
      const newSkill = { ...isEditingSkill, id: Date.now().toString() }
      setSkills((prev) => [...prev, newSkill])
    }

    setShowModal(false)
    setIsEditingSkill(null)
    triggerToast("Skill saved successfully!")
    loadHeaderData()
  }

  const handleDeleteSkill = async (id?: string) => {
    if (!id) return
    if (confirm("Are you sure you want to delete this skill?")) {
      if (isSupabaseConfigured && !id.startsWith("demo")) {
        await supabase.from("skills").delete().eq("id", id)
      }
      setSkills((prev) => prev.filter((s) => s.id !== id))
      triggerToast("Skill deleted.")
      loadHeaderData()
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your frontend, backend, database, and devops tech stack
          </p>
        </div>
        <Button
          onClick={() => {
            setIsEditingSkill({ name: "", category: "Frontend", icon_name: "SiReact" })
            setShowModal(true)
          }}
          className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div
            key={s.id}
            className="bg-[#202020] border-none p-4 rounded-2xl flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white text-sm">{s.name}</div>
              <span className="text-[10px] text-green-500 uppercase tracking-wider font-semibold">
                {s.category}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsEditingSkill(s)
                  setShowModal(true)
                }}
                className="p-1.5 text-gray-400 hover:text-white cursor-pointer"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteSkill(s.id)}
                className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Skill Modal */}
      {showModal && isEditingSkill && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#202020] border-none rounded-3xl p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-bold text-white">
              {isEditingSkill.id ? "Edit Skill" : "Add Skill"}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Skill Name</label>
                <Input
                  value={isEditingSkill.name}
                  onChange={(e) =>
                    setIsEditingSkill({ ...isEditingSkill, name: e.target.value })
                  }
                  required
                  className="bg-[#181818] border-none text-white text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                <Input
                  value={isEditingSkill.category}
                  onChange={(e) =>
                    setIsEditingSkill({ ...isEditingSkill, category: e.target.value })
                  }
                  placeholder="Frontend / Backend / Database / DevOps"
                  required
                  className="bg-[#181818] border-none text-white text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Icon Identifier</label>
                <Input
                  value={isEditingSkill.icon_name || ""}
                  onChange={(e) =>
                    setIsEditingSkill({ ...isEditingSkill, icon_name: e.target.value })
                  }
                  placeholder="SiReact / SiTypescript / SiNodedotjs"
                  className="bg-[#181818] border-none text-white text-xs rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="bg-[#181818] border-none text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 text-slate-950 font-bold text-xs rounded-xl">
                  Save Skill
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
