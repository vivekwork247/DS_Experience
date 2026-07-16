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
import { useStore, Customer } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/mock-data'
import {
  Bell, Search, Plus, Users, Crown, Star, ShoppingBag,
  Edit, Trash2, Eye, UserCheck, MapPin, Calendar, Ticket,
  DollarSign, TrendingUp, Ban
} from 'lucide-react'

const MEMBERSHIP_OPTIONS = ['All', 'Bronze', 'Silver', 'Gold', 'Platinum'] as const

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function avatarUrl(id: string) {
  const num = parseInt(id.replace(/\D/g, '')) || 1
  return `https://i.pravatar.cc/100?img=${(num % 70) + 1}`
}

function MembershipBadge({ tier }: { tier: Customer['membership'] }) {
  if (tier === 'Platinum') return <Badge className="gap-1 bg-purple-500/15 text-purple-700 hover:bg-purple-500/15"><Crown className="h-3 w-3" />{tier}</Badge>
  if (tier === 'Gold') return <Badge className="gap-1 bg-amber-500/15 text-amber-700 hover:bg-amber-500/15"><Star className="h-3 w-3" />{tier}</Badge>
  if (tier === 'Silver') return <Badge variant="secondary">{tier}</Badge>
  return <Badge variant="outline">{tier}</Badge>
}

function statusBadgeClass(status: Customer['status']) {
  if (status === 'Active') return 'border-emerald-500/30 text-emerald-600'
  if (status === 'Suspended') return 'border-rose-500/30 text-rose-600'
  return 'border-muted-foreground/30 text-muted-foreground'
}

function bookingStatusBadgeClass(status: string) {
  if (status === 'Confirmed') return 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15'
  if (status === 'Pending') return 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15'
  if (status === 'Refunded') return 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15'
  return 'bg-muted text-muted-foreground hover:bg-muted'
}

interface CustomerForm {
  name: string
  email: string
  country: string
  membership: Customer['membership']
  status: Customer['status']
}

