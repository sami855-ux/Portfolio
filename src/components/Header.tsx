import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Send } from "lucide-react"

const Header = () => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto w-full max-w-4xl rounded-full px-5 py-2.5 flex items-center justify-between transition-all duration-500 ${scrolled
          ? "bg-white/[0.08] backdrop-blur-2xl border border-transparent"
          : "bg-white/[0.05] backdrop-blur-2xl border border-transparent"
          }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">

          <span className="font-outfit font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
            Sami <span className="text-emerald-400">T.</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.toLowerCase() === item.path.toLowerCase())

            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative px-3.5 py-1.5 rounded-full text-xs font-outfit font-semibold tracking-wide transition-all duration-300"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHeaderPill"
                    className="absolute inset-0 rounded-full bg-emerald-500/20 backdrop-blur-md border border-transparent"
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

        {/* Right Action Button */}
        <div className="hidden sm:flex items-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-outfit font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500/25 to-blue-500/25 hover:from-emerald-500/35 hover:to-blue-500/35 backdrop-blur-md border border-transparent transition-all duration-300 cursor-pointer"
          >
            <span>Let's Talk</span>
            <Send className="w-3 h-3 text-emerald-400" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
