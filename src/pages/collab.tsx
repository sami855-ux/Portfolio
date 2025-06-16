"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Handshake, Rocket, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Collab() {
  const navigate = useNavigate()
  return (
    <div className="h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 pt-24 flex flex-col items-center justify-center">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#3a5a40]/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0.3,
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
                transition: {
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#0d3b66]/30 border border-[#3a86ff]/30 text-[#3a86ff]">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Let's build together</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#3a86ff] to-[#3a5a40]">
            Want to collaborate?
          </h1>

          <p className="text-xl text-gray-300 mb-10">
            I'm always open to discussing new projects, creative ideas or
            opportunities to be part of your vision. Let's create something
            amazing together.
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              onClick={() => navigate("/contact")}
              className="group relative overflow-hidden bg-gradient-to-r from-[#3a5a40] to-[#3a86ff] hover:from-[#3a86ff] hover:to-[#3a5a40] text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                Let's Collaborate
              </span>
              <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></span>
            </Button>
          </motion.div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#3a86ff]" />
              <span>Innovative Projects</span>
            </div>
            <div className="hidden sm:block h-5 w-px bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#3a5a40]" />
              <span>Creative Solutions</span>
            </div>
            <div className="hidden sm:block h-5 w-px bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-[#3a86ff]" />
              <span>Mutual Growth</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
