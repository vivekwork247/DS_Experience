'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { B2B_GROUPS } from '@/components/pages/b2b-groups'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency } from '@/lib/mock-data'
import { Bell, Download, TrendingUp, DollarSign, Ticket, Users, BarChart3 } from 'lucide-react'

export function B2BReportsPage() {
  const { navigate } = useRouter()
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const data = [
    { month: 'Sep', revenue: 38000, bookings: 38 },
    { month: 'Oct', revenue: 52000, bookings: 52 },
    { month: 'Nov', revenue: 44000, bookings: 44 },
    { month: 'Dec', revenue: 68000, bookings: 68 },
    { month: 'Jan', revenue: 76000, bookings: 76 },
    { month: 'Feb', revenue: 92000, bookings: 92 },
  ]
  const max = Math.max(...data.map(d => d.revenue))

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-reports"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Reports & Analytics"
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
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your B2B performance and revenue.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 rounded-md border border-border p-1">
            {(['7d', '30d', '90d', '1y'] as const).map(r => (
              <button key={r} onClick={() => setRange(r)} className={`rounded px-2.5 py-1 text-xs ${range === r ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>{r}</button>
            ))}
          </div>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Revenue', value: formatCurrency(92000), delta: '+18.4%', up: true, icon: DollarSign },
          { label: 'Bookings', value: '92', delta: '+12', up: true, icon: Ticket },
          { label: 'Customers', value: '47', delta: '+5', up: true, icon: Users },
          { label: 'Avg Order', value: formatCurrency(1000), delta: '+4.2%', up: true, icon: TrendingUp },
        ].map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-medium text-emerald-600">{s.delta}</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">+18.4%</Badge>
          </div>
          <div className="mt-6 flex h-56 items-end justify-between gap-3">
            {data.map((d) => (
              <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full">
                  <div className="w-full rounded-t bg-gradient-to-t from-foreground to-foreground/60 transition-all hover:from-accent hover:to-accent/70" style={{ height: `${(d.revenue / max) * 200}px` }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">
                    {formatCurrency(d.revenue)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top categories */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <BarChart3 className="h-4 w-4" />
            Top Categories
          </h3>
          <div className="space-y-3">
            {[
              { cat: 'Sports', pct: 42, color: 'bg-amber-500' },
              { cat: 'Concerts', pct: 28, color: 'bg-rose-500' },
              { cat: 'Formula 1', pct: 18, color: 'bg-red-500' },
              { cat: 'Cricket', pct: 8, color: 'bg-emerald-500' },
              { cat: 'Hospitality', pct: 4, color: 'bg-purple-500' },
            ].map(c => (
              <div key={c.cat}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{c.cat}</span>
                  <span className="text-muted-foreground">{c.pct}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top events */}
      <Card className="mt-6">
        <div className="border-b border-border p-5">
          <h3 className="font-semibold">Top Performing Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3 font-medium">Revenue</th>
                <th className="px-5 py-3 font-medium">Commission</th>
                <th className="px-5 py-3 font-medium">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { event: 'UEFA Champions League Final 2026', bookings: 18, revenue: 41400, commission: 7452, conv: 68 },
                { event: 'Monaco Grand Prix 2026', bookings: 12, revenue: 28800, commission: 4320, conv: 54 },
                { event: 'Coldplay London', bookings: 24, revenue: 9600, commission: 1920, conv: 72 },
                { event: 'El Clásico', bookings: 9, revenue: 12600, commission: 2268, conv: 48 },
                { event: 'IPL Final 2026', bookings: 16, revenue: 4960, commission: 496, conv: 65 },
              ].map(e => (
                <tr key={e.event} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{e.event}</td>
                  <td className="px-5 py-3">{e.bookings}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(e.revenue)}</td>
                  <td className="px-5 py-3 text-emerald-700">{formatCurrency(e.commission)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-foreground" style={{ width: `${e.conv}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{e.conv}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  )
}
