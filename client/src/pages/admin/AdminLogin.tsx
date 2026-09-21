import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    const toastId = toast.loading("Authenticating admin access...")

    const { error } = await apiClient.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
      toast.error(error.message, { id: toastId })
      setLoading(false)
      return
    }
    toast.success("Welcome back!", { id: toastId })
    navigate("/admin")
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center p-4 relative">
      {/* Back to Home Link */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors text-sm font-medium z-10"
      >
        ← Back to Portfolio
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#252424] border-none rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Admin <span className="text-green-500">Portal</span>
          </h1>
          <p className="text-gray-400 text-sm">Sign in to manage portfolio content</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 text-red-400 text-sm rounded-2xl text-center">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
            <Input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required className="h-12 bg-[#181818] border-none text-white rounded-2xl px-4" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
            <Input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="h-12 bg-[#181818] border-none text-white rounded-2xl px-4" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-green-500 hover:bg-green-600 text-slate-950 font-bold rounded-2xl">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-[11px] text-gray-500 text-center mt-6">Restricted access. Credentials are verified by the portfolio API.</p>
      </motion.div>
    </div>
  )
}
