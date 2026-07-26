import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

import { useProfileSettingsQuery } from "@/hooks/usePortfolioQueries"
import { Skeleton } from "@/components/ui/skeleton"

export function Footer() {
  const { data: profile, isLoading } = useProfileSettingsQuery()
  const email = profile?.email || (profile as any)?.contact_email || ""
  const fullName = profile?.full_name || ""

  return (
    <footer className="mt-16 border-t border-[#262626] dark:border-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Mini Site Map */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <Link to="/projects" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Projects
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <Link to="/contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <Link
              to="https://github.com/sami855-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <Link
              to="https://www.linkedin.com/in/samiux855/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Link>
          </Button>
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
