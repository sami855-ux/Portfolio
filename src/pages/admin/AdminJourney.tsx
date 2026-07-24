import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

export default function AdminJourney() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [loading, setLoading] = useState(true)
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([])
  const [isEditingJourney, setIsEditingJourney] = useState<JourneyItem | null>(null)
  const [showModal, setShowModal] = useState(false)

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

  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingJourney) return

    if (isSupabaseConfigured) {
      if (isEditingJourney.id && !isEditingJourney.id.startsWith("demo")) {
        await supabase
          .from("journey_timeline")
          .update(isEditingJourney)
          .eq("id", isEditingJourney.id)
      } else {
        const { id, ...newItem } = isEditingJourney
        await supabase.from("journey_timeline").insert([newItem])
      }
    }

    if (isEditingJourney.id) {
      setJourneyItems((prev) =>
        prev.map((j) => (j.id === isEditingJourney.id ? isEditingJourney : j))
      )
    } else {
      const newItem = { ...isEditingJourney, id: Date.now().toString() }
      setJourneyItems((prev) => [...prev, newItem])
    }

    setShowModal(false)
    setIsEditingJourney(null)
    triggerToast("Journey milestone saved!")
    loadHeaderData()
  }

  const handleDeleteJourney = async (id?: string) => {
    if (!id) return
    if (confirm("Are you sure you want to delete this milestone?")) {
      if (isSupabaseConfigured && !id.startsWith("demo")) {
        await supabase.from("journey_timeline").delete().eq("id", id)
      }
      setJourneyItems((prev) => prev.filter((j) => j.id !== id))
      triggerToast("Milestone deleted.")
      loadHeaderData()
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading career journey...</p>
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
          <h2 className="text-2xl font-bold text-white">Career Journey Timeline</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your career history, milestones, and education timeline
          </p>
        </div>
        <Button
          onClick={() => {
            setIsEditingJourney({ title: "", description: "", date_range: "" })
            setShowModal(true)
          }}
          className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Milestone
        </Button>
      </div>

      <div className="space-y-4">
        {journeyItems.map((j) => (
          <div
            key={j.id}
            className="bg-[#202020] border-none p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="text-xs text-green-500 font-bold">{j.date_range}</div>
              <h3 className="font-bold text-base text-white">{j.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                {j.description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditingJourney(j)
                  setShowModal(true)
                }}
                className="bg-[#181818] border-none hover:bg-[#282828] text-gray-300 text-xs rounded-xl cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button
                size="sm"
                onClick={() => handleDeleteJourney(j.id)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none text-xs rounded-xl cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Journey Modal */}
      {showModal && isEditingJourney && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#202020] border-none rounded-3xl p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-bold text-white">
              {isEditingJourney.id ? "Edit Milestone" : "Add Milestone"}
            </h3>

            <form onSubmit={handleSaveJourney} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Title</label>
                <Input
                  value={isEditingJourney.title}
                  onChange={(e) =>
                    setIsEditingJourney({ ...isEditingJourney, title: e.target.value })
                  }
                  required
                  className="bg-[#181818] border-none text-white text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Date Range</label>
                <Input
                  value={isEditingJourney.date_range}
                  onChange={(e) =>
                    setIsEditingJourney({ ...isEditingJourney, date_range: e.target.value })
                  }
                  placeholder="2023 - Present"
                  required
                  className="bg-[#181818] border-none text-white text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
                <Textarea
                  value={isEditingJourney.description}
                  onChange={(e) =>
                    setIsEditingJourney({ ...isEditingJourney, description: e.target.value })
                  }
                  required
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
                  Save Milestone
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
