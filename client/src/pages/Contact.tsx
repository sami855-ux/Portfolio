import emailjs from "emailjs-com"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowUpRight } from "lucide-react"
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
  return <FaGlobe className="w-3.5 h-3.5 text-green-400" />
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
  const submitMutation = useSubmitContactMessageMutation()
  const { data: dbContactLinks } = useContactLinksQuery()
  const { data: profileSettings } = useProfileSettingsQuery()

  const socialLinks = dbContactLinks && dbContactLinks.length > 0
    ? dbContactLinks
    : defaultSocialLinks

  const email = profileSettings?.email || (profileSettings as any)?.contact_email || "samitale86@gmail.com"
  const phone = profileSettings?.phone || "+251 978 109 304"
  const location = profileSettings?.location || "Addis Ababa, Ethiopia"

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
      <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent">
        {/* Apple subtle ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto pt-8 sm:pt-12"
        >
          {/* Apple-style Section Header */}
          <div className="mb-14 sm:mb-16 text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white font-outfit">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Touch.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-3 font-normal max-w-lg leading-relaxed">
              Have an architectural question, project inquiry, or partnership opportunity? I’d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Contact Details (Apple Frosted Glass Panel) */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-full p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border-0 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-white tracking-tight font-outfit">
                  Direct Inquiries
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] flex items-center justify-center text-emerald-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">Email</h3>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm text-zinc-200 hover:text-emerald-400 font-mono mt-0.5 block transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] flex items-center justify-center text-emerald-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">Phone</h3>
                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="text-sm text-zinc-200 hover:text-emerald-400 font-mono mt-0.5 block transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider">Location</h3>
                      <p className="text-sm text-zinc-200 mt-0.5">{location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="mt-10 pt-6 border-t border-white/[0.06]">
                <h3 className="font-semibold text-xs uppercase tracking-wider mb-4 text-zinc-400">
                  Connect Online
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 hover:text-white border-0 text-xs font-medium transition-all"
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
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {isSubmitted ? (
                <div className="h-full p-8 sm:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border-0 shadow-2xl flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-6">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-2 font-outfit">
                      Message Sent.
                    </h3>
                    <p className="text-sm text-zinc-400 mb-8 max-w-xs mx-auto">
                      Thank you for reaching out. I’ll review your note and respond as soon as possible.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="h-full p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border-0 shadow-2xl">
                  <h2 className="text-xl font-semibold text-white tracking-tight font-outfit mb-6">
                    Send a Message
                  </h2>

                  <form className="space-y-4" onSubmit={sendEmail}>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                      >
                        Name
                      </label>
                      <Input
                        className="bg-white/[0.04] text-white border-0 focus:ring-1 focus:ring-emerald-400/50 rounded-2xl text-xs sm:text-sm h-11 placeholder:text-zinc-500"
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
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                      >
                        Email
                      </label>
                      <Input
                        className="bg-white/[0.04] text-white border-0 focus:ring-1 focus:ring-emerald-400/50 rounded-2xl text-xs sm:text-sm h-11 placeholder:text-zinc-500"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="subject"
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                      >
                        Subject
                      </label>
                      <Input
                        className="bg-white/[0.04] text-white border-0 focus:ring-1 focus:ring-emerald-400/50 rounded-2xl text-xs sm:text-sm h-11 placeholder:text-zinc-500"
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
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message..."
                        rows={4}
                        className="bg-white/[0.04] text-white border-0 focus:ring-1 focus:ring-emerald-400/50 rounded-2xl text-xs sm:text-sm placeholder:text-zinc-500 resize-none"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider shadow-xl shadow-white/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
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
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
