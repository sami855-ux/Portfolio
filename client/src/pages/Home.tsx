import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Instagram, Facebook, Globe, Mail, FileText } from "lucide-react"
import { PersonalCardHeader } from "@/components/PersonalCardHeader"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SiTelegram, SiYoutube, SiDiscord, SiWhatsapp, SiMedium } from "react-icons/si"
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

  const nameParts = fullName.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  return (
    <>
      <div className="w-full min-h-[92vh] flex items-center justify-center flex-col relative overflow-hidden px-4 md:px-6 pt-32 pb-20">
        {/* Apple subtle ambient aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-[400px] h-[300px] bg-cyan-500/[0.05] rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-center my-auto max-w-3xl mx-auto"
        >
          {/* Headline in Apple Keynote display style */}
          <h1 className="font-outfit font-semibold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.1] mb-3">
            <span>Hi, I'm {firstName} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              {lastName}
            </span>
            <span className="text-emerald-400">.</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-2xl text-zinc-200 font-medium tracking-tight mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {titleText}
          </motion.p>

          {/* Narrative bio */}
          <motion.p
            className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8 font-normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {bioText}
          </motion.p>

          {/* Apple Frosted Portrait Frame */}
          {avatarUrl ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="relative mb-8 flex items-center justify-center group"
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-1.5 bg-white/[0.04] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.remove("opacity-0")
                    ;(e.currentTarget as HTMLImageElement).classList.add("opacity-100")
                  }}
                  className="w-full h-full rounded-full object-cover opacity-0 transition-opacity duration-700 ease-out"
                />
              </div>
            </motion.div>
          ) : null}

          {/* Apple-Style High-Contrast Action Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 transition-all cursor-pointer shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-zinc-950" />
              <span>See My CV</span>
            </a>
          </motion.div>

          {/* Apple Frosted Glass Social Icons */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.12] backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                title={social.name}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center">
                        {social.icon === "github" ? (
                          <Github className="w-4 h-4" />
                        ) : social.icon === "linkedin" ? (
                          <Linkedin className="w-4 h-4" />
                        ) : social.icon === "telegram" ? (
                          <SiTelegram className="w-4 h-4" />
                        ) : social.icon === "twitter" || social.icon === "x" ? (
                          <Twitter className="w-4 h-4" />
                        ) : social.icon === "instagram" ? (
                          <Instagram className="w-4 h-4" />
                        ) : social.icon === "facebook" ? (
                          <Facebook className="w-4 h-4" />
                        ) : social.icon === "youtube" ? (
                          <SiYoutube className="w-4 h-4" />
                        ) : social.icon === "discord" ? (
                          <SiDiscord className="w-4 h-4" />
                        ) : social.icon === "whatsapp" ? (
                          <SiWhatsapp className="w-4 h-4" />
                        ) : social.icon === "medium" ? (
                          <SiMedium className="w-4 h-4" />
                        ) : social.icon === "email" || social.icon === "gmail" || social.icon === "mail" ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <Globe className="w-4 h-4" />
                        )}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 text-zinc-200 border-none shadow-xl text-xs rounded-xl px-2.5 py-1">
                      <p className="capitalize">{social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
