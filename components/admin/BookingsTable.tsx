'use client'

import { useState, useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AdminBooking,
  STATUS_LABELS,
  STATUS_COLORS,
  CAGE_LABELS,
  formatDateNO,
  nightsBetween,
} from '@/lib/admin/utils'
import { BookingDetailDialog } from './BookingDetailDialog'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingsTableProps {
  bookings: AdminBooking[]
}

// Custom global filter that searches across name + email
const globalFilterFn: FilterFn<AdminBooking> = (
  row,
  _columnId,
  filterValue: string
) => {
  const search = filterValue.toLowerCase()
  const name =
    `${row.original.user_first_name ?? ''} ${row.original.user_last_name ?? ''}`.toLowerCase()
  const email = (row.original.user_email ?? '').toLowerCase()
  return name.includes(search) || email.includes(search)
}

function SortHeader({ label, column }: { label: string; column: any }) {
  const sorted = column.getIsSorted()
  return (
    <button
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-foreground"
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="h-3 w-3" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  )
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date_from', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(
    null
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  // Apply status filter before passing to table
  const statusFiltered = useMemo(
    () =>
      statusFilter === 'all'
        ? bookings
        : bookings.filter((b) => b.status === statusFilter),
    [bookings, statusFilter]
  )

  const columns: ColumnDef<AdminBooking>[] = [
    {
      id: 'customer',
      accessorFn: (row) =>
        `${row.user_first_name ?? ''} ${row.user_last_name ?? ''} ${row.user_email}`,
      header: ({ column }) => <SortHeader label="Kunde" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">
            {row.original.user_first_name} {row.original.user_last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.user_email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'date_from',
      header: ({ column }) => <SortHeader label="Innsjekk" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{formatDateNO(row.original.date_from)}</p>
          <p className="text-xs text-muted-foreground">
            {nightsBetween(row.original.date_from, row.original.date_to)} netter
          </p>
        </div>
      ),
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'date_to',
      header: ({ column }) => <SortHeader label="Utsjekk" column={column} />,
      cell: ({ row }) => (
        <p className="text-sm">{formatDateNO(row.original.date_to)}</p>
      ),
      sortingFn: 'alphanumeric',
    },
    {
      accessorKey: 'cage_type',
      header: 'Bur',
      cell: ({ row }) => (
        <p className="text-sm">
          {row.original.cage_count === 2
            ? '2× Standard'
            : CAGE_LABELS[row.original.cage_type]}
        </p>
      ),
    },
    {
      accessorKey: 'num_cats',
      header: ({ column }) => <SortHeader label="Katter" column={column} />,
      cell: ({ row }) => <p className="text-sm">{row.original.num_cats}</p>,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <SortHeader label="Pris" column={column} />,
      cell: ({ row }) => (
        <p className="text-sm font-medium">
          {row.original.price.toLocaleString('nb-NO')} kr
        </p>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortHeader label="Status" column={column} />,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn('text-xs', STATUS_COLORS[row.original.status])}
        >
          {STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
  ]

  const table = useReactTable({
    data: statusFiltered,
    columns,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  function openBooking(booking: AdminBooking) {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Søk etter navn eller e-post..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 max-w-xs text-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue placeholder="Alle statuser" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statuser</SelectItem>
            <SelectItem value="pending">Venter</SelectItem>
            <SelectItem value="confirmed">Bekreftet</SelectItem>
            <SelectItem value="completed">Gjennomført</SelectItem>
            <SelectItem value="cancelled">Avbestilt</SelectItem>
          </SelectContent>
        </Select>
        <p className="ml-auto text-sm text-muted-foreground">
          {table.getRowModel().rows.length} av {bookings.length} bookinger
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/40">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 text-xs">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  Ingen bookinger funnet
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => openBooking(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BookingDetailDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
