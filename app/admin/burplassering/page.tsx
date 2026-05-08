import { Suspense } from 'react'
import { connection } from 'next/server'
import { addDays } from 'date-fns'
import {
  getCageAssignments,
  getUnassignedConfirmed,
  getFreeCages,
} from '@/lib/admin/cageActions'
import { createClient } from '@/lib/supabase/server'
import CageGrid from '@/components/admin/CageGrid'

function localStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function CageGridLoader() {
  await connection()

  const windowStart = new Date()
  windowStart.setHours(0, 0, 0, 0)
  const windowEnd = addDays(windowStart, 13)

  const from = localStr(windowStart)
  const to = localStr(windowEnd)

  const [assignments, unassigned, freeCages, allCagesResult] =
    await Promise.all([
      getCageAssignments(from, to),
      getUnassignedConfirmed(),
      getFreeCages(from, to),
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
    is_fully_free: false,
  }))

  return (
    <CageGrid
      initialAssignments={assignments}
      initialUnassigned={unassigned}
      initialFree={freeCages}
      allCages={allCages}
      initialWindowStart={from}
    />
  )
}

export default function BurplasseringPage() {
  return (
    <div className="p-6">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">
            Laster burplassering...
          </div>
        }
      >
        <CageGridLoader />
      </Suspense>
    </div>
  )
}
