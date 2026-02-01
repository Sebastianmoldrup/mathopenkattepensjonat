"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingStatus } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";
import MinSideLayout from "./components/MinSideLayout";
import MinSideDashboard from "./components/MinSideDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MinSidePage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUserAndOnboarding();
  }, []);

  async function checkUserAndOnboarding() {
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setUserId(user.id);

    // Check onboarding status
    const status = await getOnboardingStatus(user.id);

    if (!status.hasProfile) {
      // Redirect to profile completion
      router.push("/min-side/min-informasjon?onboarding=true");
      return;
    }

    setLoading(false);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MinSideLayout>
      <MinSideDashboard userId={userId!} />
    </MinSideLayout>
  );
}
