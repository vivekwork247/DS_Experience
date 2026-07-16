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
import { useStore, InventoryItem } from '@/lib/store'
import {
  Bell, Search, Plus, Boxes, Layers, Filter, Minus,
  Pencil, Trash2, AlertCircle
} from 'lucide-react'

type Status = 'All' | 'Active' | 'Sold Out' | 'Reserved'

const PRIORITY_OPTIONS: InventoryItem['priority'][] = ['Critical', 'High', 'Medium', 'Low']
const STATUS_OPTIONS: InventoryItem['status'][] = ['Active', 'Sold Out', 'Reserved']
const STATUS_CYCLE: InventoryItem['status'][] = ['Active', 'Reserved', 'Sold Out']

function priorityBadge(p: InventoryItem['priority']) {
  switch (p) {
    case 'Critical': return <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/15">{p}</Badge>
    case 'High':     return <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">{p}</Badge>
    case 'Medium':   return <Badge variant="secondary">{p}</Badge>
    default:         return <Badge variant="outline">{p}</Badge>
  }
}

function statusBadge(s: InventoryItem['status']) {
  const cls =
    s === 'Active' ? 'border-emerald-500/30 text-emerald-600' :
    s === 'Sold Out' ? 'border-rose-500/30 text-rose-600' :
    'border-amber-500/30 text-amber-600'
  return <Badge variant="outline" className={cls}>{s}</Badge>
}

export function InventoryManagementPage() {
  const { navigate } = useRouter()
  const { inventory, suppliers, addInventory, updateInventory, deleteInventory } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status>('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    event: '',
    supplier: '',
    tier: '',
    qty: 0,
    priority: 'Medium' as InventoryItem['priority'],
    status: 'Active' as InventoryItem['status'],
  })

  const filtered = inventory.filter(i => {
    const matchesSearch =
      search === '' ||
      i.event.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier.toLowerCase().includes(search.toLowerCase()) ||
      i.tier.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openAdd = () => {
    setEditing(null)
    setForm({
      event: '',
      supplier: suppliers[0]?.name ?? '',
      tier: '',
      qty: 0,
      priority: 'Medium',
      status: 'Active',
    })
    setDialogOpen(true)
  }

  const openEdit = (i: InventoryItem) => {
    setEditing(i)
    setForm({
      event: i.event,
      supplier: i.supplier,
      tier: i.tier,
      qty: i.qty,
      priority: i.priority,
      status: i.status,
    })
    setDialogOpen(true)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateInventory(editing.id, {
        event: form.event,
        supplier: form.supplier,
        tier: form.tier,
        qty: form.qty,
        priority: form.priority,
        status: form.status,
      })
    } else {
      addInventory({
        event: form.event,
        supplier: form.supplier,
        tier: form.tier,
        qty: form.qty,
        priority: form.priority,
        status: form.status,
      })
    }
    setDialogOpen(false)
  }

  const cycleStatus = (i: InventoryItem) => {
    const idx = STATUS_CYCLE.indexOf(i.status)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    updateInventory(i.id, { status: next })
  }

  const adjustQty = (i: InventoryItem, delta: number) => {
    updateInventory(i.id, { qty: Math.max(0, i.qty + delta) })
  }

  const totalQty = inventory.reduce((s, i) => s + i.qty, 0)
  const activeCount = inventory.filter(i => i.status === 'Active').length
  const soldOutCount = inventory.filter(i => i.status === 'Sold Out').length
  const reservedCount = inventory.filter(i => i.status === 'Reserved').length

  const stats = [
    { label: 'Total Items', value: inventory.length, icon: Boxes, sub: `${suppliers.length} suppliers` },
    { label: 'Active', value: activeCount, icon: Layers, sub: 'Live listings' },
    { label: 'Sold Out', value: soldOutCount, icon: Filter, sub: `${reservedCount} reserved` },
    { label: 'Total Quantity', value: totalQty.toLocaleString(), icon: Plus, sub: 'Tickets available' },
  ]

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="inventory"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Inventory Management"
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
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage ticket inventory across suppliers — add, edit, reserve and update quantities.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Inventory
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => {
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

      {/* Search + status filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event, supplier, tier or ID…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Active', 'Sold Out', 'Reserved'] as Status[]).map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(st)}
            >
              {st}
              {st !== 'All' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {st === 'Active' ? activeCount : st === 'Sold Out' ? soldOutCount : reservedCount}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Inventory table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Product ID</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                  <td className="px-5 py-3 font-medium">{item.event}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{item.supplier}</td>
                  <td className="px-5 py-3">{item.tier}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => adjustQty(item, -1)}
                        title="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className={`min-w-[2.5rem] text-center font-medium tabular-nums ${item.qty === 0 ? 'text-rose-600' : item.qty < 50 ? 'text-amber-600' : ''}`}>
                        {item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => adjustQty(item, 1)}
                        title="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-5 py-3">{priorityBadge(item.priority)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => cycleStatus(item)}
                      title="Click to cycle status"
                      className="transition-opacity hover:opacity-80"
                    >
                      {statusBadge(item.status)}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(item.id)}>
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
            <Boxes className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No inventory items found.</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the inventory details' : 'Create a new ticket inventory entry'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-xs">Event Name *</Label>
              <Input
                value={form.event}
                onChange={(e) => setForm(p => ({ ...p, event: e.target.value }))}
                placeholder="e.g. UEFA Champions League Final"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Supplier *</Label>
              <select
                value={form.supplier}
                onChange={(e) => setForm(p => ({ ...p, supplier: e.target.value }))}
                required
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>Select a supplier…</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Tier Name *</Label>
              <Input
                value={form.tier}
                onChange={(e) => setForm(p => ({ ...p, tier: e.target.value }))}
                placeholder="e.g. VIP Suite, Category 1"
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Quantity *</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.qty}
                  onChange={(e) => setForm(p => ({ ...p, qty: parseInt(e.target.value) || 0 }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm(p => ({ ...p, priority: e.target.value as InventoryItem['priority'] }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm(p => ({ ...p, status: e.target.value as InventoryItem['status'] }))}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Add item'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Delete inventory item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the inventory item from the catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) deleteInventory(deleteId); setDeleteId(null) }}
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
