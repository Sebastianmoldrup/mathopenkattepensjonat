import { Suspense } from 'react'
import { connection } from 'next/server'
import { addDays } from 'date-fns'
import { adminGetCheckinCheckoutByDate } from '@/lib/admin/actions'
import { getCageAssignments } from '@/lib/admin/cageActions'
import { getCageDayConfirmations } from '@/lib/admin/cageStatusActions'
import { createClient } from '@/lib/supabase/server'
import BurstatusClient from '@/components/admin/BurstatusClient'

function localStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function resolveDate(raw: string | undefined, fallback: string): string {
  if (!raw || !ISO_DATE_RE.test(raw)) return fallback
  const d = new Date(raw + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? fallback : raw
}

async function BurstatusLoader({
  searchParams,
}: {
  searchParams: Promise<{ dato?: string }>
}) {
  await connection()
  const params = await searchParams
  const today = localStr(new Date())
  const date = resolveDate(params.dato, today)
  const parsedDate = new Date(date + 'T12:00:00')
  const windowFrom = localStr(addDays(parsedDate, -1))
  const windowTo = localStr(addDays(parsedDate, 1))

  const [entries, assignments, confirmations, allCagesResult] =
    await Promise.all([
      adminGetCheckinCheckoutByDate(date),
      getCageAssignments(windowFrom, windowTo),
      getCageDayConfirmations(date),
      createClient().then((supabase) =>
        supabase
          .from('cages')
          .select('id, label, section, number')
          .order('section')
          .order('number')
      ),
    ])

  const allCages = (allCagesResult.data ?? []).map((c) => ({
    cage_id: c.id,
    cage_label: c.label,
    cage_section: c.section,
    cage_number: c.number,
  }))

  return (
    <BurstatusClient
      initialDate={date}
      initialEntries={entries}
      initialAssignments={assignments}
      initialConfirmations={confirmations}
      allCages={allCages}
    />
  )
}

export default function BurstatusPage({
  searchParams,
}: {
  searchParams: Promise<{ dato?: string }>
}) {
  return (
    <div className="p-6">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Laster...</div>
        }
      >
        <BurstatusLoader searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
