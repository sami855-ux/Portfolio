import { motion } from "framer-motion"
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiFigma,
  SiPrisma,
  SiRedux,
  SiDocker,
  SiGithub,
  SiVite,
  SiFramer,
  SiFirebase,
  SiJavascript,
  SiVuedotjs,
  SiLaravel,
  SiReactquery,
  SiSupabase,
  SiShadcnui,
} from "react-icons/si"

const Skills = () => {
  const skills = [
    { icon: <SiReact size={32} />, name: "React", color: "text-[#61DAFB]" },

    {
      icon: <SiNextdotjs size={32} />,
      name: "Next.js",
      color: "text-black dark:text-white",
    },
    { icon: <SiVuedotjs size={32} />, name: "Vue.js", color: "text-[#42B883]" },
    { icon: <SiLaravel size={32} />, name: "Laravel", color: "text-[#FF2D20]" },
    {
      icon: <SiTailwindcss size={32} />,
      name: "Tailwind",
      color: "text-[#38BDF8]",
    },
    {
      icon: <SiReactquery size={32} />,
      name: "React Query",
      color: "text-[#FF4154]",
    },
    {
      icon: <SiTypescript size={32} />,
      name: "TypeScript",
      color: "text-[#3178C6]",
    },
    {
      icon: <SiJavascript size={32} />,
      name: "JavaScript",
      color: "text-[#F7DF1E]",
    },
    {
      icon: <SiNodedotjs size={32} />,
      name: "Node.js",
      color: "text-[#339933]",
    },
    {
      icon: <SiExpress size={32} />,
      name: "Express",
      color: "text-black dark:text-white",
    },
    { icon: <SiMongodb size={32} />, name: "MongoDB", color: "text-[#47A248]" },
    {
      icon: <SiPostgresql size={32} />,
      name: "PostgreSQL",
      color: "text-[#4169E1]",
    },
    { icon: <SiPrisma size={32} />, name: "Prisma", color: "text-[#0C344B]" },
    { icon: <SiRedux size={32} />, name: "Redux", color: "text-[#764ABC]" },
    { icon: <SiDocker size={32} />, name: "Docker", color: "text-[#2496ED]" },
    { icon: <SiGit size={32} />, name: "Git", color: "text-[#F05032]" },
    {
      icon: <SiGithub size={32} />,
      name: "GitHub",
      color: "text-black dark:text-white",
    },
    { icon: <SiFigma size={32} />, name: "Figma", color: "text-[#F24E1E]" },
    {
      icon: <SiSupabase size={32} />,
      name: "Supabase",
      color: "text-[#3ECF8E]",
    },
    {
      icon: <SiShadcnui size={32} />,
      name: "Shadcn UI",
      color: "text-[#3ECF8E]",
    },

    { icon: <SiVite size={32} />, name: "Vite", color: "text-[#646CFF]" },
    {
      icon: <SiReact size={32} />,
      name: "React Native",
      color: "text-[#61DAFB]",
    },
    {
      icon: <SiFramer size={32} />,
      name: "Framer Motion",
      color: "text-black dark:text-white",
    },
    {
      icon: <SiFirebase size={32} />,
      name: "Firebase",
      color: "text-[#FFCA28]",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.h2
        className="text-3xl font-bold text-center mb-8 text-white dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        My{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
          Tech Stack
        </span>
      </motion.h2>

      <div className="grid grid-cols-3 sm:grid-cols-8 gap-2 items-center">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
            }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`p-4 rounded-xl bg-[#232323]  flex items-center justify-center ${skill.color} hover:shadow-lg transition-all duration-300 cursor-default`}
              whileTap={{ scale: 0.9 }}
            >
              {skill.icon}
            </motion.div>
            <motion.p
              className="mt-3 text-sm font-medium text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.3 }}
              viewport={{ once: true }}
            >
              {skill.name}
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* Animated background elements */}
      <motion.div
        className="absolute left-0 top-1/3 w-32 h-32 rounded-full bg-green-500/10 blur-3xl -z-10"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-0 bottom-1/4 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl -z-10"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  )
}

export default Skills