export function CustomerManagementPage() {
  const { navigate } = useRouter()
  const { customers, bookings, addCustomer, updateCustomer, deleteCustomer } = useStore()
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<CustomerForm>({
    name: '', email: '', country: '',
    membership: 'Bronze', status: 'Active',
  })

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    const matchesSearch = search === '' ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    const matchesTier = tierFilter === 'All' || c.membership === tierFilter
    return matchesSearch && matchesTier
  })

  const activeCount = customers.filter(c => c.status === 'Active').length
  const platinumCount = customers.filter(c => c.membership === 'Platinum').length
  const avgLtv = customers.length > 0
    ? customers.reduce((s, c) => s + c.lifetimeValue, 0) / customers.length
    : 0

  const detail = detailId ? customers.find(c => c.id === detailId) ?? null : null
  const detailBookings = detail ? bookings.filter(b => b.email === detail.email) : []

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', country: '', membership: 'Bronze', status: 'Active' })
    setDialogOpen(true)
  }
  const openEdit = (c: Customer) => {
    setEditing(c)
    setForm({ name: c.name, email: c.email, country: c.country, membership: c.membership, status: c.status })
    setDialogOpen(true)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateCustomer(editing.id, {
        name: form.name, email: form.email, country: form.country,
        membership: form.membership, status: form.status,
      })
    } else {
      addCustomer({
        name: form.name, email: form.email, country: form.country,
        membership: form.membership, status: form.status,
        bookings: 0, lifetimeValue: 0, tickets: 0,
      })
    }
    setDialogOpen(false)
  }

  const toggleSuspend = (c: Customer) => {
    const next = c.status === 'Suspended' ? 'Active' : 'Suspended'
    updateCustomer(c.id, { status: next })
  }

  const formField = (label: string, key: string, children: React.ReactNode) => (
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
      currentRoute="customers"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Customer Management"
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
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage customer accounts, view lifetime value, and track engagement.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, sub: `${filtered.length} shown` },
          { label: 'Active', value: activeCount, icon: UserCheck, sub: 'Engaged accounts' },
          { label: 'Avg Lifetime Value', value: formatCurrency(avgLtv), icon: TrendingUp, sub: 'Per customer' },
          { label: 'Platinum Members', value: platinumCount, icon: Crown, sub: 'Top tier' },
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

      {/* Search & tier filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, country…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {MEMBERSHIP_OPTIONS.map((t) => (
            <Button
              key={t}
              variant={tierFilter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTierFilter(t)}
            >
              {t}
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
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3 font-medium">LTV</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => setDetailId(c.id)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl(c.id)} />
                        <AvatarFallback>{initials(c.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.country}</td>
                  <td className="px-5 py-3 font-medium">{c.bookings}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(c.lifetimeValue)}</td>
                  <td className="px-5 py-3"><MembershipBadge tier={c.membership} /></td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <Badge variant="outline" className={statusBadgeClass(c.status)}>{c.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title={c.status === 'Suspended' ? 'Activate' : 'Suspend'} onClick={() => toggleSuspend(c)}>
                        {c.status === 'Suspended'
                          ? <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                          : <Ban className="h-3.5 w-3.5 text-amber-600" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View" onClick={() => setDetailId(c.id)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(c)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(c.id)}>
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
            <Users className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No customers found.</p>
          </div>
        )}
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground">
            Showing {filtered.length} of {customers.length} customers
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>{editing ? 'Update customer details' : 'Create a new customer account record'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            {formField('Full Name *', 'name',
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" required />
            )}
            {formField('Email *', 'email',
              <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" required />
            )}
            {formField('Country', 'country',
              <Input value={form.country} onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))} placeholder="United Kingdom" />
            )}
            <div className="grid grid-cols-2 gap-3">
              {formField('Membership', 'membership',
                <select value={form.membership} onChange={(e) => setForm(p => ({ ...p, membership: e.target.value as Customer['membership'] }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {(['Bronze', 'Silver', 'Gold', 'Platinum'] as const).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              )}
              {formField('Status', 'status',
                <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value as Customer['status'] }))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {(['Active', 'Inactive', 'Suspended'] as const).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Add customer'}</Button>
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
                <DialogTitle>Customer Profile</DialogTitle>
                <DialogDescription>Full account details and recent bookings</DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={avatarUrl(detail.id)} />
                  <AvatarFallback>{initials(detail.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{detail.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{detail.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <MembershipBadge tier={detail.membership} />
                    <Badge variant="outline" className={statusBadgeClass(detail.status)}>{detail.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><MapPin className="h-3 w-3" />Country</div>
                  <div className="mt-1 text-sm font-medium">{detail.country}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Ticket className="h-3 w-3" />Customer ID</div>
                  <div className="mt-1 font-mono text-sm font-medium">{detail.id}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><ShoppingBag className="h-3 w-3" />Total Bookings</div>
                  <div className="mt-1 text-sm font-medium">{detail.bookings}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Ticket className="h-3 w-3" />Open Tickets</div>
                  <div className="mt-1 text-sm font-medium">{detail.tickets}</div>
                </div>
                <div className="col-span-2 rounded-md bg-emerald-500/10 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><DollarSign className="h-3 w-3" />Lifetime Value</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-700">{formatCurrency(detail.lifetimeValue)}</div>
                </div>
              </div>

              {/* Booking history summary */}
              <div className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3 w-3" />Booking History
                  </span>
                  <span className="text-[10px] text-muted-foreground">{detailBookings.length} matched</span>
                </div>
                {detailBookings.length === 0 ? (
                  <div className="py-3 text-center text-xs text-muted-foreground">No bookings linked to this customer.</div>
                ) : (
                  <div className="max-h-40 space-y-1.5 overflow-y-auto">
                    {detailBookings.slice(0, 8).map((b) => (
                      <div key={b.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/30 px-2 py-1.5 text-xs">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{b.eventName}</div>
                          <div className="text-[10px] text-muted-foreground">{formatDate(b.eventDate)} · {b.id}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{formatCurrency(b.amount, b.currency)}</span>
                          <Badge variant="secondary" className={bookingStatusBadgeClass(b.status)}>{b.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { toggleSuspend(detail); setDetailId(null) }}>
                  {detail.status === 'Suspended'
                    ? <><UserCheck className="h-3.5 w-3.5" />Activate</>
                    : <><Ban className="h-3.5 w-3.5" />Suspend</>}
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { openEdit(detail); setDetailId(null) }}>
                  <Edit className="h-3.5 w-3.5" />Edit
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-rose-600" onClick={() => { setDeleteId(detail.id); setDetailId(null) }}>
                  <Trash2 className="h-3.5 w-3.5" />Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the customer account. Existing bookings will remain for audit purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteCustomer(deleteId); setDeleteId(null) }} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
