import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Globe,
  Smartphone,
  Server,
  CreditCard,
  CheckCircle2,
} from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  apiClient,
  isApiConfigured,
  defaultServices,
} from "@/lib/api"
import type { Service } from "@/types/api"

import { useQueryClient } from "@tanstack/react-query"
import { useServicesQuery, QUERY_KEYS } from "@/hooks/usePortfolioQueries"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

const ICON_OPTIONS = [
  { value: "Globe", label: "Globe (Web App)" },
  { value: "Smartphone", label: "Smartphone (Mobile App)" },
  { value: "Server", label: "Server (Backend / API)" },
  { value: "CreditCard", label: "Credit Card (Payment)" },
]

export default function AdminServices() {
  const context = useOutletContext<AdminContext>()
  const loadHeaderData = context?.loadHeaderData || (() => {})
  const queryClient = useQueryClient()
  const { data: dbServices } = useServicesQuery()

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [isEditingService, setIsEditingService] = useState<Service | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id?: string
    title?: string
    isLoading: boolean
  }>({ open: false, isLoading: false })

  useEffect(() => {
    if (dbServices) {
      setServices(dbServices)
      setLoading(false)
    } else {
      setServices(defaultServices)
      setLoading(false)
    }
  }, [dbServices])

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "smartphone":
      case "mobile":
        return <Smartphone className="w-4 h-4 text-emerald-400" />
      case "server":
      case "backend":
        return <Server className="w-4 h-4 text-emerald-400" />
      case "creditcard":
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-400" />
      case "globe":
      default:
        return <Globe className="w-4 h-4 text-emerald-400" />
    }
  }

  const handleOpenNew = () => {
    setIsEditingService({
      title: "",
      description: "",
      icon_name: "Globe",
      stack: "",
      contact_url: "https://sam-nu-fawn.vercel.app/contact",
      display_order: services.length + 1,
      is_active: true,
    })
    setShowSheet(true)
  }

  const handleOpenEdit = (service: Service) => {
    setIsEditingService({ ...service })
    setShowSheet(true)
  }

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditingService || !isEditingService.title.trim()) {
      toast.error("Please provide a service title.")
      return
    }

    setIsSaving(true)
    const isUUID = Boolean(isEditingService.id && isEditingService.id.length > 20 && isEditingService.id.includes("-"))
    const isNew = !isUUID
    const toastId = toast.loading(isNew ? "Creating service..." : "Updating service...")

    const payload = {
      title: isEditingService.title.trim(),
      description: isEditingService.description.trim(),
      icon_name: isEditingService.icon_name || "Globe",
      stack: isEditingService.stack || "",
      contact_url: isEditingService.contact_url || "https://sam-nu-fawn.vercel.app/contact",
      display_order: isEditingService.display_order ?? services.length + 1,
      is_active: isEditingService.is_active ?? true,
    }

    try {
      if (isApiConfigured) {
        if (!isNew && isEditingService.id) {
          const { error } = await apiClient.from("services").update(payload).eq("id", isEditingService.id)
          if (error) throw new Error(error.message)
        } else {
          const { error } = await apiClient.from("services").insert([payload])
          if (error) throw new Error(error.message)
        }
      }

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services })
      toast.success(isNew ? "Service created successfully!" : "Service updated successfully!", { id: toastId })
      setShowSheet(false)
      loadHeaderData()
    } catch (err: any) {
      console.error("Save service error:", err)
      toast.error(err?.message || "Failed to save service", { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.id) return
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }))
    const toastId = toast.loading("Deleting service...")

    try {
      if (isApiConfigured && deleteDialog.id.length > 20 && deleteDialog.id.includes("-")) {
        const { error } = await apiClient.from("services").delete().eq("id", deleteDialog.id)
        if (error) throw new Error(error.message)
      } else {
        setServices((prev) => prev.filter((s) => s.id !== deleteDialog.id))
      }

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services })
      toast.success("Service removed successfully!", { id: toastId })
      setDeleteDialog({ open: false, isLoading: false })
      loadHeaderData()
    } catch (err: any) {
      console.error("Delete service error:", err)
      toast.error(err?.message || "Failed to delete service", { id: toastId })
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }))
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
        <p className="text-xs text-zinc-500">Loading services...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-400" />
            <span>Core Capabilities & Services</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your technical specializations, architectural offerings, and client solution cards.
          </p>
        </div>

        <Button
          onClick={handleOpenNew}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl h-10 px-5 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#18181c] border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
                    {renderIcon(item.icon_name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Order: {item.display_order ?? idx + 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({
                        open: true,
                        id: item.id,
                        title: item.title,
                        isLoading: false,
                      })
                    }
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 font-mono gap-2">
              <span className="truncate">{item.stack}</span>
              <span className="text-emerald-400 shrink-0 font-semibold flex items-center gap-1">
                Active <CheckCircle2 className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit / Create Sheet */}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        <SheetContent className="bg-[#18181c] border-zinc-800 text-white w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="text-left pb-4 border-b border-zinc-800">
            <SheetTitle className="text-white text-base font-bold">
              {isEditingService?.id ? "Edit Service" : "New Service"}
            </SheetTitle>
            <SheetDescription className="text-zinc-400 text-xs">
              Configure this core capability card displayed on your home showcase.
            </SheetDescription>
          </SheetHeader>

          {isEditingService && (
            <form onSubmit={handleSaveService} className="space-y-5 pt-5 text-xs">
              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Service Title <span className="text-emerald-400">*</span>
                </label>
                <Input
                  value={isEditingService.title}
                  onChange={(e) =>
                    setIsEditingService({ ...isEditingService, title: e.target.value })
                  }
                  placeholder="e.g. Full-Stack Web App Development"
                  required
                  className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-10 px-3.5"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Description <span className="text-emerald-400">*</span>
                </label>
                <Textarea
                  value={isEditingService.description}
                  onChange={(e) =>
                    setIsEditingService({ ...isEditingService, description: e.target.value })
                  }
                  placeholder="Brief description of the service..."
                  required
                  rows={3}
                  className="bg-zinc-900 border-zinc-800 text-white rounded-xl p-3 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">Icon</label>
                <Select
                  value={isEditingService.icon_name || "Globe"}
                  onValueChange={(val) =>
                    setIsEditingService({ ...isEditingService, icon_name: val })
                  }
                >
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white rounded-xl h-10 px-3.5">
                    <SelectValue placeholder="Select Icon" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Tech Stack / Highlight Tags
                </label>
                <Input
                  value={isEditingService.stack || ""}
                  onChange={(e) =>
                    setIsEditingService({ ...isEditingService, stack: e.target.value })
                  }
                  placeholder="e.g. React • Next.js • TypeScript • Tailwind CSS"
                  className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-10 px-3.5"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1.5">
                  Contact Action URL
                </label>
                <Input
                  value={isEditingService.contact_url || ""}
                  onChange={(e) =>
                    setIsEditingService({ ...isEditingService, contact_url: e.target.value })
                  }
                  placeholder="https://sam-nu-fawn.vercel.app/contact or /contact"
                  className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-10 px-3.5"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div>
                  <label className="font-semibold text-white block">Active Card</label>
                  <p className="text-[10px] text-zinc-500">Show on home page</p>
                </div>
                <Switch
                  checked={isEditingService.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setIsEditingService({ ...isEditingService, is_active: checked })
                  }
                />
              </div>

              <SheetFooter className="pt-4 border-t border-zinc-800 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSheet(false)}
                  className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isSaving ? "Saving..." : "Save Service"}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        variant="danger"
        title="Delete Service?"
        description={`Are you sure you want to delete "${deleteDialog.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteDialog.isLoading}
        loadingText="Deleting..."
      />
    </div>
  )
}
