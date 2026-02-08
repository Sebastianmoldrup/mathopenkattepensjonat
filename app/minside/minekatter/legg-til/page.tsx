"use client";

import React from "react";
import { readUser } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";
import AddCatForm from "@/components/add-cat-form";
import { Suspense } from "react";

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <Suspense fallback={<div>Laster inn skjema...</div>}>
        {user && <AddCatForm />}
      </Suspense>
    </div>
  );
};
export default Page;
