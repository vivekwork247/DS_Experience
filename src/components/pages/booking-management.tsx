'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ADMIN_GROUPS } from '@/components/pages/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useStore, BookingItem } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/mock-data'
import {
  Bell, Search, Plus, ShoppingCart, Clock, CheckCircle2, DollarSign,
  Eye, Edit, Trash2, RotateCcw, XCircle, Calendar, MapPin, User, Mail,
  CreditCard, Package, Tag
} from 'lucide-react'

const STATUS_OPTIONS = ['All', 'Confirmed', 'Pending', 'Refunded', 'Cancelled'] as const
const PAYMENT_METHODS = ['Credit Card', 'PayPal', 'Stripe', 'Bank Transfer', 'Apple Pay', 'Google Pay']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'INR', 'AUD']

function statusBadgeClass(status: string) {
  if (status === 'Confirmed') return 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15'
  if (status === 'Pending') return 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15'
  if (status === 'Refunded') return 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15'
  return 'bg-muted text-muted-foreground hover:bg-muted'
}

interface BookingForm {
  eventName: string
  eventDate: string
  venue: string
  customerName: string
  email: string
  tier: string
  qty: number
  amount: number
  currency: string
  paymentMethod: string
  supplier: string
  commission: number
  status: BookingItem['status']
}

