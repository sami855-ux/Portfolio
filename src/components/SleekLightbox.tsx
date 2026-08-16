import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react"

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
  const [direction, setDirection] = useState<number>(0)
  const prevIndexRef = useRef<number>(activeIdx)

  useEffect(() => {
    if (activeIdx > prevIndexRef.current) {
      setDirection(1)
    } else if (activeIdx < prevIndexRef.current) {
      setDirection(-1)
    }
    prevIndexRef.current = activeIdx
  }, [activeIdx])

  // Infinite Cyclic Navigation Handlers
  const handleNext = () => {
    setDirection(1)
    onIndexChange((activeIdx + 1) % images.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    onIndexChange((activeIdx - 1 + images.length) % images.length)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, activeIdx, images.length, onIndexChange, onClose])

  if (!isOpen || images.length === 0) return null

  const currentImg = images[activeIdx] || images[0]

  // Clean transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : dir < 0 ? -50 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : dir > 0 ? -50 : 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    }),
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
      >
        {/* Minimalist Header Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 shrink-0 border-b border-white/10 pb-3"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-sm sm:text-base font-medium text-white tracking-wide truncate max-w-[200px] sm:max-w-md">
              {title}
            </h3>
            {images.length > 1 && (
              <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                {activeIdx + 1} / {images.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Minimal Stage */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl mx-auto flex-1 my-4 flex items-center justify-center min-h-0"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset }) => {
                if (offset.x < -40 && images.length > 1) {
                  handleNext()
                } else if (offset.x > 40 && images.length > 1) {
                  handlePrev()
                }
              }}
              className="w-full h-full flex items-center justify-center p-2 cursor-grab active:cursor-grabbing"
            >
              <img
                src={currentImg}
                alt={`${title} image ${activeIdx + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Minimal Side Navigation Arrows (Cycled) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Previous (Infinite loop)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Next (Infinite loop)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Minimalist Bottom Navigation Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/10 gap-3 shrink-0"
        >
          {/* Thumbnails Dock */}
          {images.length > 1 ? (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
              {images.map((url, idx) => {
                const isActive = activeIdx === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDirection(idx > activeIdx ? 1 : -1)
                      onIndexChange(idx)
                    }}
                    className={`relative w-12 h-9 sm:w-14 sm:h-10 rounded-md overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? "border-emerald-400 ring-1 ring-emerald-400 opacity-100 scale-105"
                        : "border-white/10 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          ) : (
            <span className="text-xs text-zinc-500 font-mono">1 photo</span>
          )}

          {/* Action Links */}
          <div className="flex items-center gap-3 shrink-0">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
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
