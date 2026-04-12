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
  Legend,
} from 'recharts'
import { RevenueStats, formatMonthNO } from '@/lib/admin/utils'
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
  // Determine available years from data
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

  // Build 12-month dataset for selected year, filling missing months with 0
  const chartData = useMemo(() => {
    return MONTH_NAMES.map((label, i) => {
      const monthKey = `${selectedYear}-${String(i + 1).padStart(2, '0')}`
      const found = data.find((d) => d.month === monthKey)
      return {
        month: label,
        Inntekt: found ? Number(found.revenue) : 0,
        Bookinger: found ? Number(found.booking_count) : 0,
        Avbestillinger: found ? Number(found.cancellation_count) : 0,
      }
    })
  }, [data, selectedYear])

  const yearRevenue = chartData.reduce((sum, d) => sum + d.Inntekt, 0)
  const yearBookings = chartData.reduce((sum, d) => sum + d.Bookinger, 0)
  const yearCancellations = chartData.reduce(
    (sum, d) => sum + d.Avbestillinger,
    0
  )

  return (
    <div className="space-y-5 rounded-xl border bg-card p-6">
      {/* Header with year selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Statistikk</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {yearRevenue.toLocaleString('nb-NO')} kr · {yearBookings} bookinger
            · {yearCancellations} avbestillinger
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

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 16, right: 16, bottom: 4, left: 16 }}
          barCategoryGap="25%"
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
            yAxisId="revenue"
            orientation="left"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`)}
            width={36}
          />
          <YAxis
            yAxisId="count"
            orientation="right"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={24}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
            formatter={(value: number, name: string) => {
              if (name === 'Inntekt')
                return [`${value.toLocaleString('nb-NO')} kr`, name]
              return [value, name]
            }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))',
              fontSize: 12,
              backgroundColor: 'hsl(var(--card))',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Bar
            yAxisId="revenue"
            dataKey="Inntekt"
            fill="hsl(var(--primary))"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            yAxisId="count"
            dataKey="Bookinger"
            fill="hsl(var(--chart-2))"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            yAxisId="count"
            dataKey="Avbestillinger"
            fill="hsl(var(--destructive))"
            radius={[3, 3, 0, 0]}
            opacity={0.75}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
