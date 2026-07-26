import { motion } from "framer-motion"
import { ExternalLink, Github, Cpu } from "lucide-react"
import type { Project } from "@/types/ui"
import Header from "@/components/Header"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Footer } from "./Footer"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

// Import your images
import taxImg from "../assets/ta.png"
import ecommerceImg from "../assets/ecommerce.png"
import emailImg from "../assets/email.png"
import tourImg from "../assets/tour.png"
import todoImg from "../assets/todo.png"
import lmsImg from "../assets/lms.png"
import realImg from "../assets/real.png"
import negariImg from "../assets/negari.png"
import { defaultImg } from "./Projects"

const projects: Project[] = [
  // 🔥 CORE PROJECTS (Top Priority)
  {
    id: 1,
    title: "Learning Management System",
    description:
      "A full-featured LMS platform for managing online courses, quizzes, certifications, and student progress.",
    technologies: ["React", "Node.js", "MongoDB", "Redux Toolkit"],
    features: [
      "Course creation and enrollment",
      "Interactive quizzes and assessments",
      "Progress tracking and certification",
      "Admin dashboard for managing users and content",
    ],
    challenges:
      "Ensuring real-time progress tracking and scalability for large numbers of users",
    solutions:
      "Used Redux Toolkit for efficient state management and optimized backend queries with MongoDB indexing",
    results:
      "Improved course completion rate by 42% and reduced admin overhead by automating content management",
    githubUrl: "#",
    liveUrl: "#",
    imageUrl: lmsImg,
  },
  {
    id: 2,
    title: "Negari - Community Issue Reporting",
    description:
      "AI-powered platform for citizens to report issues, track resolutions, and communicate with authorities.",
    technologies: [
      "React Native",
      "Next.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.io",
    ],
    features: [
      "Region-based report assignment",
      "Priority-based routing",
      "Real-time notifications and messaging",
      "Interactive issue map",
      "Admin dashboard",
    ],
    challenges:
      "Handling real-time updates and intelligent prioritization at scale",
    solutions:
      "Used Socket.io for real-time communication and integrated AI-based filtering and prioritization",
    results: "Reduced response time by 35% and improved citizen engagement",
    githubUrl: "https://github.com/sami855-ux/Negari.git",
    liveUrl: "https://negari-ten.vercel.app/",
    imageUrl: negariImg,
  },
  {
    id: 4,
    title: "Project & Task Management System",
    description:
      "Collaborative task management platform with real-time updates, task assignment, and progress tracking.",
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "Socket.io",
      "Redux",
      "Tailwind",
    ],
    features: [
      "Project creation and team collaboration",
      "Task assignment and tracking",
      "Real-time updates",
      "Dashboard analytics",
    ],
    challenges: "Managing real-time collaboration across multiple users",
    solutions: "Implemented Socket.io with efficient state synchronization",
    results: "Improved team productivity and task tracking efficiency",
    githubUrl: "#",
    liveUrl: "#",
    imageUrl: defaultImg,
  },
  {
    id: 3,
    title: "HabeshaGo - Transport & Ticketing System",
    description:
      "Smart transport platform with ticket booking, real-time tracking, and route management.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Socket.io", "Maps API"],
    features: [
      "Online ticket booking",
      "Real-time vehicle tracking",
      "Route management",
      "Admin dashboard",
    ],
    challenges: "Handling live GPS tracking and scalability",
    solutions: "Used WebSockets and optimized backend for real-time data flow",
    results: "Enhanced transport efficiency and user convenience",
    githubUrl: "#",
    liveUrl: "#",
    imageUrl: defaultImg,
  },

  // ⚡ OTHER PROJECTS
  {
    id: 5,
    title: "Tax Payment Web App",
    description:
      "Secure platform for managing tax filings, payments, and compliance.",
    technologies: ["React", "Node.js", "MongoDB", "Framer Motion"],
    features: [
      "Tax dashboard",
      "Official approval system",
      "Dynamic tax rules",
      "Notifications",
    ],
    challenges: "Handling complex tax logic with a simple UI",
    solutions: "Built a flexible rule engine and guided UI flows",
    results: "Increased on-time payments by 55%",
    githubUrl: "https://github.com/sami855-ux/Tax-payment-Website.git",
    liveUrl: "#",
    imageUrl: taxImg,
  },
  {
    id: 6,
    title: "E-Commerce Platform",
    description:
      "Online store with payment processing and inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    features: [
      "Product catalog",
      "Authentication",
      "Cart system",
      "Admin dashboard",
    ],
    challenges: "Handling real-time inventory updates",
    solutions: "Used caching and WebSockets",
    results: "Improved conversion rate by 25%",
    githubUrl: "https://github.com/sami855-ux/E-commerce-Website.git",
    liveUrl: "#",
    imageUrl: ecommerceImg,
  },
  {
    id: 7,
    title: "Real Time Chat App",
    description:
      "Real-time messaging app with typing indicators and online status.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    features: [
      "Instant messaging",
      "Typing indicators",
      "Online presence",
      "Chat history",
    ],
    challenges: "Scaling real-time communication",
    solutions: "Used Socket.io rooms and Redis",
    results: "Handled 10k+ concurrent users",
    githubUrl: "https://github.com/yourusername/realtime-chat-app",
    liveUrl: "#",
    imageUrl: realImg,
  },
  {
    id: 8,
    title: "Tour Mobile App",
    description:
      "Mobile app for booking and managing tours with real-time tracking.",
    technologies: ["Java", "Firebase", "Google Maps API"],
    features: ["Tour booking", "User authentication", "Admin dashboard"],
    challenges: "Efficient location tracking",
    solutions: "Optimized GPS usage",
    results: "Improved engagement by 45%",
    githubUrl: "https://github.com/sami855-ux/Tour-Mobile-App-Main.git",
    liveUrl: "#",
    imageUrl: tourImg,
  },
  {
    id: 9,
    title: "Email Spam Detector",
    description:
      "Machine learning system for classifying emails as spam or legitimate.",
    technologies: ["React", "Node.js", "TensorFlow.js"],
    features: ["Spam detection", "Dashboard", "User feedback loop"],
    challenges: "Achieving high accuracy",
    solutions: "Used ML model with feedback retraining",
    results: "96% accuracy",
    githubUrl: "https://github.com/sami855-ux/Email-spam-classfication.git",
    liveUrl: "#",
    imageUrl: emailImg,
  },
  {
    id: 10,
    title: "Animated To-Do Website",
    description:
      "Task manager with smooth animations and drag-and-drop features.",
    technologies: ["React", "Framer Motion", "Tailwind"],
    features: ["Task CRUD", "Drag & drop", "Dark mode"],
    challenges: "Smooth animations",
    solutions: "Optimized Framer Motion usage",
    results: "Increased engagement",
    githubUrl: "https://github.com/sami855-ux/animated-todo-app.git",
    liveUrl: "#",
    imageUrl: todoImg,
  },
  {
    id: 11,
    title: "Shopping Website Landing Page",
    description: "Modern animated landing page for an e-commerce platform.",
    technologies: ["React", "Tailwind", "Framer Motion"],
    features: ["Hero section", "Product highlights", "Responsive design"],
    challenges: "Balancing animation and performance",
    solutions: "Optimized assets and lazy loading",
    results: "Increased engagement by 48%",
    githubUrl: "https://github.com/sami855-ux/Shopping-cart-website.git",
    liveUrl: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1607083200843-eac15f4b7de0?auto=format&fit=crop&w=1350&q=80",
  },
]

