'use client'

import { useRouter } from '@/lib/router'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import { CheckCircle2, Download, Eye, Home, Calendar, MapPin, Mail, Gift, Sparkles } from 'lucide-react'

export function OrderSuccessPage() {
  const { route, navigate } = useRouter()
  const fmt = useCurrencyFormatter()
  const total = (route.params?.total as number) || 4536
  const currency = (route.params?.currency as string) || 'USD'
  const pointsEarned = (route.params?.pointsEarned as number) || Math.round(total)
  const bookingRef = 'BK-2026-00213'

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <div className="container mx-auto flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Success animation */}
          <div className="text-center">
            <div className="relative mx-auto grid h-20 w-20 place-items-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <div className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">Booking Confirmed!</h1>
            <p className="mt-2 text-muted-foreground">
              Thank you for your purchase. Your tickets are on their way to your inbox.
            </p>
          </div>

          {/* Booking Reference */}
          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Booking Reference</div>
                <div className="mt-1 font-mono text-xl font-bold tracking-tight">{bookingRef}</div>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                Confirmed
              </div>
            </div>

            {/* Points earned banner */}
            {pointsEarned > 0 && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-white">
                  <Gift className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-violet-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    You earned {pointsEarned.toLocaleString()} reward points!
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Added to your unified rewards wallet. Redeem at checkout on any future booking.
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate('customer-dashboard', { tab: 'rewards' })}>
                  View wallet
                </Button>
              </div>
            )}

            <Separator className="my-5" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">UEFA Champions League Final 2026</div>
                  <div className="text-xs text-muted-foreground">{formatDate('2026-05-30')} · 21:00</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Wembley Stadium</div>
                  <div className="text-xs text-muted-foreground">London, United Kingdom</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">james.whitmore@example.com</div>
                  <div className="text-xs text-muted-foreground">E-tickets will be delivered here 24-48h before event</div>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">2 × Premium Category 1</span>
                <span className="font-medium">{fmt(2900, currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes & fees</span>
                <span>{fmt(total - 2900, currency)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total Paid</span>
                <span>{fmt(total, currency)}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate('booking-details', { bookingId: bookingRef })}>
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate('booking-details', { bookingId: bookingRef })}>
              <Eye className="h-4 w-4" />
              View Booking
            </Button>
          </div>

          <Button
            variant="ghost"
            className="mt-4 w-full gap-2"
            onClick={() => navigate('home')}
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>

          {/* What's next */}
          <Card className="mt-6 p-5 bg-muted/30">
            <h3 className="text-sm font-semibold">What happens next?</h3>
            <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2"><span className="font-medium text-foreground">1.</span> You will receive a confirmation email within 5 minutes.</li>
              <li className="flex gap-2"><span className="font-medium text-foreground">2.</span> E-tickets are delivered 24-48 hours before the event date.</li>
              <li className="flex gap-2"><span className="font-medium text-foreground">3.</span> Present your e-ticket (printed or on phone) at the venue entrance.</li>
              <li className="flex gap-2"><span className="font-medium text-foreground">4.</span> For hospitality packages, a concierge will contact you 7 days prior.</li>
            </ol>
          </Card>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
