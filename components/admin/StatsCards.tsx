import { Clock, Banknote, TrendingDown } from 'lucide-react'

interface StatsCardsProps {
  pending: number
  totalRevenue: number
  totalRevenueExVat: number
  totalVat: number
}

export function StatsCards({
  pending,
  totalRevenue,
  totalRevenueExVat,
  totalVat,
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
      label: 'Total inntekt inkl. MVA',
      value: `${totalRevenue.toLocaleString('nb-NO')} kr`,
      icon: Banknote,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Netto inntekt etter MVA',
      value: `${totalRevenueExVat.toLocaleString('nb-NO')} kr`,
      icon: TrendingDown,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'MVA å innbetale (25%)',
      value: `${totalVat.toLocaleString('nb-NO')} kr`,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
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
