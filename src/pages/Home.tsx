import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Instagram, Facebook, Globe, Mail, FileText, Send } from "lucide-react"
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
import { SiTelegram, SiYoutube, SiDiscord, SiWhatsapp, SiMedium, SiGmail } from "react-icons/si"
import type { socialLinks } from "@/types/ui"
import { Link } from "react-router-dom"

import { useProfileSettingsQuery, useContactLinksQuery, useFloatingCardsQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"

const defaultSocialLinks: socialLinks[] = [
  { name: "GitHub", url: "https://github.com/sami855-ux", icon: "github" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/samiux855/",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/samii_211912/",
    icon: "instagram",
  },
  { name: "Facebook", url: "#", icon: "facebook" },
  { name: "Telegram", url: "https://t.me/Sami_hhtt", icon: "telegram" },
]

export default function Home() {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const { data: profile, isLoading: isProfileLoading } = useProfileSettingsQuery()
  const { data: dbContactLinks, isLoading: isLinksLoading } = useContactLinksQuery()
  const { data: dbFloatingCards, isLoading: isCardsLoading } = useFloatingCardsQuery()

  if (isProfileLoading || isLinksLoading || isCardsLoading) {
    return (
      <div className="w-full min-h-[85vh] flex items-center justify-center flex-col relative overflow-hidden px-4 md:px-0 py-12 mb-12 md:mb-16">
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/20 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"></div>
        </motion.div>

        <div className="flex flex-col items-center justify-center text-center my-auto w-full max-w-xl px-4">
          {/* Skeleton for Title "Hi, I'm ..." */}
          <Skeleton className="h-12 md:h-14 w-72 md:w-96 rounded-xl mb-4 bg-white/10" />

          {/* Skeleton for Subtitle */}
          <Skeleton className="h-6 md:h-7 w-64 md:w-80 rounded-lg mb-4 bg-white/10" />

          {/* Skeleton for Bio text */}
          <Skeleton className="h-4 w-full max-w-md rounded-md mb-2 bg-white/10" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-md mb-8 bg-white/10" />

          {/* Skeleton for Profile Avatar */}
          <div className="relative mb-8">
            <Skeleton className="w-44 h-44 rounded-full bg-white/10 border-4 border-white/5" />
          </div>

          {/* Skeleton for Social Icons */}
          <div className="flex gap-4 mt-4 mb-7">
            <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
            <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
            <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
            <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
          </div>

          {/* Skeleton for Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Skeleton className="w-36 h-11 rounded-full bg-white/10" />
            <Skeleton className="w-36 h-11 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  const floatingCards = dbFloatingCards || []

  const socialLinks = dbContactLinks && dbContactLinks.length > 0
    ? dbContactLinks.map((link) => ({
      name: link.name,
      url: link.url,
      icon: (link.icon_name || link.name.toLowerCase()).replace(/[^a-z]/g, ""),
    }))
    : defaultSocialLinks

  const fullName = profile?.full_name || ""
  const titleText = profile?.hero_title || (profile as any)?.title || ""
  const bioText = profile?.hero_description || (profile as any)?.bio || ""
  const cvUrl = profile?.resume_url || (profile as any)?.cv_url || ""
  const avatarUrl = profile?.avatar_url

  // Parse name into first and last for styling
  const nameParts = fullName.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  return (
    <>
      <div className="w-full min-h-[100vh] flex items-center justify-center flex-col relative overflow-hidden px-4 md:px-0 py-0 mt-12">
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
          className="flex flex-col items-center justify-center text-center my-auto max-w-3xl mx-auto"
        >
          {/* Profile image with playful interaction */}

          <h2 className="font-bold text-4xl md:text-6xl text-white mb-2 relative mt-7 md:mt-0">
            Hi, I'm {firstName}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
              {lastName}
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
            className="py-3 text-lg md:text-xl text-white font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {titleText}
          </motion.p>

          <motion.p
            className="text-center text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {bioText}
          </motion.p>

          <motion.div
            className="relative mb-8"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-44 h-44 rounded-full object-cover border-4 border-green-500/30 shadow-2xl"
              />
            ) : (
              <ProfileImage />
            )}
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
                          {social.icon === "github" ? (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Github size={20} />
                            </div>
                          ) : social.icon === "linkedin" ? (
                            <div className="text-gray-400 hover:text-blue-400 transition-colors">
                              <Linkedin size={20} />
                            </div>
                          ) : social.icon === "telegram" ? (
                            <div className="text-gray-400 hover:text-cyan-400 transition-colors">
                              <SiTelegram size={20} />
                            </div>
                          ) : social.icon === "twitter" || social.icon === "x" ? (
                            <div className="text-gray-400 hover:text-sky-400 transition-colors">
                              <Twitter size={20} />
                            </div>
                          ) : social.icon === "instagram" ? (
                            <div className="text-gray-400 hover:text-rose-400 transition-colors">
                              <Instagram size={20} />
                            </div>
                          ) : social.icon === "facebook" ? (
                            <div className="text-gray-400 hover:text-blue-500 transition-colors">
                              <Facebook size={20} />
                            </div>
                          ) : social.icon === "youtube" ? (
                            <div className="text-gray-400 hover:text-red-500 transition-colors">
                              <SiYoutube size={20} />
                            </div>
                          ) : social.icon === "discord" ? (
                            <div className="text-gray-400 hover:text-indigo-400 transition-colors">
                              <SiDiscord size={20} />
                            </div>
                          ) : social.icon === "whatsapp" ? (
                            <div className="text-gray-400 hover:text-green-400 transition-colors">
                              <SiWhatsapp size={20} />
                            </div>
                          ) : social.icon === "medium" ? (
                            <div className="text-gray-400 hover:text-white transition-colors">
                              <SiMedium size={20} />
                            </div>
                          ) : social.icon === "email" || social.icon === "gmail" || social.icon === "mail" ? (
                            <div className="text-gray-400 hover:text-emerald-400 transition-colors">
                              <Mail size={20} />
                            </div>
                          ) : (
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                              <Globe size={20} />
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
            className="flex flex-wrap items-center justify-center gap-4 mt-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, staggerChildren: 0.1 }}
          >
            {/* Minimalist See My CV Button */}
            <div>
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-green-400 to-blue-500 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                <span>See My CV</span>
              </a>
            </div>

            {/* Minimalist Contact Me Button */}
            <div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/20 hover:border-white/40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-green-400" />
                <span>Contact Me</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {floatingCards.map((card, idx) => (
        <PersonalCardHeader
          key={card.id || idx}
          name={card.name}
          title={card.title}
          position={card.position || "top-1/2 left-1/2"}
        />
      ))}
    </>
  )
}
