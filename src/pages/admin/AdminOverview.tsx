import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FolderGit2,
  Cpu,
  Mail,
  Share2,
  Plus,
  UserCheck,
  Globe,
  ArrowUpRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  supabase,
  isSupabaseConfigured,
  getProjects,
  getSkills,
  getContactLinks,
  getProfileSettings,
} from "@/lib/supabase"
import type { Project, Skill, ContactLink, Message, ProfileSettings } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

import {
  useProjectsQuery,
  useSkillsQuery,
  useContactLinksQuery,
  useProfileSettingsQuery,
} from "@/hooks/usePortfolioQueries"

export default function AdminOverview() {
  const navigate = useNavigate()
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  const [errorMsg, setErrorMsg] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  const { data: projectsData, isLoading: pLoading } = useProjectsQuery()
  const { data: skillsData, isLoading: sLoading } = useSkillsQuery()
  const { data: linksData, isLoading: lLoading } = useContactLinksQuery()
  const { data: profileData, isLoading: profLoading } = useProfileSettingsQuery()

  const projects = projectsData || []
  const skills = skillsData || []
  const contactLinks = linksData || []
  const profile = profileData || null
  const loading = pLoading || sLoading || lLoading || profLoading

  useEffect(() => {
    const loadOverviewMessages = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: msgData, error: msgErr } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false })

          if (msgErr) {
            console.warn("Supabase messages fetch error:", msgErr.message)
            setErrorMsg("Could not fetch messages from Supabase: " + msgErr.message)
          } else if (msgData) {
            setMessages(msgData as Message[])
          }
        } catch (e: any) {
          console.error("Messages fetch exception:", e)
          setErrorMsg("Network error loading messages. Displaying offline data.")
        }
      } else {
        setMessages([
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
        ])
      }
    }
    loadOverviewMessages()
  }, [])

  const unreadCount = (messages || []).filter((m) => !m?.is_read).length

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading overview...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
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
      {/* Hero Welcome Banner */}
      <div className="bg-[#202020] border-none rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">
            Welcome back, {profile?.full_name || "Samuel"}!
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Portfolio Control <span className="text-green-500">Center</span>
          </h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-lg">
            Manage your web & mobile projects, technical skills, career journey timeline, social channels, and visitor inquiry messages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <Button
            onClick={() => navigate("/admin/projects")}
            className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Manage Projects
          </Button>
          <Button
            onClick={() => navigate("/admin/profile")}
            className="bg-[#181818] hover:bg-[#282828] text-gray-200 font-medium px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border-none cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-green-500" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Projects",
            value: projects.length,
            badge: `${projects.filter((p) => p.featured).length} Featured`,
            icon: FolderGit2,
            path: "/admin/projects",
            iconBg: "bg-green-500/10 text-green-400",
          },
          {
            title: "Tech Stack Skills",
            value: skills.length,
            badge: "5 Categories",
            icon: Cpu,
            path: "/admin/skills",
            iconBg: "bg-blue-500/10 text-blue-400",
          },
          {
            title: "Visitor Messages",
            value: messages.length,
            badge: `${unreadCount} Unread`,
            icon: Mail,
            path: "/admin/messages",
            iconBg: unreadCount > 0 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400",
          },
          {
            title: "Social Channels",
            value: contactLinks.length,
            badge: "Active Links",
            icon: Share2,
            path: "/admin/links",
            iconBg: "bg-purple-500/10 text-purple-400",
          },
        ].map((s, idx) => {
          const Icon = s.icon
          return (
            <div
              key={idx}
              onClick={() => navigate(s.path)}
              className="bg-[#202020] border-none p-6 rounded-3xl hover:bg-[#252525] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {s.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${s.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-4xl font-extrabold text-white mb-2">{s.value}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-gray-500 bg-[#181818] px-2 py-0.5 rounded-lg">
                  {s.badge}
                </span>
                <span className="text-green-500 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                  View <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 60/40 Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (3/5 width): Recent Visitor Messages */}
        <div className="lg:col-span-3 bg-[#202020] border-none p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4.5 h-4.5 text-green-500" />
              <h3 className="font-bold text-base text-white">Recent Visitor Messages</h3>
            </div>
            <button
              onClick={() => navigate("/admin/messages")}
              className="text-xs text-green-500 hover:underline font-bold cursor-pointer"
            >
              View All ({messages.length})
            </button>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 bg-[#181818] rounded-2xl">
                No messages received yet.
              </div>
            ) : (
              messages.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate("/admin/messages")}
                  className="bg-[#181818] border-none p-4 rounded-2xl hover:bg-[#252525] transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      {!m.is_read && (
                        <span className="text-[10px] font-extrabold uppercase bg-green-500 text-slate-950 px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-[10px]">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  {m.subject && (
                    <div className="text-xs font-semibold text-green-500">
                      {m.subject}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (2/5 width): Quick Actions & Supabase Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Center */}
          <div className="bg-[#202020] border-none p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-white">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Button
                onClick={() => navigate("/admin/skills")}
                className="bg-[#181818] hover:bg-[#252525] text-gray-300 text-xs font-semibold justify-start rounded-2xl h-11 border-none cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-green-500 mr-2" /> Add Tech Skill
              </Button>
              <Button
                onClick={() => navigate("/admin/journey")}
                className="bg-[#181818] hover:bg-[#252525] text-gray-300 text-xs font-semibold justify-start rounded-2xl h-11 border-none cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-green-500 mr-2" /> Add Milestone
              </Button>
              <Button
                onClick={() => navigate("/admin/links")}
                className="bg-[#181818] hover:bg-[#252525] text-gray-300 text-xs font-semibold justify-start rounded-2xl h-11 border-none cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-green-500 mr-2" /> Add Social Link
              </Button>
              <Button
                onClick={() => navigate("/admin/profile")}
                className="bg-[#181818] hover:bg-[#252525] text-gray-300 text-xs font-semibold justify-start rounded-2xl h-11 border-none cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-green-500 mr-2" /> Profile Settings
              </Button>
            </div>
          </div>

          {/* Cloud Sync Status */}
          <div className="bg-[#202020] border-none p-6 rounded-3xl space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-500" /> Database Connection
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isSupabaseConfigured
                ? "Connected to live Supabase database. Real-time updates enabled."
                : "Running in local portfolio mode. To connect online database, set credentials in .env:"}
            </p>
            <div className="bg-[#181818] p-3.5 rounded-2xl border-none text-[11px] font-mono text-gray-300 space-y-1">
              <div className="text-green-500 font-bold"># Supabase Credentials</div>
              <div>VITE_SUPABASE_URL=https://...</div>
              <div>VITE_SUPABASE_ANON_KEY=eyJ...</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
