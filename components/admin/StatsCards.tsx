import { Clock, CheckCircle2, Banknote, CalendarDays } from 'lucide-react'

interface StatsCardsProps {
  pending: number
  confirmed: number
  totalRevenue: number
  totalBookings: number
}

export function StatsCards({
  pending,
  confirmed,
  totalRevenue,
  totalBookings,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Venter på bekreftelse',
      value: pending,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Bekreftede bookinger',
      value: confirmed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Totale bookinger',
      value: totalBookings,
      icon: CalendarDays,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total inntekt',
      value: `${totalRevenue.toLocaleString('nb-NO')} kr`,
      icon: Banknote,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="space-y-3 rounded-xl border bg-card p-4"
        >
          <div className={`inline-flex rounded-lg p-2 ${stat.bg}`}>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
