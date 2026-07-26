import emailjs from "emailjs-com"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { ChangeEvent, FormEvent } from "react"

import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import { submitContactMessage } from "@/lib/supabase"
import { useSubmitContactMessageMutation } from "@/hooks/usePortfolioQueries"

const socialLinks = [
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
            "Ddw-YUU_qHVSVYCjv", // (public key)
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
              // Even if emailjs fails, message was stored in Supabase
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
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto pt-16"
        >
          {/* Plain Left-Aligned Header */}
          <div className="mb-12 text-left">
            <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white tracking-tight">
              {isSubmitted ? "Message Sent!" : "Contact"}
            </h1>
            <p className="text-sm text-gray-400 mt-2 font-normal max-w-md">
              {isSubmitted
                ? "Thank you for reaching out! I'll get back to you soon."
                : "Have a project in mind or want to collaborate? Feel free to reach out!"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information - Always visible */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full p-6 bg-[#1a1a1a] border-[#201f1f]">
                <h2 className="text-xl font-outfit font-extrabold mb-6 text-white tracking-tight">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-sm text-white">Email</h3>
                      <p className="text-xs text-gray-300 font-mono mt-0.5">samitale86@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Phone className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-sm text-white">Phone</h3>
                      <p className="text-xs text-gray-300 font-mono mt-0.5">+251 978 109 304</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-sm text-white">Location</h3>
                      <p className="text-xs text-gray-300 mt-0.5">Addis Ababa, Ethiopia</p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="mt-8 pt-6 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-outfit font-bold text-xs uppercase tracking-wider mb-4 text-gray-400">
                    Connect with me
                  </h3>
                  <div className="flex gap-2.5 flex-wrap">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-[#1c1c24] hover:bg-[#282834] text-gray-300 hover:text-white border border-white/10 text-xs font-mono font-medium transition-all"
                        whileHover={{ y: -2 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {social.name}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </Card>
            </motion.div>

            {/* Right side - Form or Success Message */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isSubmitted ? (
                <Card className="h-full p-6 bg-[#1a1a1a] border-[#201f1f] flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-outfit font-extrabold text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-xs text-gray-300 mb-6">
                      Thank you for contacting me. I'll get back to you as soon as possible.
                    </p>
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-outfit font-bold rounded-full px-6 py-2.5 text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        Send another message
                      </Button>
                    </motion.div>
                  </motion.div>
                </Card>
              ) : (
                <Card className="h-full p-6 bg-[#1a1a1a] border-[#201f1f]">
                  <h2 className="text-xl font-outfit font-extrabold mb-6 text-white tracking-tight">
                    Send a Message
                  </h2>

                  <form className="space-y-4" onSubmit={sendEmail}>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-xs font-mono font-medium text-gray-300"
                      >
                        Name
                      </label>
                      <Input
                        className="bg-[#1c1c24] text-white border-white/10 focus:border-emerald-500/50 rounded-xl text-xs h-10 placeholder:text-gray-500"
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
                        className="text-xs font-mono font-medium text-gray-300"
                      >
                        Email
                      </label>
                      <Input
                        className="bg-[#1c1c24] text-white border-white/10 focus:border-emerald-500/50 rounded-xl text-xs h-10 placeholder:text-gray-500"
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
                        className="text-xs font-mono font-medium text-gray-300"
                      >
                        Subject
                      </label>
                      <Input
                        className="bg-[#1c1c24] text-white border-white/10 focus:border-emerald-500/50 rounded-xl text-xs h-10 placeholder:text-gray-500"
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="text-xs font-mono font-medium text-gray-300"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message here..."
                        rows={4}
                        className="bg-[#1c1c24] text-white border-white/10 focus:border-emerald-500/50 rounded-xl text-xs placeholder:text-gray-500"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-outfit font-bold rounded-full py-5 text-xs shadow-lg shadow-emerald-500/20 cursor-pointer border border-white/10"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}


