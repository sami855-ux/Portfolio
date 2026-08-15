import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Github, ExternalLink, Sparkles } from "lucide-react"

interface SleekLightboxProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  activeIdx: number
  onIndexChange: (index: number) => void
  title: string
  github?: string
  live?: string
}

export const SleekLightbox = ({
  isOpen,
  onClose,
  images,
  activeIdx,
  onIndexChange,
  title,
  github,
  live,
}: SleekLightboxProps) => {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onIndexChange((activeIdx - 1 + images.length) % images.length)
      } else if (e.key === "ArrowRight") {
        onIndexChange((activeIdx + 1) % images.length)
      } else if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, activeIdx, images.length, onIndexChange, onClose])

  if (!isOpen || images.length === 0) return null

  const currentImg = images[activeIdx] || images[0]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden"
      >
        {/* Floating Top Glass Header Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl mx-auto flex items-center justify-between bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 px-5 py-3 rounded-2xl shadow-2xl shrink-0"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-md">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {images.length > 1 && (
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {activeIdx + 1} / {images.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Media Stage */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl mx-auto flex-1 my-4 flex items-center justify-center min-h-0"
        >
          <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black/80 border border-zinc-800/60 shadow-2xl flex items-center justify-center group/stage">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIdx}
                src={currentImg}
                alt={`${title} screenshot ${activeIdx + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-w-full max-h-full object-contain select-none p-2"
              />
            </AnimatePresence>

            {/* Left & Right Glass Control Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onIndexChange((activeIdx - 1 + images.length) % images.length)}
                  className="absolute left-4 p-3.5 rounded-2xl bg-zinc-950/80 hover:bg-emerald-500 hover:text-slate-950 text-white border border-zinc-800 backdrop-blur-xl transition-all shadow-2xl cursor-pointer hover:scale-105"
                  title="Previous Image (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => onIndexChange((activeIdx + 1) % images.length)}
                  className="absolute right-4 p-3.5 rounded-2xl bg-zinc-950/80 hover:bg-emerald-500 hover:text-slate-950 text-white border border-zinc-800 backdrop-blur-xl transition-all shadow-2xl cursor-pointer hover:scale-105"
                  title="Next Image (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Floating Bottom Navigation Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between bg-[#121216]/80 backdrop-blur-xl border border-zinc-800/80 px-5 py-3 rounded-2xl shadow-2xl gap-3 shrink-0"
        >
          {/* Thumbnails Dock */}
          {images.length > 1 ? (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5">
              {images.map((url, idx) => {
                const isActive = activeIdx === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onIndexChange(idx)}
                    className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? "border-emerald-400 ring-2 ring-emerald-500/40 scale-105 opacity-100 shadow-lg shadow-emerald-500/20"
                        : "border-zinc-800 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full resolution preview</span>
            </div>
          )}

          {/* Quick Action Links */}
          <div className="flex items-center gap-3 shrink-0">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
