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
import { useStore, Partner } from '@/lib/store'
import { formatCurrency } from '@/lib/mock-data'
import {
  Bell, Search, Handshake, CheckCircle2, DollarSign,
  TrendingUp, Clock, Ban, Eye, Gift, Plus, Edit, Trash2,
  ArrowUpCircle, ArrowDownCircle, Building2
} from 'lucide-react'

type PartnerForm = {
  company: string
  contact: string
  country: string
  tier: 'Silver' | 'Gold' | 'Platinum'
  creditLimit: number
  status: 'Approved' | 'Pending' | 'Suspended'
}

const EMPTY_FORM: PartnerForm = {
  company: '',
  contact: '',
  country: '',
  tier: 'Silver',
  creditLimit: 50000,
  status: 'Pending',
}

export function B2BPartnerManagementPage() {
  const { navigate } = useRouter()
  const { partners, addPartner, updatePartner, deletePartner, addToast } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Suspended'>('All')
  const [tierFilter, setTierFilter] = useState<'All' | 'Silver' | 'Gold' | 'Platinum'>('All')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState<PartnerForm>(EMPTY_FORM)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [detailPartner, setDetailPartner] = useState<Partner | null>(null)

  const filtered = partners.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch =
      search === '' ||
      p.company.toLowerCase().includes(q) ||
      p.contact.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    const matchTier = tierFilter === 'All' || p.tier === tierFilter
    return matchSearch && matchStatus && matchTier
  })

  const totalCreditUsed = partners.reduce((sum, p) => sum + p.used, 0)

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (p: Partner) => {
    setEditing(p)
    setForm({
      company: p.company,
      contact: p.contact,
      country: p.country,
      tier: p.tier,
      creditLimit: p.creditLimit,
      status: p.status,
    })
    setDialogOpen(true)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updatePartner(editing.id, {
        company: form.company,
        contact: form.contact,
        country: form.country,
        tier: form.tier,
        creditLimit: form.creditLimit,
        status: form.status,
      })
    } else {
      addPartner({
        company: form.company,
        contact: form.contact,
        country: form.country,
        tier: form.tier,
        creditLimit: form.creditLimit,
        used: 0,
        status: form.status,
      })
    }
    setDialogOpen(false)
  }

  const toggleStatus = (p: Partner) => {
    if (p.status === 'Pending' || p.status === 'Suspended') {
      updatePartner(p.id, { status: 'Approved' })
    } else if (p.status === 'Approved') {
      updatePartner(p.id, { status: 'Suspended' })
    }
  }

  const changeTier = (p: Partner, direction: 'up' | 'down') => {
    const order: Partner['tier'][] = ['Silver', 'Gold', 'Platinum']
    const idx = order.indexOf(p.tier)
    const nextIdx = direction === 'up' ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1)
    if (nextIdx !== idx) {
      updatePartner(p.id, { tier: order[nextIdx] })
      addToast({
        title: 'Tier updated',
        description: `${p.company} is now ${order[nextIdx]}`,
        type: 'success',
      })
      setDetailPartner((prev) => prev ? { ...prev, tier: order[nextIdx] } : prev)
    }
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="partners"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="B2B Partner Management"
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
          <h1 className="text-2xl font-bold tracking-tight">B2B Partners</h1>
          <p className="mt-1 text-sm text-muted-foreground">Approve, manage, and monitor B2B partner companies.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Partners', value: partners.length, icon: Handshake, sub: `${partners.filter(p => p.status === 'Approved').length} active` },
          { label: 'Approved', value: partners.filter(p => p.status === 'Approved').length, icon: CheckCircle2, sub: 'Live credit lines' },
          { label: 'Pending Approval', value: partners.filter(p => p.status === 'Pending').length, icon: Clock, sub: 'Awaiting review' },
          { label: 'Total Credit Used', value: formatCurrency(totalCreditUsed), icon: DollarSign, sub: 'Across all partners' },
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

      {/* Search + Filters */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, contact, country…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          {(['All', 'Approved', 'Pending', 'Suspended'] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
          <span className="ml-3 text-xs font-medium text-muted-foreground">Tier:</span>
          {(['All', 'Silver', 'Gold', 'Platinum'] as const).map((s) => (
            <Button
              key={s}
              variant={tierFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTierFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Partners table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Credit Utilization</th>
                <th className="px-5 py-3 font-medium">Points</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const ratio = p.creditLimit > 0 ? p.used / p.creditLimit : 0
                return (
                  <tr
                    key={p.id}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => setDetailPartner(p)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-foreground text-background">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{p.company}</div>
                          <div className="text-xs text-muted-foreground">{p.contact} · {p.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={
                        p.tier === 'Platinum' ? 'border-purple-500/30 text-purple-600' :
                        p.tier === 'Gold' ? 'border-amber-500/30 text-amber-600' :
                        'border-slate-400/30 text-slate-600'
                      }>
                        {p.tier}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className={
                        p.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                        p.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                        'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15'
                      }>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="w-40">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{formatCurrency(p.used)}</span>
                          <span>{formatCurrency(p.creditLimit)}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${ratio > 0.8 ? 'bg-rose-500' : ratio > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, ratio * 100)}%` }}
                          />
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">{Math.round(ratio * 100)}% used</div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 font-semibold">
                        <Gift className="h-3.5 w-3.5 text-amber-500" />
                        {p.points.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {p.status === 'Pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-emerald-600"
                            title="Approve"
                            onClick={() => toggleStatus(p)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        )}
                        {p.status === 'Approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-rose-600"
                            title="Suspend"
                            onClick={() => toggleStatus(p)}
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Suspend
                          </Button>
                        )}
                        {p.status === 'Suspended' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-emerald-600"
                            title="Reactivate"
                            onClick={() => toggleStatus(p)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Reactivate
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(p)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View" onClick={() => setDetailPartner(p)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <Handshake className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No partners match your filters.</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update partner profile and credit configuration' : 'Register a new B2B partner company'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-xs">Company Name *</Label>
              <Input
                value={form.company}
                onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))}
                placeholder="e.g. Global Sports Tours"
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Contact Person *</Label>
                <Input
                  value={form.contact}
                  onChange={(e) => setForm(p => ({ ...p, contact: e.target.value }))}
                  placeholder="e.g. Sarah Mitchell"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Country *</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))}
                  placeholder="e.g. United Kingdom"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tier</Label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm(p => ({ ...p, tier: e.target.value as PartnerForm['tier'] }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(p => ({ ...p, status: e.target.value as PartnerForm['status'] }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Credit Limit (USD)</Label>
              <Input
                type="number"
                min={0}
                step={1000}
                value={form.creditLimit}
                onChange={(e) => setForm(p => ({ ...p, creditLimit: parseFloat(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Add partner'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailPartner} onOpenChange={(o) => !o && setDetailPartner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
            <DialogDescription>
              {detailPartner?.id} · Registered partner
            </DialogDescription>
          </DialogHeader>
          {detailPartner && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-foreground text-background">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{detailPartner.company}</h3>
                  <p className="text-xs text-muted-foreground">{detailPartner.contact} · {detailPartner.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tier</div>
                  <div className="mt-1 font-semibold">
                    <Badge variant="outline" className={
                      detailPartner.tier === 'Platinum' ? 'border-purple-500/30 text-purple-600' :
                      detailPartner.tier === 'Gold' ? 'border-amber-500/30 text-amber-600' :
                      'border-slate-400/30 text-slate-600'
                    }>
                      {detailPartner.tier}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</div>
                  <div className="mt-1 font-semibold">
                    <Badge variant="secondary" className={
                      detailPartner.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                      detailPartner.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                      'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15'
                    }>
                      {detailPartner.status}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Credit Limit</div>
                  <div className="mt-1 font-semibold">{formatCurrency(detailPartner.creditLimit)}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Credit Used</div>
                  <div className="mt-1 font-semibold">{formatCurrency(detailPartner.used)}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Available</div>
                  <div className="mt-1 font-semibold text-emerald-600">{formatCurrency(detailPartner.creditLimit - detailPartner.used)}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reward Points</div>
                  <div className="mt-1 font-semibold flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5 text-amber-500" />
                    {detailPartner.points.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Credit utilization */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Credit Utilization</span>
                  <span>{Math.round((detailPartner.used / Math.max(1, detailPartner.creditLimit)) * 100)}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      detailPartner.used / Math.max(1, detailPartner.creditLimit) > 0.8 ? 'bg-rose-500' :
                      detailPartner.used / Math.max(1, detailPartner.creditLimit) > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (detailPartner.used / Math.max(1, detailPartner.creditLimit)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Tier actions */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => changeTier(detailPartner, 'up')}
                  disabled={detailPartner.tier === 'Platinum'}
                >
                  <ArrowUpCircle className="h-3.5 w-3.5" />
                  Upgrade Tier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => changeTier(detailPartner, 'down')}
                  disabled={detailPartner.tier === 'Silver'}
                >
                  <ArrowDownCircle className="h-3.5 w-3.5" />
                  Downgrade Tier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto gap-1.5"
                  onClick={() => {
                    openEdit(detailPartner)
                    setDetailPartner(null)
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete partner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the partner and revoke their credit line. Existing bookings will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) deletePartner(deleteId); setDeleteId(null) }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