export function BookingManagementPage() {
  const { navigate } = useRouter()
  const { bookings, suppliers, addBooking, updateBooking, deleteBooking } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [createOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const emptyForm: BookingForm = {
    eventName: '', eventDate: '', venue: '', customerName: '', email: '',
    tier: 'Standard', qty: 1, amount: 0, currency: 'USD',
    paymentMethod: 'Credit Card', supplier: suppliers[0]?.name ?? '', commission: 0,
    status: 'Pending',
  }
  const [form, setForm] = useState<BookingForm>(emptyForm)

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase()
    const matchesSearch = search === '' ||
      b.id.toLowerCase().includes(q) ||
      b.eventName.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((s, b) => s + b.amount, 0)
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length
  const pendingCount = bookings.filter(b => b.status === 'Pending').length

  const detail = detailId ? bookings.find(b => b.id === detailId) ?? null : null

  const openCreate = () => {
    setForm({ ...emptyForm, supplier: suppliers[0]?.name ?? '' })
    setCreateOpen(true)
  }

  const openEdit = (b: BookingItem) => {
    setForm({
      eventName: b.eventName, eventDate: b.eventDate, venue: b.venue,
      customerName: b.customerName, email: b.email, tier: b.tier, qty: b.qty,
      amount: b.amount, currency: b.currency, paymentMethod: b.paymentMethod,
      supplier: b.supplier, commission: b.commission, status: b.status,
    })
    setEditOpen(true)
  }

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    addBooking({
      eventName: form.eventName,
      eventDate: form.eventDate,
      venue: form.venue,
      customer: form.email,
      email: form.email,
      customerName: form.customerName,
      tier: form.tier,
      qty: Number(form.qty),
      amount: Number(form.amount),
      currency: form.currency,
      paymentMethod: form.paymentMethod,
      supplier: form.supplier,
      commission: Number(form.commission),
      status: form.status,
    })
    setCreateOpen(false)
  }

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (detail) {
      updateBooking(detail.id, {
        eventName: form.eventName, eventDate: form.eventDate, venue: form.venue,
        customerName: form.customerName, customer: form.email, email: form.email,
        tier: form.tier, qty: Number(form.qty), amount: Number(form.amount),
        currency: form.currency, paymentMethod: form.paymentMethod,
        supplier: form.supplier, commission: Number(form.commission), status: form.status,
      })
      setEditOpen(false)
    }
  }

  const formFields = (label: string, key: keyof BookingForm, children: React.ReactNode) => (
    <div key={key}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  )

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="admin-bookings"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Booking Management"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=5" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, view, refund and rebook customer orders across the platform.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Create Booking
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: ShoppingCart, sub: `${filtered.length} shown` },
          { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, sub: 'Confirmed only' },
          { label: 'Confirmed', value: confirmedCount, icon: CheckCircle2, sub: 'Ready to fulfill' },
          { label: 'Pending', value: pendingCount, icon: Clock, sub: 'Awaiting confirmation' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{s.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Search & status filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by booking ID, event, or customer…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Booking ID</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Booked</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Commission</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => setDetailId(b.id)}
                >
                  <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{b.eventName}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(b.eventDate)}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-xs">{b.customerName}</div>
                    <div className="text-[10px] text-muted-foreground">{b.email}</div>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{b.supplier}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{b.bookingDate}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                  <td className="px-5 py-3 text-emerald-600">{formatCurrency(b.commission, b.currency)}</td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <Badge variant="secondary" className={statusBadgeClass(b.status)}>{b.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View" onClick={() => setDetailId(b.id)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(b)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(b.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No bookings found.</p>
          </div>
        )}
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        </div>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>Add a new order to the system. Status defaults to Pending.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitCreate} className="space-y-3">
            {formFields('Event Name *', 'eventName',
              <Input value={form.eventName} onChange={(e) => setForm(p => ({ ...p, eventName: e.target.value }))} placeholder="e.g. Premier League: Arsenal vs Chelsea" required />
            )}
            <div className="grid grid-cols-2 gap-3">
              {formFields('Event Date *', 'eventDate',
                <Input type="date" value={form.eventDate} onChange={(e) => setForm(p => ({ ...p, eventDate: e.target.value }))} required />
              )}
              {formFields('Venue', 'venue',
                <Input value={form.venue} onChange={(e) => setForm(p => ({ ...p, venue: e.target.value }))} placeholder="Emirates Stadium" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Customer Name *', 'customerName',
                <Input value={form.customerName} onChange={(e) => setForm(p => ({ ...p, customerName: e.target.value }))} placeholder="John Doe" required />
              )}
              {formFields('Email *', 'email',
                <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" required />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Tier', 'tier',
                <Input value={form.tier} onChange={(e) => setForm(p => ({ ...p, tier: e.target.value }))} placeholder="Standard" />
              )}
              {formFields('Quantity', 'qty',
                <Input type="number" min={1} value={form.qty} onChange={(e) => setForm(p => ({ ...p, qty: Number(e.target.value) }))} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Amount *', 'amount',
                <Input type="number" min={0} step={0.01} value={form.amount} onChange={(e) => setForm(p => ({ ...p, amount: Number(e.target.value) }))} required />
              )}
              {formFields('Commission', 'commission',
                <Input type="number" min={0} step={0.01} value={form.commission} onChange={(e) => setForm(p => ({ ...p, commission: Number(e.target.value) }))} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Payment Method', 'paymentMethod',
                <select value={form.paymentMethod} onChange={(e) => setForm(p => ({ ...p, paymentMethod: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
              {formFields('Supplier', 'supplier',
                <select value={form.supplier} onChange={(e) => setForm(p => ({ ...p, supplier: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            {formFields('Currency', 'currency',
              <select value={form.currency} onChange={(e) => setForm(p => ({ ...p, currency: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit">Create booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetailId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{detail.id}</span>
                  <Badge variant="secondary" className={statusBadgeClass(detail.status)}>{detail.status}</Badge>
                </DialogTitle>
                <DialogDescription className="text-base font-medium text-foreground">{detail.eventName}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Calendar className="h-3 w-3" />Event Date</div>
                    <div className="mt-1 text-sm font-medium">{formatDate(detail.eventDate)}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><MapPin className="h-3 w-3" />Venue</div>
                    <div className="mt-1 text-sm font-medium">{detail.venue}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><User className="h-3 w-3" />Customer</div>
                    <div className="mt-1 text-sm font-medium">{detail.customerName}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Mail className="h-3 w-3" />Email</div>
                    <div className="mt-1 truncate text-sm font-medium">{detail.email}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Tag className="h-3 w-3" />Tier</div>
                    <div className="mt-1 text-sm font-medium">{detail.tier}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Package className="h-3 w-3" />Quantity</div>
                    <div className="mt-1 text-sm font-medium">{detail.qty}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><CreditCard className="h-3 w-3" />Payment</div>
                    <div className="mt-1 text-sm font-medium">{detail.paymentMethod}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Package className="h-3 w-3" />Supplier</div>
                    <div className="mt-1 text-sm font-medium">{detail.supplier}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-md bg-muted/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</div>
                    <div className="mt-1 text-lg font-bold">{formatCurrency(detail.amount, detail.currency)}</div>
                  </div>
                  <div className="rounded-md bg-emerald-500/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Commission</div>
                    <div className="mt-1 text-lg font-bold text-emerald-700">{formatCurrency(detail.commission, detail.currency)}</div>
                  </div>
                  <div className="rounded-md bg-muted/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Booked</div>
                    <div className="mt-1 text-xs font-medium">{formatDate(detail.bookingDate)}</div>
                  </div>
                </div>

                {/* Status actions */}
                <div className="rounded-md border border-border p-3">
                  <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Status Actions</div>
                  <div className="flex flex-wrap gap-2">
                    {detail.status === 'Pending' && (
                      <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700" onClick={() => { updateBooking(detail.id, { status: 'Confirmed' }); setDetailId(null) }}>
                        <CheckCircle2 className="h-3.5 w-3.5" />Confirm
                      </Button>
                    )}
                    {detail.status === 'Confirmed' && (
                      <Button size="sm" variant="outline" className="gap-1.5 text-rose-600" onClick={() => { updateBooking(detail.id, { status: 'Refunded' }); setDetailId(null) }}>
                        <RotateCcw className="h-3.5 w-3.5" />Refund
                      </Button>
                    )}
                    {detail.status !== 'Cancelled' && detail.status !== 'Refunded' && (
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { updateBooking(detail.id, { status: 'Cancelled' }); setDetailId(null) }}>
                        <XCircle className="h-3.5 w-3.5" />Cancel
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { openEdit(detail); setDetailId(null) }}>
                      <Edit className="h-3.5 w-3.5" />Edit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-rose-600" onClick={() => { setDeleteId(detail.id); setDetailId(null) }}>
                      <Trash2 className="h-3.5 w-3.5" />Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Update booking details. All fields are editable.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitEdit} className="space-y-3">
            {formFields('Event Name *', 'eventName',
              <Input value={form.eventName} onChange={(e) => setForm(p => ({ ...p, eventName: e.target.value }))} required />
            )}
            <div className="grid grid-cols-2 gap-3">
              {formFields('Event Date *', 'eventDate',
                <Input type="date" value={form.eventDate} onChange={(e) => setForm(p => ({ ...p, eventDate: e.target.value }))} required />
              )}
              {formFields('Venue', 'venue',
                <Input value={form.venue} onChange={(e) => setForm(p => ({ ...p, venue: e.target.value }))} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Customer Name *', 'customerName',
                <Input value={form.customerName} onChange={(e) => setForm(p => ({ ...p, customerName: e.target.value }))} required />
              )}
              {formFields('Email *', 'email',
                <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Tier', 'tier',
                <Input value={form.tier} onChange={(e) => setForm(p => ({ ...p, tier: e.target.value }))} />
              )}
              {formFields('Quantity', 'qty',
                <Input type="number" min={1} value={form.qty} onChange={(e) => setForm(p => ({ ...p, qty: Number(e.target.value) }))} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Amount *', 'amount',
                <Input type="number" min={0} step={0.01} value={form.amount} onChange={(e) => setForm(p => ({ ...p, amount: Number(e.target.value) }))} required />
              )}
              {formFields('Commission', 'commission',
                <Input type="number" min={0} step={0.01} value={form.commission} onChange={(e) => setForm(p => ({ ...p, commission: Number(e.target.value) }))} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Payment Method', 'paymentMethod',
                <select value={form.paymentMethod} onChange={(e) => setForm(p => ({ ...p, paymentMethod: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
              {formFields('Supplier', 'supplier',
                <select value={form.supplier} onChange={(e) => setForm(p => ({ ...p, supplier: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formFields('Currency', 'currency',
                <select value={form.currency} onChange={(e) => setForm(p => ({ ...p, currency: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              {formFields('Status', 'status',
                <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value as BookingItem['status'] }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {(['Confirmed', 'Pending', 'Refunded', 'Cancelled'] as const).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the booking record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteBooking(deleteId); setDeleteId(null) }} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
