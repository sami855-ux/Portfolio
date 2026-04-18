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
  SiSocketdotio,
  SiJsonwebtokens,
  SiCloudinary,
  SiStripe,
  SiZod,
  SiAxios,
  SiExpo,
  SiAndroid,
  SiApple,
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

    // 🔥 Backend / Tools additions
    {
      icon: <SiSocketdotio size={32} />,
      name: "Socket.io",
      color: "text-black dark:text-white",
    },
    {
      icon: <SiJsonwebtokens size={32} />,
      name: "JWT",
      color: "text-[#000000]",
    },
    {
      icon: <SiCloudinary size={32} />,
      name: "Cloudinary",
      color: "text-[#3448C5]",
    },
    {
      icon: <SiStripe size={32} />,
      name: "Stripe",
      color: "text-[#635BFF]",
    },
    {
      icon: <SiZod size={32} />,
      name: "Zod",
      color: "text-[#3E67B1]",
    },
    {
      icon: <SiAxios size={32} />,
      name: "Axios",
      color: "text-[#5A29E4]",
    },

    // 📱 Mobile stack additions
    {
      icon: <SiExpo size={32} />,
      name: "Expo",
      color: "text-black dark:text-white",
    },
    {
      icon: <SiAndroid size={32} />,
      name: "Android",
      color: "text-[#3DDC84]",
    },
    {
      icon: <SiApple size={32} />,
      name: "iOS",
      color: "text-white",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      <motion.h2
        className="text-3xl font-bold text-center mb-8 text-white"
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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.04,
            }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`p-4 rounded-xl bg-[#232323] flex items-center justify-center ${skill.color} hover:shadow-lg transition-all duration-300`}
              whileTap={{ scale: 0.9 }}
            >
              {skill.icon}
            </motion.div>
            <p className="mt-2 text-sm text-white">{skill.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Skills
