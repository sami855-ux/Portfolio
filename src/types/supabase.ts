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
  challenges?: string[]
  solutions?: string[]
  architecture?: string
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

export interface FloatingCard {
  id?: string
  name: string
  title: string
  position?: string
  is_active?: boolean
  display_order?: number
  created_at?: string
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Project>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Skill>
      }
      journey_timeline: {
        Row: JourneyItem
        Insert: Omit<JourneyItem, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<JourneyItem>
      }
      contact_links: {
        Row: ContactLink
        Insert: Omit<ContactLink, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<ContactLink>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Message>
      }
      profile_settings: {
        Row: ProfileSettings
        Insert: Omit<ProfileSettings, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<ProfileSettings>
      }
    }
  }
}
