import emailjs from "emailjs-com"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowUpRight, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"
import type { ChangeEvent, FormEvent } from "react"

import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
  useSubmitContactMessageMutation,
  useContactLinksQuery,
  useProfileSettingsQuery,
} from "@/hooks/usePortfolioQueries"
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTelegram,
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa"

const defaultSocialLinks = [
  { name: "GitHub", url: "https://github.com/sami855-ux", icon_name: "github" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/samiux855/",
    icon_name: "linkedin",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/samii_211912/",
    icon_name: "instagram",
  },
  { name: "Telegram", url: "https://t.me/Sami_hhtt", icon_name: "telegram" },
]

const renderSocialTagIcon = (iconName?: string, name?: string) => {
  const key = (iconName || name || "").toLowerCase()
  if (key.includes("github")) return <FaGithub className="w-3.5 h-3.5" />
  if (key.includes("linkedin")) return <FaLinkedin className="w-3.5 h-3.5 text-blue-400" />
  if (key.includes("twitter") || key.includes("x")) return <FaTwitter className="w-3.5 h-3.5 text-sky-400" />
  if (key.includes("telegram")) return <FaTelegram className="w-3.5 h-3.5 text-cyan-400" />
  if (key.includes("instagram")) return <FaInstagram className="w-3.5 h-3.5 text-rose-400" />
  if (key.includes("youtube")) return <FaYoutube className="w-3.5 h-3.5 text-red-400" />
  if (key.includes("discord")) return <FaDiscord className="w-3.5 h-3.5 text-indigo-400" />
  if (key.includes("email") || key.includes("mail")) return <FaEnvelope className="w-3.5 h-3.5 text-emerald-400" />
  return <FaGlobe className="w-3.5 h-3.5 text-emerald-400" />
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const submitMutation = useSubmitContactMessageMutation()
  const { data: dbContactLinks } = useContactLinksQuery()
  const { data: profileSettings } = useProfileSettingsQuery()

  const socialLinks = dbContactLinks && dbContactLinks.length > 0
    ? dbContactLinks
    : defaultSocialLinks

  const email = profileSettings?.email || (profileSettings as any)?.contact_email || "samitale86@gmail.com"
  const phone = profileSettings?.phone || "+251 978 109 304"
  const location = profileSettings?.location || "Addis Ababa, Ethiopia"

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(label)
    toast.success(`Copied ${label} to clipboard!`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const sendEmail = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading("Sending your message...")
    const formEl = e.target as HTMLFormElement

    submitMutation.mutate(formData, {
      onSuccess: () => {
        emailjs
          .sendForm(
            "service_8oby0sa",
            "template_jrk5rq9",
            formEl,
            "Ddw-YUU_qHVSVYCjv",
          )
          .then(
            (result) => {
              console.log("Email sent!", result.text)
              setIsSubmitted(true)
              setIsLoading(false)
              toast.success("Message sent successfully! I will get back to you soon.", { id: toastId })
              setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
              })
            },
            (error) => {
              console.error("Failed to send email", error.text)
              setIsSubmitted(true)
              setIsLoading(false)
              toast.success("Message recorded successfully!", { id: toastId })
            },
          )
      },
      onError: (err: any) => {
        console.error("Submit error:", err)
        toast.error("Failed to send message: " + (err?.message || "Please try again."), { id: toastId })
        setIsLoading(false)
      },
    })
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  return (
    <>
      <Header />
      <div className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-x-clip">
        {/* Subtle responsive ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[650px] h-[220px] sm:h-[320px] bg-emerald-500/[0.04] rounded-full blur-[90px] sm:blur-[140px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 lg:mb-14 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3 sm:mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for new projects</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white font-outfit">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Touch.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 sm:mt-3 font-normal max-w-xl mx-auto sm:mx-0 leading-relaxed">
              Have an architectural question, project inquiry, or partnership opportunity? I’d love to hear from you.
            </p>
          </div>

          {/* Grid Layout: Stacks cleanly on Mobile & Tablet, 2 columns on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Direct Inquiries (Apple Frosted Glass Panel) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="lg:col-span-5 p-5 sm:p-7 lg:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-2xl flex flex-col justify-between gap-8 lg:min-h-[520px]"
            >
              <div className="space-y-6 sm:space-y-7">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight font-outfit">
                    Direct Inquiries
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Reach out directly or connect through verified channels.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-3.5">
                  {/* Email Row */}
                  <div className="group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[11px] text-zinc-400 uppercase tracking-wider">Email</h3>
                        <a
                          href={`mailto:${email}`}
                          className="text-xs sm:text-sm text-zinc-200 hover:text-emerald-400 font-mono mt-0.5 block transition-colors truncate"
                          title={email}
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(email, "Email")}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                      title="Copy Email"
                      aria-label="Copy Email"
                    >
                      {copiedKey === "Email" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Phone Row */}
                  <div className="group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[11px] text-zinc-400 uppercase tracking-wider">Phone</h3>
                        <a
                          href={`tel:${phone.replace(/\s+/g, "")}`}
                          className="text-xs sm:text-sm text-zinc-200 hover:text-emerald-400 font-mono mt-0.5 block transition-colors truncate"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(phone, "Phone")}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                      title="Copy Phone Number"
                      aria-label="Copy Phone Number"
                    >
                      {copiedKey === "Phone" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Location Row */}
                  <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[11px] text-zinc-400 uppercase tracking-wider">Location</h3>
                      <p className="text-xs sm:text-sm text-zinc-200 mt-0.5 truncate">{location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-5 sm:pt-6 border-t border-white/[0.06]">
                <h3 className="font-semibold text-[11px] uppercase tracking-wider mb-3 text-zinc-400">
                  Connect Online
                </h3>
                <div className="flex gap-2 sm:gap-2.5 flex-wrap">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] hover:border-emerald-500/30 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {renderSocialTagIcon(social.icon_name, social.name)}
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Message Form (Apple Frosted Glass Panel) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="lg:col-span-7"
            >
              {isSubmitted ? (
                <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-2xl flex flex-col items-center justify-center text-center lg:min-h-[520px]">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-500/20 mb-5 sm:mb-6 border border-emerald-500/30">
                      <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-2 font-outfit">
                      Message Sent.
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. I’ve received your note and will review it and respond shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] shadow-2xl lg:min-h-[520px] flex flex-col justify-between">
                  <div>
                    <div className="mb-5 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight font-outfit">
                        Send a Message
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                        Fill out the form below and I'll respond as soon as possible.
                      </p>
                    </div>

                    <form className="space-y-4" onSubmit={sendEmail}>
                      {/* Name & Email: 2 cols on tablet/desktop, 1 col on mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="name"
                            className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider"
                          >
                            Name
                          </label>
                          <Input
                            className="bg-white/[0.03] text-white border border-white/[0.08] focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base sm:text-sm h-11 sm:h-12 px-3.5 placeholder:text-zinc-500 transition-all"
                            id="name"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="email"
                            className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider"
                          >
                            Email
                          </label>
                          <Input
                            className="bg-white/[0.03] text-white border border-white/[0.08] focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base sm:text-sm h-11 sm:h-12 px-3.5 placeholder:text-zinc-500 transition-all"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="subject"
                          className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider"
                        >
                          Subject
                        </label>
                        <Input
                          className="bg-white/[0.03] text-white border border-white/[0.08] focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base sm:text-sm h-11 sm:h-12 px-3.5 placeholder:text-zinc-500 transition-all"
                          id="subject"
                          name="subject"
                          placeholder="What is this regarding?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="message"
                          className="text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider"
                        >
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell me about your project, idea, or inquiry..."
                          rows={4}
                          className="bg-white/[0.03] text-white border border-white/[0.08] focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-base sm:text-sm p-3.5 placeholder:text-zinc-500 resize-none min-h-[120px] transition-all"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-white/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? (
                            <span className="inline-block animate-pulse">Transmitting message...</span>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <ArrowUpRight className="w-4 h-4 text-zinc-950" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

