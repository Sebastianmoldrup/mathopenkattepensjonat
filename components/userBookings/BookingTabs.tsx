'use client'

import { useState } from 'react'
import { UserBooking } from '@/lib/userBookings/utils'
import { BookingCard } from './BookingCard'
import { CalendarClock, History } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingTabsProps {
  upcoming: UserBooking[]
  history: UserBooking[]
}

type Tab = 'upcoming' | 'history'

export function BookingTabs({ upcoming, history }: BookingTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')

  const tabs: {
    key: Tab
    label: string
    icon: React.ReactNode
    count: number
  }[] = [
    {
      key: 'upcoming',
      label: 'Kommende',
      icon: <CalendarClock className="h-4 w-4" />,
      count: upcoming.length,
    },
    {
      key: 'history',
      label: 'Historikk',
      icon: <History className="h-4 w-4" />,
      count: history.length,
    },
  ]

  const items = activeTab === 'upcoming' ? upcoming : history

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5',
              'text-sm font-medium transition-all duration-150',
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count > 0 && (
              <span
                className={cn(
                  'ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none',
                  activeTab === tab.key
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          {activeTab === 'upcoming' ? (
            <>
              <CalendarClock className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Ingen kommende bookinger
              </p>
              <p className="text-xs text-muted-foreground">
                Bookinger med status «venter» eller «bekreftet» vises her.
              </p>
            </>
          ) : (
            <>
              <History className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Ingen tidligere bookinger
              </p>
              <p className="text-xs text-muted-foreground">
                Gjennomførte og avbestilte bookinger vises her.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
