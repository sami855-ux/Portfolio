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
import { SiTelegram, SiYoutube, SiDiscord, SiWhatsapp, SiMedium, SiGmail } from "react-icons/si"
import type { SocialLink } from "@/types/ui"

import { useProfileSettingsQuery, useContactLinksQuery, useFloatingCardsQuery } from "@/hooks/usePortfolioQueries"
import { defaultProfileSettings } from "@/lib/api"

const defaultSocialLinks: SocialLink[] = [
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
  const { data: profileData } = useProfileSettingsQuery()
  const { data: dbContactLinks } = useContactLinksQuery()
  const { data: dbFloatingCards } = useFloatingCardsQuery()

  const profile = profileData || defaultProfileSettings
  const floatingCards = dbFloatingCards || []

  const socialLinks = dbContactLinks && dbContactLinks.length > 0
    ? dbContactLinks.map((link) => ({
      name: link.name,
      url: link.url,
      icon: (link.icon_name || link.name.toLowerCase()).replace(/[^a-z]/g, ""),
    }))
    : defaultSocialLinks

  const fullName = profile.full_name || "Samuel Tale"
  const titleText = profile.hero_title || "Full Stack Web & Mobile Developer"
  const bioText = profile.hero_description || "Turning ideas into sleek, fast, and responsive websites for web and mobile."
  const cvUrl = profile.resume_url || "#"
  const avatarUrl = profile.avatar_url

  // Parse name into first and last for styling
  const nameParts = fullName.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center flex-col relative overflow-hidden px-4 md:px-6 pt-28 pb-16">
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
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center my-auto max-w-3xl mx-auto"
        >
          {/* Profile image with playful interaction */}

          <h2 className="font-bold text-4xl md:text-6xl text-white mb-2 relative flex items-center justify-center flex-wrap gap-2">
            <span>Hi, I'm {firstName}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
              {lastName}
            </span>
            <motion.span
              className="inline-block ml-1 text-3xl md:text-5xl select-none origin-[70%_70%]"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
              style={{
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
            className="text-center text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {bioText}
          </motion.p>

          {/* Profile Avatar / Image (No fallback placeholder, enhanced size, lazy loaded) */}
          {avatarUrl ? (
            <div className="relative mb-6 flex items-center justify-center group">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full p-1 bg-white/[0.02]">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.remove("opacity-0")
                    ;(e.currentTarget as HTMLImageElement).classList.add("opacity-100")
                  }}
                  className="w-full h-full rounded-full object-cover opacity-0 transition-opacity duration-500 ease-out"
                />
              </div>
            </div>
          ) : null}

          {/* Single Clean See My CV Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-green-500/20 hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>See My CV</span>
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="flex gap-4 mt-2"
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
