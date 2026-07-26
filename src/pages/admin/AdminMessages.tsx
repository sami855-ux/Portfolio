import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Trash2, Send, Inbox, Mail, CheckCircle2, Clock, Eye, Sparkles } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
} from "@/lib/supabase"
import type { Message } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminMessages() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showSheet, setShowSheet] = useState(false)

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id?: string
    name?: string
    isLoading: boolean
    isError: boolean
    errorMessage?: string
  }>({ open: false, isLoading: false, isError: false })

  const loadData = async () => {
    setLoading(true)
    setErrorMsg("")
    try {
      if (isSupabaseConfigured) {
        const { data: msgData, error: fetchErr } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchErr) {
          console.warn("Error fetching messages:", fetchErr.message)
          if (fetchErr.message.includes("JWT issued at future") || fetchErr.message.includes("jwt")) {
            setErrorMsg("Authentication token synchronizing... Please refresh the page in a few seconds.")
          } else {
            setErrorMsg("Could not connect to Supabase inbox: " + fetchErr.message)
          }
        } else if (msgData) {
          setMessages(msgData as Message[])
        }
      } else {
        const sampleMsgs: Message[] = [
          {
            id: "demo-1",
            name: "Alexander Vance",
            email: "alex@example.com",
            subject: "Project Collaboration Inquiry",
            message:
              "Hi Samuel, I checked out your portfolio and loved your LMS and Negari projects! Would love to discuss a full-stack collaboration opportunity.",
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]
        setMessages(sampleMsgs)
      }
    } catch (err: any) {
      console.error("Error loading messages:", err)
      setErrorMsg("Failed to load inbox messages: " + (err?.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleMessageRead = async (id?: string, currentRead?: boolean) => {
    if (!id) return
    const nextRead = !currentRead
    try {
      if (isSupabaseConfigured && !id.startsWith("demo")) {
        const { error: updateErr } = await supabase.from("messages").update({ is_read: nextRead }).eq("id", id)
        if (updateErr) {
          toast.error("Failed to update status: " + updateErr.message)
          return
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: nextRead } : m))
      )
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: nextRead })
      }
      toast.success(nextRead ? "Marked as read." : "Marked as unread.")
      loadHeaderData()
    } catch (err: any) {
      toast.error("Error updating message status.")
    }
  }

  const promptDeleteMessage = (msg: Message) => {
    setDeleteDialog({
      open: true,
      id: msg.id,
      name: msg.name,
      isLoading: false,
      isError: false,
    })
  }

  const confirmDeleteMessage = async () => {
    if (!deleteDialog.id) return
    setDeleteDialog((prev) => ({ ...prev, isLoading: true, isError: false }))
    const toastId = toast.loading("Deleting message...")
    try {
      if (isSupabaseConfigured && !deleteDialog.id.startsWith("demo")) {
        const { error: delErr } = await supabase.from("messages").delete().eq("id", deleteDialog.id)
        if (delErr) throw delErr
      }
      const updated = messages.filter((m) => m.id !== deleteDialog.id)
      setMessages(updated)
      if (selectedMessage?.id === deleteDialog.id) {
        setSelectedMessage(null)
        setShowSheet(false)
      }
      toast.success("Message deleted.", { id: toastId })
      loadHeaderData()
      setDeleteDialog({ open: false, isLoading: false, isError: false })
    } catch (err: any) {
      toast.error(err.message || "Failed to delete message.", { id: toastId })
      setDeleteDialog((prev) => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: err.message || "Failed to delete message. Please try again.",
      }))
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    } catch {
      return dateStr
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading inbox messages...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Suite Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Messages Inbox</h2>
              {unreadCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Direct inquiries and contact form submissions from potential clients & collaborators
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold">
          <span>⚠️ {errorMsg}</span>
          <button
            onClick={() => setErrorMsg("")}
            className="text-red-400 hover:text-white font-bold ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Minimalist Message List Rows */}
      {messages.length === 0 ? (
        <div className="bg-[#181818] border border-[#262626] rounded-3xl p-12 text-center space-y-3 flex flex-col items-center justify-center">
          <Mail className="w-10 h-10 opacity-30 text-green-500 mb-1" />
          <p className="text-sm font-bold text-white">Your Inbox is Empty</p>
          <p className="text-xs text-gray-400 max-w-sm">
            Inquiries submitted through your public portfolio contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m, idx) => (
            <motion.div
              key={m.id || idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => {
                setSelectedMessage(m)
                setShowSheet(true)
                if (!m.is_read) toggleMessageRead(m.id, false)
              }}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-md ${
                !m.is_read
                  ? "bg-[#1e2620]/80 border-green-500/40 hover:border-green-500/70"
                  : "bg-[#1b1b1b] border-[#262626] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Status Indicator */}
                {!m.is_read ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-md shadow-green-500/50 animate-pulse shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-gray-500 shrink-0" />
                )}

                {/* Avatar Initials */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
                  {getInitials(m.name)}
                </div>

                {/* Contact Meta */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm group-hover:text-green-400 transition-colors truncate">
                      {m.name}
                    </h3>
                    <span className="text-xs text-gray-400 font-mono hidden md:inline truncate">
                      &lt;{m.email}&gt;
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 truncate mt-0.5">
                    {m.subject ? (
                      <span className="font-semibold text-gray-200 mr-1.5">{m.subject} —</span>
                    ) : null}
                    <span className="text-gray-400 font-normal">{m.message}</span>
                  </p>
                </div>
              </div>

              {/* Action & Date */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                <span className="text-[11px] font-mono text-gray-400">
                  {formatDate(m.created_at)}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedMessage(m)
                      setShowSheet(true)
                      if (!m.is_read) toggleMessageRead(m.id, false)
                    }}
                    className="bg-[#141414] border border-[#282828] hover:border-green-500/40 text-xs text-gray-300 hover:text-green-400 rounded-xl h-8 px-3 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> View
                  </Button>

                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      promptDeleteMessage(m)
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs rounded-xl h-8 px-2.5 cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Reader Sheet Drawer */}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        {selectedMessage && (
          <SheetContent side="right" className="w-full sm:max-w-lg bg-[#181818] p-6 sm:p-8 border-l border-[#282828] overflow-y-auto no-scrollbar">
            <SheetHeader className="pb-4 border-b border-[#262626]">
              <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                Inquiry Details
              </SheetTitle>
              <SheetDescription className="text-xs text-gray-400">
                Received on {formatDate(selectedMessage.created_at)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 pt-6">
              {/* Sender Details Header Card */}
              <div className="bg-[#141414] border border-[#282828] p-4 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-500 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-green-500/20 shrink-0">
                    {getInitials(selectedMessage.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{selectedMessage.name}</h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs text-green-400 font-mono hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3" /> {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleMessageRead(selectedMessage.id, selectedMessage.is_read)}
                  className="bg-[#1b1b1b] border border-[#2a2a2a] hover:border-green-500/40 text-xs text-gray-300 hover:text-green-400 rounded-xl h-8 px-2.5 shrink-0"
                >
                  {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                </Button>
              </div>

              {/* Subject Tag */}
              {selectedMessage.subject && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Subject</label>
                  <div className="text-xs font-bold text-white bg-[#141414] border border-[#282828] p-3.5 rounded-xl">
                    {selectedMessage.subject}
                  </div>
                </div>
              )}

              {/* Message Content Body */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Message Content</label>
                <div className="bg-[#141414] border border-[#282828] p-5 rounded-2xl text-xs sm:text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-wrap min-h-[160px]">
                  {selectedMessage.message}
                </div>
              </div>

              <SheetFooter className="pt-4 flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  onClick={() => promptDeleteMessage(selectedMessage)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl h-11 px-4 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || "Portfolio Inquiry"
                  )}`}
                  className="inline-flex bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-2xl items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-green-500/20 hover:scale-[1.02] flex-1"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" /> Reply via Email
                </a>
              </SheetFooter>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        variant="danger"
        title="Delete Message?"
        description={`Are you sure you want to delete the message from "${deleteDialog.name || "this contact"}"? This action cannot be undone.`}
        confirmText="Delete Message"
        cancelText="Cancel"
        onConfirm={confirmDeleteMessage}
        onCancel={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        isLoading={deleteDialog.isLoading}
        loadingText="Deleting message..."
        isError={deleteDialog.isError}
        errorTitle="Deletion Failed"
        errorMessage={deleteDialog.errorMessage}
      />
    </motion.div>
  )
}
