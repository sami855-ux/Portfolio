import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  supabase,
  isSupabaseConfigured,
  getContactLinks,
} from "@/lib/supabase"
import type { ContactLink } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminLinks() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [loading, setLoading] = useState(true)
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([])
  const [isEditingLink, setIsEditingLink] = useState<ContactLink | null>(null)
  const [showModal, setShowModal] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getContactLinks()
      setContactLinks(data)
    } catch (err) {
      console.error("Error loading contact links:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingLink) return

    if (isSupabaseConfigured) {
      if (isEditingLink.id && !isEditingLink.id.startsWith("demo")) {
        await supabase
          .from("contact_links")
          .update(isEditingLink)
          .eq("id", isEditingLink.id)
      } else {
        const { id, ...newLink } = isEditingLink
        await supabase.from("contact_links").insert([newLink])
      }
    }

    if (isEditingLink.id) {
      setContactLinks((prev) =>
        prev.map((l) => (l.id === isEditingLink.id ? isEditingLink : l))
      )
    } else {
      const newLink = { ...isEditingLink, id: Date.now().toString() }
      setContactLinks((prev) => [...prev, newLink])
    }

    setShowModal(false)
    setIsEditingLink(null)
    triggerToast("Social link saved!")
    loadHeaderData()
  }

  const handleDeleteLink = async (id?: string) => {
    if (!id) return
    if (confirm("Are you sure you want to delete this link?")) {
      if (isSupabaseConfigured && !id.startsWith("demo")) {
        await supabase.from("contact_links").delete().eq("id", id)
      }
      setContactLinks((prev) => prev.filter((l) => l.id !== id))
      triggerToast("Social link deleted.")
      loadHeaderData()
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading social links...</p>
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
          <h2 className="text-2xl font-bold text-white">Social & Contact Links</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your social media channels & profile URLs
          </p>
        </div>
        <Button
          onClick={() => {
            setIsEditingLink({
              name: "",
              url: "",
              icon_name: "github",
              is_active: true,
            })
            setShowModal(true)
          }}
          className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-4 py-2 rounded-2xl flex items-center gap-2 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Link
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactLinks.map((l) => (
          <div
            key={l.id}
            className="bg-[#202020] border-none p-4 rounded-2xl flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-white text-sm">{l.name}</div>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-green-500 hover:underline truncate max-w-[200px] block"
              >
                {l.url}
              </a>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsEditingLink(l)
                  setShowModal(true)
                }}
                className="p-1.5 text-gray-400 hover:text-white cursor-pointer"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteLink(l.id)}
                className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Link Modal */}
      {showModal && isEditingLink && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#202020] border-none rounded-3xl p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-lg font-bold text-white">
              {isEditingLink.id ? "Edit Social Link" : "Add Social Link"}
            </h3>

            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Platform Name</label>
                <Input
                  value={isEditingLink.name}
                  onChange={(e) =>
                    setIsEditingLink({ ...isEditingLink, name: e.target.value })
                  }
                  placeholder="GitHub / LinkedIn / Twitter"
                  required
                  className="bg-[#181818] border-none text-white text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">URL</label>
                <Input
                  value={isEditingLink.url}
                  onChange={(e) =>
                    setIsEditingLink({ ...isEditingLink, url: e.target.value })
                  }
                  placeholder="https://..."
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
                  Save Link
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
