import { Globe, Smartphone, Server, CreditCard, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useServicesQuery } from "@/hooks/usePortfolioQueries"
import { defaultServices } from "@/lib/api"
import type { Service } from "@/types/api"

const getServiceIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case "smartphone":
    case "mobile":
      return <Smartphone className="w-4 h-4" />
    case "server":
    case "database":
    case "backend":
      return <Server className="w-4 h-4" />
    case "creditcard":
    case "credit-card":
    case "payment":
    case "telebirr":
      return <CreditCard className="w-4 h-4" />
    case "globe":
    case "web":
    default:
      return <Globe className="w-4 h-4" />
  }
}

const getTechTags = (stack?: string) => {
  if (!stack) return []
  return stack
    .split(/[•|,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function Services() {
  const { data: dbServices } = useServicesQuery()
  const services: Service[] = (dbServices && dbServices.length > 0) ? dbServices : defaultServices

  return (
    <section id="services" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-16">
      {/* Section Headline - Compact & Refined */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 sm:mb-14 max-w-2xl"
      >
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white font-outfit">
          Services &amp;{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Specializations.
          </span>
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
          Technical services, architectural solutions, and localized integrations engineered for high-performance web and mobile platforms.
        </p>
      </motion.div>

      {/* Editorial Showcase with rounded-md & compact spacing */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {services.map((item, i) => {
          const contactUrl = item.contact_url || "/contact"
          const isExternal = contactUrl.startsWith("http://") || contactUrl.startsWith("https://")
          const techTags = getTechTags(item.stack)
          const indexNumber = String(i + 1).padStart(2, "0")

          const ActionBadge = (
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-emerald-400 transition-colors">
              <span className="hidden sm:inline">Get in Touch</span>
              <div className="w-8 h-8 rounded-md bg-white/[0.05] group-hover:bg-emerald-500/20 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          )

          return (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group py-6 sm:py-7 -mx-3 sm:-mx-4 px-3 sm:px-4 rounded-md hover:bg-white/[0.02] transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                {/* Left: Index + Icon + Title & Narrative */}
                <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                  <span className="font-mono text-xs text-zinc-600 font-medium pt-2 shrink-0 select-none">
                    {indexNumber}
                  </span>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300 shrink-0">
                    {getServiceIcon(item.icon_name)}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300 font-outfit">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-2xl">
                      {item.description}
                    </p>

                    {/* Tech Pills with rounded-md */}
                    {techTags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {techTags.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 rounded-md text-xs font-medium text-zinc-300 bg-white/[0.04] backdrop-blur-sm transition-colors duration-200 group-hover:bg-white/[0.07]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Action Link */}
                <div className="pl-12 sm:pl-14 md:pl-0 pt-1 self-start md:self-center shrink-0">
                  {isExternal ? (
                    <a
                      href={contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer inline-block"
                      aria-label={`Get in touch for ${item.title}`}
                    >
                      {ActionBadge}
                    </a>
                  ) : (
                    <Link
                      to={contactUrl}
                      className="cursor-pointer inline-block"
                      aria-label={`Get in touch for ${item.title}`}
                    >
                      {ActionBadge}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
