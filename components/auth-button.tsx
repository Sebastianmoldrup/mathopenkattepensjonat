"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AuthButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const className = fullWidth ? "w-full" : "";

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Optional: avoid flicker
  if (isLoggedIn === null) {
    return (
      <Button variant="ghost" disabled>
        Laster…
      </Button>
    );
  }

  return isLoggedIn ? (
    <Button asChild variant="outline" className={className}>
      <Link href="/minside">Min side</Link>
    </Button>
  ) : (
    <Button asChild className={className}>
      <Link href="/login">Logg inn</Link>
    </Button>
  );
}
