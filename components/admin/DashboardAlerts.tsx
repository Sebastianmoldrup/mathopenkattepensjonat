import Link from 'next/link'
import { ShieldCheck, Clock, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardAlertsProps {
  lastHms: string | null // ISO timestamp of last HMS log
  todayMorgen: boolean // whether morgen routine exists today
  todayDagKveld: boolean // whether dag/kveld routine exists today
  pendingCount: number
}

function daysSince(isoDate: string): number {
  const then = new Date(isoDate)
  const now = new Date()
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

function AlertCard({
  icon,
  title,
  description,
  href,
  variant = 'neutral',
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  variant?: 'ok' | 'warn' | 'alert' | 'neutral'
}) {
  const styles = {
    ok: 'border-green-200 bg-green-50',
    warn: 'border-amber-200 bg-amber-50',
    alert: 'border-red-200 bg-red-50',
    neutral: 'border-border bg-card',
  }
  const iconStyles = {
    ok: 'text-green-600',
    warn: 'text-amber-600',
    alert: 'text-red-600',
    neutral: 'text-muted-foreground',
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 transition-opacity hover:opacity-80',
        styles[variant]
      )}
    >
      <span className={cn('mt-0.5 shrink-0', iconStyles[variant])}>{icon}</span>
      <div>
        <p className="text-sm font-medium leading-tight">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

export function DashboardAlerts({
  lastHms,
  todayMorgen,
  todayDagKveld,
  pendingCount,
}: DashboardAlertsProps) {
  const hmsDays = lastHms ? daysSince(lastHms) : null
  const hmsVariant =
    hmsDays === null
      ? 'alert'
      : hmsDays > 180
        ? 'alert'
        : hmsDays > 90
          ? 'warn'
          : 'ok'

  const hmsTitle =
    hmsDays === null
      ? 'HMS aldri registrert'
      : hmsDays > 180
        ? `HMS sist registrert for ${hmsDays} dager siden`
        : hmsDays > 90
          ? `HMS sist registrert for ${hmsDays} dager siden`
          : `HMS oppdatert for ${hmsDays} dager siden`

  const hmsDescription =
    hmsDays === null
      ? 'Opprett din første HMS-registrering nå.'
      : hmsDays > 90
        ? 'Anbefalt å gjennomføre en ny HMS-gjennomgang (mål: hver 3.–6. måned).'
        : 'HMS er à jour. Neste anbefalt gjennomgang om ' +
          Math.max(0, 90 - hmsDays) +
          ' dager.'

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Status i dag
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending bookings */}
        <AlertCard
          icon={<Clock className="h-4 w-4" />}
          title={
            pendingCount > 0
              ? `${pendingCount} booking${pendingCount > 1 ? 'er' : ''} venter`
              : 'Ingen ventende bookinger'
          }
          description={
            pendingCount > 0
              ? 'Gå til bookinger for å bekrefte.'
              : 'Alt er behandlet.'
          }
          href="/admin/bookinger"
          variant={pendingCount > 0 ? 'warn' : 'ok'}
        />

        {/* Morgen routine */}
        <AlertCard
          icon={<Sun className="h-4 w-4" />}
          title={todayMorgen ? 'Morgenrutine fullført' : 'Morgenrutine mangler'}
          description={
            todayMorgen
              ? 'Dagens morgensjekkliste er registrert.'
              : 'Husk å fylle inn morgenrutinen.'
          }
          href="/admin/sjekkliste"
          variant={todayMorgen ? 'ok' : 'warn'}
        />

        {/* Dag/kveld routine */}
        <AlertCard
          icon={<Moon className="h-4 w-4" />}
          title={
            todayDagKveld
              ? 'Dag/kveld-rutine fullført'
              : 'Dag/kveld-rutine mangler'
          }
          description={
            todayDagKveld
              ? 'Dagens kveldsjekkliste er registrert.'
              : 'Husk å fylle inn dag/kveld-rutinen.'
          }
          href="/admin/sjekkliste"
          variant={todayDagKveld ? 'ok' : 'neutral'}
        />

        {/* HMS status */}
        <AlertCard
          icon={<ShieldCheck className="h-4 w-4" />}
          title={hmsTitle}
          description={hmsDescription}
          href="/admin/hms"
          variant={hmsVariant}
        />
      </div>
    </div>
  )
}
