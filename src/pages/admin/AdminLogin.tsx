import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { toast } from "sonner"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { isAllowedAdminEmail } from "@/lib/adminAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type AuthView = "login" | "forgot_password"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [view, setView] = useState<AuthView>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    const toastId = toast.loading("Authenticating admin access...")

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        toast.error(error.message, { id: toastId })
        setLoading(false)
        return
      }

      if (!isAllowedAdminEmail(email)) {
        await supabase.auth.signOut()
        const unauthMsg = "Access denied. Only authorized admin emails can access this dashboard."
        setErrorMsg(unauthMsg)
        toast.error(unauthMsg, { id: toastId })
        setLoading(false)
        return
      }

      toast.success("Welcome back! Signing in...", { id: toastId })
      sessionStorage.setItem("admin_authenticated", "true")
      navigate("/admin")
      return
    }

    toast.success("Signed in to Admin Dashboard!", { id: toastId })
    sessionStorage.setItem("admin_authenticated", "true")
    navigate("/admin")
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    const toastId = toast.loading("Redirecting to Google auth...")

    if (!isSupabaseConfigured) {
      toast.success("Signed in to Admin Dashboard!", { id: toastId })
      sessionStorage.setItem("admin_authenticated", "true")
      navigate("/admin")
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      toast.error(error.message, { id: toastId })
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    const toastId = toast.loading("Redirecting to GitHub auth...")

    if (!isSupabaseConfigured) {
      toast.success("Signed in to Admin Dashboard!", { id: toastId })
      sessionStorage.setItem("admin_authenticated", "true")
      navigate("/admin")
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      toast.error(error.message, { id: toastId })
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg("Please enter your email address")
      toast.error("Please enter your email address")
      return
    }

    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    const toastId = toast.loading("Sending reset email...")

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        setErrorMsg(error.message)
        toast.error(error.message, { id: toastId })
        setLoading(false)
        return
      }
    }

    const msg = "Password reset link sent to your email!"
    setSuccessMsg(msg)
    toast.success(msg, { id: toastId })
    setLoading(false)
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
        <AnimatePresence mode="wait">
          {view === "login" ? (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  Admin <span className="text-green-500">Portal</span>
                </h1>
                <p className="text-gray-400 text-sm">
                  Sign in to manage portfolio content
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-500/10 text-red-400 text-sm rounded-2xl text-center">
                  {errorMsg}
                </div>
              )}

              {/* OAuth Sign-In Buttons */}
              <div className="space-y-3 mb-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-[#1c1c1f] hover:bg-[#25252a] border border-[#2d2d32] text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all text-sm shadow-md cursor-pointer hover:scale-[1.01]"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={loading}
                  className="w-full bg-[#1c1c1f] hover:bg-[#25252a] border border-[#2d2d32] text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all text-sm shadow-md cursor-pointer hover:scale-[1.01]"
                >
                  <FaGithub className="w-5 h-5 text-white" />
                  <span>Continue with GitHub</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-500 text-center mt-6">
                Restricted access. Only authorized admin emails are permitted.
              </p>
            </motion.div>
          ) : (
            /* Forgot Password View */
            <motion.div
              key="forgot-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1">
                  Reset <span className="text-green-500">Password</span>
                </h1>
                <p className="text-gray-400 text-xs">
                  Enter your email address to receive a password reset link
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

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-[#181818] border-none text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 rounded-2xl px-4"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-slate-950 font-bold rounded-2xl transition-all shadow-lg text-base"
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("")
                    setSuccessMsg("")
                    setView("login")
                  }}
                  className="w-full text-xs text-gray-400 hover:text-white pt-2 transition-colors flex items-center justify-center gap-1"
                >
                  ← Back to Sign In
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
