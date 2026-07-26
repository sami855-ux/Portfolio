import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getProjects,
  getSkills,
  getJourney,
  getContactLinks,
  getFloatingCards,
  getProfileSettings,
  updateProfileSettings,
  submitContactMessage,
} from "@/lib/supabase"
import type { Project, Skill, JourneyItem, ContactLink, FloatingCard, ProfileSettings } from "@/types/supabase"

// QUERY KEYS CONSTANTS FOR REUSE & INVALIDATION
export const QUERY_KEYS = {
  projects: ["projects"] as const,
  skills: ["skills"] as const,
  journey: ["journey"] as const,
  contactLinks: ["contactLinks"] as const,
  floatingCards: ["floatingCards"] as const,
  profileSettings: ["profileSettings"] as const,
  messages: ["messages"] as const,
}

const STALE_TIME = 1000 * 60 * 15 // 15 minutes cache
const GC_TIME = 1000 * 60 * 60 // 1 hour memory retention

// CACHED DATA FETCHING HOOKS
export function useProjectsQuery() {
  return useQuery<Project[]>({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useSkillsQuery() {
  return useQuery<Skill[]>({
    queryKey: QUERY_KEYS.skills,
    queryFn: getSkills,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useJourneyQuery() {
  return useQuery<JourneyItem[]>({
    queryKey: QUERY_KEYS.journey,
    queryFn: getJourney,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useContactLinksQuery() {
  return useQuery<ContactLink[]>({
    queryKey: QUERY_KEYS.contactLinks,
    queryFn: getContactLinks,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useFloatingCardsQuery() {
  return useQuery<FloatingCard[]>({
    queryKey: QUERY_KEYS.floatingCards,
    queryFn: getFloatingCards,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useProfileSettingsQuery() {
  return useQuery<ProfileSettings>({
    queryKey: QUERY_KEYS.profileSettings,
    queryFn: getProfileSettings,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

// MUTATION HOOKS WITH QUERY CACHE INVALIDATION
export function useUpdateProfileSettingsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfileSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profileSettings })
    },
  })
}

export function useSubmitContactMessageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messages })
    },
  })
}
