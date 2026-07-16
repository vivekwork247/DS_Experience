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
import { useStore, Transaction } from '@/lib/store'
import { formatCurrency } from '@/lib/mock-data'
import {
  Bell, Search, Download, CreditCard, RotateCcw, AlertTriangle,
  RefreshCw, DollarSign, TrendingUp, CheckCircle2, Eye, Server
} from 'lucide-react'

type StatusFilter = 'All' | 'Captured' | 'Pending' | 'Refunded' | 'Chargeback'
type GatewayFilter = 'All' | 'Stripe' | 'Adyen' | 'Razorpay'

const GATEWAYS = ['Stripe', 'Adyen', 'Razorpay'] as const

const GATEWAY_COLORS: Record<string, string> = {
  Stripe: 'bg-indigo-500',
  Adyen: 'bg-emerald-500',
  Razorpay: 'bg-amber-500',
}

export function PaymentManagementPage() {
  const { navigate } = useRouter()
  const { transactions, updateTransaction, addToast } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [gatewayFilter, setGatewayFilter] = useState<GatewayFilter>('All')
  const [detail, setDetail] = useState<Transaction | null>(null)

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch =
      search === '' ||
      t.id.toLowerCase().includes(q) ||
      t.booking.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All' || t.status === statusFilter
    const matchGateway = gatewayFilter === 'All' || t.gateway === gatewayFilter
    return matchSearch && matchStatus && matchGateway
  })

  const capturedTotal = transactions
    .filter(t => t.status === 'Captured')
    .reduce((s, t) => s + (t.currency === 'USD' ? t.amount : t.amount * 0.85), 0)
  const refundedTotal = transactions
    .filter(t => t.status === 'Refunded')
    .reduce((s, t) => s + (t.currency === 'USD' ? t.amount : t.amount * 0.85), 0)
  const chargebacks = transactions.filter(t => t.status === 'Chargeback')
  const chargebackTotal = chargebacks.reduce((s, t) => s + (t.currency === 'USD' ? t.amount : t.amount * 0.85), 0)
  const netRevenue = capturedTotal - refundedTotal - chargebackTotal

  // Gateway breakdown
  const gatewayTotals = GATEWAYS.map((g) => {
    const txns = transactions.filter(t => t.gateway === g)
    const volume = txns
      .filter(t => t.status === 'Captured')
      .reduce((s, t) => s + (t.currency === 'USD' ? t.amount : t.amount * 0.85), 0)
    return { gateway: g, count: txns.length, volume }
  })
  const maxGatewayVolume = Math.max(...gatewayTotals.map(g => g.volume), 1)

  const handleAction = (txn: Transaction, action: 'refund' | 'chargeback' | 'capture') => {
    if (action === 'refund') {
      updateTransaction(txn.id, { status: 'Refunded' })
      addToast({ title: 'Transaction refunded', description: `${txn.id} → Refunded`, type: 'success' })
    } else if (action === 'chargeback') {
      updateTransaction(txn.id, { status: 'Chargeback' })
      addToast({ title: 'Chargeback recorded', description: `${txn.id} → Chargeback`, type: 'error' })
    } else if (action === 'capture') {
      updateTransaction(txn.id, { status: 'Captured' })
      addToast({ title: 'Payment captured', description: `${txn.id} → Captured`, type: 'success' })
    }
    // Sync detail view
    setDetail(prev => prev ? { ...prev, status: action === 'refund' ? 'Refunded' : action === 'chargeback' ? 'Chargeback' : 'Captured' } : prev)
  }

  const handleExport = () => {
    addToast({
      title: 'Export started',
      description: `Exporting ${filtered.length} transactions to CSV…`,
      type: 'info',
    })
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="payments"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Payment Management"
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
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor transactions, refunds, chargebacks, and gateway reconciliation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => addToast({ title: 'Reconciliation started', description: 'Comparing platform vs gateway records', type: 'info' })}>
            <RefreshCw className="h-4 w-4" />
            Reconcile
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Captured', value: formatCurrency(capturedTotal), icon: DollarSign, sub: `${transactions.filter(t => t.status === 'Captured').length} transactions`, color: 'text-emerald-600' },
          { label: 'Refunded', value: formatCurrency(refundedTotal), icon: RotateCcw, sub: `${transactions.filter(t => t.status === 'Refunded').length} refunds`, color: 'text-amber-600' },
          { label: 'Chargebacks', value: String(chargebacks.length), icon: AlertTriangle, sub: `${formatCurrency(chargebackTotal)} in dispute`, color: 'text-rose-600' },
          { label: 'Net Revenue', value: formatCurrency(netRevenue), icon: TrendingUp, sub: 'After refunds & disputes', color: 'text-emerald-600' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4">
              <Icon className={`h-4 w-4 ${s.color}`} />
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{s.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Gateway breakdown */}
      <Card className="mt-6 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Server className="h-4 w-4" />
          Gateway Breakdown
        </h3>
        <div className="space-y-3">
          {gatewayTotals.map((g) => (
            <div key={g.gateway}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${GATEWAY_COLORS[g.gateway]}`} />
                  <span className="font-medium">{g.gateway}</span>
                  <span className="text-muted-foreground">· {g.count} txns</span>
                </div>
                <span className="font-mono font-semibold">{formatCurrency(g.volume)}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${GATEWAY_COLORS[g.gateway]}`}
                  style={{ width: `${(g.volume / maxGatewayVolume) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, booking, or customer…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          {(['All', 'Captured', 'Pending', 'Refunded', 'Chargeback'] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
          <span className="ml-3 text-xs font-medium text-muted-foreground">Gateway:</span>
          {(['All', 'Stripe', 'Adyen', 'Razorpay'] as const).map((s) => (
            <Button
              key={s}
              variant={gatewayFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGatewayFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Gateway</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => setDetail(t)}
                >
                  <td className="px-5 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{t.booking}</td>
                  <td className="px-5 py-3">{t.customer}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(t.amount, t.currency)}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${GATEWAY_COLORS[t.gateway] || 'bg-slate-400'}`} />
                      <span className="text-xs">{t.gateway}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary" className={
                      t.status === 'Captured' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                      t.status === 'Refunded' ? 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15' :
                      t.status === 'Chargeback' ? 'bg-rose-700/15 text-rose-800 hover:bg-rose-700/15' :
                      'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15'
                    }>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {t.status === 'Captured' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-amber-600"
                          title="Refund"
                          onClick={() => handleAction(t, 'refund')}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Refund
                        </Button>
                      )}
                      {t.status === 'Pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-emerald-600"
                          title="Capture"
                          onClick={() => handleAction(t, 'capture')}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Capture
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View details" onClick={() => setDetail(t)}>
                        <Eye className="h-3.5 w-3.5" />
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
            <CreditCard className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No transactions match your filters.</p>
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {detail?.id} · {detail?.date}
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-foreground text-background">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{detail.customer}</div>
                    <div className="font-mono text-xs text-muted-foreground">{detail.id}</div>
                  </div>
                </div>
                <Badge variant="secondary" className={
                  detail.status === 'Captured' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                  detail.status === 'Refunded' ? 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15' :
                  detail.status === 'Chargeback' ? 'bg-rose-700/15 text-rose-800 hover:bg-rose-700/15' :
                  'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15'
                }>
                  {detail.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Booking</div>
                  <div className="mt-1 font-mono text-xs font-semibold">{detail.booking}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</div>
                  <div className="mt-1 font-semibold">{formatCurrency(detail.amount, detail.currency)}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment Method</div>
                  <div className="mt-1 font-semibold">{detail.method}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Gateway</div>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold">
                    <span className={`h-2 w-2 rounded-full ${GATEWAY_COLORS[detail.gateway] || 'bg-slate-400'}`} />
                    {detail.gateway}
                  </div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Currency</div>
                  <div className="mt-1 font-semibold">{detail.currency}</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</div>
                  <div className="mt-1 font-semibold">{detail.date}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {detail.status === 'Captured' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-amber-600"
                    onClick={() => handleAction(detail, 'refund')}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Refund Transaction
                  </Button>
                )}
                {detail.status === 'Pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-emerald-600"
                    onClick={() => handleAction(detail, 'capture')}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark as Captured
                  </Button>
                )}
                {detail.status !== 'Chargeback' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-rose-600"
                    onClick={() => handleAction(detail, 'chargeback')}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Mark as Chargeback
                  </Button>
                )}
                {detail.status === 'Chargeback' && (
                  <Badge variant="outline" className="border-rose-500/30 text-rose-600">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Dispute in progress
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
