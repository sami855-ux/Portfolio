import {
  Briefcase,
  GraduationCap,
  Code,
  Rocket,
  User,
  Code2,
  Users,
  TreePine,
} from "lucide-react"

type TimelineItem = {
  id: number
  title: string
  description: string
  date?: string
  icon: React.ReactNode
  side: "left" | "right"
  color?: string
}

export function About() {
  const items: TimelineItem[] = [
    {
      id: 1,
      title: "Introduction",
      description:
        "Full-stack developer with 3+ years of experience building web applications using React, Next.js, Node.js and PostgreSQL. I have developed a strong foundation in front-end and back-end development, and I'm passionate about creating user-friendly and efficient applications that meet the needs of my clients.",
      icon: <User className="w-6 h-6" />,
      side: "left",
      color: "text-blue-500",
    },
    {
      id: 2,
      title: "Education",
      description:
        "Software engineering degree from University of Debre brihan university (2022-2025). Graduated with honors.",
      date: "2022 - 2025",
      icon: <GraduationCap className="w-6 h-6" />,
      side: "right",
      color: "text-green-500",
    },
    {
      id: 3,
      title: "Internship",
      description:
        "Internship at Efuye gela, full-stack developer. I have worked on a range of projects, including web applications and mobile apps.",
      date: "2018 - 2020",
      icon: <Briefcase className="w-6 h-6" />,
      side: "left",
      color: "text-yellow-500",
    },
    {
      id: 4,
      title: "Currently",
      description:
        "Actively learning and working on personal projects. Developing web applications using React, Next.js, Node.js and PostgreSQL.",
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
    <div className="relative max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-16 ">
        My{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
          Journey
        </span>
      </h2>

      {/* Central line */}
      <div className="absolute left-1/2 w-0.5 h-[85%] mt-28 md:h-[77%] md:mt-24 bg-[#262727] transform -translate-x-1/2"></div>

      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative flex ${
              item.side === "left" ? "justify-start" : "justify-end"
            }`}
          >
            {/* Item container */}
            <div
              className={`w-5/12 p-6 relative z-10 rounded-lg  border bg-[#1c1c1c] shadow-md ${
                item.side === "left" ? "mr-auto" : "ml-auto"
              } border-[#262727] dark:border-gray-700 -mt-7`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`"p-2 w-10 h-10 flex justify-center items-center rounded-full bg-[#1e1e1f] dark:bg-primary/20" ${item.color} text-[17px]`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold dark:text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-muted-foreground dark:text-gray-300">
                {item.description}
              </p>
              {item.date && (
                <div className="mt-2 text-sm text-primary font-medium dark:text-primary-300">
                  {item.date}
                </div>
              )}
            </div>

            {/* Connecting line */}
            <div
              className={`absolute top-1/2 w-1/4 h-0.5 bg-[#1f2126] z-5 dark:bg-gray-600 ${
                item.side === "left" ? "right-1/2" : "left-1/2"
              }`}
            ></div>

            {/* Central dot */}
            <div className="absolute z-20 top-1/2 left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background dark:border-gray-900 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
