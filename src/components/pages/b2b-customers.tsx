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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useStore, Customer } from '@/lib/store'
import { formatCurrency } from '@/lib/mock-data'
import { Bell, Search, Plus, Filter, Trash2, Edit, UserPlus } from 'lucide-react'

export function B2BCustomersPage() {
  const { navigate } = useRouter()
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState({ name: '', email: '', country: '', membership: 'Silver' as Customer['membership'] })

  const filtered = customers.filter(c =>
    search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', country: '', membership: 'Silver' })
    setOpen(true)
  }
  const openEdit = (c: Customer) => {
    setEditing(c)
    setForm({ name: c.name, email: c.email, country: c.country, membership: c.membership })
    setOpen(true)
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateCustomer(editing.id, { name: form.name, email: form.email, country: form.country, membership: form.membership })
    } else {
      addCustomer({ name: form.name, email: form.email, country: form.country, membership: form.membership, bookings: 0, lifetimeValue: 0, status: 'Active', tickets: 0 })
    }
    setOpen(false)
  }

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-customers"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Customers"
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
          <h1 className="text-2xl font-bold tracking-tight">My Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage customers you have booked tickets for.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="h-4 w-4" />Add Customer</Button>
      </div>

      <Card className="mb-5 p-4">
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…" className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3 font-medium">Lifetime Value</th>
                <th className="px-5 py-3 font-medium">Membership</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8"><AvatarFallback>{c.name.split(' ').map(s => s[0]).join('')}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.country}</td>
                  <td className="px-5 py-3">{c.bookings}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(c.lifetimeValue)}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={
                      c.membership === 'Platinum' ? 'border-purple-500/30 text-purple-700' :
                      c.membership === 'Gold' ? 'border-amber-500/30 text-amber-700' :
                      c.membership === 'Silver' ? 'border-slate-500/30 text-slate-700' :
                      'border-orange-700/30 text-orange-700'
                    }>{c.membership}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary" className={c.status === 'Active' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' : 'bg-muted text-muted-foreground hover:bg-muted'}>{c.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(c)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600" onClick={() => deleteCustomer(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <UserPlus className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No customers yet. Add your first customer.</p>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            <DialogDescription>{editing ? 'Update customer information' : 'Create a new customer record'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-xs">Name</Label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Customer name" required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Country</Label>
              <Input value={form.country} onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))} placeholder="Country" required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Membership</Label>
              <select value={form.membership} onChange={(e) => setForm(p => ({ ...p, membership: e.target.value as any }))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Add customer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
