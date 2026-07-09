'use client'

import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AdminUser, AdminUserCat } from '@/lib/admin/utils'
import { Mail, Phone, MapPin, ShieldAlert, CalendarDays } from 'lucide-react'

interface UserDetailSheetProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  )
}

function formatVaccineDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function CatCard({ cat }: { cat: AdminUserCat }) {
  const vaccineDate = formatVaccineDate(cat.last_vaccine_date)
  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
          {cat.image_url ? (
            <Image
              src={cat.image_url}
              alt={cat.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl">
              🐱
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{cat.name}</p>
          <p className="text-xs text-muted-foreground">
            {[cat.breed, cat.age].filter(Boolean).join(' · ') || '–'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {cat.gender && (
          <Badge variant="outline" className="text-xs font-normal">
            {cat.gender === 'hann' ? 'Hann' : 'Hunn'}
          </Badge>
        )}
        {cat.is_sterilized != null && (
          <Badge variant="outline" className="text-xs font-normal">
            {cat.is_sterilized ? 'Kastrert/sterilisert' : 'Ikke kastrert/sterilisert'}
          </Badge>
        )}
        {cat.gets_medication && (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-100 text-xs font-normal text-amber-800"
          >
            På medisiner
          </Badge>
        )}
      </div>

      {vaccineDate && (
        <p className="text-xs text-muted-foreground">
          Siste vaksine: {vaccineDate}
        </p>
      )}

      {cat.gets_medication && cat.medication_details && (
        <p className="text-xs">
          <span className="text-muted-foreground">Medisinering: </span>
          {cat.medication_details}
        </p>
      )}
      {cat.diet && (
        <p className="text-xs">
          <span className="text-muted-foreground">Diett: </span>
          {cat.diet}
        </p>
      )}
      {cat.medical_notes && (
        <p className="text-xs">
          <span className="text-muted-foreground">Medisinske notater: </span>
          {cat.medical_notes}
        </p>
      )}
      {cat.behavior_notes && (
        <p className="text-xs">
          <span className="text-muted-foreground">Atferd: </span>
          {cat.behavior_notes}
        </p>
      )}
    </div>
  )
}

export function UserDetailSheet({ user, open, onOpenChange }: UserDetailSheetProps) {
  if (!user) return null

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{fullName || 'Uten navn'}</SheetTitle>
          <SheetDescription>
            Registrert{' '}
            {new Date(user.created_at).toLocaleDateString('nb-NO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {!user.profile_completed && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              Denne brukeren har ikke fullført profilen sin.
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Kontaktinfo
            </p>
            <div className="space-y-3">
              <Row icon={<Mail className="h-4 w-4" />} label="E-post" value={user.email} />
              <Row
                icon={<Phone className="h-4 w-4" />}
                label="Telefon"
                value={user.phone || '–'}
              />
              <Row
                icon={<MapPin className="h-4 w-4" />}
                label="Adresse"
                value={user.address || '–'}
              />
              <Row
                icon={<ShieldAlert className="h-4 w-4" />}
                label="Nødkontakt"
                value={user.emergency_contact || '–'}
              />
              <Row
                icon={<CalendarDays className="h-4 w-4" />}
                label="Antall bookinger"
                value={user.booking_count}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Katter ({user.cats.length})
            </p>
            {user.cats.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ingen katter registrert på denne brukeren.
              </p>
            ) : (
              <div className="space-y-3">
                {user.cats.map((cat) => (
                  <CatCard key={cat.id} cat={cat} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
