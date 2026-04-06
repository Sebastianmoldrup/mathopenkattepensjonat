'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cat } from '@/lib/booking/types';
import { getUser, getUserCats } from '@/lib/booking/actions';
import { PawPrint, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BookingGateProps {
  onReady: (userId: string, cats: Cat[]) => void;
}

type GateState = 'loading' | 'unauthenticated' | 'no_cats' | 'ready';

export function BookingGate({ onReady }: BookingGateProps) {
  const router = useRouter();
  const [state, setState] = useState<GateState>('loading');

  useEffect(() => {
    async function check() {
      const user = await getUser();

      if (!user) {
        setState('unauthenticated');
        return;
      }

      const cats = await getUserCats(user.id);

      if (cats.length === 0) {
        setState('no_cats');
        return;
      }

      setState('ready');
      onReady(user.id, cats);
    }

    check();
  }, [onReady]);

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (state === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="rounded-full bg-muted p-4">
          <LogIn className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Logg inn for å booke</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Du må være innlogget for å gjøre en booking.
          </p>
        </div>
        <Button asChild>
          <Link href="/login">Logg inn</Link>
        </Button>
      </div>
    );
  }

  if (state === 'no_cats') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="rounded-full bg-muted p-4">
          <PawPrint className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Ingen katter registrert</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Du må legge til minst én katt på profilen din før du kan gjøre en booking.
          </p>
        </div>
        <Button asChild>
          <Link href="/minside/minekatter">Legg til katt</Link>
        </Button>
      </div>
    );
  }

  // state === 'ready' — render nothing, parent takes over
  return null;
}
