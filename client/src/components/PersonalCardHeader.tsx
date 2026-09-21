import { motion } from "framer-motion"

interface PersonalCardHeaderProps {
  name: string
  title: string
  position?: string
}

export function PersonalCardHeader({
  name,
  title,
  position = "top-1/2 left-1/2",
}: PersonalCardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{
        opacity: [0, 0.85, 0.85, 0],
        scale: [0.95, 1, 1, 0.95],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.75, 1],
      }}
      className={`hidden md:flex items-center gap-3 absolute z-40 ${position} -translate-x-1/2 rounded-full px-4 py-2 bg-white/[0.05] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] pointer-events-none border-0`}
    >
      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse" />
      <div className="flex items-center gap-2 text-xs font-outfit">
        <span className="font-semibold text-white tracking-tight">{name}</span>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-400 font-normal">{title}</span>
      </div>
    </motion.div>
  )
}
