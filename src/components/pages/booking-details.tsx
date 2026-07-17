'use client'

import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell, SidebarGroup } from '@/components/layout/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UPCOMING_BOOKINGS, formatCurrency, formatDate } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import {
  LayoutDashboard, Ticket as TicketIcon, FileText, LifeBuoy, User, LogOut, Bell,
  Download, Calendar, MapPin, CreditCard, Mail, Phone, ChevronLeft,
  MessageSquare, ShieldCheck
} from 'lucide-react'

const groups: SidebarGroup[] = [
  {
    items: [
      { label: 'Dashboard', route: 'customer-dashboard', icon: LayoutDashboard },
      { label: 'My Bookings', route: 'customer-dashboard', icon: TicketIcon },
      { label: 'Invoices', route: 'customer-dashboard', icon: FileText },
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

export function BookingDetailsPage() {
  const { route, navigate } = useRouter()
  const fmt = useCurrencyFormatter()
  const bookingId = (route.params?.bookingId as string) || UPCOMING_BOOKINGS[0].id
  const booking = [...UPCOMING_BOOKINGS].find(b => b.id === bookingId) || UPCOMING_BOOKINGS[0]

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Customer Portal"
      groups={groups}
      currentRoute="customer-dashboard"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Booking Details"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=12" />
            <AvatarFallback>JW</AvatarFallback>
          </Avatar>
        </>
      }
    >
      {/* Breadcrumb / Back */}
      <Button variant="ghost" size="sm" className="mb-4 -ml-2 gap-1" onClick={() => navigate('customer-dashboard')}>
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Button>

      {/* Booking header */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-xl font-bold tracking-tight">{booking.id}</h1>
                <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {booking.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Booked on {formatDate(booking.bookingDate)} · Paid via {booking.paymentMethod}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download Ticket
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Invoice
              </Button>
            </div>
          </div>
        </div>

        {/* Event details */}
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-lg font-semibold">{booking.eventName}</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Date & Time</div>
                    <div className="mt-0.5 text-sm font-medium">{formatDate(booking.eventDate)}</div>
                    <div className="text-xs text-muted-foreground">21:00 local time</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Venue</div>
                    <div className="mt-0.5 text-sm font-medium">{booking.venue}</div>
                    <div className="text-xs text-muted-foreground">View on map</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tickets */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Tickets</h3>
              <div className="space-y-2">
                {Array.from({ length: booking.qty }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-md bg-foreground text-background">
                        <TicketIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Ticket {i + 1} of {booking.qty}</div>
                        <div className="text-xs text-muted-foreground">{booking.tier} · Section A, Row {12 + i}, Seat {i + 1}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">E-Ticket ready</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Customer */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Customer</h3>
              <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://i.pravatar.cc/100?img=12" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{booking.customer}</div>
                  <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{booking.email}</div>
                    <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />+44 7700 900123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice summary */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Invoice Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{booking.tier} × {booking.qty}</span>
                  <span className="font-medium">{fmt(booking.amount - Math.round(booking.amount * 0.13), booking.currency)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes & fees</span>
                  <span>{fmt(Math.round(booking.amount * 0.13), booking.currency)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{fmt(booking.amount, booking.currency)}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full gap-2">
                <Download className="h-4 w-4" />
                Download Invoice
              </Button>
            </Card>

            <Card className="p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="h-4 w-4" />
                Need help with this booking?
              </h3>
              <p className="text-xs text-muted-foreground">Our support team is available 24/7 for any questions about your booking.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Chat</Button>
                <Button variant="outline" size="sm">Email</Button>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="mb-3 text-sm font-semibold">Payment</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CreditCard className="h-3.5 w-3.5" />
                    {booking.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono">TXN-984712</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">Captured</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </DashboardShell>
  )
}

