'use client'

import { useState, useMemo } from 'react'
import {
  ColumnDef,
  Column,
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
import { Badge } from '@/components/ui/badge'
import { AdminUser } from '@/lib/admin/utils'
import { UserDetailSheet } from './UserDetailSheet'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UsersTableProps {
  users: AdminUser[]
}

type FilterValue = 'all' | 'has_cats' | 'no_cats' | 'incomplete'

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'has_cats', label: 'Har katter' },
  { value: 'no_cats', label: 'Ingen katter' },
  { value: 'incomplete', label: 'Ufullstendig profil' },
]

const MAX_CAT_BADGES = 3

function formatRegisteredDate(value: string | null | undefined): string {
  if (!value) return '–'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '–'
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ownerFullName(u: AdminUser): string {
  return [u.first_name, u.last_name].filter(Boolean).join(' ').trim()
}

const globalFilterFn: FilterFn<AdminUser> = (row, _columnId, filterValue: string) => {
  const search = filterValue.trim().toLocaleLowerCase('nb-NO')
  if (!search) return true

  const u = row.original
  const haystack = [
    ownerFullName(u),
    u.email,
    u.phone,
    ...u.cats.map((c) => c.name),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('nb-NO')

  return haystack.includes(search)
}

function SortHeader({
  label,
  column,
}: {
  label: string
  column: Column<AdminUser, unknown>
}) {
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

export function UsersTable({ users }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterValue>('all')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const incompleteCount = useMemo(
    () => users.filter((u) => !u.profile_completed).length,
    [users]
  )

  const filterCounts = useMemo(
    () => ({
      all: users.length,
      has_cats: users.filter((u) => u.cats.length > 0).length,
      no_cats: users.filter((u) => u.cats.length === 0).length,
      incomplete: incompleteCount,
    }),
    [users, incompleteCount]
  )

  const statusFiltered = useMemo(() => {
    switch (statusFilter) {
      case 'has_cats':
        return users.filter((u) => u.cats.length > 0)
      case 'no_cats':
        return users.filter((u) => u.cats.length === 0)
      case 'incomplete':
        return users.filter((u) => !u.profile_completed)
      default:
        return users
    }
  }, [users, statusFilter])

  const columns: ColumnDef<AdminUser>[] = [
    {
      id: 'owner',
      accessorFn: (row) => `${ownerFullName(row)} ${row.email}`,
      header: ({ column }) => <SortHeader label="Eier" column={column} />,
      cell: ({ row }) => {
        const name = ownerFullName(row.original)
        return (
          <div>
            <p className="text-sm font-medium">
              {name || <span className="text-muted-foreground">Uten navn</span>}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: 'Telefon',
      cell: ({ row }) => (
        <p className="text-sm">{row.original.phone || '–'}</p>
      ),
    },
    {
      id: 'cats',
      accessorFn: (row) => row.cats.length,
      header: ({ column }) => <SortHeader label="Katter" column={column} />,
      cell: ({ row }) => {
        const cats = row.original.cats
        if (cats.length === 0) {
          return <p className="text-xs text-muted-foreground">Ingen katter</p>
        }
        const shown = cats.slice(0, MAX_CAT_BADGES)
        const rest = cats.length - shown.length
        return (
          <div className="flex flex-wrap gap-1">
            {shown.map((cat) => (
              <Badge key={cat.id} variant="outline" className="text-xs font-normal">
                {cat.name}
              </Badge>
            ))}
            {rest > 0 && (
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                +{rest}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'booking_count',
      header: ({ column }) => <SortHeader label="Bookinger" column={column} />,
      cell: ({ row }) => (
        <p className="text-sm">{row.original.booking_count}</p>
      ),
    },
    {
      id: 'profile_completed',
      accessorFn: (row) => (row.profile_completed ? 1 : 0),
      header: ({ column }) => <SortHeader label="Profil" column={column} />,
      cell: ({ row }) =>
        row.original.profile_completed ? (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Komplett
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-100 text-xs text-amber-800"
          >
            Ufullstendig
          </Badge>
        ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <SortHeader label="Registrert" column={column} />,
      cell: ({ row }) => (
        <p className="text-sm">{formatRegisteredDate(row.original.created_at)}</p>
      ),
      sortingFn: 'alphanumeric',
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

  function openUser(user: AdminUser) {
    setSelectedUser(user)
    setSheetOpen(true)
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {users.length} registrerte brukere
        {incompleteCount > 0 && (
          <>
            {' · '}
            <span className="font-medium text-amber-700">
              {incompleteCount} med ufullstendig profil
            </span>
          </>
        )}
      </p>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <Input
          placeholder="Søk etter navn, e-post, telefon eller kattenavn..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 max-w-xs text-sm"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const isActive = statusFilter === f.value
              return (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/40 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {filterCounts[f.value]}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            {table.getRowModel().rows.length} av {users.length} brukere
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/40">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 text-xs">
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                  Ingen brukere funnet
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => openUser(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDetailSheet
        user={selectedUser}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
