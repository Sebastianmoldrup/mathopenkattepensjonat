import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Singleton: createBrowserClient must only be instantiated once per tab.
// Calling it fresh per component (the old pattern) spins up a separate
// GoTrueClient per caller, and each one competes for the same named
// navigator.locks lock during token auto-refresh -- that contention is
// what produced the "navigator locks" warnings, not multi-tab usage.
// This differs from the server client, which must NOT be memoized
// (see lib/supabase/server.ts) because each server request needs its
// own cookie-bound instance under Fluid compute / edge runtime.
let client: SupabaseClient | undefined;

export function createClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
  }
  return client;
}
