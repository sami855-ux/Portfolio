export interface socialLinks {
  name: string
  url: string
  icon: string
}
export interface navItems {
  name: string
  id: string
}
export interface TimelineItem {
  id: number
  title: string
  description: string
  date?: string
  icon: React.ReactNode
  side: "left" | "right"
  color?: string
}
