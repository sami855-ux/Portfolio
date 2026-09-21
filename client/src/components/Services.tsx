import { Globe, Smartphone, Server, CreditCard, ArrowRight, Layers } from "lucide-react"
import { Link } from "react-router-dom"
import { useServicesQuery } from "@/hooks/usePortfolioQueries"
import { defaultServices } from "@/lib/api"
import type { Service } from "@/types/api"

const getServiceIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case "smartphone":
    case "mobile":
      return <Smartphone className="w-5 h-5 text-emerald-400" />
    case "server":
    case "database":
    case "backend":
      return <Server className="w-5 h-5 text-emerald-400" />
    case "creditcard":
    case "credit-card":
    case "payment":
    case "telebirr":
      return <CreditCard className="w-5 h-5 text-emerald-400" />
    case "globe":
    case "web":
    default:
      return <Globe className="w-5 h-5 text-emerald-400" />
  }
}

export default function Services() {
  const { data: dbServices, isLoading } = useServicesQuery()
  const services: Service[] = (dbServices && dbServices.length > 0) ? dbServices : defaultServices

  return (
    <section id="services" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-10 sm:scroll-mt-2">
      {/* Centered Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-transparent text-emerald-400 text-xs font-mono font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Services &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Specializations
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 font-normal max-w-xl mx-auto leading-relaxed">
          Technical services, architectural solutions, and localized integrations I provide for web and mobile platforms.
        </p>
      </div>

      {/* Cards Grid - Styled with transparent borders and dynamic content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((item, i) => {
          const contactUrl = item.contact_url || "/contact"
          const isExternal = contactUrl.startsWith("http://") || contactUrl.startsWith("https://")

          return (
            <div
              key={item.id || i}
              className="group rounded-2xl sm:rounded-3xl border border-transparent bg-gradient-to-b from-[#18181c]/90 to-[#101014]/90 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:border-emerald-500/30"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#22222a] border border-transparent text-emerald-400 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {getServiceIcon(item.icon_name)}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs text-gray-400 font-mono">
                <span className="truncate text-zinc-400">{item.stack}</span>
                {isExternal ? (
                  <a
                    href={contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    <span>Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    to={contactUrl}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    <span>Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

