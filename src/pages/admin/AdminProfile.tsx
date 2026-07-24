import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { motion } from "framer-motion"
import { UserCheck, Upload } from "lucide-react"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog } from "@/components/ui/alert-dialog"
import {
  supabase,
  isSupabaseConfigured,
  defaultProfileSettings,
} from "@/lib/supabase"
import {
  useProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
} from "@/hooks/usePortfolioQueries"
import type { ProfileSettings } from "@/types/supabase"

interface AdminContext {
  triggerToast: (msg: string) => void
  loadHeaderData: () => void
}

export default function AdminProfile() {
  const context = useOutletContext<AdminContext>()
  const triggerToast = context?.triggerToast || (() => { })
  const loadHeaderData = context?.loadHeaderData || (() => { })
  
  const { data: queryProfile, isLoading } = useProfileSettingsQuery()
  const updateProfileMutation = useUpdateProfileSettingsMutation()
  const isSaving = updateProfileMutation.isPending

  const [profile, setProfile] = useState<ProfileSettings>(defaultProfileSettings)
  const [initialProfile, setInitialProfile] = useState<ProfileSettings>(defaultProfileSettings)
  const [removeAvatarDialogOpen, setRemoveAvatarDialogOpen] = useState(false)

  useEffect(() => {
    if (queryProfile) {
      setProfile(queryProfile)
      setInitialProfile(queryProfile)
    }
  }, [queryProfile])

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfile((prev) => ({ ...prev, avatar_url: reader.result as string }))
        triggerToast("Avatar loaded from device! Click Save Profile Settings to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasChanges) return

    const toastId = toast.loading("Saving profile settings...")

    updateProfileMutation.mutate(profile, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.error("Failed to save profile: " + (res.error || "Unknown error"), { id: toastId })
          return
        }
        if (res.data) {
          setProfile(res.data)
          setInitialProfile(res.data)
        } else {
          setInitialProfile(profile)
        }
        toast.success("Profile settings saved successfully!", { id: toastId })
        loadHeaderData()
      },
      onError: (err: any) => {
        console.error("Save profile error:", err)
        toast.error("Failed to save profile: " + (err?.message || "Unknown error"), { id: toastId })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-green-500" />
        <p className="text-xs text-gray-400">Loading profile settings...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full"
    >
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Profile & Site Settings</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage your identity, avatar image, and contact details
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 border-none shadow-lg shadow-green-500/20 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" /> Save Profile Settings
              </>
            )}
          </Button>
        </div>

        {/* Full Width 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (1/3 width): Avatar */}
          <div className="space-y-6">
            {/* Avatar Image Card */}
            <div className="bg-[#202020] border-none p-6 rounded-3xl space-y-5 text-center flex flex-col items-center">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider w-full text-left">
                Profile Avatar Image
              </label>

              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-[#181818] border-2 border-[#333] flex items-center justify-center shadow-xl">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-extrabold text-green-500 text-3xl">ST</span>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="w-full space-y-2.5">
                <Button
                  type="button"
                  onClick={() => document.getElementById("avatar-file-input")?.click()}
                  className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-xs rounded-2xl h-11 border-none shadow-md shadow-green-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload from Device
                </Button>

                <Input
                  placeholder="Or paste image URL (https://...)"
                  value={profile.avatar_url || ""}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  className="h-10 bg-[#181818] border-none text-white text-xs rounded-xl px-3 text-center"
                />

                {profile.avatar_url && (
                  <Button
                    type="button"
                    onClick={() => setRemoveAvatarDialogOpen(true)}
                    className="w-full h-9 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl border-none cursor-pointer"
                  >
                    Remove Avatar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (2/3 width): Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Bio Card */}
            <div className="bg-[#202020] border-none p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Personal & Bio Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Full Name</label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="h-11 bg-[#181818] border-none text-white rounded-xl px-4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Hero Headline</label>
                  <Input
                    value={profile.hero_title}
                    onChange={(e) => setProfile({ ...profile, hero_title: e.target.value })}
                    className="h-11 bg-[#181818] border-none text-white rounded-xl px-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Short Subtitle Description</label>
                <Input
                  value={profile.hero_description}
                  onChange={(e) => setProfile({ ...profile, hero_description: e.target.value })}
                  className="h-11 bg-[#181818] border-none text-white rounded-xl px-4"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">About Bio</label>
                <Textarea
                  rows={5}
                  value={profile.about_bio}
                  onChange={(e) => setProfile({ ...profile, about_bio: e.target.value })}
                  className="bg-[#181818] border-none text-white rounded-xl p-4 leading-relaxed"
                />
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-[#202020] border-none p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address</label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="h-11 bg-[#181818] border-none text-white rounded-xl px-4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Phone Number</label>
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="h-11 bg-[#181818] border-none text-white rounded-xl px-4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Location</label>
                  <Input
                    value={profile.location || ""}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="h-11 bg-[#181818] border-none text-white rounded-xl px-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Remove Avatar Confirmation Alert Dialog */}
      <AlertDialog
        open={removeAvatarDialogOpen}
        onOpenChange={setRemoveAvatarDialogOpen}
        variant="warning"
        title="Remove Avatar Image?"
        description="Are you sure you want to remove your profile avatar image? Click Save Profile Settings to make changes permanent."
        confirmText="Remove Avatar"
        cancelText="Keep Avatar"
        onConfirm={() => {
          setProfile({ ...profile, avatar_url: "" })
          setRemoveAvatarDialogOpen(false)
          triggerToast("Avatar image removed. Click Save Profile Settings to apply changes.")
        }}
      />
    </motion.div>
  )
}
