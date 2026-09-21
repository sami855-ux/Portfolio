import { Mail, ExternalLink, Globe } from "lucide-react"
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTelegram,
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaEnvelope,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import { useProfileSettingsQuery, useContactLinksQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"

function renderFooterSocialIcon(iconName?: string, name?: string) {
  const key = (iconName || name || "").toLowerCase()
  if (key.includes("github")) return <FaGithub className="w-3.5 h-3.5" />
  if (key.includes("linkedin")) return <FaLinkedin className="w-3.5 h-3.5" />
  if (key.includes("twitter") || key.includes("x")) return <FaTwitter className="w-3.5 h-3.5" />
  if (key.includes("telegram")) return <FaTelegram className="w-3.5 h-3.5" />
  if (key.includes("instagram")) return <FaInstagram className="w-3.5 h-3.5" />
  if (key.includes("youtube")) return <FaYoutube className="w-3.5 h-3.5" />
  if (key.includes("discord")) return <FaDiscord className="w-3.5 h-3.5" />
  if (key.includes("email") || key.includes("mail")) return <FaEnvelope className="w-3.5 h-3.5" />
  return <Globe className="w-3.5 h-3.5" />
}

export function Footer() {
  const { data: profile, isLoading } = useProfileSettingsQuery()
  const { data: contactLinks } = useContactLinksQuery()
  const email = profile?.email || (profile as { contact_email?: string } | undefined)?.contact_email || ""
  const fullName = profile?.full_name || "Samuel Tale"

  const linksToDisplay = contactLinks && contactLinks.length > 0
    ? contactLinks
    : [
        { id: "gh", name: "GitHub", url: "https://github.com/sami855-ux", icon_name: "github" },
        { id: "li", name: "LinkedIn", url: "https://www.linkedin.com/in/samiux855/", icon_name: "linkedin" },
      ]

  return (
    <footer className="mt-20 border-t border-white/[0.06] py-12 text-zinc-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Apple-style Directory Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-xs font-medium">
          <Link
            to="/"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Home
          </Link>
          <a
            href="/#services"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Services
          </a>
          <Link
            to="/projects"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Projects
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>
          <Link
            to="/contact"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Contact
            <Mail className="w-3 h-3 text-zinc-500" />
          </Link>

          {linksToDisplay.map((link) => (
            <a
              key={link.id || link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {renderFooterSocialIcon(link.icon_name, link.name)}
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {/* Email, Copyright, and Apple-style Disclaimer */}
        <div className="text-center space-y-2 pt-6 border-t border-white/[0.04]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-4 w-48 bg-white/10" />
              <Skeleton className="h-3 w-36 bg-white/10" />
            </div>
          ) : (
            <>
              {email && (
                <p className="text-xs text-zinc-400">
                  Direct Inquiries:{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
                  >
                    {email}
                  </a>
                </p>
              )}
              <p className="text-[11px] text-zinc-500 font-normal">
                Copyright © {new Date().getFullYear()} {fullName}. Designed with precision and engineered for performance.
              </p>
            </>
          )}
        </div>
      </div>
    </footer>
  )
}
