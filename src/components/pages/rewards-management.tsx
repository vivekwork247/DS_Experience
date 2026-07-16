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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useStore, Partner } from '@/lib/store'
import {
  Bell, Gift, Crown, Star, Award, Plus, Pencil, Trash2,
  TrendingUp, Zap, Building2, ArrowUp, ArrowDown, Coins
} from 'lucide-react'

interface RewardRule {
  id: string
  tier: 'Silver' | 'Gold' | 'Platinum'
  multiplier: number
  discount: number
  freeShipping: boolean
  prioritySupport: boolean
}

const INITIAL_RULES: RewardRule[] = [
  { id: 'RR-001', tier: 'Silver', multiplier: 1.0, discount: 5, freeShipping: false, prioritySupport: false },
  { id: 'RR-002', tier: 'Gold', multiplier: 1.5, discount: 10, freeShipping: true, prioritySupport: false },
  { id: 'RR-003', tier: 'Platinum', multiplier: 2.0, discount: 15, freeShipping: true, prioritySupport: true },
]

const EMPTY_RULE: Omit<RewardRule, 'id'> = {
  tier: 'Silver',
  multiplier: 1.0,
  discount: 5,
  freeShipping: false,
  prioritySupport: false,
}

const tierColor = (tier: string) =>
  tier === 'Platinum'
    ? 'border-purple-500/30 text-purple-600'
    : tier === 'Gold'
      ? 'border-amber-500/30 text-amber-600'
      : 'border-slate-400/30 text-slate-600'

const tierBg = (tier: string) =>
  tier === 'Platinum'
    ? 'bg-gradient-to-br from-purple-400 to-fuchsia-500'
    : tier === 'Gold'
      ? 'bg-gradient-to-br from-amber-400 to-amber-500'
      : 'bg-gradient-to-br from-slate-300 to-slate-400'

