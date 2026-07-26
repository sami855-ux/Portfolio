import { useState, useEffect } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Milestone,
  Share2,
  Mail,
  UserCheck,
  LogOut,
  Globe,
  RefreshCw,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AlertDialog } from "@/components/ui/alert-dialog"
import {
  supabase,
  isSupabaseConfigured,
  getProfileSettings,
} from "@/lib/supabase"
import type { ProfileSettings } from "@/types/supabase"

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")
  const [profile, setProfile] = useState<ProfileSettings | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [counts, setCounts] = useState({
    projects: 0,
    skills: 0,
    journey: 0,
    links: 0,
  })

  // Determine current active route ID
  const currentPath = location.pathname
  const getActiveTab = () => {
    if (currentPath.includes("/admin/profile")) return "profile"
    if (currentPath.includes("/admin/projects")) return "projects"
    if (currentPath.includes("/admin/skills")) return "skills"
    if (currentPath.includes("/admin/journey")) return "journey"
    if (currentPath.includes("/admin/links")) return "links"
    if (currentPath.includes("/admin/messages")) return "messages"
    return "overview"
  }

  const activeTab = getActiveTab()

  const loadHeaderData = async () => {
    try {
      const profileData = await getProfileSettings()
      setProfile(profileData)

      // Fetch sidebar counts
      if (isSupabaseConfigured) {
        const [pRes, sRes, jRes, lRes, mRes] = await Promise.all([
          supabase.from("projects").select("id", { count: "exact" }),
          supabase.from("skills").select("id", { count: "exact" }),
          supabase.from("journey_timeline").select("id", { count: "exact" }),
          supabase.from("contact_links").select("id", { count: "exact" }),
          supabase.from("messages").select("id", { count: "exact" }).eq("is_read", false),
        ])

        setCounts({
          projects: pRes.count || 0,
          skills: sRes.count || 0,
          journey: jRes.count || 0,
          links: lRes.count || 0,
        })
        setUnreadCount(mRes.count || 0)
      }
    } catch (err) {
      console.error("Error loading layout metadata:", err)
    }
  }

  useEffect(() => {
    loadHeaderData()
  }, [location.pathname])

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (type === "error") {
      toast.error(msg)
    } else if (type === "info") {
      toast.info(msg)
    } else {
      toast.success(msg)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      sessionStorage.removeItem("admin_authenticated")
      if (isSupabaseConfigured) {
        await supabase.auth.signOut()
      }
      setLogoutDialogOpen(false)
      navigate("/admin/login")
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const toastId = toast.loading("Refreshing dashboard data...")
    try {
      await loadHeaderData()
      // Dispatch admin-refresh event for any active sub-view to reload data
      window.dispatchEvent(new Event("admin-refresh"))
      toast.success("Dashboard data refreshed!", { id: toastId })
    } catch (err) {
      console.error("Refresh error:", err)
      toast.error("Failed to refresh dashboard data", { id: toastId })
    } finally {
      setTimeout(() => setIsRefreshing(false), 600)
    }
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin" },
    { id: "profile", label: "Profile", icon: UserCheck, path: "/admin/profile" },
    { id: "projects", label: "Projects", icon: FolderGit2, path: "/admin/projects", count: counts.projects },
    { id: "skills", label: "Skills", icon: Cpu, path: "/admin/skills", count: counts.skills },
    { id: "journey", label: "Journey", icon: Milestone, path: "/admin/journey", count: counts.journey },
    { id: "links", label: "Social Links", icon: Share2, path: "/admin/links", count: counts.links },
    {
      id: "messages",
      label: "Messages",
      icon: Mail,
      path: "/admin/messages",
      count: unreadCount,
      hasBadge: unreadCount > 0,
    },
  ]

  return (
    <div className="min-h-screen bg-[#141414] text-white flex font-['Inter']">
      {/* Toast Notification */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-green-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* VERCEL / LINEAR STYLE LEFT VERTICAL SIDEBAR */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-[#1a1a1a] border-r border-[#262626] flex flex-col justify-between shrink-0 h-screen sticky top-0 ${isCollapsed ? "p-3" : "p-5"
          } overflow-hidden z-40`}
      >
        <div>
          {/* Brand Logo & Collapse Toggle */}
          <div
            className={`flex ${isCollapsed ? "flex-col items-center gap-3" : "items-center justify-between gap-3"
              } mb-8`}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-10 h-10 rounded-2xl object-cover border border-[#333] shadow-lg shadow-green-500/10 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-green-400 to-blue-600 flex items-center justify-center font-extrabold text-slate-950 text-xl shadow-lg shadow-green-500/20 shrink-0">
                ST
              </div>
            )}

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-sm text-white leading-tight truncate">
                  {profile?.full_name || "Samuel Tale"}
                </h1>
                <div className="text-[11px] text-green-500 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {isSupabaseConfigured ? "Supabase Cloud" : "Local Mode"}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#252525] transition-colors shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-green-500" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  title={isCollapsed ? tab.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-3.5"
                    } py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border bg-transparent ${isActive
                      ? "text-emerald-400 font-extrabold border-transparent"
                      : "text-gray-400 hover:text-white border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-gray-400"}`} />
                    {!isCollapsed && <span>{tab.label}</span>}
                  </div>
                  {!isCollapsed && tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab.hasBadge
                          ? "bg-emerald-400 text-slate-950 animate-bounce"
                          : "bg-white/10 text-gray-300"
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-[#262626] space-y-2">
          <button
            onClick={() => navigate("/")}
            title={isCollapsed ? "View Live Site" : undefined}
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-3.5"
              } py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-[#202020] transition-colors cursor-pointer`}
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-500 shrink-0" />
              {!isCollapsed && <span>View Live Site</span>}
            </span>
            {!isCollapsed && <ArrowUpRight className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setLogoutDialogOpen(true)}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center ${isCollapsed ? "justify-center" : ""
              } gap-2 px-3.5 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Action Header Bar */}
        <header className="sticky top-0 z-30 bg-[#141414]/90 backdrop-blur-xl border-b border-[#242424] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-white font-bold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-[#202020] border-none hover:bg-[#2a2a2a] text-gray-300 rounded-xl flex items-center gap-1.5 text-xs h-9 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} /> Refresh
            </Button>

            {/* Profile Avatar Pill */}
            <div
              onClick={() => navigate("/admin/profile")}
              className="flex items-center gap-2.5 bg-[#202020] hover:bg-[#262626] border-none px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-6 h-6 rounded-lg object-cover border border-[#333]"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-green-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  ST
                </div>
              )}
              <span className="text-xs font-semibold text-gray-300 hidden sm:inline">
                {profile?.full_name || "Samuel"}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <div className="p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ triggerToast, loadHeaderData }} />
        </div>
      </main>

      {/* Logout Confirmation Alert Dialog */}
      <AlertDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        variant="danger"
        title="Sign Out of Admin?"
        description="Are you sure you want to sign out? You will need to log in again to access the admin dashboard."
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        loadingText="Signing out..."
      />
    </div>
  )
}
