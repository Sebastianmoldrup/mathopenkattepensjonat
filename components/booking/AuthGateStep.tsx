'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface AuthGateStepProps {
  onAuthenticated: () => void
}

type AuthView = 'login' | 'forgot'

export function AuthGateStep({ onAuthenticated }: AuthGateStepProps) {
  const [view, setView] = useState<AuthView>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      setError('Feil e-post eller passord. Prøv igjen.')
      return
    }
    onAuthenticated()
  }

  async function handleForgotPassword() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/endre-passord`,
    })
    setLoading(false)
    if (error) {
      setError('Kunne ikke sende e-post. Prøv igjen.')
      return
    }
    setResetSent(true)
  }

  if (view === 'forgot') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Glemt passord
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vi sender deg en lenke for å nullstille passordet ditt.
          </p>
        </div>

        {resetSent ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            E-post sendt! Sjekk innboksen din og følg lenken.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleForgotPassword()
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="reset-email">E-post</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send nullstillingslenke
            </Button>
          </form>
        )}

        <button
          onClick={() => {
            setView('login')
            setError(null)
            setResetSent(false)
          }}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Tilbake til innlogging
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Logg inn for å fortsette
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Du må være innlogget for å fullføre bookingen. Bookingprosessen din er
          lagret.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">E-post</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Passord</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Logg inn
        </Button>
      </form>

      <button
        onClick={() => {
          setView('forgot')
          setError(null)
        }}
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Glemt passord?
      </button>
    </div>
  )
}
