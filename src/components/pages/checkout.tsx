'use client'

import { useState } from 'react'
import { useRouter } from '@/lib/router'
import { PublicHeader } from '@/components/layout/public-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { EVENTS, TICKET_TIERS, formatCurrency, formatDate } from '@/lib/mock-data'
import { useStore } from '@/lib/store'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import {
  ChevronRight, Check, Tag, X, ShieldCheck, Gift, CreditCard, Sparkles,
  Utensils, Music, Trophy
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CheckoutPage() {
  const { route, navigate } = useRouter()
  const fmt = useCurrencyFormatter()
  const {
    user, currency, rewardsBalance, redeemRewardPoints,
    membershipCards, ownedCardCodes, redeemMembershipCard, addToast,
  } = useStore()
  const eventId = (route.params?.eventId as string) || EVENTS[0].id
  const event = EVENTS.find(e => e.id === eventId) || EVENTS[0]
  const tiers = TICKET_TIERS[event.id] || TICKET_TIERS.default

  // Use the first tier as the selected ticket for demo
  const selectedTier = route.params?.tierId
    ? (tiers.find(t => t.id === route.params!.tierId) || tiers[0])
    : tiers[0]
  const qty = (route.params?.qty as number) || 2
  const subtotal = selectedTier!.price * qty
  const taxes = Math.round(subtotal * 0.08)
  const fees = Math.round(subtotal * 0.05)
  const baseTotal = subtotal + taxes + fees

  const [promoApplied, setPromoApplied] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedCardCode, setAppliedCardCode] = useState<string | null>(null)
  const [redeemPoints, setRedeemPoints] = useState(false)
  const pointsToRedeem = redeemPoints ? Math.min(rewardsBalance, Math.round(baseTotal * 0.3)) : 0
  const pointsValue = pointsToRedeem // 1 point = $1

  // Compute discounts
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const ownedCards = membershipCards.filter(c => ownedCardCodes.includes(c.code) && c.status === 'Active')
  const activeCard = appliedCardCode ? membershipCards.find(c => c.code === appliedCardCode) : null
  const cardDiscount = activeCard
    ? Math.min(
        Math.round(subtotal * activeCard.discountPct / 100),
        activeCard.maxDiscount ?? Infinity
      )
    : 0

  const totalDiscount = promoDiscount + cardDiscount + pointsValue
  const finalTotal = Math.max(0, baseTotal - totalDiscount)
  const pointsEarned = Math.round(finalTotal) // 1 point per $1

  const [attendees, setAttendees] = useState(
    Array.from({ length: qty }, (_, i) => ({ name: '', email: '', phone: '' }))
  )

  const updateAttendee = (i: number, field: string, value: string) => {
    setAttendees(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }

  const handleApplyCard = (code: string) => {
    if (appliedCardCode === code) {
      setAppliedCardCode(null)
      addToast({ title: 'Card removed', type: 'info' })
    } else {
      setAppliedCardCode(code)
      const card = membershipCards.find(c => c.code === code)
      addToast({ title: 'Card applied', description: `${card?.name} — ${card?.discountPct}% off`, type: 'success' })
    }
  }

  const handleProceedToPayment = () => {
    // Commit redemptions
    if (redeemPoints && pointsToRedeem > 0) {
      redeemRewardPoints(pointsToRedeem, 'Checkout discount', `Redeemed at checkout — ${event.name}`)
    }
    if (activeCard) {
      redeemMembershipCard(activeCard.code)
    }
    navigate('payment', {
      eventId, tierId: selectedTier!.id, qty,
      total: finalTotal, currency: event.currency,
      pointsEarned,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <div className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('events')} className="cursor-pointer">Events</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('event-detail', { eventId })} className="cursor-pointer">{event.name}</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Checkout</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Steps */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            {['Cart', 'Attendee Info', 'Payment', 'Confirmation'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`grid h-7 w-7 place-items-center rounded-full text-xs font-medium ${i <= 1 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                  {i < 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={i <= 1 ? 'font-medium' : 'text-muted-foreground'}>{step}</span>
                {i < 3 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Selected Tickets */}
              <Card className="p-5">
                <h2 className="mb-4 text-base font-semibold">Selected Tickets</h2>
                <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <img src={event.image} alt={event.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium leading-tight">{event.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{event.venue} · {formatDate(event.date)} · {event.time}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">{selectedTier!.name}</span>
                      <span className="text-xs text-muted-foreground">× {qty}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{fmt(selectedTier!.price * qty, event.currency)}</div>
                    <div className="text-xs text-muted-foreground">{fmt(selectedTier!.price, event.currency)} each</div>
                  </div>
                </div>
              </Card>

              {/* Attendee Information */}
              <Card className="p-5">
                <h2 className="mb-4 text-base font-semibold">Attendee Information</h2>
                <div className="space-y-4">
                  {attendees.map((att, i) => (
                    <div key={i} className="rounded-lg border border-border p-4">
                      <h3 className="mb-3 text-sm font-medium">Attendee {i + 1}</h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`name-${i}`} className="text-xs">Full name</Label>
                          <Input
                            id={`name-${i}`}
                            value={att.name}
                            onChange={(e) => updateAttendee(i, 'name', e.target.value)}
                            placeholder="e.g. James Whitmore"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`email-${i}`} className="text-xs">Email address</Label>
                          <Input
                            id={`email-${i}`}
                            type="email"
                            value={att.email}
                            onChange={(e) => updateAttendee(i, 'email', e.target.value)}
                            placeholder="attendee@example.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`phone-${i}`} className="text-xs">Phone number</Label>
                          <Input
                            id={`phone-${i}`}
                            type="tel"
                            value={att.phone}
                            onChange={(e) => updateAttendee(i, 'phone', e.target.value)}
                            placeholder="+44 7700 900123"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Billing Address */}
              <Card className="p-5">
                <h2 className="mb-4 text-base font-semibold">Billing Address</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="addr1" className="text-xs">Address line 1</Label>
                    <Input id="addr1" placeholder="1 Mayfair Place" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="addr2" className="text-xs">Address line 2 (optional)</Label>
                    <Input id="addr2" placeholder="Apartment, suite, etc." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs">City</Label>
                    <Input id="city" placeholder="London" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="postcode" className="text-xs">Postal code</Label>
                    <Input id="postcode" placeholder="SW1A 1AA" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="country" className="text-xs">Country</Label>
                    <Input id="country" placeholder="United Kingdom" className="mt-1" />
                  </div>
                </div>
              </Card>

              {/* Membership Card Redemption */}
              <Card className="p-5">
                <h2 className="mb-1 flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  Membership Cards
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  Your membership cards are redeemable across event tickets and partner restaurants — pick the one that saves you most.
                </p>
                {ownedCards.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <CreditCard className="mx-auto h-6 w-6 text-muted-foreground/50" />
                    <p className="mt-2 text-xs text-muted-foreground">No membership cards in your wallet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {ownedCards.map((card) => {
                      const active = appliedCardCode === card.code
                      const potentialDiscount = Math.min(
                        Math.round(subtotal * card.discountPct / 100),
                        card.maxDiscount ?? Infinity
                      )
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleApplyCard(card.code)}
                          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-4 text-left text-white transition-all ${
                            active ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : 'opacity-90 hover:opacity-100'
                          }`}
                        >
                          <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
                          <div className="absolute -bottom-8 -left-2 h-16 w-16 rounded-full bg-white/5" />
                          <div className="relative">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-[10px] uppercase tracking-wider opacity-80">{card.code}</div>
                                <div className="mt-0.5 font-semibold leading-tight">{card.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{card.discountPct}%</div>
                                <div className="text-[10px] opacity-80">OFF</div>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {card.validFor.map(v => (
                                <span key={v} className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-medium uppercase">
                                  {v === 'events' ? '🎫 Events' : v === 'restaurants' ? '🍽 Dining' : v}
                                </span>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <span className="opacity-80">You save</span>
                              <span className="font-semibold">{fmt(potentialDiscount, 'USD')}</span>
                            </div>
                            {active && (
                              <div className="mt-2 flex items-center gap-1 text-[10px] font-medium">
                                <Check className="h-3 w-3" /> Applied to this order
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </Card>

              {/* Rewards Redemption */}
              <Card className="p-5">
                <h2 className="mb-1 flex items-center gap-2 text-base font-semibold">
                  <Gift className="h-4 w-4 text-violet-500" />
                  Unified Rewards Wallet
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  Earn 1 point per {fmt(1, 'USD')} spent. Redeem up to 30% of your order value with points.
                </p>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Available balance</div>
                    <div className="mt-0.5 text-2xl font-bold">
                      {rewardsBalance.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">pts</span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">≈ {fmt(rewardsBalance, 'USD')} off</div>
                  </div>
                  <div className="text-right">
                    <Button
                      type="button"
                      variant={redeemPoints ? 'default' : 'outline'}
                      onClick={() => setRedeemPoints(!redeemPoints)}
                      disabled={rewardsBalance === 0}
                    >
                      {redeemPoints ? (
                        <>Redeeming {pointsToRedeem} pts</>
                      ) : (
                        <>Redeem points</>
                      )}
                    </Button>
                    {redeemPoints && pointsToRedeem > 0 && (
                      <div className="mt-2 text-xs text-emerald-600">
                        Saving {fmt(pointsValue, 'USD')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Promo Code */}
              <Card className="p-5">
                <h2 className="mb-4 text-base font-semibold">Promo Code</h2>
                {promoApplied ? (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600" />
                      <div>
                        <div className="text-sm font-medium">Code &ldquo;DSWELCOME10&rdquo; applied</div>
                        <div className="text-xs text-muted-foreground">10% discount on subtotal</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setPromoApplied(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code (try DSWELCOME10)"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setPromoApplied(true)}
                      disabled={!promoCode}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 p-5">
                <h2 className="text-base font-semibold">Order Summary</h2>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="bg-foreground/5">{currency} display</Badge>
                  <span>·</span>
                  <span>Payment processed in {currency}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({qty} × {selectedTier!.name})</span>
                    <span className="font-medium">{fmt(subtotal, event.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes (8%)</span>
                    <span className="font-medium">{fmt(taxes, event.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fees (5%)</span>
                    <span className="font-medium">{fmt(fees, event.currency)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo (10%)</span>
                      <span className="font-medium">−{fmt(promoDiscount, event.currency)}</span>
                    </div>
                  )}
                  {cardDiscount > 0 && activeCard && (
                    <div className="flex justify-between text-emerald-600">
                      <span>{activeCard.name} ({activeCard.discountPct}%)</span>
                      <span className="font-medium">−{fmt(cardDiscount, event.currency)}</span>
                    </div>
                  )}
                  {pointsValue > 0 && (
                    <div className="flex justify-between text-violet-600">
                      <span>Rewards ({pointsToRedeem} pts)</span>
                      <span className="font-medium">−{fmt(pointsValue, event.currency)}</span>
                    </div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{fmt(finalTotal, event.currency)}</div>
                    <div className="text-xs text-muted-foreground">{currency} · incl. taxes</div>
                  </div>
                </div>

                {pointsEarned > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-violet-500/10 p-2 text-xs text-violet-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    You&apos;ll earn <strong className="mx-1">{pointsEarned}</strong> reward points on this booking
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Buyer protection included</div>
                  <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Free cancellation within 24h</div>
                </div>

                <Button
                  className="mt-5 w-full gap-2"
                  size="lg"
                  onClick={handleProceedToPayment}
                >
                  Continue to payment
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  You won&apos;t be charged yet. Secure payment on next step.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
