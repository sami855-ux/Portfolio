import type { TimelineItem } from "@/types/ui"
import {
  Briefcase,
  GraduationCap,
  Code,
  Rocket,
  User,
  Users,
  TreePine,
} from "lucide-react"
import { motion } from "framer-motion"

export function About() {
  const items: TimelineItem[] = [
    {
      id: 1,
      title: "Introduction",
      description:
        "Full-stack developer with 3+ years of experience building web applications using React, Next.js,Vue.js, laravel, Node.js and PostgreSQL. I have developed a strong foundation in front-end and back-end development, and I'm passionate about creating user-friendly and efficient applications that meet the needs of my clients.",
      icon: <User className="w-5 h-5" />,
      side: "left",
      color: "text-blue-500",
    },
    {
      id: 2,
      title: "Education",
      description:
        "Software engineering degree from Debre Brihan University (2022-2025). Graduated with honors. and  have certificates from udemy for fundamental programming and Artificial Intelligence and alsion for MERN stack development. ",
      date: "2022 - 2025",
      icon: <GraduationCap className="w-5 h-5" />,
      side: "right",
      color: "text-green-500",
    },
    {
      id: 3,
      title: "Internship",
      description:
        "Internship at Efuye Gela as a full-stack developer and as a frontend developer at melfan tech. Worked on a range of projects including web applications using React, Next.js, Vue.js, Laravel Node.js and PostgreSQL.",
      date: "2018 - 2020",
      icon: <Briefcase className="w-5 h-5" />,
      side: "left",
      color: "text-yellow-500",
    },
    {
      id: 4,
      title: "Currently",
      description: `Working in a node package for ethiopian that uses telebirr and fayda to help with payments, 
      and actively learning and working on personal projects. Developing web applications using React, Next.js, Node.js and PostgreSQL.  
        
       `,
      date: "2020 - Present",
      icon: <Code className="w-5 h-5" />,
      side: "right",
      color: "text-orange-500",
    },
    {
      id: 5,
      title: "Future Goals",
      description:
        "Continuously learning and growing as a developer. Working on personal projects and contributing to open-source projects. Seeking new opportunities to expand my skills and knowledge.",
      icon: <Rocket className="w-5 h-5" />,
      side: "left",
      color: "text-purple-500",
    },
    {
      id: 21,
      title: "Development Philosophy",
      description:
        "I believe in clean, maintainable code and user-centric design. Performance and accessibility should never be afterthoughts.",
      icon: <TreePine className="w-5 h-5" />,
      side: "right",
      color: "text-red-500",
    },
    {
      id: 23,
      title: "Work Style",
      description:
        "Agile practitioner who thrives in collaborative environments. Strong believer in documentation and knowledge sharing.",
      icon: <Users className="w-5 h-5" />,
      side: "left",
      color: "text-pink-500",
    },
  ]

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        My{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
          Journey
        </span>
      </motion.h2>

      {/* Central line - hidden on mobile */}
      <div className="hidden md:block absolute left-1/2 w-0.5 h-[85%] top-28 bg-gradient-to-b from-transparent via-gray-400 to-transparent dark:via-gray-600 transform -translate-x-1/2"></div>

      <div className="space-y-8 md:space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`relative flex ${
              item.side === "left" ? "md:justify-start" : "md:justify-end"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Item container */}
            <div
              className={`w-full md:w-5/12 p-5 md:p-6 relative z-10 rounded-xl border bg-[#1a1a1a] text-white dark:bg-[#1c1c1c] shadow-sm dark:shadow-md ${
                item.side === "left" ? "md:mr-auto" : "md:ml-auto"
              } border-[#272727] dark:border-[#262727] hover:border-primary/30 dark:hover:border-primary/50 transition-colors duration-300`}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className={`p-2 w-10 h-10 flex justify-center items-center rounded-full bg-[#2f2f30] dark:bg-[#1e1e1f] ${item.color}`}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 dark:text-white">
                    {item.title}
                  </h3>
                  {item.date && (
                    <p className="text-sm text-slate-400 font-medium dark:text-primary-400">
                      {item.date}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[#aaa9a9] dark:text-gray-300">
                {item.description}
              </p>
            </div>

            {/* Connecting line - hidden on mobile */}
            <div
              className={`hidden md:block absolute top-1/2 w-1/4 h-0.5 bg-gray-200 dark:bg-gray-600 ${
                item.side === "left" ? "right-1/2" : "left-1/2"
              }`}
            ></div>

            {/* Central dot - hidden on mobile */}
            <div className="hidden md:block absolute z-20 top-1/2 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-gray-900 transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
