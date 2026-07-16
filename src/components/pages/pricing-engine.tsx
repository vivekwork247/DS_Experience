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
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useStore, PricingRule } from '@/lib/store'
import {
  Bell, Search, Plus, Save, DollarSign, Percent, TrendingUp, Globe,
  Award, Tag, Pencil, Trash2, AlertCircle, Calculator
} from 'lucide-react'

const COUNTRIES = ['Global', 'United Kingdom', 'European Union', 'Asia Pacific', 'United States', 'Middle East']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SGD']
const PARTNER_LEVELS = ['All', 'Silver+', 'Gold+', 'Platinum']

export function PricingEnginePage() {
  const { navigate } = useRouter()
  const { pricingRules, suppliers, addPricingRule, updatePricingRule, deletePricingRule } = useStore()
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<PricingRule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [simCost, setSimCost] = useState(1000)
  const [simRuleId, setSimRuleId] = useState<string>('')
  const [form, setForm] = useState({
    supplier: '',
    markup: 20,
    minMargin: 12,
    campaign: '',
    country: 'Global',
    currency: 'USD',
    partnerLevel: 'All',
  })

  const filtered = pricingRules.filter(r =>
    search === '' ||
    r.supplier.toLowerCase().includes(search.toLowerCase()) ||
    r.country.toLowerCase().includes(search.toLowerCase()) ||
    r.campaign.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditing(null)
    setForm({
      supplier: suppliers[0]?.name ?? '',
      markup: 20,
      minMargin: 12,
      campaign: '',
      country: 'Global',
      currency: 'USD',
      partnerLevel: 'All',
    })
    setDialogOpen(true)
  }

  const openEdit = (r: PricingRule) => {
    setEditing(r)
    setForm({
      supplier: r.supplier,
      markup: r.markup,
      minMargin: r.minMargin,
      campaign: r.campaign,
      country: r.country,
      currency: r.currency,
      partnerLevel: r.partnerLevel,
    })
    setDialogOpen(true)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const campaign = form.campaign.trim() === '' ? '—' : form.campaign.trim()
    if (editing) {
      updatePricingRule(editing.id, {
        supplier: form.supplier,
        markup: form.markup,
        minMargin: form.minMargin,
        campaign,
        country: form.country,
        currency: form.currency,
        partnerLevel: form.partnerLevel,
      })
    } else {
      addPricingRule({
        supplier: form.supplier,
        markup: form.markup,
        minMargin: form.minMargin,
        campaign,
        country: form.country,
        currency: form.currency,
        partnerLevel: form.partnerLevel,
      })
    }
    setDialogOpen(false)
  }

  // Stats
  const avgMarkup = pricingRules.length
    ? pricingRules.reduce((s, r) => s + r.markup, 0) / pricingRules.length
    : 0
  const avgMargin = pricingRules.length
    ? pricingRules.reduce((s, r) => s + r.minMargin, 0) / pricingRules.length
    : 0
  const activeCampaigns = new Set(
    pricingRules.map(r => r.campaign).filter(c => c && c !== '—')
  ).size

  const stats = [
    { label: 'Total Rules', value: pricingRules.length, icon: Tag, sub: `${suppliers.length} suppliers` },
    { label: 'Avg Markup', value: `${avgMarkup.toFixed(1)}%`, icon: Percent, sub: 'Across all rules' },
    { label: 'Avg Min Margin', value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, sub: 'Margin floor' },
    { label: 'Active Campaigns', value: activeCampaigns, icon: Award, sub: 'Distinct campaigns' },
  ]

  // Margin simulator
  const simRule = pricingRules.find(r => r.id === simRuleId) ?? pricingRules[0] ?? null
  const simMarkupAmount = simRule ? (simCost * simRule.markup) / 100 : 0
  const simSellPrice = simCost + simMarkupAmount
  const simMarginPct = simSellPrice > 0 ? (simMarkupAmount / simSellPrice) * 100 : 0
  const simMeetsFloor = simRule ? simMarginPct >= simRule.minMargin : false

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="pricing"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Pricing Engine"
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
          <h1 className="text-2xl font-bold tracking-tight">Pricing Rules</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure markups, minimum margins, and partner-level pricing across the platform.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Rule
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

      {/* Search */}
      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by supplier, country, campaign or ID…"
            className="pl-9"
          />
        </div>
      </div>

      {/* Pricing rules table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Rule ID</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Markup %</th>
                <th className="px-5 py-3 font-medium">Min Margin</th>
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 font-medium">Currency</th>
                <th className="px-5 py-3 font-medium">Partner Level</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((rule) => (
                <tr key={rule.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{rule.id}</td>
                  <td className="px-5 py-3 font-medium">{rule.supplier}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[rule.markup]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(v) => updatePricingRule(rule.id, { markup: v[0] })}
                        className="w-20"
                      />
                      <span className="min-w-[2.5rem] font-semibold tabular-nums">{rule.markup}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={rule.minMargin < 12 ? 'text-amber-600 font-medium' : 'font-medium'}>
                      {rule.minMargin}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {rule.campaign === '—' || !rule.campaign ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {rule.campaign}
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{rule.country}</td>
                  <td className="px-5 py-3"><code className="text-xs">{rule.currency}</code></td>
                  <td className="px-5 py-3">
                    <Badge variant="outline">{rule.partnerLevel}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(rule)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(rule.id)}>
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
            <Tag className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No pricing rules found.</p>
          </div>
        )}
      </Card>

      {/* Margin Simulator */}
      <Card className="mt-6 p-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">Margin Simulator</h3>
            <p className="text-xs text-muted-foreground">Test a supplier cost against any pricing rule.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Pricing Rule</Label>
              <select
                value={simRule?.id ?? ''}
                onChange={(e) => setSimRuleId(e.target.value)}
                className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {pricingRules.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {r.supplier} ({r.markup}% markup)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Supplier Cost</Label>
                <span className="text-sm font-semibold tabular-nums">
                  ${simCost.toLocaleString()}.00
                </span>
              </div>
              <Slider
                value={[simCost]}
                min={0}
                max={10000}
                step={50}
                onValueChange={(v) => setSimCost(v[0])}
                className="mt-3"
              />
              <Input
                type="number"
                min={0}
                value={simCost}
                onChange={(e) => setSimCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-2"
              />
            </div>
            {simRule && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border p-3">
                  <div className="text-muted-foreground">Markup</div>
                  <div className="mt-1 text-base font-semibold">{simRule.markup}%</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-muted-foreground">Min Margin Floor</div>
                  <div className="mt-1 text-base font-semibold">{simRule.minMargin}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Calculation */}
          <div className="rounded-lg bg-muted/30 p-5">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="h-4 w-4" />
              Calculation
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {simRule ? `Using ${simRule.supplier} rule (${simRule.id})` : 'Select a rule to begin'}
            </p>
            <div className="mt-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supplier cost</span>
                <span>${simCost.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  + Markup ({simRule?.markup ?? 0}%)
                </span>
                <span>+${simMarkupAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Selling price</span>
                <span className="text-base">${simSellPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Resulting margin</span>
                <span>{simMarginPct.toFixed(1)}%</span>
              </div>
            </div>
            <div className={`mt-4 rounded-md border p-3 text-xs ${simMeetsFloor ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700' : 'border-rose-500/30 bg-rose-500/5 text-rose-700'}`}>
              {simRule
                ? simMeetsFloor
                  ? `✓ Meets the minimum margin floor of ${simRule.minMargin}%`
                  : `✗ Below the minimum margin floor of ${simRule.minMargin}% — increase markup`
                : 'Select a pricing rule to evaluate the margin.'}
            </div>
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Pricing Rule' : 'Add Pricing Rule'}</DialogTitle>
            <DialogDescription>{editing ? 'Update rule configuration' : 'Define how prices are calculated for a supplier & segment'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Markup % *</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={form.markup}
                  onChange={(e) => setForm(p => ({ ...p, markup: parseFloat(e.target.value) || 0 }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Min Margin % *</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={form.minMargin}
                  onChange={(e) => setForm(p => ({ ...p, minMargin: parseFloat(e.target.value) || 0 }))}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Campaign</Label>
              <Input
                value={form.campaign}
                onChange={(e) => setForm(p => ({ ...p, campaign: e.target.value }))}
                placeholder="e.g. Summer Sports 2026 (optional)"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Country</Label>
                <select
                  value={form.country}
                  onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Currency</Label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm(p => ({ ...p, currency: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-xs">Partner Level</Label>
                <select
                  value={form.partnerLevel}
                  onChange={(e) => setForm(p => ({ ...p, partnerLevel: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {PARTNER_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {editing ? 'Save changes' : 'Add rule'}
              </Button>
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
              Delete pricing rule?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the pricing rule. Any future transactions will fall back to the supplier default.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) deletePricingRule(deleteId); setDeleteId(null) }}
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
