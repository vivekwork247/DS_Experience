'use client'

import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell, SidebarGroup } from '@/components/layout/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LayoutDashboard, Search, Ticket, Users, FileText, Gift, BarChart3,
  UserCog, Building2, Bell, Star, Crown, TrendingUp, Award, Sparkles, ArrowRight
} from 'lucide-react'

const groups: SidebarGroup[] = [
  {
    items: [
      { label: 'Dashboard', route: 'b2b-dashboard', icon: LayoutDashboard },
      { label: 'Search Events', route: 'events', icon: Search },
      { label: 'Bookings', route: 'b2b-dashboard', icon: Ticket },
      { label: 'Customers', route: 'b2b-dashboard', icon: Users },
      { label: 'Invoices', route: 'b2b-dashboard', icon: FileText },
      { label: 'Rewards', route: 'rewards', icon: Gift },
      { label: 'Reports', route: 'b2b-dashboard', icon: BarChart3 },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Users', route: 'user-management', icon: UserCog },
      { label: 'Company Settings', route: 'b2b-dashboard', icon: Building2 },
    ],
  },
]

const TIERS = [
  { name: 'Silver', min: 0, max: 1000, color: 'from-slate-400 to-slate-500', benefits: ['Standard pricing', 'Email support', 'Monthly reports'] },
  { name: 'Gold', min: 1000, max: 2000, color: 'from-amber-400 to-amber-500', benefits: ['5% better pricing', 'Priority support', 'Weekly reports', 'Credit line $60K'] },
  { name: 'Platinum', min: 2000, max: 5000, color: 'from-purple-400 to-fuchsia-500', benefits: ['10% better pricing', 'Dedicated account manager', 'Real-time inventory', 'Credit line $250K', 'Exclusive inventory'] },
]

const POINTS_HISTORY = [
  { date: '2026-02-18', action: 'Booking #BK-2026-00211', points: +120, type: 'earn' },
  { date: '2026-02-15', action: 'Campaign bonus — F1 boost', points: +80, type: 'earn' },
  { date: '2026-02-10', action: 'Booking #BK-2026-00197', points: +95, type: 'earn' },
  { date: '2026-02-05', action: 'Quarterly tier review', points: +50, type: 'earn' },
  { date: '2026-01-28', action: 'Booking refund #BK-2025-118291', points: -45, type: 'redeem' },
  { date: '2026-01-22', action: 'Booking #BK-2026-00184', points: +145, type: 'earn' },
  { date: '2026-01-15', action: 'Manual adjustment — Q4 promo', points: +200, type: 'earn' },
]

export function RewardsPage() {
  const { navigate } = useRouter()
  const currentPoints = 1240
  const nextTier = TIERS[2]
  const progressPct = ((currentPoints - 1000) / (nextTier.min - 1000)) * 100

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={groups}
      currentRoute="rewards"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Rewards & Loyalty"
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
      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-foreground via-foreground to-foreground/80 p-8 text-background">
          <div className="absolute right-0 top-0 h-40 w-40 -translate-y-12 translate-x-12 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/60">
                <Crown className="h-3.5 w-3.5 text-accent" />
                Current Tier
              </div>
              <h2 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight">
                Gold Seller
                <Badge className="bg-accent text-accent-foreground hover:bg-accent">Active</Badge>
              </h2>
              <p className="mt-2 text-sm text-background/70">
                You&apos;ve earned <span className="font-semibold text-accent">1,240 reward points</span>. Reach 2,000 to unlock Platinum tier.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-background/60">Total Points</div>
              <div className="mt-1 text-5xl font-bold">{currentPoints.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress to next tier */}
          <div className="relative mt-8">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-background/60">Gold · 1,000 pts</span>
              <span className="font-medium text-accent">760 pts to Platinum</span>
              <span className="text-background/60">Platinum · 2,000 pts</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-background/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tier ladder */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Seller Tier Ladder</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((tier, i) => {
            const isCurrent = tier.name === 'Gold'
            return (
              <Card
                key={tier.name}
                className={`relative overflow-hidden p-6 ${isCurrent ? 'border-2 border-accent shadow-md' : ''}`}
              >
                {isCurrent && (
                  <div className="absolute right-3 top-3">
                    <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Current
                    </Badge>
                  </div>
                )}
                <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${tier.color} text-white`}>
                  {tier.name === 'Platinum' ? <Crown className="h-6 w-6" /> : tier.name === 'Gold' ? <Award className="h-6 w-6" /> : <Star className="h-6 w-6" />}
                </div>
                <h4 className="mt-4 text-lg font-semibold">{tier.name}</h4>
                <div className="mt-1 text-xs text-muted-foreground">{tier.min.toLocaleString()} – {tier.max.toLocaleString()} points</div>
                <Separator className="my-4" />
                <ul className="space-y-2">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 text-emerald-600">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Benefits grid */}
      <Card className="mt-6 p-6">
        <h3 className="mb-4 text-lg font-semibold">Your Gold Tier Benefits</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, label: 'Priority Support', desc: '24/7 dedicated partner line with sub-2hr response SLA.' },
            { icon: Award, label: 'Better Pricing', desc: '5% discount on all inventory vs standard B2B rates.' },
            { icon: Sparkles, label: 'Exclusive Inventory', desc: 'Access to limited-availability hospitality suites.' },
            { icon: Crown, label: 'Credit Line', desc: '$60K revolving credit line with net-30 payment terms.' },
          ].map((b) => {
            const Icon = b.icon
            return (
              <div key={b.label} className="rounded-lg border border-border p-4">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-accent/15">
                  <Icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="mt-3 text-sm font-semibold">{b.label}</div>
                <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Points History */}
      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-semibold">Points History</h3>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Export <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 text-right font-medium">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {POINTS_HISTORY.map((h, i) => (
                <tr key={i} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 text-xs text-muted-foreground">{h.date}</td>
                  <td className="px-5 py-3 font-medium">{h.action}</td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={h.type === 'earn' ? 'border-emerald-500/30 text-emerald-600' : 'border-rose-500/30 text-rose-600'}>
                      {h.type === 'earn' ? 'Earned' : 'Redeemed'}
                    </Badge>
                  </td>
                  <td className={`px-5 py-3 text-right font-semibold ${h.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {h.points > 0 ? '+' : ''}{h.points}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td colSpan={3} className="px-5 py-3 text-right text-sm font-semibold">Current Balance</td>
                <td className="px-5 py-3 text-right text-base font-bold">{currentPoints.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </DashboardShell>
  )
}
