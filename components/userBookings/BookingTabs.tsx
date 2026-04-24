'use client'

import { useState } from 'react'
import { UserWaitlistEntry } from '@/lib/userBookings/actions'
import { UserBooking } from '@/lib/userBookings/utils'
import { BookingCard } from './BookingCard'
import { WaitlistCard } from './WaitlistCard'
import { CalendarClock, History, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingTabsProps {
  upcoming: UserBooking[]
  history: UserBooking[]
  waitlist: UserWaitlistEntry[]
}

type Tab = 'upcoming' | 'history' | 'waitlist'

export function BookingTabs({ upcoming, history, waitlist }: BookingTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [waitlistEntries, setWaitlistEntries] = useState(waitlist)

  const activeWaitlist = waitlistEntries.filter((e) => e.status === 'waiting')

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
      key: 'waitlist',
      label: 'Venteliste',
      icon: <Clock className="h-4 w-4" />,
      count: activeWaitlist.length,
    },
    {
      key: 'history',
      label: 'Historikk',
      icon: <History className="h-4 w-4" />,
      count: history.length,
    },
  ]

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
      {activeTab === 'upcoming' &&
        (upcoming.length === 0 ? (
          <EmptyState
            icon={
              <CalendarClock className="h-10 w-10 text-muted-foreground/40" />
            }
            title="Ingen kommende bookinger"
            description="Bookinger med status «venter» eller «bekreftet» vises her."
          />
        ) : (
          <div className="space-y-4">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ))}

      {activeTab === 'waitlist' &&
        (activeWaitlist.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-10 w-10 text-muted-foreground/40" />}
            title="Ingen aktive ventelisteregistreringer"
            description="Registreringer der du venter på ledig plass vises her."
          />
        ) : (
          <div className="space-y-4">
            {activeWaitlist.map((entry) => (
              <WaitlistCard
                key={entry.id}
                entry={entry}
                onCancelled={() =>
                  setWaitlistEntries((prev) =>
                    prev.map((e) =>
                      e.id === entry.id ? { ...e, status: 'cancelled' } : e
                    )
                  )
                }
              />
            ))}
          </div>
        ))}

      {activeTab === 'history' &&
        (history.length === 0 ? (
          <EmptyState
            icon={<History className="h-10 w-10 text-muted-foreground/40" />}
            title="Ingen tidligere bookinger"
            description="Gjennomførte og avbestilte bookinger vises her."
          />
        ) : (
          <div className="space-y-4">
            {history.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ))}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
