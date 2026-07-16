'use client'

import { useState, useMemo } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ADMIN_GROUPS } from '@/components/pages/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { REVENUE_CHART, COUNTRY_DATA, formatCurrency } from '@/lib/mock-data'
import {
  Bell, Download, FileSpreadsheet, FileText, TrendingUp, TrendingDown,
  DollarSign, Ticket, Users, Receipt, Calendar, BarChart3, Trophy, Globe
} from 'lucide-react'

type DateRange = '7d' | '30d' | '90d' | '1y'

export function ReportsPage() {
  const { navigate } = useRouter()
  const { bookings, customers, suppliers, addToast } = useStore()
  const [range, setRange] = useState<DateRange>('30d')

  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((s, b) => s + b.amount, 0)
    const totalBookings = bookings.length
    const activeCustomers = customers.filter(c => c.status === 'Active').length
    const avgOrder = totalBookings > 0 ? totalRevenue / totalBookings : 0
    return { totalRevenue, totalBookings, activeCustomers, avgOrder }
  }, [bookings, customers])

  const topSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [suppliers])
  const maxSupplierRev = topSuppliers[0]?.revenue || 1

  const topEvents = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>()
    bookings.forEach(b => {
      const cur = map.get(b.eventName) || { count: 0, revenue: 0 }
      cur.count += b.qty
      cur.revenue += b.amount
      map.set(b.eventName, cur)
    })
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [bookings])
  const maxEventCount = topEvents[0]?.count || 1

  const maxRevenue = Math.max(...REVENUE_CHART.map(m => m.revenue), 1)
  const maxCountryRev = Math.max(...COUNTRY_DATA.map(c => c.revenue), 1)

  const currencyDist = useMemo(() => {
    const map = new Map<string, { volume: number; count: number }>()
    bookings.forEach(b => {
      const cur = map.get(b.currency) || { volume: 0, count: 0 }
      cur.volume += b.amount
      cur.count += 1
      map.set(b.currency, cur)
    })
    const total = Array.from(map.values()).reduce((s, v) => s + v.volume, 0) || 1
    return Array.from(map.entries())
      .map(([cur, v]) => ({ cur, ...v, share: Math.round((v.volume / total) * 100) }))
      .sort((a, b) => b.volume - a.volume)
  }, [bookings])

  const exportToast = (fmt: 'PDF' | 'CSV' | 'Excel') => {
    addToast({ title: `Exporting ${fmt} report`, description: `Last ${range} · ${stats.totalBookings} bookings`, type: 'success' })
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="reports"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Reports & Analytics"
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
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sales, supplier, and revenue analytics across the platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => exportToast('PDF')}>
            <FileText className="h-4 w-4" />Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => exportToast('CSV')}>
            <Download className="h-4 w-4" />Export CSV
          </Button>
          <Button className="gap-2" onClick={() => exportToast('Excel')}>
            <FileSpreadsheet className="h-4 w-4" />Export Excel
          </Button>
        </div>
      </div>

      {/* Date range selector */}
      <div className="mb-6 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Range:</span>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(['7d', '30d', '90d', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === r ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === '7d' ? '7 days' : r === '30d' ? '30 days' : r === '90d' ? '90 days' : '1 year'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, sub: 'Across all bookings', up: true, delta: '+18.4%' },
          { label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), icon: Ticket, sub: 'Confirmed + pending', up: true, delta: '+12.8%' },
          { label: 'Active Customers', value: stats.activeCustomers.toLocaleString(), icon: Users, sub: 'Currently active', up: true, delta: '+4.6%' },
          { label: 'Avg Order Value', value: formatCurrency(stats.avgOrder), icon: Receipt, sub: 'Per booking', up: false, delta: '-1.2%' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4">
              <div className="flex items-start justify-between">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className={`text-[10px] ${s.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {s.up ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />} {s.delta}
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{s.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Revenue chart */}
      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-4 w-4" />
              Revenue Trend
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Monthly revenue and bookings · last 6 months</p>
          </div>
          <Badge variant="secondary">{range}</Badge>
        </div>
        <div className="mt-6 flex h-64 items-end justify-between gap-3">
          {REVENUE_CHART.map((m) => (
            <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
              <div className="text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100">{formatCurrency(m.revenue)}</div>
              <div className="flex w-full items-end justify-center">
                <div
                  className="w-full max-w-[48px] rounded-t bg-gradient-to-t from-foreground to-foreground/60 transition-all hover:from-accent hover:to-accent/70"
                  style={{ height: `${(m.revenue / maxRevenue) * 220}px` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{m.month}</span>
              <div className="text-[10px] text-muted-foreground">{m.bookings} bk</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top countries + Currency distribution */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Globe className="h-4 w-4" />
            Top Countries by Revenue
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Geographic distribution of bookings</p>
          <div className="mt-5 space-y-4">
            {COUNTRY_DATA.map((c) => (
              <div key={c.country}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.country}</span>
                  <span className="text-muted-foreground">{formatCurrency(c.revenue)} · {c.bookings} bk</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-foreground to-accent transition-all"
                    style={{ width: `${(c.revenue / maxCountryRev) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <DollarSign className="h-4 w-4" />
            Currency Distribution
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Transaction volume by currency</p>
          <div className="mt-5 space-y-3">
            {currencyDist.map((c) => (
              <div key={c.cur} className="grid grid-cols-[60px_1fr_auto] items-center gap-3 rounded-lg border border-border p-3 text-sm">
                <div className="font-semibold">{c.cur}</div>
                <div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(c.volume, c.cur)} · {c.count} txns</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-foreground/70" style={{ width: `${c.share}%` }} />
                  </div>
                </div>
                <Badge variant="secondary">{c.share}%</Badge>
              </div>
            ))}
            {currencyDist.length === 0 && (
              <div className="grid place-items-center py-8 text-center">
                <DollarSign className="h-6 w-6 text-muted-foreground/50" />
                <p className="mt-2 text-xs text-muted-foreground">No transaction data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Top suppliers + Top events */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Trophy className="h-4 w-4" />
            Top Suppliers by Revenue
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Top 5 contributors</p>
          <div className="mt-5 space-y-4">
            {topSuppliers.map((s, i) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="text-muted-foreground">{formatCurrency(s.revenue)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-foreground/70'} transition-all`}
                    style={{ width: `${(s.revenue / maxSupplierRev) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topSuppliers.length === 0 && (
              <div className="grid place-items-center py-8 text-center">
                <Trophy className="h-6 w-6 text-muted-foreground/50" />
                <p className="mt-2 text-xs text-muted-foreground">No supplier data available</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <Ticket className="h-4 w-4" />
            Top Events by Bookings
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Computed from live bookings</p>
          <div className="mt-5 space-y-4">
            {topEvents.map((e, i) => (
              <div key={e.name}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {i + 1}
                    </span>
                    <span className="font-medium line-clamp-1">{e.name}</span>
                  </div>
                  <span className="text-muted-foreground">{e.count} tkts · {formatCurrency(e.revenue)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-foreground/70'} transition-all`}
                    style={{ width: `${(e.count / maxEventCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topEvents.length === 0 && (
              <div className="grid place-items-center py-8 text-center">
                <Ticket className="h-6 w-6 text-muted-foreground/50" />
                <p className="mt-2 text-xs text-muted-foreground">No booking data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
