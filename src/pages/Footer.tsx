import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Footer() {
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
            <a href="#projects" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Projects
            </a>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <a href="#contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="hover:bg-[#262626] hover:text-white"
          >
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>
        </div>

        {/* Email and Copyright */}
        <div className="text-center mb-4">
          <a
            href="mailto:your.email@example.com"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground  transition-colors"
          >
            <Mail className="w-4 h-4" />
            samitale86@gmail.com
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Samuel tale. All rights reserved.
          </p>
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
