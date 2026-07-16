'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/lib/router'
import { useStore } from '@/lib/store'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EVENTS, CATEGORIES, DESTINATIONS, formatCurrency, formatDate } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import { ImageWithFallback } from '@/components/image-gallery'
import {
  Trophy, Music, Car, CircleDot, Wine, ArrowRight, MapPin, Calendar,
  ShieldCheck, CreditCard, Globe, Zap, Star, Sparkles, ChevronRight,
  TrendingUp, Users, Clock, Circle
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ICONS: Record<string, any> = {
  Trophy, Music, Car, CircleDot, Wine, Circle
}

// Scroll-reveal wrapper
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function LandingPage() {
  const { navigate } = useRouter()
  const { wishlist, toggleWishlist, addToast } = useStore()
  const fmt = useCurrencyFormatter()
  const popularEvents = EVENTS.filter(e => e.featured).slice(0, 4)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({ title: 'Subscribed!', description: 'You will receive our next newsletter soon', type: 'success' })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      {/* Hero Banner with parallax */}
      <section ref={heroRef} className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&q=80"
            alt="Stadium atmosphere"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/40" />
        </motion.div>

        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Official hospitality partner of 200+ events worldwide</span>
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Extraordinary moments.
              <br />
              <span className="shimmer-text">Unforgettable live experiences.</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-base text-background/70 sm:text-lg"
            >
              From UEFA Champions League finals to Formula 1 paddocks and the world&apos;s biggest concert stages —
              secure your seat at the events that matter, with hospitality that elevates every moment.
            </motion.p>

            {/* Hero search */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={(e) => { e.preventDefault(); navigate('events') }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-background/20 bg-background/10 px-4 py-3 backdrop-blur-md">
                <Calendar className="h-4 w-4 text-background/60" />
                <Input
                  placeholder="Search event, team or artist…"
                  className="border-0 bg-transparent p-0 text-background placeholder:text-background/50 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button size="lg" type="submit" className="gap-2">
                Browse all events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>

            {/* Hero quick links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {['UEFA Champions League Tickets', 'Formula 1', 'Concerts', 'Hospitality Packages'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate('events', { search: tag })}
                  className="rounded-full border border-background/20 bg-background/5 px-4 py-1.5 text-xs text-background/80 backdrop-blur-md transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating stats card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute right-8 bottom-8 hidden w-64 rounded-xl border border-background/10 bg-background/5 p-5 backdrop-blur-md xl:block"
          >
            <div className="flex items-center gap-2 text-xs text-background/60">
              <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
              Live inventory · refreshed every 60s
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Events', value: '200+' },
                { label: 'Countries', value: '38' },
                { label: 'On sale', value: '1.2K' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-background/50">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Featured Categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">Explore by what you love</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('events')} className="hidden sm:inline-flex group">
              View all
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon]
            return (
              <Reveal key={cat.name} delay={i * 80}>
                <button
                  onClick={() => navigate('events', { category: cat.name })}
                  className="group relative w-full overflow-hidden rounded-xl border border-border bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${cat.gradient} blur-2xl transition-transform duration-500 group-hover:scale-150`} />
                  <div className="relative">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-foreground text-background transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:rotate-6">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 font-semibold">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{cat.count} events</p>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Popular Events */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <TrendingUp className="h-6 w-6 text-accent" />
                  Popular Events
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Handpicked experiences selling fast</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('events')} className="group">
                All events
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularEvents.map((event, i) => (
              <Reveal key={event.id} delay={i * 100}>
                <Card
                  className="group cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  onClick={() => navigate('event-detail', { eventId: event.id })}
                >
                  <div className="relative aspect-[4/3] overflow-hidden image-zoom">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                      {event.category}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(event.id); addToast({ title: wishlist.includes(event.id) ? 'Removed from wishlist' : 'Added to wishlist', type: 'success' }) }}
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur transition-transform hover:scale-110"
                    >
                      <Star className={`h-4 w-4 ${wishlist.includes(event.id) ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.venue}, {event.city}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold leading-snug">{event.name}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(event.date)} · {event.time}
                    </div>
                    <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
                        <div className="text-lg font-semibold text-foreground">
                          {fmt(event.startingPrice, event.currency)}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="gap-1 px-2 text-accent-foreground group/btn">
                        Details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Featured Destinations</h2>
            <p className="mt-1 text-sm text-muted-foreground">Where the world&apos;s best events unfold</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {DESTINATIONS.map((dest, i) => (
            <Reveal key={dest.name} delay={i * 100}>
              <button
                onClick={() => navigate('events', { search: dest.name })}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl text-left"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors group-hover:from-black/90" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <MapPin className="h-3 w-3" />
                    {dest.country}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold">{dest.name}</h3>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] backdrop-blur-md transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    {dest.events} events
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why DS Experiences */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why DS Experiences</div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                The standard for premium live event access.
              </h2>
              <p className="mt-3 text-background/70">
                We don&apos;t just sell tickets — we orchestrate the moments that define a lifetime. Every booking is backed by our four uncompromising promises.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'Official Partners', desc: 'Direct allocations from clubs, promoters and venues — never grey market. Every ticket is verifiably authentic.' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'PCI-DSS compliant gateways, 3-D Secure authentication, and buyer protection on every transaction.' },
              { icon: Globe, title: 'Global Inventory', desc: '200+ events across 38 countries, sourced from our network of vetted hospitality partners worldwide.' },
              { icon: Zap, title: 'Instant Confirmation', desc: 'Real-time inventory sync means your booking confirms in seconds, not hours. No waiting, no uncertainty.' },
            ].map((feat, i) => {
              const Icon = feat.icon
              return (
                <Reveal key={feat.title} delay={i * 100}>
                  <div className="h-full rounded-xl border border-background/10 bg-background/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-background/10">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 flex items-center gap-2 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-background/70">{feat.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted/30 p-8 sm:p-12">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Never miss the moment.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Get priority access to ticket releases, exclusive hospitality packages, and members-only offers — delivered to your inbox.
                </p>
              </div>
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 flex-1"
                />
                <Button type="submit" size="lg" className="gap-2">
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </section>

      <PublicFooter />
    </div>
  )
}
