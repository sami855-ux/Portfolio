import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Send, Menu, X } from "lucide-react"

const Header = () => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileOpen])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services", isAnchor: true },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ]

  const handleNavClick = (e: React.MouseEvent, item: (typeof navItems)[0]) => {
    if (item.isAnchor) {
      e.preventDefault()
      if (location.pathname === "/") {
        const el = document.getElementById("services")
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        navigate("/")
        setTimeout(() => {
          const el = document.getElementById("services")
          if (el) el.scrollIntoView({ behavior: "smooth" })
        }, 300)
      }
    }
  }

  return (
    <header
      className={`fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ${
        scrolled ? "top-4 sm:top-6" : "top-4"
      }`}
    >
      <div
        ref={headerRef}
        className={`pointer-events-auto w-full max-w-4xl transition-all duration-300 ${
          mobileOpen ? "rounded-3xl" : "rounded-full"
        } ${
          scrolled || mobileOpen
            ? "bg-[#111116]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
            : "bg-[#16161e]/80 backdrop-blur-2xl border border-white/10 shadow-lg shadow-black/20"
        }`}
      >
        <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between">
          {/* Brand Logo - Always properly placed and never squeezed */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-1.5 group shrink-0"
          >
            <span className="font-outfit font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
              Sami <span className="text-emerald-400">T.</span>
            </span>
          </Link>

          {/* Center Nav Links (Desktop: md and up) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.toLowerCase() === item.path.toLowerCase())

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className="relative px-3.5 py-1.5 rounded-full text-xs font-outfit font-semibold tracking-wide transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeHeaderPill"
                      className="absolute inset-0 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={
                      isActive
                        ? "text-emerald-400 font-bold relative z-10"
                        : "text-gray-300 hover:text-white relative z-10 transition-colors"
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Right Action Button (Desktop: md and up) */}
          <div className="hidden md:flex items-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-outfit font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500/25 to-blue-500/25 hover:from-emerald-500/35 hover:to-blue-500/35 backdrop-blur-md border border-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <span>Let's Talk</span>
              <Send className="w-3 h-3 text-emerald-400" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Toggle (Mobile: < md) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-emerald-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile Animated Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden md:hidden border-t border-white/10 px-4 pt-2 pb-4 space-y-1"
            >
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" && location.pathname.toLowerCase() === item.path.toLowerCase())

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={(e) => {
                      handleNavClick(e, item)
                      setMobileOpen(false)
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-outfit font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                    )}
                  </Link>
                )
              })}

              <div className="pt-2">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-xs font-outfit font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span>Let's Talk</span>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
