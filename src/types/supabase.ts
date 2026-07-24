export interface Project {
  id?: string
  title: string
  description: string
  tags: string[]
  github: string
  live: string
  image?: string
  featured?: boolean
  category?: string
  features?: string[]
  challenges?: string
  solutions?: string
  results?: string
  created_at?: string
}

export interface Skill {
  id?: string
  name: string
  category: 'Frontend' | 'Backend' | 'Database' | 'Mobile' | 'Tools' | string
  icon_name: string
  color?: string
  proficiency?: number
  display_order?: number
  created_at?: string
}

export interface JourneyItem {
  id?: string
  title: string
  description: string
  date_range?: string
  icon_name?: string
  side?: 'left' | 'right' | string
  color?: string
  display_order?: number
  created_at?: string
}

export interface ContactLink {
  id?: string
  name: string
  url: string
  icon_name: string
  display_order?: number
  is_active?: boolean
  created_at?: string
}

export interface Message {
  id?: string
  name: string
  email: string
  subject?: string
  message: string
  is_read?: boolean
  created_at?: string
}

export interface ProfileSettings {
  id?: string
  full_name: string
  hero_title: string
  hero_description: string
  about_bio: string
  resume_url?: string
  email: string
  phone?: string
  location?: string
  avatar_url?: string
  created_at?: string
}
