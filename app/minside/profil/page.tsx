"use client";

import React from "react";
import { readUser } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";
import { ProfileForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const getUserId = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    console.error("Error getting user claims:", error.message);
    return null;
  }
  return data?.claims.sub || null;
};

const Page = () => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userId = await getUserId();
      if (userId) {
        const user = await readUser(userId);
        // userProfileIncomplete(user) && setOnboarding(true);
        setUser(user);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center h-full flex-col gap-4 p-4 md:p-8">
      <Link href="/minside" className="self-start">
        <Button>Tilbake</Button>
      </Link>
      <ProfileForm user={user} />
    </div>
  );
};

export default Page;
