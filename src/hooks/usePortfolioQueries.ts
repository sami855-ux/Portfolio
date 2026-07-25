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

// CACHED DATA FETCHING HOOKS
export function useProjectsQuery() {
  return useQuery<Project[]>({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
  })
}

export function useSkillsQuery() {
  return useQuery<Skill[]>({
    queryKey: QUERY_KEYS.skills,
    queryFn: getSkills,
  })
}

export function useJourneyQuery() {
  return useQuery<JourneyItem[]>({
    queryKey: QUERY_KEYS.journey,
    queryFn: getJourney,
  })
}

export function useContactLinksQuery() {
  return useQuery<ContactLink[]>({
    queryKey: QUERY_KEYS.contactLinks,
    queryFn: getContactLinks,
  })
}

export function useFloatingCardsQuery() {
  return useQuery<FloatingCard[]>({
    queryKey: QUERY_KEYS.floatingCards,
    queryFn: getFloatingCards,
  })
}

export function useProfileSettingsQuery() {
  return useQuery<ProfileSettings>({
    queryKey: QUERY_KEYS.profileSettings,
    queryFn: getProfileSettings,
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
