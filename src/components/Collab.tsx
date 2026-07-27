"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Handshake, Rocket, Code } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Collab() {
  const navigate = useNavigate()
  return (
    <section className="min-h-[75vh] w-full flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent text-white">
      <div className="container mx-auto flex flex-col items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-blue-500 leading-tight">
            Want to collaborate?
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            I'm always open to discussing new projects, creative ideas, or opportunities to build your vision. Let's create something extraordinary together.
          </p>

          <div className="pt-4">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block"
            >
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-outfit font-bold rounded-full px-9 py-7 text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 cursor-pointer overflow-hidden border border-white/10"
              >
                <Handshake className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Let's Collaborate</span>
              </Button>
            </motion.div>
          </div>

          <div className="pt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
              <Code className="h-4 w-4 text-emerald-400" />
              <span>Innovative Architecture</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
              <Rocket className="h-4 w-4 text-cyan-400" />
              <span>Creative Solutions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
              <Handshake className="h-4 w-4 text-blue-400" />
              <span>Mutual Growth</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
