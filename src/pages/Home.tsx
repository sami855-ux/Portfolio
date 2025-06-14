import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Instagram, Facebook } from "lucide-react"
import { useState } from "react"

import { PersonalCardHeader } from "@/components/PersonalCardHeader"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ProfileImage from "@/components/ProfileImage"
import { Button } from "@/components/ui/button"
import { SiTelegram } from "react-icons/si"
import type { socialLinks } from "@/types/ui"
import { Link } from "react-router-dom"

const socialLinks: socialLinks[] = [
  { name: "GitHub", url: "https://github.com/sami855-ux", icon: "github" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/samiux855/",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/sami.tale.18/",
    icon: "instagram",
  },
  { name: "Facebook", url: "#", icon: "facebook" },
  { name: "Telegram", url: "https://t.me/Sami_hhtt", icon: "telegram" },
]

export default function Home() {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <>
      <div className="w-full min-h-screen flex items-center flex-col relative overflow-hidden px-4 md:px-0">
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"></div>
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center pt-24 mt-4"
        >
          {/* Profile image with playful interaction */}

          <h2 className="font-bold text-4xl md:text-6xl text-white mb-2 relative mt-7 md:mt-0">
            Hi, I'm Samuel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
              Tale
            </span>
            <motion.span
              className="absolute md:inline-block hidden -top-7 -right-4 text-4xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [-10, 10, -5, 0],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              style={{
                transformOrigin: "70% 70%",
                textShadow: "0 2px 10px rgba(74, 222, 128, 0.3)",
              }}
            >
              👋
            </motion.span>
          </h2>

          <motion.p
            className="pt-3 text-lg md:text-xl text-white font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Full Stack Developer
          </motion.p>
          <motion.p
            className="py-1 pb-3 text-slate-400 text-[14px] md:text-[16px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            with 3+ years of experience.
          </motion.p>

          <motion.p
            className="text-center text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Turning ideas into sleek, fast, and responsive websites for web
            users around the world.
          </motion.p>

          <motion.div
            className="relative mb-8"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
          >
            <ProfileImage />
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent"
              animate={{
                borderColor: isHovered
                  ? ["#ec4899", "#8b5cf6", "#ec4899"]
                  : "transparent",
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Social links with animations */}
          <motion.div
            className="flex gap-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                whileTap={{ scale: 0.9 }}
                title={social.name}
              >
                <span className={`icon-${social.icon}`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center">
                          {social.icon === "github" && (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Github size={20} />
                            </div>
                          )}

                          {social.icon === "linkedin" && (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Linkedin size={20} />
                            </div>
                          )}
                          {social.icon === "telegram" && (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <SiTelegram size={20} />
                            </div>
                          )}

                          {social.icon === "twitter" && (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Twitter size={20} />
                            </div>
                          )}

                          {social.icon === "instagram" && (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Instagram size={20} />
                            </div>
                          )}

                          {social.icon === "facebook" && (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Facebook size={20} />
                            </div>
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="capitalize">{social.icon}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="flex gap-4 mt-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, staggerChildren: 0.1 }}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                className="w-40 rounded-full text-sm font-medium uppercase tracking-wider
      text-white  transition-all duration-300 cursor-pointer
      border-2 border-transparent hover:border-white/20 relative overflow-hidden group"
              >
                <span className="relative z-10">See my CV</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="w-40 rounded-full text-sm font-medium uppercase tracking-wider
      transition-all duration-300  cursor-pointer
     text-gray-800 relative overflow-hidden group"
                >
                  <span className="relative z-10">Contact me</span>
                  <span className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <PersonalCardHeader
        name="samitale86@gmail.com"
        title="+251 978109304"
        position="top-2/3 -right-5"
      />
      <PersonalCardHeader
        name="Big Tech lover"
        title="Programmer"
        position="top-1/6 -right-5"
      />
      <PersonalCardHeader
        name="Samuel 'The Bug Whisperer' Tale"
        title="Chief Coffee Consumer"
        position="top-[25%] left-[20%]"
      />
    </>
  )
}
