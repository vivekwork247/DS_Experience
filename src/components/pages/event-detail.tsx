'use client'

import { useState, useCallback } from 'react'
import { useRouter } from '@/lib/router'
import { useStore } from '@/lib/store'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VenueSeatingSelector, SelectedBooking } from '@/components/venue-seating-selector'
import { ImageGallery, ImageWithFallback } from '@/components/image-gallery'
import { EVENTS, TICKET_TIERS, FAQS, formatCurrency, formatDate } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import {
  MapPin, Calendar, Clock, Users, ShieldCheck, Truck, Ban, CheckCircle2,
  Star, ChevronRight, Info, Minus, Plus, Heart, Share2, Ticket as TicketIcon,
  ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

export function EventDetailPage() {
  const { route, navigate } = useRouter()
  const { toast } = useToast()
  const { wishlist, toggleWishlist, addToCart } = useStore()
  const fmt = useCurrencyFormatter()
  const eventId = (route.params?.eventId as string) || EVENTS[0].id
  const event = EVENTS.find(e => e.id === eventId) || EVENTS[0]
  const tiers = TICKET_TIERS[event.id] || TICKET_TIERS.default
  const relatedEvents = EVENTS.filter(e => e.id !== event.id && e.category === event.category).slice(0, 3)
  const gallery = event.gallery || [event.image, event.image, event.image, event.image]

  const [qty, setQty] = useState<Record<string, number>>({})
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null)

  const inWishlist = wishlist.includes(event.id)

  const getQty = (tierId: string) => qty[tierId] || 0
  const updateQty = (tierId: string, delta: number) => {
    setQty(prev => ({ ...prev, [tierId]: Math.max(0, (prev[tierId] || 0) + delta) }))
  }

  const totalSelected = Object.values(qty).reduce((s, n) => s + n, 0)
  const totalAmount = tiers.reduce((sum, tier) => sum + (qty[tier.id] || 0) * tier.price, 0)

  const handleBookingChange = useCallback((booking: SelectedBooking | null) => {
    setSelectedBooking(booking)
  }, [])

  const handleBookingContinue = (booking: SelectedBooking) => {
    if (!booking || booking.qty < 1) {
      toast({ title: 'No tickets selected', description: 'Please choose at least one ticket', variant: 'destructive' })
      return
    }
    addToCart({
      eventId: event.id,
      eventName: event.name,
      tierId: booking.blockId,
      tierName: `${booking.blockName} (${booking.blockCode})`,
      price: booking.price,
      currency: booking.currency,
      qty: booking.qty,
      block: booking.blockName,
      eventDate: event.date,
      venue: event.venue,
    })
    navigate('checkout', { eventId: event.id, fromSeats: true, qty: booking.qty })
  }

  const handleBookNow = (tierId?: string) => {
    if (tierId) {
      const tier = tiers.find(t => t.id === tierId)!
      if (!qty[tierId]) setQty(prev => ({ ...prev, [tierId]: 1 }))
      addToCart({
        eventId: event.id,
        eventName: event.name,
        tierId,
        tierName: tier.name,
        price: tier.price,
        currency: tier.currency,
        qty: qty[tierId] || 1,
        eventDate: event.date,
        venue: event.venue,
      })
    } else if (selectedBooking && selectedBooking.qty > 0) {
      handleBookingContinue(selectedBooking)
      return
    } else {
      tiers.forEach(t => {
        const q = qty[t.id] || 0
        if (q > 0) {
          addToCart({
            eventId: event.id,
            eventName: event.name,
            tierId: t.id,
            tierName: t.name,
            price: t.price,
            currency: t.currency,
            qty: q,
            eventDate: event.date,
            venue: event.venue,
          })
        }
      })
    }
    navigate('checkout', { eventId: event.id, qty: tierId ? (qty[tierId] || 1) : totalSelected })
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, text: event.description })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({ title: 'Link copied to clipboard' })
      }
    } catch {}
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <div className="flex-1">
        {/* Cinematic hero strip with breadcrumb */}
        <section className="relative overflow-hidden border-b border-border bg-foreground">
          <div className="absolute inset-0">
            <img
              src={event.image}
              alt=""
              aria-hidden
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/80 to-foreground" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-transparent to-foreground" />
          </div>
          {/* Ambient orb */}
          <div className="orb-ambient-1 pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-amber-500/20 blur-[100px]" />

          <div className="container relative mx-auto px-4 py-5 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList className="text-background/80">
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate('home')} className="cursor-pointer hover:text-accent">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate('events')} className="cursor-pointer hover:text-accent">Events</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate('events', { category: event.category })} className="cursor-pointer hover:text-accent">
                    {event.category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-background">{event.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Event title overlay */}
            <div className="py-8 sm:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
              >
                <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-500 hover:to-orange-500">
                  {event.category}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-background sm:text-4xl lg:text-5xl">
                  {event.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-background/70">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" />{event.venue}, {event.city}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-accent" />{formatDate(event.date)}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />{event.time}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <ImageGallery
                images={gallery.map((url, i) => ({
                  url,
                  alt: `${event.name} — view ${i + 1}`,
                  caption: `${event.name} · ${event.venue}, ${event.city}`,
                }))}
                title={event.name}
                badge={<Badge className="bg-accent text-accent-foreground hover:bg-accent">{event.category}</Badge>}
                subtitle={
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.venue}, {event.city}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(event.date)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time}</span>
                  </div>
                }
              />
            </div>

            {/* Side card with key info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Starting from</div>
                    <div className="text-2xl font-bold">{fmt(event.startingPrice, event.currency)}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { toggleWishlist(event.id); toast({ title: inWishlist ? 'Removed from wishlist' : 'Added to wishlist' }) }}
                    >
                      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formatDate(event.date)}</div>
                      <div className="text-xs text-muted-foreground">{event.time} local time</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.venue}</div>
                      <div className="text-xs text-muted-foreground">{event.city}, {event.country}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.ticketsAvailable} tickets available</div>
                      <div className="text-xs text-muted-foreground">Across {tiers.length} tiers</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 100% official tickets</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Instant confirmation</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Secure payments</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Seats together</div>
                </div>

                <Button className="mt-4 w-full gap-2" onClick={() => {
                  document.getElementById('seating-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}>
                  Select your seats
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Card>
            </div>
          </div>

          {/* Tabs: About / Seating Map / Tickets / FAQs / Related */}
          <div className="mt-10">
            <Tabs defaultValue="seating">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="seating">Select Your Seats</TabsTrigger>
                <TabsTrigger value="about">About Event</TabsTrigger>
                <TabsTrigger value="tickets">Ticket Tiers</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="related">Related Events</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <Card className="p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold">About this event</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                    <Separator className="my-5" />
                    <h3 className="text-sm font-semibold">What&apos;s included</h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        { icon: Users, label: 'Seats together', desc: 'Your group will be seated adjacent wherever possible' },
                        { icon: Truck, label: 'Delivery method', desc: 'E-tickets delivered 24-48h before the event' },
                        { icon: Ban, label: 'Cancellation policy', desc: 'Non-refundable. Flexible terms on hospitality.' },
                        { icon: Info, label: 'Restrictions', desc: 'Age 5+. No professional cameras. ID required.' },
                      ].map((item) => {
                        const Icon = item.icon
                        return (
                          <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                            <Icon className="mt-0.5 h-4 w-4 text-accent-foreground" />
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-sm font-semibold">Venue information</h3>
                    <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-muted">
                      <ImageWithFallback src={gallery[1] || event.image} alt={event.venue} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="font-medium">{event.venue}</div>
                      <div className="text-muted-foreground">{event.city}, {event.country}</div>
                      <div className="text-xs text-muted-foreground">Capacity: 90,000 · Opened: 1923 · Renovated: 2007</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full gap-2" onClick={() => toast({ title: 'Map opened', description: 'Showing venue on Google Maps' })}>
                      <MapPin className="h-4 w-4" />
                      View on map
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="seating" className="mt-6" id="seating-map">
                <VenueSeatingSelector
                  event={event}
                  onSelect={handleBookingChange}
                  onContinue={handleBookingContinue}
                />
              </TabsContent>

              <TabsContent value="tickets" className="mt-6">
                <div className="space-y-4">
                  {tiers.map((tier) => (
                    <Card key={tier.id} className="overflow-hidden p-0">
                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{tier.name}</h3>
                            {tier.badge && (
                              <Badge className="bg-accent text-accent-foreground hover:bg-accent">{tier.badge}</Badge>
                            )}
                          </div>
                          <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                            {tier.features.map((f) => (
                              <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                {f}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium text-amber-600">{tier.available} tickets remaining</span>
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3 sm:w-48">
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Per ticket</div>
                            <div className="text-2xl font-bold">{fmt(tier.price, tier.currency)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQty(tier.id, -1)}
                              disabled={getQty(tier.id) === 0}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{getQty(tier.id)}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQty(tier.id, 1)}
                              disabled={getQty(tier.id) >= 8}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleBookNow(tier.id)}
                            disabled={tier.available === 0}
                          >
                            {tier.available === 0 ? 'Sold out' : 'Book now'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="faqs" className="mt-6">
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {FAQS.map((faq, i) => (
                      <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </TabsContent>

              <TabsContent value="related" className="mt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedEvents.map((rel) => (
                    <Card
                      key={rel.id}
                      className="group cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-lg"
                      onClick={() => { navigate('event-detail', { eventId: rel.id }) }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <ImageWithFallback src={rel.image} alt={rel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />{rel.city}</div>
                          <div className="mt-1 line-clamp-1 text-sm font-semibold">{rel.name}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-[10px] uppercase text-muted-foreground">From</div>
                            <div className="text-lg font-semibold">{fmt(rel.startingPrice, rel.currency)}</div>
                          </div>
                          <Star className="h-4 w-4 fill-accent text-accent" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Sticky bottom booking bar */}
      <AnimatePresence>
        {(totalSelected > 0 || (selectedBooking && selectedBooking.qty > 0)) && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="sticky bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"
          >
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">
                  {selectedBooking && selectedBooking.qty > 0
                    ? `${selectedBooking.qty} ticket${selectedBooking.qty > 1 ? 's' : ''} · ${selectedBooking.blockName}`
                    : `${totalSelected} ticket${totalSelected > 1 ? 's' : ''} selected`}
                </div>
                <div className="text-lg font-bold">
                  {fmt(selectedBooking && selectedBooking.qty > 0 ? selectedBooking.total : totalAmount, event.currency)}{' '}
                  <span className="text-xs font-normal text-muted-foreground">total</span>
                </div>
              </div>
              <Button onClick={() => handleBookNow()} className="gap-2">
                Continue to checkout
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  )
}