export function RewardsManagementPage() {
  const { navigate } = useRouter()
  const { partners, updatePartner, addToast } = useStore()

  const [rules, setRules] = useState<RewardRule[]>(INITIAL_RULES)
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null)
  const [ruleForm, setRuleForm] = useState<Omit<RewardRule, 'id'>>(EMPTY_RULE)
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null)

  // Points adjustment dialog
  const [adjustPartner, setAdjustPartner] = useState<Partner | null>(null)
  const [adjustAmount, setAdjustAmount] = useState<number>(0)
  const [adjustReason, setAdjustReason] = useState('')

  const totalIssued = partners.reduce((s, p) => s + p.points, 0)
  const totalRedeemed = Math.round(totalIssued * 0.32)
  const membersByTier = (tier: string) => partners.filter(p => p.tier === tier).length

  const maxPoints = Math.max(...partners.map(p => p.points), 1)

  const openAddRule = () => {
    setEditingRule(null)
    setRuleForm(EMPTY_RULE)
    setRuleDialogOpen(true)
  }

  const openEditRule = (r: RewardRule) => {
    setEditingRule(r)
    setRuleForm({ tier: r.tier, multiplier: r.multiplier, discount: r.discount, freeShipping: r.freeShipping, prioritySupport: r.prioritySupport })
    setRuleDialogOpen(true)
  }

  const submitRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRule) {
      setRules(rs => rs.map(r => r.id === editingRule.id ? { ...r, ...ruleForm } : r))
      addToast({ title: 'Rule updated', description: `${ruleForm.tier} tier rule saved`, type: 'success' })
    } else {
      const newRule: RewardRule = {
        ...ruleForm,
        id: `RR-${String(rules.length + 1).padStart(3, '0')}`,
      }
      setRules(rs => [newRule, ...rs])
      addToast({ title: 'Rule created', description: `${newRule.tier} tier rule added`, type: 'success' })
    }
    setRuleDialogOpen(false)
  }

  const confirmDeleteRule = () => {
    if (deleteRuleId) {
      setRules(rs => rs.filter(r => r.id !== deleteRuleId))
      addToast({ title: 'Rule deleted', type: 'info' })
      setDeleteRuleId(null)
    }
  }

  const applyAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustPartner) return
    const newPoints = Math.max(0, adjustPartner.points + adjustAmount)
    updatePartner(adjustPartner.id, { points: newPoints })
    addToast({
      title: 'Points adjusted',
      description: `${adjustAmount > 0 ? '+' : ''}${adjustAmount} pts → ${adjustPartner.company}`,
      type: 'success',
    })
    setAdjustPartner(null)
    setAdjustAmount(0)
    setAdjustReason('')
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="rewards-mgmt"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Rewards Management"
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
          <h1 className="text-2xl font-bold tracking-tight">Rewards Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure tier rules, distribute points, and monitor partner loyalty.</p>
        </div>
        <Button className="gap-2" onClick={openAddRule}>
          <Plus className="h-4 w-4" />
          Add Reward Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Points Issued', value: totalIssued.toLocaleString(), icon: Coins, sub: 'Across all partners' },
          { label: 'Total Points Redeemed', value: totalRedeemed.toLocaleString(), icon: Gift, sub: `${Math.round((totalRedeemed / Math.max(1, totalIssued)) * 100)}% redemption rate` },
          { label: 'Active Rules', value: rules.length, icon: Zap, sub: 'Tier reward configs' },
          { label: 'Active Partners', value: partners.length, icon: Award, sub: `${membersByTier('Platinum')} platinum` },
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

      {/* Tier overview */}
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tier Configuration</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(['Silver', 'Gold', 'Platinum'] as const).map((tier) => {
          const rule = rules.find(r => r.tier === tier)
          const Icon = tier === 'Platinum' ? Crown : tier === 'Gold' ? Award : Star
          return (
            <Card key={tier} className="overflow-hidden">
              <div className={`${tierBg(tier)} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6" />
                  <span className="text-3xl font-bold">{membersByTier(tier)}</span>
                </div>
                <div className="mt-2 text-xl font-semibold">{tier}</div>
                <div className="text-xs opacity-80">{rule ? `${rule.multiplier}× points · ${rule.discount}% discount` : 'No rule set'}</div>
              </div>
              <div className="p-4 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Free shipping</span>
                  <Badge variant="outline" className={rule?.freeShipping ? 'border-emerald-500/30 text-emerald-600' : ''}>
                    {rule?.freeShipping ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Priority support</span>
                  <Badge variant="outline" className={rule?.prioritySupport ? 'border-emerald-500/30 text-emerald-600' : ''}>
                    {rule?.prioritySupport ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Rewards rules table */}
      <Card className="mt-6">
        <div className="border-b border-border p-5">
          <h3 className="font-semibold">Rewards Rules</h3>
          <p className="mt-1 text-xs text-muted-foreground">Configure multiplier, discount and benefits per tier.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Rule ID</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 font-medium">Points Multiplier</th>
                <th className="px-5 py-3 font-medium">Discount</th>
                <th className="px-5 py-3 font-medium">Free Shipping</th>
                <th className="px-5 py-3 font-medium">Priority Support</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rules.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={tierColor(r.tier)}>{r.tier}</Badge>
                  </td>
                  <td className="px-5 py-3 font-semibold">{r.multiplier}×</td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">
                      {r.discount}% off
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={r.freeShipping ? 'border-emerald-500/30 text-emerald-600' : 'text-muted-foreground'}>
                      {r.freeShipping ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={r.prioritySupport ? 'border-emerald-500/30 text-emerald-600' : 'text-muted-foreground'}>
                      {r.prioritySupport ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEditRule(r)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteRuleId(r.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rules.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <Zap className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No rules configured. Click "Add Reward Rule" to begin.</p>
          </div>
        )}
      </Card>

      {/* Points distribution chart + partners */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4" />
            Points Distribution by Partner
          </h3>
          <div className="space-y-2.5">
            {partners.slice(0, 8).map((p) => (
              <div key={p.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate pr-2 font-medium">{p.company}</span>
                  <span className="font-mono text-muted-foreground">{p.points.toLocaleString()} pts</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      p.tier === 'Platinum' ? 'bg-gradient-to-r from-purple-400 to-fuchsia-500' :
                      p.tier === 'Gold' ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                      'bg-gradient-to-r from-slate-300 to-slate-400'
                    }`}
                    style={{ width: `${(p.points / maxPoints) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total across all partners:</span>
            <span className="font-mono font-semibold text-foreground">{totalIssued.toLocaleString()} pts</span>
          </div>
        </Card>

        <Card>
          <div className="border-b border-border p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <Coins className="h-4 w-4" />
              Partner Points & Adjustments
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">Manually add or remove points from any partner.</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Partner</th>
                  <th className="px-5 py-3 font-medium">Tier</th>
                  <th className="px-5 py-3 font-medium">Points</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partners.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded bg-foreground text-background">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-medium leading-tight">{p.company}</div>
                          <div className="text-[10px] text-muted-foreground">{p.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={tierColor(p.tier)}>{p.tier}</Badge>
                    </td>
                    <td className="px-5 py-3 font-semibold">{p.points.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => {
                          setAdjustPartner(p)
                          setAdjustAmount(0)
                          setAdjustReason('')
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add/Edit Rule Dialog */}
      <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Edit Reward Rule' : 'Add Reward Rule'}</DialogTitle>
            <DialogDescription>
              {editingRule ? 'Update tier benefits configuration' : 'Configure rewards for a partner tier'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRule} className="space-y-3">
            <div>
              <Label className="text-xs">Tier *</Label>
              <select
                value={ruleForm.tier}
                onChange={(e) => setRuleForm(p => ({ ...p, tier: e.target.value as RewardRule['tier'] }))}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Points Multiplier</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={ruleForm.multiplier}
                  onChange={(e) => setRuleForm(p => ({ ...p, multiplier: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Discount (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={ruleForm.discount}
                  onChange={(e) => setRuleForm(p => ({ ...p, discount: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="space-y-2 rounded-md border border-border p-3">
              <label className="flex cursor-pointer items-center justify-between text-sm">
                <span>Free Shipping</span>
                <input
                  type="checkbox"
                  checked={ruleForm.freeShipping}
                  onChange={(e) => setRuleForm(p => ({ ...p, freeShipping: e.target.checked }))}
                  className="h-4 w-4 accent-foreground"
                />
              </label>
              <Separator />
              <label className="flex cursor-pointer items-center justify-between text-sm">
                <span>Priority Support</span>
                <input
                  type="checkbox"
                  checked={ruleForm.prioritySupport}
                  onChange={(e) => setRuleForm(p => ({ ...p, prioritySupport: e.target.checked }))}
                  className="h-4 w-4 accent-foreground"
                />
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRuleDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingRule ? 'Save changes' : 'Add rule'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Points adjustment Dialog */}
      <Dialog open={!!adjustPartner} onOpenChange={(o) => !o && setAdjustPartner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Partner Points</DialogTitle>
            <DialogDescription>
              {adjustPartner?.company} · Current balance: {adjustPartner?.points.toLocaleString()} pts
            </DialogDescription>
          </DialogHeader>
          {adjustPartner && (
            <form onSubmit={applyAdjustment} className="space-y-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={adjustAmount > 0 ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1"
                  onClick={() => setAdjustAmount(Math.abs(adjustAmount) || 50)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  Add points
                </Button>
                <Button
                  type="button"
                  variant={adjustAmount < 0 ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1"
                  onClick={() => setAdjustAmount(-(Math.abs(adjustAmount) || 50))}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                  Remove points
                </Button>
              </div>
              <div>
                <Label className="text-xs">Amount {adjustAmount >= 0 ? '(positive adds)' : '(negative deducts)'}</Label>
                <Input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value, 10) || 0)}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  New balance: <span className="font-semibold text-foreground">{Math.max(0, (adjustPartner.points + adjustAmount)).toLocaleString()} pts</span>
                </p>
              </div>
              <div>
                <Label className="text-xs">Reason</Label>
                <Input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Loyalty bonus, system correction"
                  className="mt-1"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAdjustPartner(null)}>Cancel</Button>
                <Button type="submit" disabled={adjustAmount === 0}>Apply adjustment</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Rule confirmation */}
      <AlertDialog open={!!deleteRuleId} onOpenChange={(o) => !o && setDeleteRuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete reward rule?</AlertDialogTitle>
            <AlertDialogDescription>
              Partners on this tier will lose the associated benefits. You can recreate the rule later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRule}
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
