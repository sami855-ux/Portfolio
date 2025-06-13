import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import type { Project } from "@/types/ui" // Define your types
import Header from "@/components/Header"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

const projects: Project[] = [
  {
    id: 1,
    title: "Real Time Chat App",
    description:
      "A modern real-time chat application that allows users to send and receive messages instantly, with typing indicators, read receipts, and online status updates.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Express"],
    features: [
      "1-on-1 and group chat support",
      "Real-time messaging with Socket.io",
      "User authentication and profile management",
      "Online status and typing indicators",
      "Chat history and message persistence",
      "Responsive UI with dark mode",
    ],
    challenges:
      "Handling real-time message delivery, presence tracking, and scaling Socket connections without latency under heavy load.",
    solutions:
      "Utilized Socket.io with rooms for efficient message broadcasting, implemented Redis for scalable pub/sub, and set up horizontal scaling with sticky sessions.",
    results:
      "Achieved sub-second message delivery latency and supported over 10,000 concurrent users with smooth real-time interactions.",
    githubUrl: "https://github.com/yourusername/realtime-chat-app",
    liveUrl: "https://realtime-chat-app.vercel.app",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/4kzWG72Pi925q9Gtc6hBQh/6bdbb560251e188bab5d3ea1ad195d6b/1.jpg",
  },

  {
    id: 1,
    title: "Email spam detector",
    description:
      "A full-featured online store with payment processing and inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    features: [
      "Product catalog with filters",
      "User authentication system",
      "Shopping cart functionality",
      "Admin dashboard",
    ],
    challenges:
      "Implementing real-time inventory updates during high traffic periods",
    solutions: "Used Redis for caching and WebSockets for live updates",
    results:
      "Reduced checkout time by 40% and increased conversion rate by 25%",
    githubUrl: "#",
    liveUrl: "#",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/4aF6vvw0ruLgoBkSe6o6kJ/7d5a578c5eb569d018840eaedf036989/4.jpg",
  },
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-featured online store with payment processing and inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    features: [
      "Product catalog with filters",
      "User authentication system",
      "Shopping cart functionality",
      "Admin dashboard",
    ],
    challenges:
      "Implementing real-time inventory updates during high traffic periods",
    solutions: "Used Redis for caching and WebSockets for live updates",
    results:
      "Reduced checkout time by 40% and increased conversion rate by 25%",
    githubUrl: "#",
    liveUrl: "#",
    imageUrl:
      "https://images.ctfassets.net/hrltx12pl8hq/4kzWG72Pi925q9Gtc6hBQh/6bdbb560251e188bab5d3ea1ad195d6b/1.jpg",
  },
  // Add more projects...
]

export function MainProjects() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4 sm:px-8">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto pt-5"
      >
        <header className="mb-16">
          <h1 className="font-semibold text-3xl py-2 ">
            My main{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
              projects
            </span>
          </h1>
          <p className=" text-gray-400 max-w-3xl">
            Detailed case studies of my most significant work, including
            technical challenges and measurable outcomes.
          </p>
        </header>

        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.section
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div
                className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <div className="relative rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/30 transition-all duration-500 h-96">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
              </div>

              <div
                className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {project.title}
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-400/25  text-white">
                    Featured
                  </span>
                </div>

                <p className="text-gray-300 mb-6">{project.description}</p>

                <div className="mb-8">
                  <motion.h3
                    className="font-semibold text-lg mb-3 flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                      <motion.span
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </span>
                    Key Features
                  </motion.h3>

                  <ul className="space-y-3">
                    {project.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                      >
                        <motion.span
                          className="text-blue-400 mr-3 mt-0.5 flex-shrink-0"
                          whileHover={{ rotate: 15 }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M5 12h14"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M12 5l7 7-7 7"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </motion.span>

                        <motion.span
                          className="text-[15px] leading-relaxed relative"
                          whileHover={{
                            x: 5,
                          }}
                        >
                          {feature}
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                        </motion.span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2">Challenges</h3>
                    <p className="text-gray-400 text-sm">
                      {project.challenges}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Solutions</h3>
                    <p className="text-gray-400 text-sm">{project.solutions}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Results</h3>
                    <p className="text-gray-400 text-sm">{project.results}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <motion.h3
                    className="font-semibold text-lg mb-4 flex items-center"
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-2" />
                    Technologies Used
                  </motion.h3>

                  <motion.div
                    className="flex flex-wrap gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
                  >
                    {project.technologies.map((tech) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{
                          y: -3,
                          scale: 1.05,
                          background:
                            "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.2) 100%)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                          hover: { duration: 0.2 },
                        }}
                        className={cn(
                          "text-sm px-3 py-1.5 rounded-full",
                          "bg-gray-800/80 text-gray-200",
                          "border border-gray-700 hover:border-blue-400/50",
                          "transition-all duration-200",
                          "flex items-center gap-1.5",
                          "cursor-default"
                        )}
                      >
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                        {tech}
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="mt-4 flex items-center gap-2 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="flex gap-1">
                      {[1, 2, 3].map((dot) => (
                        <motion.span
                          key={dot}
                          className="w-2 h-2 rounded-full bg-gray-700"
                          animate={{
                            scale: dot === 2 ? [1, 1.1, 1] : 1,
                            backgroundColor: dot === 2 ? "#a855f7" : "#374151",
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </span>
                    <span>Advanced proficiency in these technologies</span>
                  </motion.div>
                </div>

                <div className="mt-10">
                  <motion.div
                    className="flex gap-5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {/* GitHub Button */}
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-2 px-6 py-3 rounded-xl overflow-hidden"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                      <div className="relative z-10 flex items-center gap-3">
                        <Github
                          size={18}
                          className="text-gray-300 group-hover:text-white transition-colors"
                        />
                      </div>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>

                    {/* Live Demo Button */}
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-2 px-6 py-3 rounded-xl overflow-hidden"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                      <div className="relative z-10 flex items-center gap-3">
                        <ExternalLink
                          size={18}
                          className="text-blue-100 group-hover:text-white transition-colors"
                        />
                      </div>
                      <motion.div
                        className="absolute inset-0 border-2 border-blue-400/30 rounded-xl opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0.9 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      />
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
