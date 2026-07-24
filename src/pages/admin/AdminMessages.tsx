import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { Trash2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
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
          setErrorMsg("Could not connect to Supabase inbox: " + fetchErr.message)
        } else if (msgData) {
          setMessages(msgData as Message[])
          if (msgData.length > 0) setSelectedMessage(msgData[0] as Message)
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
        setSelectedMessage(sampleMsgs[0])
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
          triggerToast("Failed to update status: " + updateErr.message)
          return
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: nextRead } : m))
      )
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: nextRead })
      }
      loadHeaderData()
    } catch (err: any) {
      triggerToast("Error updating message status.")
    }
  }

  const handleDeleteMessage = async (id?: string) => {
    if (!id) return
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        if (isSupabaseConfigured && !id.startsWith("demo")) {
          const { error: delErr } = await supabase.from("messages").delete().eq("id", id)
          if (delErr) {
            triggerToast("Failed to delete: " + delErr.message)
            return
          }
        }
        const updated = messages.filter((m) => m.id !== id)
        setMessages(updated)
        setSelectedMessage(updated.length > 0 ? updated[0] : null)
        triggerToast("Message deleted.")
        loadHeaderData()
      } catch (err: any) {
        triggerToast("Error deleting message.")
      }
    }
  }

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
      <div>
        <h2 className="text-2xl font-bold text-white">Messages Inbox</h2>
        <p className="text-xs text-gray-400 mt-1">
          Inquiries submitted from your Contact page
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List Sidebar */}
        <div className="bg-[#202020] border-none p-4 rounded-3xl space-y-2 max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-xs text-gray-500 py-8">No messages</div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMessage(m)
                  if (!m.is_read) toggleMessageRead(m.id, false)
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all ${selectedMessage?.id === m.id
                    ? "bg-[#282828] text-white"
                    : "bg-[#181818] text-gray-400 hover:bg-[#222222]"
                  }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">{m.name}</span>
                  {!m.is_read && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{m.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Selected Message Reader */}
        <div className="lg:col-span-2 bg-[#202020] border-none p-6 rounded-3xl space-y-4">
          {selectedMessage ? (
            <>
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{selectedMessage.name}</h3>
                  <p className="text-xs text-green-500">&lt;{selectedMessage.email}&gt;</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => toggleMessageRead(selectedMessage.id, selectedMessage.is_read)}
                    className="bg-[#181818] hover:bg-[#282828] text-xs text-gray-300 rounded-xl cursor-pointer"
                  >
                    {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {selectedMessage.subject && (
                <div className="text-xs font-semibold text-gray-300">
                  Subject: {selectedMessage.subject}
                </div>
              )}

              <p className="text-xs text-gray-300 leading-relaxed bg-[#181818] p-5 rounded-2xl whitespace-pre-wrap">
                {selectedMessage.message}
              </p>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Portfolio Inquiry")}`}
                className="inline-flex bg-green-500 hover:bg-green-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Reply via Email
              </a>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-gray-500">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
