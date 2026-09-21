import { motion } from "framer-motion"
import { ArrowUpRight, Code, Rocket, Handshake } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Collab() {
  const navigate = useNavigate()
  return (
    <section className="min-h-[70vh] w-full flex flex-col items-center justify-center py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Apple Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="container mx-auto flex flex-col items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl space-y-6"
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white font-outfit leading-[1.08]">
            Let’s build something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              extraordinary.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
            Always open to discussing new projects, technical partnerships, and opportunities to engineer high-impact solutions.
          </p>

          <div className="pt-4">
            <motion.button
              type="button"
              onClick={() => navigate("/contact")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider shadow-2xl shadow-white/10 transition-all cursor-pointer"
            >
              <span>Let's Collaborate</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-950" />
            </motion.button>
          </div>

          <div className="pt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-zinc-400">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border-0 shadow-sm">
              <Code className="h-3.5 w-3.5 text-emerald-400" />
              <span>Modern Architecture</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border-0 shadow-sm">
              <Rocket className="h-3.5 w-3.5 text-teal-400" />
              <span>Production Scale</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-xl border-0 shadow-sm">
              <Handshake className="h-3.5 w-3.5 text-cyan-400" />
              <span>Transparent Collaboration</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
