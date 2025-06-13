import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const clients = [
  {
    name: "Google",
    logo: "https://media.licdn.com/dms/image/v2/D4D05AQHZP_2lSwEwJw/videocover-high/B4DZYUt4HLG4Bs-/0/1744104334474?e=2147483647&v=beta&t=2bXorYqWS5DTLjgAj20gQ881fabK9wiyYNxrrhr74DE",
  },
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Amazon", logo: "/logos/amazon.svg" },
]

export function ClientMarqueeRow() {
  return (
    <div
      className="relative w-[90%] md:w-[55%] mx-auto overflow-hidden py-12"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Gradient fade effects */}
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#1a1a1a] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#1a1a1a] to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-12 items-center"
        animate={{
          x: ["0%", "-100%"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Double the array for seamless looping */}
        {[...clients, ...clients].map((client, index) => (
          <motion.div
            key={`${client.name}-${index}`}
            className={cn(
              "flex flex-col items-center justify-center",
              "min-w-[160px] px-6 py-4 rounded-lg",
              "bg-[#2a2a2a] hover:bg-[#333333] transition-all duration-300",
              "border border-[#333333] hover:border-primary/30",
              "shadow-sm hover:shadow-lg"
            )}
            whileHover={{
              scale: 1.05,
              y: -5,
            }}
          >
            <div className="relative w-16 h-16 mb-3">
              <img
                src="@/assets/logo.jpg"
                alt={client.name}
                className="object-contain dark:invert w-full h-full"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-sm text-white/80">{client.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
