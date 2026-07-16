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
import { useStore, MembershipCard } from '@/lib/store'
import {
  Bell, Plus, CreditCard, Edit, Trash2, Pause, Play, Copy, Check,
  Sparkles, Utensils, Ticket, Wine, Plane
} from 'lucide-react'
import { motion } from 'framer-motion'

const SERVICE_OPTIONS = [
  { value: 'events', label: '🎫 Events' },
  { value: 'restaurants', label: '🍽 Restaurants' },
  { value: 'hospitality', label: '🥂 Hospitality' },
  { value: 'travel', label: '✈ Travel' },
] as const

const COLOR_OPTIONS = [
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-700',
  'from-rose-500 to-pink-700',
  'from-emerald-500 to-green-700',
  'from-blue-500 to-cyan-600',
  'from-slate-700 to-slate-900',
]

const EMPTY_FORM = {
  name: '',
  code: '',
  discountPct: 10,
  validFor: ['events'] as ('events' | 'restaurants' | 'hospitality' | 'travel')[],
  minSpend: 100,
  maxDiscount: 250,
  status: 'Active' as 'Active' | 'Paused' | 'Expired',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
  description: '',
  color: COLOR_OPTIONS[0],
}

export function MembershipCardsPage() {
  const { navigate } = useRouter()
  const {
    membershipCards, addMembershipCard, updateMembershipCard, deleteMembershipCard, addToast,
  } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MembershipCard | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }
  const openEdit = (c: MembershipCard) => {
    setEditing(c)
    setForm({
      name: c.name,
      code: c.code,
      discountPct: c.discountPct,
      validFor: c.validFor,
      minSpend: c.minSpend ?? 0,
      maxDiscount: c.maxDiscount ?? 0,
      status: c.status,
      startDate: c.startDate,
      endDate: c.endDate,
      description: c.description,
      color: c.color,
    })
    setDialogOpen(true)
  }

  const toggleService = (s: 'events' | 'restaurants' | 'hospitality' | 'travel') => {
    setForm(p => ({
      ...p,
      validFor: p.validFor.includes(s) ? p.validFor.filter(x => x !== s) : [...p.validFor, s],
    }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateMembershipCard(editing.id, { ...form })
    } else {
      addMembershipCard({ ...form })
    }
    setDialogOpen(false)
  }

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 1500)
  }

  const totalIssued = membershipCards.reduce((s, c) => s + c.issuedCount, 0)
  const totalRedeemed = membershipCards.reduce((s, c) => s + c.redeemedCount, 0)
  const redemptionRate = totalIssued > 0 ? ((totalRedeemed / totalIssued) * 100).toFixed(1) : '0'

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="membership-cards"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Membership Cards"
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
          <h1 className="text-2xl font-bold tracking-tight">Membership Cards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure discount cards redeemable across events, restaurants, hospitality, and travel.
          </p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          New Membership Card
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Active Cards', value: membershipCards.filter(c => c.status === 'Active').length, icon: CreditCard, sub: `${membershipCards.length} total` },
          { label: 'Total Issued', value: totalIssued.toLocaleString(), icon: Sparkles, sub: 'Across all cards' },
          { label: 'Redemptions', value: totalRedeemed.toLocaleString(), icon: Check, sub: `${redemptionRate}% rate` },
          { label: 'Services', value: new Set(membershipCards.flatMap(c => c.validFor)).size, icon: Utensils, sub: 'Cross-service reach' },
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

      {/* Cards grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {membershipCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`relative overflow-hidden bg-gradient-to-br ${card.color} p-0 text-white`}>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/5" />
              <div className="relative p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] opacity-70">{card.code}</div>
                    <div className="mt-1 text-lg font-bold leading-tight">{card.name}</div>
                  </div>
                  <button
                    onClick={() => copyCode(card.code)}
                    className="rounded-md bg-white/15 p-1.5 transition hover:bg-white/25"
                    title="Copy code"
                  >
                    {copiedCode === card.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div className="text-3xl font-bold">{card.discountPct}%<span className="text-sm font-medium opacity-80"> OFF</span></div>
                  <Badge className={
                    card.status === 'Active' ? 'bg-emerald-500 text-white' :
                    card.status === 'Paused' ? 'bg-amber-500 text-white' :
                    'bg-rose-500 text-white'
                  }>{card.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {card.validFor.map(v => (
                    <span key={v} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase">
                      {v}
                    </span>
                  ))}
                </div>
                <div className="mt-3 text-[11px] opacity-90 line-clamp-2">{card.description}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="rounded-md bg-white/10 p-2">
                    <div className="opacity-70">Issued</div>
                    <div className="font-semibold text-sm">{card.issuedCount.toLocaleString()}</div>
                  </div>
                  <div className="rounded-md bg-white/10 p-2">
                    <div className="opacity-70">Redeemed</div>
                    <div className="font-semibold text-sm">{card.redeemedCount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] opacity-80">
                  <span>Min spend: ${card.minSpend ?? 0}</span>
                  <span>Max off: ${card.maxDiscount ?? 0}</span>
                </div>
              </div>
              <div className="relative flex border-t border-white/15 bg-black/10 text-xs">
                <button
                  onClick={() => openEdit(card)}
                  className="flex flex-1 items-center justify-center gap-1 py-2 transition hover:bg-white/10"
                >
                  <Edit className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => updateMembershipCard(card.id, { status: card.status === 'Active' ? 'Paused' : 'Active' })}
                  className="flex flex-1 items-center justify-center gap-1 py-2 transition hover:bg-white/10"
                >
                  {card.status === 'Active'
                    ? <><Pause className="h-3 w-3" /> Pause</>
                    : <><Play className="h-3 w-3" /> Resume</>
                  }
                </button>
                <button
                  onClick={() => setDeleteId(card.id)}
                  className="flex flex-1 items-center justify-center gap-1 py-2 transition hover:bg-white/10"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
        {membershipCards.length === 0 && (
          <Card className="col-span-full grid place-items-center py-16 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No membership cards yet.</p>
            <Button className="mt-3 gap-2" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Create your first card
            </Button>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Card' : 'New Membership Card'}</DialogTitle>
            <DialogDescription>
              Configure a discount card. Cards can be redeemed across one or more services based on eligibility rules.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Card Name *</Label>
                <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Gold Member Pass" required className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Card Code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="GOLD10"
                  required
                  className="mt-1 font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Eligible Services *</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SERVICE_OPTIONS.map((s) => {
                  const active = form.validFor.includes(s.value)
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleService(s.value)}
                      className={`rounded-full border px-3 py-1 text-xs transition-all ${
                        active
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-background text-muted-foreground hover:border-foreground/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Card will be redeemable across all selected services.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Discount %</Label>
                <Input type="number" min={1} max={100} value={form.discountPct} onChange={(e) => setForm(p => ({ ...p, discountPct: parseFloat(e.target.value) || 0 }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Min Spend ($)</Label>
                <Input type="number" min={0} value={form.minSpend} onChange={(e) => setForm(p => ({ ...p, minSpend: parseFloat(e.target.value) || 0 }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Max Discount ($)</Label>
                <Input type="number" min={0} value={form.maxDiscount} onChange={(e) => setForm(p => ({ ...p, maxDiscount: parseFloat(e.target.value) || 0 }))} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm(p => ({ ...p, startDate: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm(p => ({ ...p, endDate: e.target.value }))} className="mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Card Color</Label>
              <div className="mt-1.5 flex gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, color: c }))}
                    className={`h-8 w-12 rounded-md bg-gradient-to-br ${c} ${form.color === c ? 'ring-2 ring-foreground ring-offset-2' : ''}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                rows={2}
                placeholder="Short description shown to customers"
                className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm(p => ({ ...p, status: e.target.value as 'Active' | 'Paused' | 'Expired' }))}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Create card'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete membership card?</AlertDialogTitle>
            <AlertDialogDescription>
              Customers who own this card will lose access. Past redemptions will remain in their history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteMembershipCard(deleteId); setDeleteId(null) }} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
