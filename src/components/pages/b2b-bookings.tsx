'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { B2B_GROUPS } from '@/components/pages/b2b-groups'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/mock-data'
import { Bell, Search, Download, Eye, Plus, Filter, MoreVertical, Trash2, Edit } from 'lucide-react'

export function B2BBookingsPage() {
  const { navigate } = useRouter()
  const { bookings, updateBooking, deleteBooking } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = bookings.filter(b =>
    (statusFilter === 'all' || b.status === statusFilter) &&
    (search === '' || b.id.toLowerCase().includes(search.toLowerCase()) || b.eventName.toLowerCase().includes(search.toLowerCase()) || b.customerName.toLowerCase().includes(search.toLowerCase()))
  )
  const selectedBooking = bookings.find(b => b.id === selected)

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-bookings"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Bookings"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=23" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">View, manage and track all your B2B bookings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button className="gap-2" onClick={() => navigate('b2b-events')}><Plus className="h-4 w-4" />New Booking</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, event or customer…"
              className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Booking ID</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Commission</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => setSelected(b.id)}>
                  <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{b.eventName}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(b.eventDate)}</div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{b.customerName}</td>
                  <td className="px-5 py-3 text-xs">{b.tier} × {b.qty}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                  <td className="px-5 py-3 text-emerald-700">{formatCurrency(b.commission, b.currency)}</td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary" className={
                      b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                      b.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                      b.status === 'Refunded' ? 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15' :
                      'bg-muted text-muted-foreground hover:bg-muted'
                    }>{b.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <Filter className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No bookings found.</p>
          </div>
        )}
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details — {selectedBooking?.id}</DialogTitle>
            <DialogDescription>Full booking information and actions</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Event</div><div className="font-medium">{selectedBooking.eventName}</div></div>
                <div><div className="text-xs text-muted-foreground">Date</div><div className="font-medium">{formatDate(selectedBooking.eventDate)}</div></div>
                <div><div className="text-xs text-muted-foreground">Venue</div><div className="font-medium">{selectedBooking.venue}</div></div>
                <div><div className="text-xs text-muted-foreground">Customer</div><div className="font-medium">{selectedBooking.customerName}</div></div>
                <div><div className="text-xs text-muted-foreground">Email</div><div className="font-medium">{selectedBooking.email}</div></div>
                <div><div className="text-xs text-muted-foreground">Payment</div><div className="font-medium">{selectedBooking.paymentMethod}</div></div>
                <div><div className="text-xs text-muted-foreground">Tier</div><div className="font-medium">{selectedBooking.tier} × {selectedBooking.qty}</div></div>
                <div><div className="text-xs text-muted-foreground">Amount</div><div className="font-semibold">{formatCurrency(selectedBooking.amount, selectedBooking.currency)}</div></div>
                <div><div className="text-xs text-muted-foreground">Commission</div><div className="font-semibold text-emerald-700">{formatCurrency(selectedBooking.commission, selectedBooking.currency)}</div></div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant="secondary" className={
                  selectedBooking.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-700' :
                  selectedBooking.status === 'Pending' ? 'bg-amber-500/15 text-amber-700' :
                  selectedBooking.status === 'Refunded' ? 'bg-rose-500/15 text-rose-700' :
                  'bg-muted text-muted-foreground'
                }>{selectedBooking.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { if (selectedBooking) deleteBooking(selectedBooking.id); setSelected(null) }}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
            {selectedBooking?.status === 'Pending' && (
              <Button size="sm" className="gap-1.5" onClick={() => { if (selectedBooking) updateBooking(selectedBooking.id, { status: 'Confirmed' }); setSelected(null) }}>
                <Edit className="h-3.5 w-3.5" /> Confirm booking
              </Button>
            )}
            {selectedBooking?.status === 'Confirmed' && (
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { if (selectedBooking) updateBooking(selectedBooking.id, { status: 'Refunded' }); setSelected(null) }}>
                Refund
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