import { getProjects } from "@/lib/supabase"
import { useProjectsQuery } from "@/hooks/usePortfolioQueries"

export function MainProjects() {
  const [loaded, setLoaded] = useState(false)
  const { data: dbProjects, isLoading: isQueryLoading, isError, refetch } = useProjectsQuery()

  // Use dynamic database projects if available, otherwise fall back to curated static list
  const projectList = dbProjects && dbProjects.length > 0
    ? dbProjects.map((p, idx) => ({
        id: p.id || idx + 100,
        title: p.title,
        description: p.description,
        technologies: p.tags || [],
        features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Full Stack Architecture", "Interactive UI"],
        challenges: Array.isArray(p.challenges) ? p.challenges.join(". ") : p.challenges || "Optimizing data sync and UI responsiveness",
        solutions: Array.isArray(p.solutions) ? p.solutions.join(". ") : p.solutions || "Implemented caching and modular architecture",
        results: p.results || "Enhanced performance and user engagement",
        githubUrl: p.github || "#",
        liveUrl: p.live || "#",
        imageUrl: p.image || defaultImg,
        architecture: p.architecture || "",
      }))
    : projects

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    setLoaded(true)
  }, [])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <>
      <div className="min-h-screen bg-[#1a1a1a] text-white py-20 px-4 sm:px-8">
        <Header />
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#3a5a40]/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0.3,
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
                transition: {
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto pt-16"
        >
          <div className="mb-12 text-left">
            <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white tracking-tight">
              Projects
            </h1>
            <p className="text-sm text-gray-400 mt-2 font-normal max-w-md">
              A collection of my technical work and case studies
            </p>
          </div>

          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between"
            >
              <span>Notice: Operating in fallback cache mode. Live updates could not be fetched from Supabase.</span>
              <button
                onClick={() => refetch()}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs rounded-xl transition-all cursor-pointer"
              >
                Retry
              </button>
            </motion.div>
          )}

          <motion.div
            className="space-y-24"
            variants={container}
            initial="hidden"
            animate={loaded ? "show" : "hidden"}
          >
            {projectList.map((project, index) => (
              <motion.section
                key={project.id}
                variants={item}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div
                  className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
                >
                  <motion.div
                    className="relative h-[420px] overflow-hidden rounded-3xl group shadow-2xl border border-white/10 bg-[#121214]"
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    whileHover="hover"
                  >
                    <LazyLoadImage
                      src={project.imageUrl}
                      alt={project.title}
                      effect="blur"
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full"
                      placeholderSrc={project.imageUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white space-y-1"
                      >
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <p className="text-xs text-gray-300 font-mono">
                          {project.technologies.join(" • ")}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div
                  className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"} space-y-6`}
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {project.title}
                    </h2>
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                      Featured
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{project.description}</p>

                  <div>
                    <motion.h3
                      className="font-bold text-base text-white mb-3 flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Key Features
                    </motion.h3>

                    <ul className="space-y-2">
                      {(Array.isArray(project.features)
                        ? project.features
                        : typeof project.features === "string"
                        ? (project.features as string).split("\n").filter((f) => f.trim().length > 0)
                        : []
                      ).map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300"
                        >
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#18181c]/60 p-4 rounded-2xl border border-white/5 space-y-1">
                      <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Challenges</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {Array.isArray(project.challenges)
                          ? project.challenges.join(". ")
                          : typeof project.challenges === "object" && project.challenges !== null
                          ? JSON.stringify(project.challenges)
                          : project.challenges || "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#18181c]/60 p-4 rounded-2xl border border-white/5 space-y-1">
                      <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">Solutions</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {Array.isArray(project.solutions)
                          ? project.solutions.join(". ")
                          : typeof project.solutions === "object" && project.solutions !== null
                          ? JSON.stringify(project.solutions)
                          : project.solutions || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Buttons Row (Icon Only with Tooltips) */}
                  <div className="pt-4 flex items-center gap-2.5">
                    {project.githubUrl && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-full bg-[#1c1c24] hover:bg-[#282834] text-gray-200 hover:text-white border border-white/10 shadow-md transition-all cursor-pointer flex items-center justify-center"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Github size={18} />
                            </motion.a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Source Code</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {project.liveUrl && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10 transition-all cursor-pointer flex items-center justify-center"
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ExternalLink size={18} />
                            </motion.a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Live Demo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
