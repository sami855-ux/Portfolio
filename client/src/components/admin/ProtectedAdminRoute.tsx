import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { apiClient, isApiConfigured } from "@/lib/api"

export const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isApiConfigured) {
      setIsAuthenticated(false)
      return
    }

    apiClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    })
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
