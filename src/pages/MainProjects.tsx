import { motion } from "framer-motion"
import { Code, ExternalLink, Github } from "lucide-react"
import type { Project } from "@/types/ui" // Define your types
import Header from "@/components/Header"

const projects: Project[] = [
  {
    id: 1,
    title: "Real time chat App",
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
      "https://images.ctfassets.net/hrltx12pl8hq/4kzWG72Pi925q9Gtc6hBQh/6bdbb560251e188bab5d3ea1ad195d6b/1.jpg",
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
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4 sm:px-8">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto pt-12"
      >
        <header className="mb-16">
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

                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Key Features:</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-purple-400 mr-2">▹</span>
                        <span>{feature}</span>
                      </li>
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

                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
