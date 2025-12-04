import { motion } from "framer-motion"
import { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

import mineImg from "../../public/image.jpeg"

export default function ProfileImage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <div className="relative group">
      {/* Floating tech badges around the image */}
      <motion.div
        className="absolute -top-4 -left-16 bg-gradient-to-br from-pink-500/80 to-rose-500/80 backdrop-blur-sm text-white rounded-full px-3 py-1 text-xs font-medium z-10 border border-white/10 shadow-lg"
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          rotate: [0, 5, -5, 0],
          y: [0, -3, 0],
        }}
        transition={{
          delay: 0.3,
          duration: 1,
          y: { duration: 3, repeat: Infinity },
        }}
      >
        <span className="mr-1">🎭</span> Creative Storyteller
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -right-16 bg-gradient-to-br from-emerald-500/80 to-teal-500/80 backdrop-blur-sm text-white rounded-full px-3 py-1 text-xs font-medium z-10 border border-white/10 shadow-lg"
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          x: [0, 5, -5, 0],
        }}
        transition={{
          delay: 0.4,
          duration: 1,
          x: { duration: 5, repeat: Infinity },
        }}
      >
        <span className="mr-1">🌱</span> Growth Mindset
      </motion.div>

      {/* Main profile image with multiple interactive elements */}
      <motion.div
        className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsClicked(!isClicked)}
        animate={{
          borderColor: isHovered
            ? ["#4ade80", "#3b82f6", "#4ade80"]
            : "rgba(255, 255, 255, 0.2)",
          boxShadow: isHovered ? "0 0 20px rgba(74, 222, 128, 0.3)" : "none",
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          borderColor: { duration: 3 },
        }}
      >
        <LazyLoadImage
          src={mineImg}
          alt="Samuel Tale"
          effect="blur"
          className="w-full h-full object-cover"
        />

        {/* Floating emoji with enhanced animation */}
        {isHovered && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.5 }}
            animate={{
              y: [0, -10, 0],
              opacity: 1,
              scale: 1,
              rotate: [0, 15, -15, 0],
            }}
            exit={{ y: -20, opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.8,
              ease: "backOut",
            }}
            className="absolute -top-6 -right-6 text-4xl"
          >
            👋
          </motion.div>
        )}

        {/* Click effect */}
        {isClicked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-white/30 pointer-events-none"
          />
        )}

        {/* Subtle gradient overlay */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>

      {/* Floating particles (appear on hover) */}
      {isHovered && (
        <>
          <motion.div
            className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-green-400"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: -30,
              opacity: [0, 1, 0],
              x: [-10, 10],
            }}
            transition={{
              duration: 1.5,
              delay: 0.2,
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-2 h-2 rounded-full bg-blue-400"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: 30,
              opacity: [0, 1, 0],
              x: [10, -10],
            }}
            transition={{
              duration: 1.5,
              delay: 0.4,
            }}
          />
        </>
      )}
    </div>
  )
}
