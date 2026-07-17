'use client'

import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell, SidebarGroup } from '@/components/layout/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { REVENUE_CHART, COUNTRY_DATA, ADMIN_BOOKINGS, SUPPLIERS, formatCurrency, formatDate } from '@/lib/mock-data'
import {
  LayoutDashboard, Truck, Boxes, DollarSign, ShoppingCart, Users,
  Handshake, Gift, CreditCard, BarChart3, FileText, Settings, Bell,
  TrendingUp, TrendingDown, AlertTriangle, Activity, Globe,
  ArrowUpRight, ArrowDownRight, ChevronRight, Search
} from 'lucide-react'

export const ADMIN_GROUPS: SidebarGroup[] = [
  {
    items: [
      { label: 'Dashboard', route: 'admin-dashboard', icon: LayoutDashboard },
      { label: 'Suppliers', route: 'suppliers', icon: Truck },
      { label: 'Inventory', route: 'inventory', icon: Boxes },
      { label: 'Pricing', route: 'pricing', icon: DollarSign },
      { label: 'Orders', route: 'admin-bookings', icon: ShoppingCart },
      { label: 'Customers', route: 'customers', icon: Users },
      { label: 'Partners', route: 'partners', icon: Handshake },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Rewards', route: 'rewards-mgmt', icon: Gift },
      { label: 'Membership Cards', route: 'membership-cards', icon: CreditCard },
      { label: 'Payments', route: 'payments', icon: CreditCard },
      { label: 'Reports', route: 'reports', icon: BarChart3 },
      { label: 'CMS', route: 'cms', icon: FileText },
      { label: 'Settings', route: 'settings', icon: Settings },
    ],
  },
]

export function AdminDashboardPage() {
  const { navigate } = useRouter()

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="admin-dashboard"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Admin Dashboard"
      topBarRight={
        <>
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything…"
              className="h-9 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm"
            />
          </div>
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
      {/* Top cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Bookings Today', value: '248', delta: '+12.4%', up: true, icon: ShoppingCart },
          { label: 'Revenue', value: '$524K', delta: '+18.4%', up: true, icon: DollarSign },
          { label: 'Pending Orders', value: '34', delta: '+8', up: false, icon: Clock },
          { label: 'Supplier Errors', value: '2', delta: '-3', up: true, icon: AlertTriangle, warn: true },
          { label: 'Low Margin Alerts', value: '7', delta: '+2', up: false, icon: TrendingDown, warn: true },
          { label: 'Top Events', value: '12', delta: 'live', up: true, icon: Activity },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <Icon className={`h-4 w-4 ${stat.warn ? 'text-amber-600' : 'text-muted-foreground'}`} />
                <span className={`flex items-center gap-0.5 text-[10px] font-medium ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.delta}
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold">{stat.value}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </Card>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue & Bookings</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Bookings</span>
            </div>
          </div>
          <div className="mt-6 flex h-56 items-end justify-between gap-2">
            {REVENUE_CHART.map((m) => {
              const maxRev = 600000
              const maxBkg = 1000
              return (
                <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1">
                    <div
                      className="w-1/2 max-w-[24px] rounded-t bg-foreground transition-all hover:from-accent"
                      style={{ height: `${(m.revenue / maxRev) * 200}px` }}
                      title={`Revenue: ${formatCurrency(m.revenue)}`}
                    />
                    <div
                      className="w-1/2 max-w-[24px] rounded-t bg-accent transition-all hover:bg-accent/70"
                      style={{ height: `${(m.bookings / maxBkg) * 200}px` }}
                      title={`Bookings: ${m.bookings}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.month}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Top countries */}
        <Card className="p-5">
          <h3 className="font-semibold">Top Countries</h3>
          <p className="text-xs text-muted-foreground">By bookings volume</p>
          <div className="mt-5 space-y-3">
            {COUNTRY_DATA.slice(0, 5).map((c, i) => {
              const max = COUNTRY_DATA[0].bookings
              return (
                <div key={c.country}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      {c.country}
                    </span>
                    <span className="text-muted-foreground">{c.bookings} · {formatCurrency(c.revenue)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${i === 0 ? 'bg-accent' : 'bg-foreground/60'}`}
                      style={{ width: `${(c.bookings / max) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent activity & supplier status */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h3 className="font-semibold">Recent Orders</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('admin-bookings')}>
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Booking</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Supplier</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ADMIN_BOOKINGS.slice(0, 5).map((b) => (
                  <tr key={b.id} className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => navigate('admin-bookings')}>
                    <td className="px-5 py-3">
                      <div className="font-mono text-xs">{b.id}</div>
                      <div className="text-xs text-muted-foreground">{b.eventName}</div>
                    </td>
                    <td className="px-5 py-3">{b.customerName}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{b.supplier}</td>
                    <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className={
                        b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                        b.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                        b.status === 'Refunded' ? 'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15' :
                        'bg-muted text-muted-foreground hover:bg-muted'
                      }>{b.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Supplier status */}
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Supplier Status</h3>
          <div className="space-y-3">
            {SUPPLIERS.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${s.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <div className="text-xs font-medium">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {s.primaryCategoryLabel} · {s.lastSync}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={
                  s.status === 'Connected' ? 'border-emerald-500/30 text-emerald-600' : 'border-rose-500/30 text-rose-600'
                }>
                  {s.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate('suppliers')}>
            Manage suppliers
          </Button>
        </Card>
      </div>

      {/* Currencies & alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Currency Distribution</h3>
          <div className="space-y-2.5">
            {[
              { cur: 'USD', pct: 48, color: 'bg-emerald-500' },
              { cur: 'EUR', pct: 24, color: 'bg-amber-500' },
              { cur: 'GBP', pct: 18, color: 'bg-purple-500' },
              { cur: 'AED', pct: 7, color: 'bg-rose-500' },
              { cur: 'SGD', pct: 3, color: 'bg-cyan-500' },
            ].map((c) => (
              <div key={c.cur} className="flex items-center gap-3 text-xs">
                <span className="w-10 font-medium">{c.cur}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
                <span className="w-10 text-right text-muted-foreground">{c.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border-l-2 border-rose-500 bg-rose-500/5 p-3">
              <div className="text-xs font-medium">Hospitality Suites Ltd — sync failed</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">3 retries · last error 6h ago</div>
            </div>
            <div className="rounded-lg border-l-2 border-amber-500 bg-amber-500/5 p-3">
              <div className="text-xs font-medium">7 events below 8% margin threshold</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Requires pricing review</div>
            </div>
            <div className="rounded-lg border-l-2 border-amber-500 bg-amber-500/5 p-3">
              <div className="text-xs font-medium">Currency rate refresh due (SGD, AED)</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Last refresh 2h ago</div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('suppliers')}>
              <Truck className="h-3.5 w-3.5" />
              Add Supplier
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('inventory')}>
              <Boxes className="h-3.5 w-3.5" />
              Add Inventory
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('pricing')}>
              <DollarSign className="h-3.5 w-3.5" />
              New Pricing Rule
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('cms')}>
              <FileText className="h-3.5 w-3.5" />
              Edit CMS
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('reports')}>
              <BarChart3 className="h-3.5 w-3.5" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('settings')}>
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
