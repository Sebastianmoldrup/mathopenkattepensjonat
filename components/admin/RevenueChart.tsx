'use client'

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { RevenueStats } from '@/lib/admin/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RevenueChartProps {
  data: RevenueStats[]
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]

export function RevenueChart({ data }: RevenueChartProps) {
  const availableYears = useMemo(() => {
    const years = [
      ...new Set(data.map((d) => Number(d.month.split('-')[0]))),
    ].sort()
    return years.length > 0 ? years : [new Date().getFullYear()]
  }, [data])

  const [selectedYear, setSelectedYear] = useState(
    () => availableYears[availableYears.length - 1]
  )

  const canGoPrev = selectedYear > availableYears[0]
  const canGoNext = selectedYear < availableYears[availableYears.length - 1]

  const chartData = useMemo(() => {
    return MONTH_NAMES.map((label, i) => {
      const monthKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`
      const found = data.find((d) => d.month === monthKey)
      return {
        month: label,
        'Inkl. MVA': found ? Number(found.revenue) : 0,
        'Ekskl. MVA': found ? Number(found.revenue_ex_vat) : 0,
        Bookinger: found ? Number(found.booking_count) : 0,
      }
    })
  }, [data, selectedYear])

  const yearRevenue = chartData.reduce((sum, d) => sum + d['Inkl. MVA'], 0)
  const yearRevenueExVat = chartData.reduce(
    (sum, d) => sum + d['Ekskl. MVA'],
    0
  )
  const yearBookings = chartData.reduce((sum, d) => sum + d.Bookinger, 0)

  return (
    <div className="space-y-5 rounded-xl border bg-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Inntekt</h2>
          <p className="text-xs text-muted-foreground">
            Kun bekreftede og gjennomførte bookinger
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            disabled={!canGoPrev}
            onClick={() => setSelectedYear((y) => y - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="w-12 text-center text-sm font-semibold">
            {selectedYear}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            disabled={!canGoNext}
            onClick={() => setSelectedYear((y) => y + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Total inkl. MVA</p>
          <p className="text-base font-semibold">
            {yearRevenue.toLocaleString('nb-NO')} kr
          </p>
        </div>
        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">
            Total ekskl. MVA (25%)
          </p>
          <p className="text-base font-semibold">
            {yearRevenueExVat.toLocaleString('nb-NO')} kr
          </p>
        </div>
        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Bekreftede bookinger</p>
          <p className="text-base font-semibold">{yearBookings}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 4, left: 8 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`)}
            width={36}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
            formatter={(value, name) => {
              const num = Number(value ?? 0)
              if (name === 'Bookinger') return [num, name]
              return [`${num.toLocaleString('nb-NO')} kr`, name]
            }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))',
              fontSize: 12,
              backgroundColor: 'hsl(var(--card))',
            }}
          />
          <Bar
            dataKey="Inkl. MVA"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Ekskl. MVA"
            fill="hsl(var(--primary) / 0.4)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
          Inkl. MVA
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/40" />
          Ekskl. MVA (25%)
        </span>
      </div>
    </div>
  )
}
