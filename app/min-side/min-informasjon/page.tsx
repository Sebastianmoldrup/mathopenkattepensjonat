"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";
import MinSideLayout from "../components/MinSideLayout";
import ProfileForm from "../components/ProfileForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Profile, ProfileFormData } from "@/types";

export default function MinInformasjonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setUserId(user.id);
    const profileData = await getProfile(user.id);
    setProfile(profileData);
    setLoading(false);
  }

  async function handleSubmit(formData: ProfileFormData) {
    if (!userId) return;

    setSaving(true);
    const success = await updateProfile(userId, formData);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // If onboarding, redirect to dashboard
      if (isOnboarding) {
        setTimeout(() => {
          router.push("/min-side");
        }, 1000);
      } else {
        // Reload profile data
        loadProfile();
      }
    }

    setSaving(false);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MinSideLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isOnboarding ? "Fullfør profilen din" : "Min informasjon"}
          </h1>
          {isOnboarding && (
            <p className="text-gray-600">
              Vennligst fyll ut din informasjon for å fortsette med booking.
            </p>
          )}
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Profilen din er oppdatert!
          </div>
        )}

        <ProfileForm
          initialData={profile}
          onSubmit={handleSubmit}
          isLoading={saving}
          isOnboarding={isOnboarding}
        />
      </div>
    </MinSideLayout>
  );
}
