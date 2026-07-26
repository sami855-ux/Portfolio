import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Plus,
  Edit,
  Trash2,
  Share2,
  Globe,
  Mail,
  ExternalLink,
  Search,
  GripVertical,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTelegram,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa"

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
  supabase,
  isSupabaseConfigured,
  getContactLinks,
} from "@/lib/supabase"
import type { ContactLink } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

const SOCIAL_PRESETS = [
  { name: "GitHub", icon_name: "github", icon: FaGithub, color: "text-slate-200" },
  { name: "LinkedIn", icon_name: "linkedin", icon: FaLinkedin, color: "text-blue-400" },
  { name: "Twitter / X", icon_name: "twitter", icon: FaTwitter, color: "text-sky-400" },
  { name: "Telegram", icon_name: "telegram", icon: FaTelegram, color: "text-cyan-400" },
  { name: "Email", icon_name: "email", icon: FaEnvelope, color: "text-emerald-400" },
  { name: "Instagram", icon_name: "instagram", icon: FaInstagram, color: "text-rose-400" },
  { name: "YouTube", icon_name: "youtube", icon: FaYoutube, color: "text-red-400" },
  { name: "Discord", icon_name: "discord", icon: FaDiscord, color: "text-indigo-400" },
  { name: "Portfolio", icon_name: "globe", icon: FaGlobe, color: "text-green-400" },
]

const ICON_SUGGESTIONS = [
  { name: "github", label: "GitHub Code Icon" },
  { name: "linkedin", label: "LinkedIn Network Icon" },
  { name: "twitter", label: "Twitter / X Bird Icon" },
  { name: "telegram", label: "Telegram Message Icon" },
  { name: "email", label: "Email Mail Envelope Icon" },
  { name: "instagram", label: "Instagram Camera Icon" },
  { name: "youtube", label: "YouTube Video Icon" },
  { name: "discord", label: "Discord Chat Icon" },
  { name: "globe", label: "Globe Website Icon" },
  { name: "facebook", label: "Facebook Social Icon" },
  { name: "whatsapp", label: "WhatsApp Chat Icon" },
  { name: "medium", label: "Medium Blog Icon" },
]

