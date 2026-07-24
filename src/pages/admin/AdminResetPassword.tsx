import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminResetPassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      const err = "Passwords do not match."
      setErrorMsg(err)
      toast.error(err)
      return
    }
    if (newPassword.length < 6) {
      const err = "Password must be at least 6 characters long."
      setErrorMsg(err)
      toast.error(err)
      return
    }

    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    const toastId = toast.loading("Updating password...")

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setErrorMsg(error.message)
        toast.error(error.message, { id: toastId })
        setLoading(false)
        return
      }
    }

    const msg = "Password updated successfully! Redirecting to Admin Dashboard..."
    setSuccessMsg(msg)
    toast.success(msg, { id: toastId })
    sessionStorage.setItem("admin_authenticated", "true")
    setTimeout(() => {
      navigate("/admin")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#252424] border-none rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Set New <span className="text-green-500">Password</span>
          </h1>
          <p className="text-gray-400 text-xs">
            Enter your new password below
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-400 text-sm rounded-2xl text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-12 bg-[#181818] border-none text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 rounded-2xl px-4"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 bg-[#181818] border-none text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 rounded-2xl px-4"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-slate-950 font-bold rounded-2xl transition-all shadow-lg text-base"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
