import { z } from "zod"

const optionalText = z.string().trim().max(5000).optional()
export const schemas = {
  projects: z.object({
    title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(10000),
    category: z.string().trim().max(80).optional(), tags: z.array(z.string().trim().max(80)).max(50).optional(),
    github: z.string().trim().max(500).optional(), live: z.string().trim().max(500).optional(),
    image: z.string().trim().max(1000).optional(), images: z.array(z.string().trim().max(1000)).max(30).optional(),
    featured: z.boolean().optional(), features: z.array(z.string().trim().max(1000)).max(50).optional(),
    challenges: z.array(z.string().trim().max(1000)).max(50).optional(), solutions: z.array(z.string().trim().max(1000)).max(50).optional(),
    architecture: optionalText, results: optionalText,
  }),
  skills: z.object({
    name: z.string().trim().min(1).max(100), category: z.enum(["Frontend", "Backend", "Database", "Mobile", "Tools"]),
    icon_name: z.string().trim().max(100).optional(), color: z.string().trim().max(80).optional(),
    proficiency: z.number().int().min(0).max(100).optional(), display_order: z.number().int().min(0).optional(),
  }),
  journey_timeline: z.object({
    title: z.string().trim().min(1).max(160), description: z.string().trim().min(1).max(10000),
    date_range: z.string().trim().max(100).optional(), icon_name: z.string().trim().max(100).optional(),
    side: z.enum(["left", "right"]).optional(), color: z.string().trim().max(80).optional(),
    display_order: z.number().int().min(0).optional(),
  }),
  contact_links: z.object({
    name: z.string().trim().min(1).max(100), url: z.string().url().max(1000), icon_name: z.string().trim().max(100).optional(),
    display_order: z.number().int().min(0).optional(), is_active: z.boolean().optional(),
  }),
  floating_cards: z.object({
    name: z.string().trim().min(1).max(160), title: z.string().trim().min(1).max(160),
    position: z.string().trim().max(160).optional(), is_active: z.boolean().optional(), display_order: z.number().int().min(0).optional(),
  }),
  messages: z.object({ is_read: z.boolean() }),
  profile_settings: z.object({
    full_name: z.string().trim().min(1).max(160), hero_title: z.string().trim().min(1).max(200),
    hero_description: z.string().trim().max(5000), about_bio: z.string().trim().max(10000),
    avatar_url: z.string().trim().max(1000).optional(), resume_url: z.string().trim().max(1000).optional(),
    email: z.string().email().max(320), phone: z.string().trim().max(50).optional(), location: z.string().trim().max(200).optional(),
  }),
  services: z.object({
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(5000),
    icon_name: z.string().trim().max(100).optional(),
    stack: z.string().trim().max(500).optional(),
    contact_url: z.string().trim().max(1000).optional(),
    display_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
  }),
} as const

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(320),
  subject: z.string().trim().max(160).optional().default("Portfolio Inquiry"), message: z.string().trim().min(10).max(5000),
})
