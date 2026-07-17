'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell, SidebarGroup } from '@/components/layout/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { useStore } from '@/lib/store'
import { EVENTS, UPCOMING_BOOKINGS, PAST_BOOKINGS, formatCurrency, formatDate } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import {
  LayoutDashboard, Ticket, FileText, LifeBuoy, User, LogOut, Bell,
  Calendar, TrendingUp, CreditCard, CheckCircle2, Clock, ArrowRight,
  ChevronRight, Star, Heart, MapPin, Mail, Globe, Save, MessageSquare,
  AlertCircle, Download, ShoppingBag, Gift, Sparkles, Utensils,
  Plus, ArrowDownLeft, ArrowUpRight, X, Wine
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const groups: SidebarGroup[] = [
  {
    items: [
      { label: 'Dashboard', route: 'customer-dashboard', icon: LayoutDashboard },
      { label: 'My Bookings', route: 'customer-dashboard', icon: Ticket },
      { label: 'Rewards Wallet', route: 'customer-dashboard', icon: Gift },
      { label: 'Membership Cards', route: 'customer-dashboard', icon: CreditCard },
      { label: 'Restaurants', route: 'customer-dashboard', icon: Utensils },
      { label: 'Invoices', route: 'customer-dashboard', icon: FileText },
      { label: 'Wishlist', route: 'customer-dashboard', icon: Heart },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Support', route: 'customer-dashboard', icon: LifeBuoy },
      { label: 'Profile', route: 'customer-dashboard', icon: User },
      { label: 'Logout', route: 'home', icon: LogOut },
    ],
  },
]

export function CustomerDashboardPage() {
  const { navigate, route } = useRouter()
  const {
    user, wishlist, toggleWishlist, logout, addToast,
    rewardsBalance, rewardsHistory, redeemRewardPoints,
    membershipCards, ownedCardCodes, grantMembershipCard,
    restaurants, restaurantBookings, addRestaurantBooking, cancelRestaurantBooking,
  } = useStore()
  const fmt = useCurrencyFormatter()
  const initialTab = (route.params?.tab as string) || 'dashboard'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [profileOpen, setProfileOpen] = useState(false)
  const [grantCode, setGrantCode] = useState('')
  const [grantOpen, setGrantOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<typeof restaurants[0] | null>(null)
  const [bookingForm, setBookingForm] = useState({ date: '', pax: 2, time: '19:30', cardCode: '' })
  const [profile, setProfile] = useState({
    name: user?.name || 'James Whitmore',
    email: user?.email || 'james.whitmore@example.com',
    phone: '+44 20 7946 0958',
    country: 'United Kingdom',
    city: 'London',
    address: '42 Mayfair Lane, London W1K 5AB',
  })

  // If not logged in, prompt to login
  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/15">
            <User className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Sign in required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to access your customer dashboard, view bookings, manage your wishlist, and update your profile.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('home')}>Return Home</Button>
            <Button className="flex-1 gap-2" onClick={() => navigate('login')}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            New here?{' '}
            <button onClick={() => navigate('register')} className="font-medium text-foreground hover:underline">
              Create an account
            </button>
          </p>
        </Card>
      </div>
    )
  }

  const wishlistEvents = EVENTS.filter(e => wishlist.includes(e.id))
  const ownedCards = membershipCards.filter(c => ownedCardCodes.includes(c.code))

  const handleLogout = () => {
    logout()
    navigate('home')
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({ title: 'Profile updated', description: 'Your changes have been saved', type: 'success' })
    setProfileOpen(false)
  }

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault()
    grantMembershipCard(grantCode.toUpperCase())
    setGrantCode('')
    setGrantOpen(false)
  }

  const handleRestaurantBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRestaurant) return
    const baseAmount = selectedRestaurant.priceForTwo * Math.ceil(bookingForm.pax / 2)
    const card = bookingForm.cardCode ? membershipCards.find(c => c.code === bookingForm.cardCode) : null
    const discount = card
      ? Math.min(Math.round(baseAmount * card.discountPct / 100), card.maxDiscount ?? Infinity)
      : 0
    const finalAmount = Math.max(0, baseAmount - discount)
    addRestaurantBooking({
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      date: bookingForm.date,
      pax: bookingForm.pax,
      amount: finalAmount,
      currency: 'USD',
      cardApplied: bookingForm.cardCode || undefined,
    })
    setSelectedRestaurant(null)
    setBookingForm({ date: '', pax: 2, time: '19:30', cardCode: '' })
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Customer Portal"
      groups={groups}
      currentRoute="customer-dashboard"
      onNavigate={(r: RouteName) => {
        if (r === 'home') handleLogout()
        else navigate(r)
      }}
      onExit={() => navigate('home')}
      topBarTitle="My Dashboard"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.split(' ').map(s => s[0]).join('').slice(0, 2)}</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="mr-1 h-3.5 w-3.5" />
            Rewards Wallet
          </TabsTrigger>
          <TabsTrigger value="cards">
            <CreditCard className="mr-1 h-3.5 w-3.5" />
            Membership Cards
          </TabsTrigger>
          <TabsTrigger value="restaurants">
            <Utensils className="mr-1 h-3.5 w-3.5" />
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist ({wishlist.length})</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* DASHBOARD TAB */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Welcome banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start justify-between gap-4 rounded-xl bg-foreground p-6 text-background sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-accent">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(' ').map(s => s[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h2>
                <p className="text-sm text-background/70">You have 3 upcoming events and {user.membership || 'Gold'} membership status.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-background/10 px-4 py-2 backdrop-blur-md">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{user.membership || 'Gold'} Member</span>
            </div>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Upcoming Bookings', value: '3', icon: Calendar, accent: 'text-emerald-600', change: '+1 this month' },
              { label: 'Past Bookings', value: '14', icon: Ticket, accent: 'text-muted-foreground', change: '+2 last quarter' },
              { label: 'Membership Status', value: user.membership || 'Gold', icon: Star, accent: 'text-amber-600', change: '158 pts to Platinum' },
              { label: 'Rewards Balance', value: `${rewardsBalance.toLocaleString()} pts`, icon: Gift, accent: 'text-violet-600', change: `≈ ${fmt(rewardsBalance)} value` },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                      <div className="mt-1 text-2xl font-bold">{stat.value}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{stat.change}</div>
                    </div>
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-muted">
                      <Icon className={`h-4 w-4 ${stat.accent}`} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Upcoming & Side */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h3 className="font-semibold">Upcoming Bookings</h3>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setActiveTab('bookings')}>
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="divide-y divide-border">
                {UPCOMING_BOOKINGS.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex cursor-pointer items-center gap-4 p-5 transition-colors hover:bg-muted/30"
                    onClick={() => navigate('booking-details', { bookingId: booking.id })}
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent/15">
                      <Calendar className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-medium">{booking.eventName}</h4>
                        {booking.status === 'Confirmed' ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">
                            <CheckCircle2 className="mr-1 h-3 w-3" />Confirmed
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">
                            <Clock className="mr-1 h-3 w-3" />Pending
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {booking.venue} · {formatDate(booking.eventDate)}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{booking.tier} × {booking.qty}</span>
                        <span>·</span>
                        <span className="font-mono">{booking.id}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(booking.amount, booking.currency)}</div>
                      <Button variant="ghost" size="sm" className="mt-1 h-7 px-2 text-xs">
                        Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-5">
                <h3 className="mb-4 font-semibold">Ticket Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'E-tickets delivered', value: 2, color: 'bg-emerald-500' },
                    { label: 'Pending delivery', value: 1, color: 'bg-amber-500' },
                    { label: 'Hospitality pending', value: 1, color: 'bg-purple-500' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-medium">{s.value}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${s.color}`} style={{ width: `${(s.value / 4) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Bell className="h-4 w-4" />
                  Notifications
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 px-3 py-2">
                    <div className="text-xs font-medium">Your Coldplay tickets are ready</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">2 hours ago</div>
                  </div>
                  <div className="rounded-lg border-l-2 border-accent bg-accent/5 px-3 py-2">
                    <div className="text-xs font-medium">Hospitality concierge assigned</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">1 day ago</div>
                  </div>
                  <div className="rounded-lg border-l-2 border-muted-foreground bg-muted/30 px-3 py-2">
                    <div className="text-xs font-medium">Earn 158 more points for Platinum</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">3 days ago</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Past bookings */}
          <Card>
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="font-semibold">Past Bookings</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => addToast({ title: 'History exported', description: 'Booking history CSV downloaded' })}>
                Export history <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Booking ID</th>
                    <th className="px-5 py-3 font-medium">Event</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Tier</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PAST_BOOKINGS.map((b) => (
                    <tr
                      key={b.id}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                      onClick={() => navigate('booking-details', { bookingId: b.id })}
                    >
                      <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                      <td className="px-5 py-3 font-medium">{b.eventName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(b.eventDate)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.tier} × {b.qty}</td>
                      <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                      <td className="px-5 py-3">
                        {b.status === 'Refunded' ? (
                          <Badge variant="secondary" className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/15">{b.status}</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">{b.status}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* BOOKINGS TAB */}
        <TabsContent value="bookings">
          <Card>
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">All Bookings</h3>
              <p className="mt-1 text-xs text-muted-foreground">Your complete booking history</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Booking ID</th>
                    <th className="px-5 py-3 font-medium">Event</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Tier</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...UPCOMING_BOOKINGS, ...PAST_BOOKINGS].map((b) => (
                    <tr key={b.id} className="cursor-pointer transition-colors hover:bg-muted/30" onClick={() => navigate('booking-details', { bookingId: b.id })}>
                      <td className="px-5 py-3 font-mono text-xs">{b.id}</td>
                      <td className="px-5 py-3 font-medium">{b.eventName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(b.eventDate)}</td>
                      <td className="px-5 py-3 text-xs">{b.tier} × {b.qty}</td>
                      <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                      <td className="px-5 py-3">
                        <Badge variant="secondary" className={
                          b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                          b.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                          'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15'
                        }>{b.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* REWARDS WALLET TAB */}
        <TabsContent value="rewards" className="space-y-6">
          {/* Wallet hero */}
          <Card className="relative overflow-hidden p-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-8 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative p-6 text-white sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Unified Rewards Wallet</div>
                  <div className="mt-2 text-4xl font-bold sm:text-5xl">
                    {rewardsBalance.toLocaleString()} <span className="text-lg font-medium opacity-80">points</span>
                  </div>
                  <div className="mt-2 text-sm opacity-90">≈ {fmt(rewardsBalance)} redeemable value · 1 pt = $1</div>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur">
                  <Gift className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
                  <div className="text-xs opacity-80">Earned</div>
                  <div className="mt-0.5 font-semibold">+{rewardsHistory.filter(t => t.type === 'earn').reduce((s, t) => s + t.points, 0).toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
                  <div className="text-xs opacity-80">Redeemed</div>
                  <div className="mt-0.5 font-semibold">{rewardsHistory.filter(t => t.type === 'redeem').reduce((s, t) => s + Math.abs(t.points), 0).toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
                  <div className="text-xs opacity-80">Sources</div>
                  <div className="mt-0.5 font-semibold">Events + Restaurants</div>
                </div>
              </div>
              <p className="mt-4 text-xs opacity-80">
                Rewards accrue from every eligible booking across event tickets and partner restaurants — all in one unified wallet, redeemable at checkout.
              </p>
            </div>
          </Card>

          {/* Two-column layout: history + redeem panel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="border-b border-border p-5">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  Rewards History
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Every transaction that earned or redeemed points</p>
              </div>
              <div className="divide-y divide-border">
                {rewardsHistory.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tx.type === 'earn' ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                      {tx.type === 'earn'
                        ? <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                        : <ArrowUpRight className="h-4 w-4 text-rose-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleString()} · Source {tx.source}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'earn' ? '+' : '−'}{Math.abs(tx.points).toLocaleString()} pts
                      </div>
                      <div className="text-[10px] text-muted-foreground">Balance: {tx.balanceAfter.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold">Redeem points</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Use your points at checkout for up to 30% off any booking — events or restaurants.
              </p>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold">{rewardsBalance.toLocaleString()} pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cash value</span>
                  <span className="font-semibold">{fmt(rewardsBalance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Conversion rate</span>
                  <span className="font-semibold">1 pt = {fmt(1)}</span>
                </div>
              </div>
              <Button
                className="mt-4 w-full gap-2"
                onClick={() => {
                  if (rewardsBalance < 100) {
                    addToast({ title: 'Need at least 100 points', type: 'error' })
                    return
                  }
                  const ok = redeemRewardPoints(100, 'Manual redemption', 'Redeemed 100 points from wallet')
                  if (ok) addToast({ title: '100 points redeemed', description: 'Applied as $100 statement credit', type: 'success' })
                }}
              >
                Redeem 100 points
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="mt-2 w-full" onClick={() => navigate('events')}>
                Browse events
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* MEMBERSHIP CARDS TAB */}
        <TabsContent value="cards" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">My Membership Cards</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configurable cards redeemable across event tickets, restaurants, hospitality, and more.
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setGrantOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>

          {/* Owned cards */}
          {ownedCards.length === 0 ? (
            <Card className="grid place-items-center py-12 text-center">
              <CreditCard className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No membership cards in your wallet yet.</p>
              <Button className="mt-3" onClick={() => setGrantOpen(true)}>Add a card</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {ownedCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg`}
                >
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                  <div className="absolute -bottom-16 -left-4 h-32 w-32 rounded-full bg-white/5" />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{card.code}</div>
                        <div className="mt-1 text-xl font-bold">{card.name}</div>
                      </div>
                      <CreditCard className="h-6 w-6 opacity-60" />
                    </div>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <div className="text-3xl font-bold">{card.discountPct}%<span className="text-base font-medium opacity-80"> OFF</span></div>
                        <div className="mt-1 text-xs opacity-80">Max discount: {fmt(card.maxDiscount ?? 0)}</div>
                      </div>
                      <div className="text-right text-[10px] opacity-70">
                        <div>Valid until</div>
                        <div className="text-xs font-medium">{card.endDate}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {card.validFor.map(v => (
                        <span key={v} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase">
                          {v === 'events' ? '🎫 Events' : v === 'restaurants' ? '🍽 Dining' : v === 'hospitality' ? '🥂 Hospitality' : v}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 rounded-md bg-white/10 p-2 text-[11px] opacity-90">
                      {card.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* All available cards */}
          <Card className="p-5">
            <h3 className="mb-1 font-semibold">All Available Membership Cards</h3>
            <p className="text-xs text-muted-foreground">Configured by the admin. Add one to your wallet to start redeeming.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 font-medium">Card</th>
                    <th className="py-2 font-medium">Discount</th>
                    <th className="py-2 font-medium">Valid For</th>
                    <th className="py-2 font-medium">Min Spend</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {membershipCards.map((card) => {
                    const owned = ownedCardCodes.includes(card.code)
                    return (
                      <tr key={card.id} className="transition-colors hover:bg-muted/30">
                        <td className="py-3">
                          <div className="font-medium">{card.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{card.code}</div>
                        </td>
                        <td className="py-3 font-semibold">{card.discountPct}%</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {card.validFor.map(v => (
                              <Badge key={v} variant="secondary" className="bg-foreground/5 text-[10px]">{v}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 text-xs">{fmt(card.minSpend ?? 0)}</td>
                        <td className="py-3">
                          <Badge variant="secondary" className={
                            card.status === 'Active' ? 'bg-emerald-500/15 text-emerald-700' :
                            card.status === 'Paused' ? 'bg-amber-500/15 text-amber-700' :
                            'bg-rose-500/15 text-rose-700'
                          }>{card.status}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          {owned ? (
                            <Badge variant="secondary" className="bg-violet-500/15 text-violet-700">In Wallet</Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={card.status !== 'Active'}
                              onClick={() => grantMembershipCard(card.code)}
                            >
                              Add
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* RESTAURANTS TAB */}
        <TabsContent value="restaurants" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Partner Restaurants</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Book a table at our partner restaurants. Use your membership cards for discounts and earn 1 point per $1 spent.
            </p>
          </div>

          {/* My restaurant bookings */}
          {restaurantBookings.length > 0 && (
            <Card>
              <div className="border-b border-border p-5">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Utensils className="h-4 w-4" />
                  My Restaurant Bookings
                </h3>
              </div>
              <div className="divide-y divide-border">
                {restaurantBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/15">
                      <Utensils className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{b.restaurantName}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(b.date)} · {b.pax} guests · {b.id}
                        {b.cardApplied && <span className="ml-1">· Card: {b.cardApplied}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{fmt(b.amount, b.currency)}</div>
                      <Badge variant="secondary" className={
                        b.status === 'Confirmed' ? 'bg-emerald-500/15 text-emerald-700' :
                        'bg-rose-500/15 text-rose-700'
                      }>{b.status}</Badge>
                    </div>
                    {b.status === 'Confirmed' && (
                      <Button variant="ghost" size="sm" onClick={() => cancelRestaurantBooking(b.id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Available restaurants */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <Card key={r.id} className="group overflow-hidden p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={r.image} alt={r.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    {r.acceptedCards.slice(0, 2).map(c => (
                      <Badge key={c} className="bg-white/90 text-foreground text-[10px]">{c}</Badge>
                    ))}
                  </div>
                  <div className="absolute right-3 top-3">
                    <Badge className={
                      r.availability === 'Available' ? 'bg-emerald-500 text-white' :
                      r.availability === 'Limited' ? 'bg-amber-500 text-white' :
                      'bg-rose-500 text-white'
                    }>{r.availability}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{r.city}, {r.country}</div>
                    <div className="mt-1 text-lg font-semibold">{r.name}</div>
                    <div className="text-xs opacity-90">{r.cuisine} · ★ {r.rating}</div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground">From (for 2)</div>
                    <div className="text-lg font-semibold">{fmt(r.priceForTwo, r.currency)}</div>
                  </div>
                  <Button
                    size="sm"
                    disabled={r.availability === 'Waitlist'}
                    onClick={() => {
                      setSelectedRestaurant(r)
                      setBookingForm({ date: '', pax: 2, time: '19:30', cardCode: '' })
                    }}
                  >
                    Book table
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* WISHLIST TAB */}
        <TabsContent value="wishlist">
          {wishlistEvents.length === 0 ? (
            <Card className="grid place-items-center py-16 text-center">
              <Heart className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">Your wishlist is empty.</p>
              <Button className="mt-3 gap-2" onClick={() => navigate('events')}>
                <ShoppingBag className="h-4 w-4" />
                Browse events
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistEvents.map((event) => (
                <Card key={event.id} className="group overflow-hidden p-0">
                  <div className="relative aspect-[4/3] cursor-pointer overflow-hidden" onClick={() => navigate('event-detail', { eventId: event.id })}>
                    <img src={event.image} alt={event.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(event.id); addToast({ title: 'Removed from wishlist' }) }}
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur"
                    >
                      <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <Badge className="bg-accent text-accent-foreground hover:bg-accent">{event.category}</Badge>
                      <div className="mt-1 text-sm font-semibold line-clamp-1">{event.name}</div>
                      <div className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{event.city}</div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase text-muted-foreground">From</div>
                      <div className="text-lg font-semibold">{formatCurrency(event.startingPrice, event.currency)}</div>
                    </div>
                    <Button size="sm" onClick={() => navigate('event-detail', { eventId: event.id })}>Book now</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* INVOICES TAB */}
        <TabsContent value="invoices">
          <Card>
            <div className="border-b border-border p-5">
              <h3 className="font-semibold">Invoices & Receipts</h3>
              <p className="mt-1 text-xs text-muted-foreground">Download invoices for your bookings</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Invoice #</th>
                    <th className="px-5 py-3 font-medium">Booking</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...UPCOMING_BOOKINGS, ...PAST_BOOKINGS].map((b, i) => (
                    <tr key={b.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs">INV-2026-{1000 + i}</td>
                      <td className="px-5 py-3 font-medium">{b.eventName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(b.bookingDate)}</td>
                      <td className="px-5 py-3 font-semibold">{formatCurrency(b.amount, b.currency)}</td>
                      <td className="px-5 py-3 text-xs">{b.paymentMethod}</td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="ghost" className="gap-1.5 h-7" onClick={() => addToast({ title: 'Invoice downloaded', description: `INV-2026-${1000 + i}.pdf` })}>
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* SUPPORT TAB */}
        <TabsContent value="support">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 p-6">
              <h3 className="flex items-center gap-2 font-semibold"><MessageSquare className="h-4 w-4" /> Submit a support request</h3>
              <p className="mt-1 text-xs text-muted-foreground">Our team typically responds within 4 hours during business days.</p>
              <Separator className="my-4" />
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); addToast({ title: 'Request submitted', description: 'Our team will be in touch shortly', type: 'success' }); (e.target as HTMLFormElement).reset() }}>
                <div>
                  <Label className="text-xs">Subject *</Label>
                  <Input required placeholder="Brief description of your issue" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Category</Label>
                  <select className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option>Booking issue</option>
                    <option>Payment / Refund</option>
                    <option>Ticket delivery</option>
                    <option>Hospitality</option>
                    <option>Account / Login</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Message *</Label>
                  <textarea required rows={5} placeholder="Tell us more about your issue…" className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <Button type="submit" className="gap-2">Submit request <ArrowRight className="h-4 w-4" /></Button>
              </form>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold"><LifeBuoy className="h-4 w-4" />Quick Help</h3>
                <div className="space-y-2">
                  {[
                    'How will I receive my tickets?',
                    'What is the cancellation policy?',
                    'Can I transfer my ticket?',
                    'How do I update my payment method?',
                    'How do loyalty points work?',
                  ].map(q => (
                    <button key={q} className="block w-full text-left text-xs text-muted-foreground hover:text-foreground hover:underline">
                      {q}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="mb-2 font-semibold">Contact Concierge</h3>
                <p className="text-xs text-muted-foreground">Available 24/7 for {user.membership} members</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />concierge@dstickets.com</div>
                  <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground" />+44 20 7946 0958</div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Profile</h3>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setProfileOpen(true)}>
                <Save className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{user.name.split(' ').map(s => s[0]).join('').slice(0, 2)}</AvatarFallback>
                </Avatar>
                <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">
                  <Star className="mr-1 h-3 w-3" />
                  {user.membership || 'Gold'}
                </Badge>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Full Name</div>
                  <div className="mt-1 font-medium">{profile.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="mt-1 font-medium">{profile.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Phone</div>
                  <div className="mt-1 font-medium">{profile.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Country</div>
                  <div className="mt-1 font-medium">{profile.country}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">City</div>
                  <div className="mt-1 font-medium">{profile.city}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div className="mt-1 font-medium">{profile.address}</div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold">14</div>
                <div className="text-xs text-muted-foreground">Total Bookings</div>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-2xl font-bold">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  {user.membership || 'Gold'}
                </div>
                <div className="text-xs text-muted-foreground">Membership Status</div>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold">1,842</div>
                <div className="text-xs text-muted-foreground">Loyalty Points</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit profile dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveProfile} className="space-y-3">
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} className="mt-1" required />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} className="mt-1" required />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Country</Label>
                <Input value={profile.country} onChange={(e) => setProfile(p => ({ ...p, country: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">City</Label>
                <Input value={profile.city} onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Address</Label>
              <Input value={profile.address} onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))} className="mt-1" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setProfileOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grant Membership Card dialog */}
      <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Membership Card</DialogTitle>
            <DialogDescription>Enter the card code issued to you. Try GOLD10, PLATINUM15, or DINE20.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGrant} className="space-y-3">
            <div>
              <Label className="text-xs">Card Code</Label>
              <Input
                value={grantCode}
                onChange={(e) => setGrantCode(e.target.value)}
                placeholder="e.g. GOLD10"
                className="mt-1 uppercase"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGrantOpen(false)}>Cancel</Button>
              <Button type="submit">Add to wallet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Restaurant booking dialog */}
      <Dialog open={!!selectedRestaurant} onOpenChange={(o) => !o && setSelectedRestaurant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Table — {selectedRestaurant?.name}</DialogTitle>
            <DialogDescription>
              {selectedRestaurant?.cuisine} · {selectedRestaurant?.city} · ★ {selectedRestaurant?.rating}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRestaurantBooking} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(p => ({ ...p, date: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Time</Label>
                <Input
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm(p => ({ ...p, time: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Number of guests</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={bookingForm.pax}
                onChange={(e) => setBookingForm(p => ({ ...p, pax: parseInt(e.target.value) || 1 }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Apply Membership Card (optional)</Label>
              <select
                value={bookingForm.cardCode}
                onChange={(e) => setBookingForm(p => ({ ...p, cardCode: e.target.value }))}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">No card applied</option>
                {ownedCards.filter(c => c.validFor.includes('restaurants')).map(card => (
                  <option key={card.code} value={card.code}>
                    {card.name} — {card.discountPct}% off
                  </option>
                ))}
              </select>
              {bookingForm.cardCode && selectedRestaurant && (() => {
                const card = membershipCards.find(c => c.code === bookingForm.cardCode)!
                const base = selectedRestaurant.priceForTwo * Math.ceil(bookingForm.pax / 2)
                const discount = Math.min(Math.round(base * card.discountPct / 100), card.maxDiscount ?? Infinity)
                return (
                  <div className="mt-2 rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-700">
                    You save {fmt(discount)} with {card.name}
                  </div>
                )
              })()}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSelectedRestaurant(null)}>Cancel</Button>
              <Button type="submit" className="gap-2">
                Confirm booking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
