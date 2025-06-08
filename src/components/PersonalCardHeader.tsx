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
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0, 0.5, 0.7, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5],
      }}
      className={`hidden md:block absolute z-100 ${position} -translate-x-1/2 rounded-2xl p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 w-fit`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
            {name}
          </h2>
          <p className="text-muted-foreground mt-1">{title}</p>
        </div>
      </div>
    </motion.div>
  )
}
