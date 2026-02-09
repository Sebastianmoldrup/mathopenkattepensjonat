import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { readUser } from "@/actions/user/readUser";

export async function MinSideHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await readUser(user.id);

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Min side</h1>

        {profile?.profile_completed && (
          <p className="mt-1 text-muted-foreground">
            Hei{" "}
            <span className="font-medium text-foreground">
              {profile.first_name} {profile.last_name}
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-col lg:items-center justify-center gap-1">
        <Button
          disabled
          className="bg-primary text-primary-foreground opacity-80 cursor-not-allowed"
        >
          Book opphold
        </Button>
        <span className="text-xs text-muted-foreground">
          Booking åpner snart
        </span>
      </div>
    </div>
  );
}
