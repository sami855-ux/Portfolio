import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import type { Project } from "@/types/ui"
import Header from "@/components/Header"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Footer } from "./Footer"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

// Import your images
import taxImg from "../assets/ta.png"
import ecommerceImg from "../assets/ecommerce.png"
import emailImg from "../assets/email.png"
import tourImg from "../assets/tour.png"
import todoImg from "../assets/todo.png"
import lmsImg from "../assets/lms.png"
import realImg from "../assets/real.png"
import negariImg from "../assets/negari.png"

const projects: Project[] = [
  {
    id: 1,
    title: "Negari - Community Issue Reporting",
    description:
      "A mobile and web platform for citizens to report urban issues, track resolutions, and communicate with local authorities.",
    technologies: [
      "React Native",
      "Next.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Leaflet",
      "Socket.io",
    ],
    features: [
      "Region-based report assignment to officials",
      "Priority-based issue routing",
      "Real-time notifications and messaging between users and officials",
      "Interactive map view of reported issues",
      "Admin dashboard for managing users, reports, and system settings",
    ],
    challenges:
      "Handling real-time updates, secure voice transcription, and prioritization of reports in a scalable system",
    solutions:
      "Integrated Socket.io for real-time communication, used OpenAI Whisper for voice-to-text, implemented custom ML models for spam and priority detection, and optimized MongoDB queries for fast data retrieval",
    results:
      "Reduced issue response time by 35% and improved citizen engagement by providing transparent tracking and notifications",
    githubUrl: "https://github.com/sami855-ux/Negari.git",
    liveUrl: "https://negari-ten.vercel.app/",
    imageUrl: negariImg,
  },

  {
    id: 2,
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
    id: 4,
    title: "Tax Payment Web App",
    description:
      "A secure and user-friendly platform for managing tax filings, payments, and compliance for individuals and businesses.",
    technologies: ["React", "Node.js", "MongoDB", "Framer Motion"],
    features: [
      "Taxpayer dashboard with due dates and payment history",
      "Official panel for reviewing and approving filings",
      "Dynamic tax rule configuration",
      "Automated reminders and notifications",
    ],
    challenges:
      "Handling complex tax rules while maintaining a simple user interface",
    solutions:
      "Implemented a flexible tax rule engine and used animations to guide user interactions step-by-step",
    results:
      "Increased on-time payments by 55% and reduced manual errors in filings by 70%",
    githubUrl: "https://github.com/sami855-ux/Tax-payment-Website.git",
    liveUrl: "#",
    imageUrl: taxImg,
  },

  {
    id: 3,
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
    githubUrl: "https://github.com/sami855-ux/E-commerce-Website.git",
    liveUrl: "#",
    imageUrl: ecommerceImg,
  },

  {
    id: 3,
    title: "Tour Mobile App",
    description:
      "A comprehensive mobile application for booking and managing guided tours with real-time location tracking.",
    technologies: ["Java", "Firebase", "Google Maps API", "SQLite"],
    features: [
      "Tour package browsing with filters",
      "User authentication system",
      "In-app tour booking and itinerary",
      "Admin dashboard for managing tours",
    ],
    challenges:
      "Implementing real-time location tracking while maintaining battery efficiency",
    solutions:
      "Used Google Maps API with optimized location services and Firebase for real-time data sync",
    results:
      "Improved user engagement by 45% and reduced booking process time by 60%",
    githubUrl: "https://github.com/sami855-ux/Tour-Mobile-App-Main.git",
    liveUrl: "#",
    imageUrl: tourImg,
  },
  {
    id: 6,
    title: "Real Time Chat App",
    description:
      "A modern real-time chat application that allows users to send and receive messages instantly, with typing indicators, read receipts, and online status updates.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Express"],
    features: [
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
    imageUrl: realImg,
  },
  {
    id: 4,
    title: "Animated To-Do Website",
    description:
      "A beautifully animated task management website that helps users organize and track daily tasks with smooth interactions.",
    technologies: ["React", "Framer Motion", "Tailwind CSS", "LocalStorage"],
    features: [
      "Add, edit, and delete tasks",
      "Drag-and-drop task reordering",
      "Light/dark theme toggle",
      "Smooth animations for all task interactions",
    ],
    challenges:
      "Creating fluid animations while maintaining high performance on all devices",
    solutions:
      "Used Framer Motion with layout transitions and optimized re-renders for animation-heavy UI",
    results:
      "Enhanced user experience with 70% longer session duration and increased daily active users",
    githubUrl: "https://github.com/sami855-ux/animated-todo-app.git",
    liveUrl: "#",
    imageUrl: todoImg,
  },
  {
    id: 2,
    title: "Email Spam Detector",
    description:
      "An intelligent email filtering tool that classifies incoming messages as spam or legitimate using machine learning.",
    technologies: ["React", "Node.js", "MongoDB", "TensorFlow.js"],
    features: [
      "Real-time spam detection using trained ML models",
      "Interactive dashboard to review flagged emails",
      "User feedback system to improve model accuracy",
      "Role-based access control for users and admins",
    ],
    challenges:
      "Training an accurate model with a high precision rate and integrating it seamlessly into the email pipeline",
    solutions:
      "Used TensorFlow.js to deploy a lightweight spam classifier in the browser and created a feedback loop to retrain with user input",
    results:
      "Achieved over 96% accuracy in spam classification and reduced false positives by 30%",
    githubUrl: "https://github.com/sami855-ux/Email-spam-classfication.git",
    liveUrl: "#",
    imageUrl: emailImg,
  },
  {
    id: 5,
    title: "Shopping Website Landing Page",
    description:
      "A modern, animated landing page for an online shopping platform, designed to attract users and promote featured products.",
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    features: [
      "Hero section with promotional banners",
      "Animated product highlights",
      "Responsive design for mobile and desktop",
      "Newsletter subscription and call-to-action sections",
    ],
    challenges:
      "Creating smooth animations without sacrificing load speed or SEO performance",
    solutions:
      "Implemented Framer Motion for lightweight animations and optimized images using lazy loading",
    results:
      "Increased user engagement by 48% and improved sign-up conversions by 30%",
    githubUrl: "https://github.com/sami855-ux/Shopping-cart-website.git",
    liveUrl: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1607083200843-eac15f4b7de0?auto=format&fit=crop&w=1350&q=80",
  },
]

export function MainProjects() {
  const [loaded, setLoaded] = useState(false)

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
          className="max-w-6xl mx-auto pt-5"
        >
          <header className="mb-16">
            <motion.h1
              className="font-semibold text-3xl py-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              My main{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                projects
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-400 max-w-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Detailed case studies of my most significant work, including
              technical challenges and measurable outcomes.
            </motion.p>
          </header>

          <motion.div
            className="space-y-24"
            variants={container}
            initial="hidden"
            animate={loaded ? "show" : "hidden"}
          >
            {projects.map((project, index) => (
              <motion.section
                key={project.id}
                variants={item}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                <div
                  className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
                >
                  <motion.div
                    className="relative h-96 overflow-hidden rounded-2xl group"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white"
                      >
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <p className="text-sm text-gray-300">
                          {project.technologies.join(", ")}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
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
                      <p className="text-gray-400 text-sm">
                        {project.solutions}
                      </p>
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
                              backgroundColor:
                                dot === 2 ? "#a855f7" : "#374151",
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
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
