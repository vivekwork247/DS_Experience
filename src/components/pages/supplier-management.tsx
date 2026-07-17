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
import { useStore, Supplier, EventCategory } from '@/lib/store'
import { formatCurrency, SUPPLIERS as SEED_SUPPLIERS } from '@/lib/mock-data'
import {
  Bell, Search, Plus, Truck, Activity, RefreshCw, Settings, Key,
  FileText, ToggleLeft, ToggleRight, ChevronRight, Edit, Trash2,
  Network, Globe, Zap, ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

// All supported categories that can be routed to suppliers
const ALL_CATEGORIES: EventCategory[] = ['Sports', 'Concerts', 'Formula 1', 'Cricket', 'Tennis', 'Hospitality']

export function SupplierManagementPage() {
  const { navigate } = useRouter()
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, syncSupplier } = useStore()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    credentials: 'API Key',
    apiKey: '',
    endpoint: '',
    margin: 18,
    primaryCategoryLabel: '',
    categories: [] as EventCategory[],
    region: 'Global',
    routingPriority: 99,
  })

  const filtered = suppliers.filter(s =>
    search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({
      name: '',
      credentials: 'API Key',
      apiKey: '',
      endpoint: '',
      margin: 18,
      primaryCategoryLabel: '',
      categories: [],
      region: 'Global',
      routingPriority: suppliers.length + 1,
    })
    setDialogOpen(true)
  }

  const openEdit = (s: Supplier) => {
    setEditing(s)
    setForm({
      name: s.name,
      credentials: s.credentials.split(' ')[0],
      apiKey: s.apiKey || '',
      endpoint: s.endpoint || '',
      margin: s.margin,
      primaryCategoryLabel: s.primaryCategoryLabel,
      categories: s.categories,
      region: s.region,
      routingPriority: s.routingPriority,
    })
    setDialogOpen(true)
  }

  const toggleCategory = (cat: EventCategory) => {
    setForm(p => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter(c => c !== cat)
        : [...p.categories, cat],
    }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateSupplier(editing.id, {
        name: form.name,
        credentials: form.credentials,
        margin: form.margin,
        categories: form.categories,
        primaryCategoryLabel: form.primaryCategoryLabel,
        region: form.region,
        routingPriority: form.routingPriority,
      })
    } else {
      addSupplier({
        name: form.name,
        status: 'Connected',
        credentials: form.credentials,
        apiKey: form.apiKey,
        endpoint: form.endpoint,
        margin: form.margin,
        categories: form.categories,
        primaryCategoryLabel: form.primaryCategoryLabel || form.categories[0] || 'Other',
        region: form.region,
        routingPriority: form.routingPriority,
      })
    }
    setDialogOpen(false)
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="suppliers"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Supplier Management"
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
          <h1 className="text-2xl font-bold tracking-tight">Suppliers &amp; Vendor Categorization</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            5 launch suppliers — each manages a specific event category. Smart routing automatically directs new events to the right vendor based on category.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => suppliers.forEach(s => syncSupplier(s.id))}>
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
          <Button className="gap-2" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length, icon: Truck, sub: `${suppliers.filter(s => s.status === 'Connected').length} active` },
          { label: 'Categories Covered', value: new Set(suppliers.flatMap(s => s.categories)).size, icon: Network, sub: `out of ${ALL_CATEGORIES.length}` },
          { label: 'Avg Margin', value: `${(suppliers.reduce((s, x) => s + x.margin, 0) / Math.max(suppliers.length, 1)).toFixed(1)}%`, icon: Settings, sub: 'Across all suppliers' },
          { label: 'Total Revenue', value: formatCurrency(suppliers.reduce((s, x) => s + x.revenue, 0)), icon: ChevronRight, sub: 'YTD' },
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

      {/* Category Routing Map */}
      <Card className="mt-6 p-5">
        <h3 className="mb-1 flex items-center gap-2 font-semibold">
          <Network className="h-4 w-4" />
          Smart Category Routing
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          When a customer browses an event, the system automatically routes inventory requests to the supplier that owns the event&apos;s category.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ALL_CATEGORIES.map((cat) => {
            const supplier = suppliers.find(s => s.categories.includes(cat) && s.status === 'Connected')
            const fallback = suppliers.find(s => s.id === 'SUP-005' || s.primaryCategoryLabel.toLowerCase().includes('other'))
            const target = supplier || fallback
            return (
              <div key={cat} className="rounded-lg border border-border p-3 transition-colors hover:border-foreground/30">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{cat}</div>
                <div className="mt-1 text-sm font-semibold leading-tight">{target?.name ?? 'Unmapped'}</div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  {supplier ? (
                    <>
                      <Zap className="h-3 w-3 text-emerald-500" /> Direct route
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-3 w-3 text-amber-500" /> Fallback
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Search */}
      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers by name, ID or status…" className="pl-9" />
        </div>
      </div>

      {/* Suppliers table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Primary Category</th>
                <th className="px-5 py-3 font-medium">Categories Routed</th>
                <th className="px-5 py-3 font-medium">Region</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3 font-medium">Revenue</th>
                <th className="px-5 py-3 font-medium">Margin</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s, idx) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-foreground text-background">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-xs font-medium">{s.primaryCategoryLabel}</div>
                    <div className="text-[10px] text-muted-foreground">Priority #{s.routingPriority}</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.categories.map((c) => (
                        <Badge key={c} variant="secondary" className="bg-foreground/5 text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      {s.region}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => updateSupplier(s.id, { status: s.status === 'Connected' ? 'Disabled' : 'Connected' })}
                      className="flex items-center gap-1.5"
                    >
                      {s.status === 'Connected' ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-medium text-emerald-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-medium text-rose-600">Disabled</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3 font-medium">{s.bookings.toLocaleString()}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(s.revenue)}</td>
                  <td className="px-5 py-3">
                    <span className={s.margin < 15 ? 'text-amber-600 font-medium' : 'font-medium'}>
                      {s.margin}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Sync now" onClick={() => syncSupplier(s.id)}>
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(s)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Credentials">
                        <Key className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(s.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <Truck className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No suppliers found.</p>
          </div>
        )}
      </Card>

      {/* Sync logs */}
      <Card className="mt-6 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Activity className="h-4 w-4" />
          Recent Sync Logs
        </h3>
        <div className="space-y-2 font-mono text-xs">
          {[
            { time: '14:32:18', supplier: 'Velocity Racing Supplies', level: 'success', msg: 'Synced 248 F1 inventory items in 1.2s' },
            { time: '14:31:55', supplier: 'Concert Live Worldwide', level: 'success', msg: 'Synced 612 concert inventory items in 2.1s' },
            { time: '14:30:42', supplier: 'Grand Slam Tennis Tix', level: 'success', msg: 'Synced 184 tennis inventory items in 0.8s' },
            { time: '14:28:11', supplier: 'Cricket Tickets India', level: 'warning', msg: '8 items failed validation. Imported 220/228.' },
            { time: '14:25:33', supplier: 'Global Events Network', level: 'success', msg: 'Synced 412 sports inventory items in 1.6s' },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md border border-border p-2">
              <span className="text-muted-foreground">{log.time}</span>
              <span className={
                log.level === 'success' ? 'text-emerald-600' :
                log.level === 'error' ? 'text-rose-600' : 'text-amber-600'
              }>[{log.level.toUpperCase()}]</span>
              <span className="font-sans font-medium text-foreground">{log.supplier}:</span>
              <span className="text-muted-foreground">{log.msg}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            <DialogDescription>{editing ? 'Update supplier configuration' : 'Connect a new ticket supplier via API'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-xs">Supplier Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Velocity Racing Supplies" required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Primary Category Label *</Label>
              <Input value={form.primaryCategoryLabel} onChange={(e) => setForm(p => ({ ...p, primaryCategoryLabel: e.target.value }))} placeholder="e.g. Racing Events" required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Categories Routed to this Supplier *</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map((cat) => {
                  const active = form.categories.includes(cat)
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-full border px-3 py-1 text-xs transition-all ${
                        active
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-background text-muted-foreground hover:border-foreground/50'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Smart routing will direct events from these categories to this supplier.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Region</Label>
                <select value={form.region} onChange={(e) => setForm(p => ({ ...p, region: e.target.value }))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="Global">Global</option>
                  <option value="APAC">APAC</option>
                  <option value="EU">Europe</option>
                  <option value="Americas">Americas</option>
                  <option value="MENA">MENA</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Routing Priority</Label>
                <Input type="number" min={1} max={99} value={form.routingPriority} onChange={(e) => setForm(p => ({ ...p, routingPriority: parseInt(e.target.value) || 99 }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Credential Type</Label>
                <select value={form.credentials} onChange={(e) => setForm(p => ({ ...p, credentials: e.target.value }))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="API Key">API Key</option>
                  <option value="OAuth">OAuth 2.0</option>
                  <option value="Basic">Basic Auth</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Default Margin (%)</Label>
                <Input type="number" min={0} max={100} step={0.1} value={form.margin} onChange={(e) => setForm(p => ({ ...p, margin: parseFloat(e.target.value) || 0 }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">API Key / Token</Label>
              <Input value={form.apiKey} onChange={(e) => setForm(p => ({ ...p, apiKey: e.target.value }))} placeholder="sk-..." className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">API Endpoint</Label>
              <Input value={form.endpoint} onChange={(e) => setForm(p => ({ ...p, endpoint: e.target.value }))} placeholder="https://api.supplier.com/v2" className="mt-1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Add supplier'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the supplier and disconnect its API. Events in its categories will fall back to the &quot;Other&quot; supplier. Existing bookings will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteSupplier(deleteId); setDeleteId(null) }} className="bg-rose-600 hover:bg-rose-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
