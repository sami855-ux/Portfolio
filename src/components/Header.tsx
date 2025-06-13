import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import type { navItems } from "@/types/ui"

const Header = () => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems: navItems[] = [
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" },
  ]

  const handleClick = (id: string) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`fixed top-0 left-0 w-full  h-16 flex items-center justify-between px-4 md:px-20 z-50 transition-all duration-300
  ${scrolled ? "backdrop-blur-lg" : "bg-transparent"}
`}
    >
      <motion.h2
        className="text-xl font-bold"
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Link to="/">Sami T.</Link>
      </motion.h2>

      <ul className="flex items-center space-x-2 md:space-x-4">
        {navItems.map((item) => (
          <motion.li
            key={item.id}
            className={`text-[14px] px-3 py-1 cursor-pointer rounded-md relative ${
              activeTab === item.id
                ? "text-white"
                : "text-white/70 hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(item.id)}
          >
            <Link to={"/" + item.id} className="hover:text-blue-500">
              {item.name}
            </Link>
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default Header
