'use client'

import { useState } from 'react'
import { format, parse, isValid } from 'date-fns'
import { nb } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string | null // stored as "DD.MM.ÅÅÅÅ" string or null
  onChange: (val: string | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function parseNO(s: string): Date | null {
  if (!s) return null
  const d = parse(s, 'dd.MM.yyyy', new Date())
  return isValid(d) ? d : null
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Velg dato',
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value ? parseNO(value) : undefined

  function handleSelect(date: Date | undefined) {
    if (!date) {
      onChange(null)
      setOpen(false)
      return
    }
    onChange(format(date, 'dd.MM.yyyy'))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-10 min-w-[180px] justify-start gap-2 px-4 text-left text-sm font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{value ?? placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={handleSelect}
          locale={nb}
          initialFocus
          classNames={{
            months: 'space-y-3',
            caption: 'flex justify-center relative items-center h-10 px-8',
            caption_label: 'text-sm font-semibold capitalize',
            nav: 'absolute inset-x-0 top-0 flex items-center justify-between h-10',
            nav_button: cn(
              'inline-flex items-center justify-center',
              'h-8 w-8 rounded-lg border border-border bg-background',
              'hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
            ),
            nav_button_previous: 'absolute left-0',
            nav_button_next: 'absolute right-0',
            table: 'w-full border-collapse mt-1',
            head_row: 'flex',
            head_cell:
              'text-muted-foreground font-medium text-xs w-10 text-center py-1',
            row: 'flex w-full mt-1',
            cell: 'w-10 h-10 text-center p-0 relative',
            day: cn(
              'h-10 w-10 rounded-lg text-sm font-medium mx-auto',
              'flex items-center justify-center transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            ),
            day_selected: 'bg-primary text-primary-foreground hover:bg-primary',
            day_today: 'ring-2 ring-inset ring-primary/40 font-bold',
            day_outside: 'opacity-30',
            day_disabled: 'opacity-30 cursor-not-allowed',
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
