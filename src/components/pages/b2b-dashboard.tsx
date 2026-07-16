'use client'

import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { B2B_GROUPS } from '@/components/pages/b2b-groups'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { ADMIN_BOOKINGS, EVENTS, formatCurrency, formatDate } from '@/lib/mock-data'
import {
  Bell, TrendingUp, DollarSign, Calendar,
  ArrowUpRight, Star, ChevronRight, ShoppingCart, Ticket, Gift
} from 'lucide-react'

export function B2BDashboardPage() {
  const { navigate } = useRouter()
  const { bookings } = useStore()

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-dashboard"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Partner Dashboard"
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
      {/* Top cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Current Tier', value: 'Gold Seller', icon: Star, sub: 'Next: Platinum', progress: 68, accent: 'text-amber-600' },
          { label: 'Reward Points', value: '1,240', icon: Gift, sub: '260 to Platinum', progress: 82, accent: 'text-accent-foreground' },
          { label: 'Total Bookings', value: '278', icon: Ticket, sub: '+24 this quarter', progress: 78, accent: 'text-emerald-600' },
          { label: 'Revenue (YTD)', value: '$26,000', icon: DollarSign, sub: '+18.4% vs last year', progress: 65, accent: 'text-emerald-600' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-md bg-muted">
                  <Icon className={`h-4 w-4 ${stat.accent}`} />
                </div>
              </div>
              <Progress value={stat.progress} className="mt-3 h-1.5" />
            </Card>
          )
        })}
      </div>

      {/* Revenue chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              +18.4%
            </div>
          </div>
          <div className="mt-6 flex h-48 items-end justify-between gap-3">
            {[
              { m: 'Sep', v: 38 }, { m: 'Oct', v: 52 }, { m: 'Nov', v: 44 },
              { m: 'Dec', v: 68 }, { m: 'Jan', v: 76 }, { m: 'Feb', v: 92 },
            ].map((b) => (
              <div key={b.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center">
                  <div
                    className="w-full max-w-[36px] rounded-t bg-gradient-to-t from-foreground to-foreground/60 transition-all hover:from-accent hover:to-accent/70"
                    style={{ height: `${b.v * 2}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{b.m}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Bell className="h-4 w-4" />
            Notifications
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 px-3 py-2">
              <div className="text-xs font-medium">You&apos;ve reached Gold tier!</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Enjoy 5% better pricing</div>
              <div className="mt-1 text-[10px] text-muted-foreground">2 hours ago</div>
            </div>
            <div className="rounded-lg border-l-2 border-accent bg-accent/5 px-3 py-2">
              <div className="text-xs font-medium">New F1 Monaco inventory available</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Premium paddock access added</div>
              <div className="mt-1 text-[10px] text-muted-foreground">5 hours ago</div>
            </div>
            <div className="rounded-lg border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
              <div className="text-xs font-medium">Invoice #INV-2026-118 due in 3 days</div>
              <div className="mt-1 text-[10px] text-muted-foreground">1 day ago</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-center text-xs">
            View all notifications <ChevronRight className="h-3 w-3" />
          </Button>
        </Card>
      </div>

      {/* Recent Bookings & Upcoming Renewals */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="font-semibold">Recent Bookings</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('b2b-bookings')}>
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Booking ID</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => navigate('b2b-bookings')}>
                    <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                    <td className="px-5 py-3 font-medium">{b.eventName}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.customerName}</td>
                    <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className={
                        b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                        b.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                        b.status === 'Refunded' ? 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15' :
                        'bg-muted text-muted-foreground hover:bg-muted'
                      }>
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Renewals */}
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            Upcoming Renewals
          </h3>
          <div className="space-y-3">
            {[
              { event: 'Wimbledon 2026', date: 'In 12 days', amount: 4200 },
              { event: 'F1 Singapore GP', date: 'In 28 days', amount: 8800 },
              { event: 'Champions League Final', date: 'In 45 days', amount: 12400 },
            ].map((r) => (
              <div key={r.event} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-amber-500/15">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">{r.event}</div>
                    <div className="text-[10px] text-muted-foreground">{r.date}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold">{formatCurrency(r.amount)}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full gap-2" onClick={() => navigate('b2b-events')}>
            <ShoppingCart className="h-4 w-4" />
            Browse new inventory
          </Button>
        </Card>
      </div>
    </DashboardShell>
  )
}
