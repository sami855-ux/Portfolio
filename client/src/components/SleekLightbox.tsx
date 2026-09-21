import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Layers } from "lucide-react"

interface SleekLightboxProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  activeIdx: number
  onIndexChange: (index: number) => void
  title?: string
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
}: SleekLightboxProps) => {
  const [, setDirection] = useState<number>(0)

  const handleNext = () => {
    setDirection(1)
    onIndexChange((activeIdx + 1) % images.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    onIndexChange((activeIdx - 1 + images.length) % images.length)
  }

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

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none"
      >
        {/* Expansive Apple Card (Almost full width like height, no header, no bottom buttons, non-scrollable) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[96vw] max-w-7xl h-[92vh] sm:h-[94vh] rounded-3xl bg-[#0c0c10]/95 backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-white/[0.08] flex flex-col justify-between overflow-hidden"
        >
          {/* Floating Minimalist Apple Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 border-0"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Image Counter Pill (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 z-30 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs font-medium flex items-center gap-1.5 shadow-xl">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeIdx + 1} / {images.length}</span>
            </div>
          )}

          {/* Full Stage Image Showcase (Expansive & Non-scrollable) */}
          <div className="relative w-full flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden min-h-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIdx}
                src={currentImg}
                alt={title || "Project image"}
                initial={{ opacity: 0.85, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.85, scale: 0.99 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain select-none shadow-2xl rounded-2xl"
                draggable={false}
              />
            </AnimatePresence>

            {/* Apple Circular Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 border-0 z-20"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 border-0 z-20"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Minimal Dots Bar (No scrolling, no live/github buttons) */}
          {images.length > 1 && (
            <div className="pb-5 pt-2 flex items-center justify-center gap-2 z-20 shrink-0 select-none">
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => onIndexChange(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIdx === dotIdx
                      ? "w-8 bg-white shadow-md shadow-white/20"
                      : "w-2 bg-white/30 hover:bg-white/70"
                  }`}
                  aria-label={`Jump to image ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