export default function AdminLinks() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [activeTab, setActiveTab] = useState<"links" | "floating">("links")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([])
  const [floatingCards, setFloatingCards] = useState<FloatingCard[]>([])
  const [isEditingLink, setIsEditingLink] = useState<ContactLink | null>(null)
  const [isEditingFloating, setIsEditingFloating] = useState<FloatingCard | null>(null)
  const [showSheet, setShowSheet] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Drag & drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id?: string
    name?: string
    type?: "link" | "floating"
    isLoading: boolean
    isError: boolean
    errorMessage?: string
  }>({ open: false, isLoading: false, isError: false })

  const loadData = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured) {
        const { data: linkData } = await supabase
          .from("contact_links")
          .select("*")
          .order("display_order", { ascending: true })
        if (linkData && linkData.length > 0) {
          setContactLinks(linkData as ContactLink[])
        } else {
          const fallback = await getContactLinks()
          setContactLinks(fallback)
        }

        const { data: cardData } = await supabase
          .from("floating_cards")
          .select("*")
          .order("display_order", { ascending: true })
        if (cardData && cardData.length > 0) {
          setFloatingCards(cardData as FloatingCard[])
        } else {
          const fallback = await getFloatingCards()
          setFloatingCards(fallback)
        }
      } else {
        const fallbackLinks = await getContactLinks()
        setContactLinks(fallbackLinks)
        const fallbackCards = await getFloatingCards()
        setFloatingCards(fallbackCards)
      }
    } catch (err) {
      console.error("Error loading links & floating cards:", err)
      const fallbackLinks = await getContactLinks()
      setContactLinks(fallbackLinks)
      const fallbackCards = await getFloatingCards()
      setFloatingCards(fallbackCards)
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
    const updated = [...contactLinks]
    const [draggedItem] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, draggedItem)
    setDraggedIndex(index)
    setContactLinks(updated)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const moveLink = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= contactLinks.length) return
    const updated = [...contactLinks]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setContactLinks(updated)
  }

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingLink || !isEditingLink.name || !isEditingLink.url) {
      toast.error("Please provide both channel name and URL.")
      return
    }

    setIsSaving(true)
    const isNew = !isEditingLink.id || !(isEditingLink.id.length > 20 && isEditingLink.id.includes("-"))
    const toastId = toast.loading(isNew ? "Creating new social link..." : "Saving link changes...")

    try {
      if (isSupabaseConfigured) {
        const isUUID = isEditingLink.id && isEditingLink.id.length > 20 && isEditingLink.id.includes("-")
        if (isUUID) {
          const { error: updateErr } = await supabase
            .from("contact_links")
            .update({
              name: isEditingLink.name,
              url: isEditingLink.url,
              icon_name: isEditingLink.icon_name,
              is_active: isEditingLink.is_active ?? true,
            })
            .eq("id", isEditingLink.id)

          if (updateErr) throw new Error(updateErr.message)
        } else {
          const { id, ...newLinkData } = isEditingLink
          const { data: inserted, error: insertErr } = await supabase
            .from("contact_links")
            .insert([{
              name: newLinkData.name,
              url: newLinkData.url,
              icon_name: newLinkData.icon_name || "github",
              is_active: newLinkData.is_active ?? true,
              display_order: contactLinks.length + 1,
            }])
            .select()

          if (insertErr) throw new Error(insertErr.message)

          if (inserted && inserted[0]) {
            setContactLinks((prev) => [...prev, inserted[0] as ContactLink])
            setShowSheet(false)
            setIsEditingLink(null)
            toast.success("Social link created successfully!", { id: toastId })
            loadHeaderData()
            return
          }
        }
      }

      // Update state locally
      if (isEditingLink.id) {
        setContactLinks((prev) =>
          prev.map((l) => (l.id === isEditingLink.id ? isEditingLink : l))
        )
      } else {
        const newLink = { ...isEditingLink, id: Date.now().toString() }
        setContactLinks((prev) => [...prev, newLink])
      }

      setShowSheet(false)
      setIsEditingLink(null)
      toast.success(isNew ? "Social link created successfully!" : "Social link updated successfully!", { id: toastId })
      loadHeaderData()
    } catch (err: any) {
      console.error("Save link error:", err)
      toast.error("Failed to save link: " + (err?.message || "Unknown error"), { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const promptDeleteLink = (link: ContactLink) => {
    setDeleteDialog({
      open: true,
      id: link.id,
      name: link.name,
      isLoading: false,
      isError: false,
    })
  }

  const confirmDeleteLink = async () => {
    if (!deleteDialog.id) return
    setDeleteDialog((prev) => ({ ...prev, isLoading: true, isError: false }))
    const toastId = toast.loading("Deleting social link...")
    try {
      if (isSupabaseConfigured && !deleteDialog.id.startsWith("demo")) {
        const { error } = await supabase.from("contact_links").delete().eq("id", deleteDialog.id)
        if (error) throw error
      }
      setContactLinks((prev) => prev.filter((l) => l.id !== deleteDialog.id))
      toast.success("Social link deleted successfully.", { id: toastId })
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: any) {
      toast.error(err.message || "Failed to delete link.", { id: toastId })
      setDeleteDialog((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: err.message || "Failed to delete link. Please try again.",
      }))
    }
  }

  const renderSocialIcon = (iconName?: string, name?: string) => {
    const key = (iconName || name || "").toLowerCase()
    if (key.includes("github")) return <FaGithub className="w-5 h-5 text-slate-200" />
    if (key.includes("linkedin")) return <FaLinkedin className="w-5 h-5 text-blue-400" />
    if (key.includes("twitter") || key.includes("x")) return <FaTwitter className="w-5 h-5 text-sky-400" />
    if (key.includes("telegram")) return <FaTelegram className="w-5 h-5 text-cyan-400" />
    if (key.includes("email") || key.includes("mail")) return <FaEnvelope className="w-5 h-5 text-emerald-400" />
    if (key.includes("instagram")) return <FaInstagram className="w-5 h-5 text-rose-400" />
    if (key.includes("youtube")) return <FaYoutube className="w-5 h-5 text-red-400" />
    if (key.includes("discord")) return <FaDiscord className="w-5 h-5 text-indigo-400" />
    return <FaGlobe className="w-5 h-5 text-green-400" />
  }

  const filteredLinks = contactLinks.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      {/* Top Suite Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Social Channels & Floating Cards</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage social media links, email handles, and dynamic hero floating widgets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selection Switcher */}
          <div className="flex items-center bg-[#141414] p-1 rounded-2xl border border-[#2a2a2a]">
            <button
              onClick={() => setActiveTab("links")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "links"
                  ? "bg-green-500 text-slate-950 shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Social Links ({contactLinks.length})
            </button>
            <button
              onClick={() => setActiveTab("floating")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "floating"
                  ? "bg-green-500 text-slate-950 shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Floating Cards ({floatingCards.length})
            </button>
          </div>

          <Button
            onClick={() => {
              if (activeTab === "links") {
                setIsEditingLink({
                  name: "",
                  url: "",
                  icon_name: "github",
                  is_active: true,
                })
              } else {
                setIsEditingFloating({
                  name: "",
                  title: "",
                  position: "top-1/2 left-1/2",
                  is_active: true,
                })
              }
              setShowSheet(true)
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs cursor-pointer shadow-lg shadow-green-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add {activeTab === "links" ? "Link" : "Floating Card"}
          </Button>
        </div>
      </div>



      {/* Content View Depending on Active Tab */}
      {activeTab === "links" ? (
        contactLinks.length === 0 ? (
          <div className="bg-[#181818] border border-[#262626] rounded-3xl p-10 text-center space-y-3">
            <p className="text-sm text-gray-400">No social links added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactLinks.map((l, idx) => (
              <motion.div
                key={l.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-[#1b1b1b] border border-[#262626] hover:border-green-500/40 p-5 rounded-3xl space-y-3 shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#141414] border border-[#282828] flex items-center justify-center shrink-0 group-hover:border-green-500/30 transition-colors">
                      {renderSocialIcon(l.icon_name, l.name)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm truncate group-hover:text-green-400 transition-colors">
                          {l.name}
                        </h3>
                        {l.is_active !== false ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-normal text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-normal text-gray-400 bg-gray-500/10 border border-gray-500/20 px-2 py-0.5 rounded-full">
                            <XCircle className="w-2.5 h-2.5" /> Hidden
                          </span>
                        )}
                      </div>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-400 hover:text-green-400 truncate max-w-[180px] block transition-colors flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate">{l.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setIsEditingLink(l)
                        setIsEditingFloating(null)
                        setShowSheet(true)
                      }}
                      className="p-1.5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors"
                      title="Edit Link"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteDialog({
                          open: true,
                          id: l.id,
                          name: l.name,
                          type: "link",
                          isLoading: false,
                          isError: false,
                        })
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        /* Floating Cards Grid */
        floatingCards.length === 0 ? (
          <div className="bg-[#181818] border border-[#262626] rounded-3xl p-10 text-center space-y-3">
            <p className="text-sm text-gray-400">No background floating cards configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {floatingCards.map((c, idx) => (
              <motion.div
                key={c.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-[#1b1b1b] border border-[#262626] hover:border-purple-500/40 p-5 rounded-3xl space-y-3 shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-purple-400 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{c.title}</p>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full inline-block mt-2">
                      Pos: {c.position || "Default"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setIsEditingFloating(c)
                        setIsEditingLink(null)
                        setShowSheet(true)
                      }}
                      className="p-1.5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors"
                      title="Edit Floating Card"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteDialog({
                          open: true,
                          id: c.id,
                          name: c.name,
                          type: "floating",
                          isLoading: false,
                          isError: false,
                        })
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                      title="Delete Floating Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Social Link or Floating Card Edit / Create Shadcn Sheet Drawer */}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        {isEditingLink && (
          <SheetContent side="right" className="w-full sm:max-w-md bg-[#181818] p-6 sm:p-8 border-l border-[#282828] overflow-y-auto no-scrollbar">
            <SheetHeader className="pb-4 border-b border-[#262626]">
              <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                {isEditingLink.id ? "Edit Social Link" : "Add Social Link"}
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-400">
                Choose a platform preset or enter custom channel details.
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSaveLink} className="space-y-5 pt-6">
              {/* Quick Social Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Quick Platform Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SOCIAL_PRESETS.map((preset) => {
                    const PresetIcon = preset.icon
                    const isSelected = isEditingLink.icon_name === preset.icon_name || isEditingLink.name === preset.name
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setIsEditingLink({
                            ...isEditingLink,
                            name: preset.name.split(" / ")[0],
                            icon_name: preset.icon_name,
                          })
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-green-500/20 border-green-500 text-green-400 font-bold shadow-md shadow-green-500/10"
                            : "bg-[#141414] border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#383838]"
                        }`}
                      >
                        <PresetIcon className={`w-4 h-4 mb-1 ${preset.color}`} />
                        <span className="text-[10px] truncate max-w-[80px]">{preset.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Platform Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Platform / Channel Name
                </label>
                <Input
                  value={isEditingLink.name}
                  onChange={(e) =>
                    setIsEditingLink({ ...isEditingLink, name: e.target.value })
                  }
                  placeholder="e.g. GitHub, LinkedIn, Telegram, Personal Email"
                  required
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5"
                />
              </div>

              {/* Icon Identifier Key Input with Suggestions */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Icon Identifier Key</span>
                  <span className="text-[10px] text-green-400 font-mono">Real-time Suggestions</span>
                </label>
                <Input
                  value={isEditingLink.icon_name || ""}
                  onChange={(e) =>
                    setIsEditingLink({ ...isEditingLink, icon_name: e.target.value })
                  }
                  placeholder="e.g. github, linkedin, twitter, telegram, email"
                  required
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5 font-mono"
                />

                {/* Auto Suggestions Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-gray-500 font-semibold self-center mr-1">Suggestions:</span>
                  {ICON_SUGGESTIONS.filter(
                    (s) =>
                      !isEditingLink.icon_name ||
                      s.name.includes((isEditingLink.icon_name || "").toLowerCase())
                  ).map((sugg) => (
                    <button
                      key={sugg.name}
                      type="button"
                      onClick={() =>
                        setIsEditingLink({
                          ...isEditingLink,
                          icon_name: sugg.name,
                        })
                      }
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                        isEditingLink.icon_name === sugg.name
                          ? "bg-green-500/20 border-green-500 text-green-400 font-bold"
                          : "bg-[#141414] border-[#2a2a2a] text-gray-400 hover:text-white"
                      }`}
                    >
                      + {sugg.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target URL Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Target URL / Link
                </label>
                <Input
                  value={isEditingLink.url}
                  onChange={(e) =>
                    setIsEditingLink({ ...isEditingLink, url: e.target.value })
                  }
                  placeholder="https://github.com/username or mailto:you@domain.com"
                  required
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5 font-mono"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141414] border border-[#2a2a2a]">
                <div>
                  <label className="text-xs font-bold text-white block">Active Status</label>
                  <span className="text-[11px] text-gray-400">Display this social link on your public portfolio</span>
                </div>
                <input
                  type="checkbox"
                  checked={isEditingLink.is_active !== false}
                  onChange={(e) =>
                    setIsEditingLink({ ...isEditingLink, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-green-500 rounded cursor-pointer"
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
                      <span>Saving Link...</span>
                    </>
                  ) : (
                    <span>Save Link</span>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        )}

        {isEditingFloating && (
          <SheetContent side="right" className="w-full sm:max-w-md bg-[#181818] p-6 sm:p-8 border-l border-[#282828] overflow-y-auto no-scrollbar">
            <SheetHeader className="pb-4 border-b border-[#262626]">
              <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                {isEditingFloating.id ? "Edit Floating Card" : "Add Floating Card"}
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-400">
                Configure background floating card title, subtitle, and screen position.
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!isEditingFloating.name || !isEditingFloating.title) {
                  toast.error("Please fill in both title and subtitle.")
                  return
                }
                setIsSaving(true)
                const toastId = toast.loading("Saving floating card...")
                try {
                  if (isSupabaseConfigured) {
                    const isUUID = isEditingFloating.id && isEditingFloating.id.length > 20 && isEditingFloating.id.includes("-")
                    if (isUUID) {
                      const { error } = await supabase
                        .from("floating_cards")
                        .update({
                          name: isEditingFloating.name,
                          title: isEditingFloating.title,
                          position: isEditingFloating.position || "top-1/2 left-1/2",
                          is_active: isEditingFloating.is_active ?? true,
                        })
                        .eq("id", isEditingFloating.id)
                      if (error) throw error
                    } else {
                      const { id, ...cardData } = isEditingFloating
                      const { data: inserted, error } = await supabase
                        .from("floating_cards")
                        .insert([{
                          name: cardData.name,
                          title: cardData.title,
                          position: cardData.position || "top-1/2 left-1/2",
                          is_active: cardData.is_active ?? true,
                          display_order: floatingCards.length + 1,
                        }])
                        .select()
                      if (error) throw error
                      if (inserted && inserted[0]) {
                        setFloatingCards((prev) => [...prev, inserted[0] as FloatingCard])
                        setShowSheet(false)
                        setIsEditingFloating(null)
                        toast.success("Floating card created!", { id: toastId })
                        return
                      }
                    }
                  }

                  if (isEditingFloating.id) {
                    setFloatingCards((prev) =>
                      prev.map((c) => (c.id === isEditingFloating.id ? isEditingFloating : c))
                    )
                  } else {
                    const newCard = { ...isEditingFloating, id: Date.now().toString() }
                    setFloatingCards((prev) => [...prev, newCard])
                  }

                  setShowSheet(false)
                  setIsEditingFloating(null)
                  toast.success("Floating card saved successfully!", { id: toastId })
                } catch (err: any) {
                  toast.error(err.message || "Failed to save card", { id: toastId })
                } finally {
                  setIsSaving(false)
                }
              }}
              className="space-y-5 pt-6"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Card Main Title / Highlight
                </label>
                <Input
                  value={isEditingFloating.name}
                  onChange={(e) =>
                    setIsEditingFloating({ ...isEditingFloating, name: e.target.value })
                  }
                  placeholder="e.g. samitale86@gmail.com, Big Tech lover"
                  required
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Card Subtitle / Role
                </label>
                <Input
                  value={isEditingFloating.title}
                  onChange={(e) =>
                    setIsEditingFloating({ ...isEditingFloating, title: e.target.value })
                  }
                  placeholder="e.g. +251 978109304, Programmer"
                  required
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Screen Tailwind Position Class
                </label>
                <Input
                  value={isEditingFloating.position || ""}
                  onChange={(e) =>
                    setIsEditingFloating({ ...isEditingFloating, position: e.target.value })
                  }
                  placeholder="e.g. top-2/3 -right-5 or top-1/6 left-5"
                  className="bg-[#141414] border border-[#2a2a2a] focus:border-green-500 text-white text-xs rounded-xl h-11 px-3.5 font-mono"
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
                      <span>Saving Card...</span>
                    </>
                  ) : (
                    <span>Save Card</span>
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
        title={`Delete ${deleteDialog.type === "floating" ? "Floating Card" : "Social Link"}?`}
        description={`Are you sure you want to delete "${deleteDialog.name || "this item"}"? This action cannot be undone.`}
        confirmText="Delete Item"
        cancelText="Cancel"
        onConfirm={async () => {
          if (!deleteDialog.id) return
          setDeleteDialog((prev) => ({ ...prev, isLoading: true, isError: false }))
          const toastId = toast.loading("Deleting item...")
          try {
            if (isSupabaseConfigured && !deleteDialog.id.startsWith("demo")) {
              const table = deleteDialog.type === "floating" ? "floating_cards" : "contact_links"
              const { error } = await supabase.from(table).delete().eq("id", deleteDialog.id)
              if (error) throw error
            }
            if (deleteDialog.type === "floating") {
              setFloatingCards((prev) => prev.filter((c) => c.id !== deleteDialog.id))
            } else {
              setContactLinks((prev) => prev.filter((l) => l.id !== deleteDialog.id))
            }
            toast.success("Item deleted successfully.", { id: toastId })
            loadHeaderData()
            setDeleteDialog({ open: false, isLoading: false, isError: false })
          } catch (err: any) {
            toast.error(err.message || "Failed to delete item.", { id: toastId })
            setDeleteDialog((prev) => ({
              ...prev,
              isLoading: false,
              isError: true,
              errorMessage: err.message || "Failed to delete item. Please try again.",
            }))
          }
        }}
        onCancel={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        isLoading={deleteDialog.isLoading}
        loadingText="Deleting..."
        isError={deleteDialog.isError}
        errorTitle="Deletion Failed"
        errorMessage={deleteDialog.errorMessage}
      />
    </motion.div>
  )
}
