import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"

const Contact = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen py-12 px-4 mt-7 sm:px-6 lg:px-8 bg-[#1a1a1a]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12 ">
            <motion.h1
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Get In Touch
            </motion.h1>
            <motion.p
              className=" text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Have a project in mind or want to collaborate? Feel free to reach
              out!
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="h-full p-6 bg-[#1a1a1a] border-[#201f1f]">
                <h2 className="text-2xl font-semibold mb-6 text-white">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Mail className="w-5 h-5 text-[#4d4d4d]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Email</h3>
                      <p className=" text-white">samitale86@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Phone className="w-5 h-5 text-[#4d4d4d]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Phone</h3>
                      <p className=" text-white">+251 978 109 304</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <MapPin className="w-5 h-5 text-[#4d4d4d]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Location</h3>
                      <p className="text-muted-foreground text-white">
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="mt-8 pt-6 border-t border-[#201f1f] dark:border-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="font-medium mb-4 text-slate-100">
                    Connect with me
                  </h3>
                  <div className="flex gap-4 flex-wrap">
                    {["Telegram", "Instagram", "GitHub", "LinkedIn"].map(
                      (social, index) => (
                        <motion.a
                          key={social}
                          href="#"
                          className="px-4 py-2 rounded-md bg-[#201f1f] text-slate-100 dark:bg-gray-800 transition-colors text-sm font-medium"
                          whileHover={{ y: -2 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {social}
                        </motion.a>
                      )
                    )}
                  </div>
                </motion.div>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="h-full p-6 bg-[#1a1a1a] border-[#201f1f]">
                <h2 className="text-2xl font-semibold mb-6 text-slate-100">
                  Send a Message
                </h2>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-100"
                    >
                      Name
                    </label>
                    <Input
                      className="text-slate-100 border-[#201f1f] hover:shadow-none"
                      id="name"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-100"
                    >
                      Email
                    </label>
                    <Input
                      className="text-slate-100 border-[#201f1f] hover:shadow-none"
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-slate-100"
                    >
                      Subject
                    </label>
                    <Input
                      className="text-slate-100 border-[#201f1f] hover:shadow-none"
                      id="subject"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-slate-100"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      rows={5}
                      className="border-[#201f1f] text-slate-100"
                    />
                  </div>

                  <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 cursor-pointer"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Contact
