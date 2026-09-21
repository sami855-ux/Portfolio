import { Mail, Heart, ExternalLink, Globe } from "lucide-react"
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
import { Button } from "@/components/ui/button"
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
  const fullName = profile?.full_name || ""

  const linksToDisplay = contactLinks && contactLinks.length > 0
    ? contactLinks
    : [
        { id: "gh", name: "GitHub", url: "https://github.com/sami855-ux", icon_name: "github" },
        { id: "li", name: "LinkedIn", url: "https://www.linkedin.com/in/samiux855/", icon_name: "linkedin" },
      ]

  return (
    <footer className="mt-16 border-t border-[#262626] dark:border-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Mini Site Map */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white text-xs h-8 px-3"
          >
            <Link to="/projects" className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Projects
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white text-xs h-8 px-3"
          >
            <Link to="/contact" className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Contact
            </Link>
          </Button>
          {linksToDisplay.map((link) => (
            <Button
              key={link.id || link.name}
              variant="ghost"
              asChild
              className="hover:bg-[#262626] hover:text-white text-xs h-8 px-3"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                {renderFooterSocialIcon(link.icon_name, link.name)}
                {link.name}
              </a>
            </Button>
          ))}
        </div>

        {/* Email and Copyright */}
        <div className="text-center mb-4 flex flex-col items-center justify-center min-h-[48px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-4 w-48 bg-white/10" />
              <Skeleton className="h-3 w-36 bg-white/10" />
            </div>
          ) : (
            <>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-green-400"
                >
                  <Mail className="w-4 h-4" />
                  {email}
                </a>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                © {new Date().getFullYear()} {fullName}. All rights reserved.
              </p>
            </>
          )}
        </div>

        {/* Cute Message */}
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4 fill-current text-rose-500" />
          <span>Built with ☕ & React. Deployed on Vercel.</span>
        </div>
      </div>
    </footer>
  )
}
