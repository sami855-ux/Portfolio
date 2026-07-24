import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check local admin bypass session first
    const localAuth = sessionStorage.getItem("admin_authenticated")
    if (localAuth === "true") {
      setIsAuthenticated(true)
      return
    }

    if (!isSupabaseConfigured) {
      setIsAuthenticated(false)
      return
    }

    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
