import { Suspense } from "react";
import { MinSideHeader } from "@/components/minside-header";
import { MinSideSubHeader } from "@/components/minside-subheader";
import { LogoutButton } from "@/components/logout-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex items-start justify-between gap-4 rounded-2xl bg-primary/5 p-6">
          <Suspense fallback={<HeaderSkeleton />}>
            <MinSideHeader />
          </Suspense>

          <LogoutButton />
        </div>

        <Suspense
          fallback={
            <div className="mb-4 h-6 w-1/3 rounded bg-muted animate-pulse" />
          }
        >
          <MinSideSubHeader />
        </Suspense>

        <main className="rounded-2xl border bg-background p-4 shadow-sm md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return <div className="h-24 w-full rounded-2xl bg-muted animate-pulse" />;
}
