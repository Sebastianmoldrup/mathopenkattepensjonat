import Link from "next/link";
import { Button } from "@/components/ui/button";
import { readUser } from "@/actions/user/readUser";
import { createClient } from "@/lib/supabase/server";
import { User, Cat, Calendar, Lock, Mail } from "lucide-react";
import { AlertTriangle } from "lucide-react";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await readUser(user.id);

  return (
    <div className="space-y-10">
      {profile?.profile_completed ? (
        <div className="grid gap-8">
          <section>
            <h3 className="mb-4 text-lg font-medium">Oversikt</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/minside/profil" className="group">
                <div className="rounded-2xl border bg-background p-5 transition hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <User className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Profil</p>
                      <p className="text-sm text-muted-foreground">
                        Se og oppdater dine opplysninger
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/minside/minekatter" className="group">
                <div className="rounded-2xl border bg-background p-5 transition hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Cat className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Mine katter</p>
                      <p className="text-sm text-muted-foreground">
                        Administrer kattene dine
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/minside/bookinger" className="group sm:col-span-2">
                <div className="rounded-2xl border bg-background p-5 transition hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Bookinger</p>
                      <p className="text-sm text-muted-foreground">
                        Se og administrer dine bookinger
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-medium">Konto</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-muted/40 p-5">
                <div className="flex items-center gap-4 opacity-70">
                  <Mail className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Endre e-post</p>
                    <p className="text-sm text-muted-foreground">
                      Kommer snart
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-muted/40 p-5">
                <div className="flex items-center gap-4 opacity-70">
                  <Lock className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Endre passord</p>
                    <p className="text-sm text-muted-foreground">
                      Kommer snart
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-2 text-yellow-900 mb-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">
                Gi beskjed dersom du ikke ønsker at kattens bilder deles på
                sosiale medier.
              </p>
              <span className="text-sm text-muted-foreground">
                <a href="mailto:post@mathopenkattepensjonat">
                  post@mathopenkattepensjonat.no
                </a>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-6">
          <p className="font-medium text-yellow-900">
            Profilen din er ikke fullført
          </p>
          <p className="mt-1 text-yellow-800">
            Fullfør profilen for å få tilgang til alle funksjoner.
          </p>

          <Link href="/minside/profil" className="mt-4 inline-block">
            <Button>Fullfør profil</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
