"use client";

import React from "react";
import { redirect } from "next/navigation";
import { readUser } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";
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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const userId = await getUserId();
      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      const user = await readUser(userId);
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Laster...</div>;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center items-center h-full flex-col gap-4 p-4 md:p-8">
      {user?.profile_completed && (
        <>
          <h2 className="capitalize font-xl mb-4">
            {user?.first_name} {user?.last_name}
          </h2>

          <div className="flex flex-col gap-4 w-full">
            <Link href="/minside/profil">
              <Button className="w-full">Gå til profilen min</Button>
            </Link>

            <Link href="/minside/bookinger">
              <Button className="w-full">Se mine bookinger</Button>
            </Link>

            <Link href="/minside/minekatter">
              <Button className="w-full">Se mine katter</Button>
            </Link>
          </div>
        </>
      )}
      {!user.profile_completed && (
        <>
          <div
            className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-200 rounded-lg"
            role="alert"
          >
            <span className="font-medium">Viktig!</span> Din profil er ikke
            fullstendig. Vennligst oppdater din informasjon.
            <br />
            <a href="/minside/profil" className="underline">
              Oppdater profil
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
