'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/lib/router'
import { useStore } from '@/lib/store'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EVENTS, CATEGORIES, DESTINATIONS } from '@/lib/mock-data'
import { PremiumEventCard, PremiumEventCardCompact } from '@/components/premium-event-card'
import {
  Trophy, Music, Car, CircleDot, Wine, ArrowRight, MapPin, Calendar,
  ShieldCheck, CreditCard, Globe, Zap, Star, Sparkles, ChevronRight,
  TrendingUp, Circle, Quote, Award, Flame
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ICONS: Record<string, any> = {
  Trophy, Music, Car, CircleDot, Wine, Circle
}

// Cinematic hero images — immersive, full-bleed
const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&q=85',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=85',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&q=85',
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1920&q=85',
]

const SLIDE_LABELS = [
  'UEFA Champions League · Wembley',
  'Coldplay · Music of the Spheres',
  'Monaco Grand Prix · Street Circuit',
  'El Clásico · Santiago Bernabéu',
]

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
  const { addToast } = useStore()
  const popularEvents = EVENTS.filter(e => e.featured).slice(0, 4)
  const trendingEvents = EVENTS.slice(2, 8)
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 250])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Track active slide for label + dots
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({ title: 'Subscribed!', description: 'You will receive our next newsletter soon', type: 'success' })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      {/* ===================== CINEMATIC HERO ===================== */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-foreground"
      >
        {/* Parallax background slideshow */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          {HERO_SLIDES.map((src, i) => (
            <div
              key={i}
              className={`hero-slide ${i === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <img
                src={src}
                alt={SLIDE_LABELS[i]}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Gradient overlays — multi-layer for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        {/* Floating ambient orbs */}
        <div className="orb-ambient-1 pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="orb-ambient-2 pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-rose-500/15 blur-[120px]" />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/90 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-medium tracking-wide">Official hospitality partner of 200+ events worldwide</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Extraordinary</span>
              <span className="block">moments.</span>
              <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Unforgettable experiences.
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-base text-white/70 sm:text-lg"
            >
              From UEFA Champions League finals to Formula 1 paddocks and the world&apos;s biggest
              concert stages — secure your seat at the events that matter, with hospitality that
              elevates every moment.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onSubmit={(e) => { e.preventDefault(); navigate('events') }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 backdrop-blur-md transition-all focus-within:border-amber-400/50 focus-within:bg-white/10">
                <Calendar className="h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search event, team or artist…"
                  className="h-6 border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/40 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button
                size="lg"
                type="submit"
                className="btn-shimmer gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:brightness-110"
              >
                Browse all events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>

            {/* Quick category chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {[
                'UEFA Champions League Tickets',
                'Formula 1',
                'Concerts',
                'Hospitality Packages',
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate('events', { search: tag })}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Slide indicator + live inventory card */}
          <div className="pointer-events-none absolute right-4 bottom-6 hidden lg:right-8 lg:bottom-8 lg:block">
            <div className="glass-strong pointer-events-auto rounded-2xl p-5 shadow-premium-lg">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-ring" />
                Live inventory · refreshed every 60s
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Events', value: '200+' },
                  { label: 'Countries', value: '38' },
                  { label: 'On sale', value: '1.2K' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`View slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeSlide
                      ? 'w-8 bg-amber-400'
                      : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mobile: active slide label */}
          <div className="absolute bottom-6 left-4 right-4 lg:hidden">
            <div className="glass-dark rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-white/90">
                <span className="h-2 w-2 rounded-full bg-amber-400 pulse-ring" />
                {SLIDE_LABELS[activeSlide]}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:block">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1 text-white/40"
            >
              <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
              <ChevronRight className="h-4 w-4 rotate-90" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===================== TRUSTED-BY MARQUEE ===================== */}
      <section className="border-b border-border bg-background py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Trusted by the world&apos;s most discerning event-goers
            </p>
          </div>
          <div className="relative flex overflow-hidden">
            <div className="marquee-track flex shrink-0 items-center gap-12 pr-12">
              {['UEFA', 'FIFA', 'Formula 1', 'Wimbledon', 'Live Nation', 'AEG', 'Coldplay', 'Adele'].map((brand, i) => (
                <span key={i} className="whitespace-nowrap text-lg font-bold tracking-tight text-muted-foreground/40">
                  {brand}
                </span>
              ))}
            </div>
            <div className="marquee-track flex shrink-0 items-center gap-12 pr-12" aria-hidden>
              {['UEFA', 'FIFA', 'Formula 1', 'Wimbledon', 'Live Nation', 'AEG', 'Coldplay', 'Adele'].map((brand, i) => (
                <span key={i} className="whitespace-nowrap text-lg font-bold tracking-tight text-muted-foreground/40">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED CATEGORIES ===================== */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Explore</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Browse by category
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick your passion — every category is curated by hospitality specialists.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('events')} className="group">
              View all
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon]
            return (
              <Reveal key={cat.name} delay={i * 60}>
                <button
                  onClick={() => navigate('events', { category: cat.name })}
                  className="group relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-premium-lg"
                >
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${cat.gradient} blur-2xl transition-transform duration-700 group-hover:scale-150`} />
                  <div className="relative">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-foreground text-background transition-all duration-500 group-hover:rotate-6 group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold tracking-tight">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{cat.count} events</p>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ===================== POPULAR EVENTS (FEATURED) ===================== */}
      <section className="relative overflow-hidden border-y border-border bg-gradient-to-b from-muted/30 via-background to-background">
        {/* Ambient orb */}
        <div className="orb-ambient-1 pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />

        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  <Flame className="h-4 w-4" />
                  Selling fast
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Popular events
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Handpicked experiences our members are booking right now.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('events')} className="group">
                All events
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularEvents.map((event, i) => (
              <PremiumEventCard key={event.id} event={event} index={i} variant="feature" />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRENDING STRIP ===================== */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                <TrendingUp className="h-4 w-4" />
                Trending now
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                More experiences you might love
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('events')} className="group hidden sm:inline-flex">
              View all
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {trendingEvents.map((event, i) => (
            <PremiumEventCardCompact key={event.id} event={event} index={i} />
          ))}
        </div>
      </section>

      {/* ===================== FEATURED DESTINATIONS ===================== */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Destinations</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Where the world&apos;s best events unfold
              </h2>
              <p className="mt-3 text-sm text-background/60">
                Iconic venues. Legendary cities. The moments that define a lifetime.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {DESTINATIONS.map((dest, i) => (
              <Reveal key={dest.name} delay={i * 100}>
                <button
                  onClick={() => navigate('events', { search: dest.name })}
                  className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl text-left shadow-premium"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-colors duration-500 group-hover:from-black/90" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <MapPin className="h-3 w-3" />
                      {dest.country}
                    </div>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight">{dest.name}</h3>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium backdrop-blur-md transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      {dest.events} events
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY DS EXPERIENCES ===================== */}
      <section className="relative overflow-hidden bg-background">
        {/* Ambient orbs */}
        <div className="orb-ambient-1 pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="orb-ambient-2 pointer-events-none absolute -right-32 bottom-32 h-96 w-96 rounded-full bg-rose-500/10 blur-[120px]" />

        <div className="container relative mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Why DS Experiences</div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                The standard for premium live event access.
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                We don&apos;t just sell tickets — we orchestrate the moments that define a lifetime.
                Every booking is backed by our four uncompromising promises.
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
                  <div className="group h-full rounded-2xl border border-border/60 bg-card p-6 shadow-premium-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-premium-lg">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 flex items-center gap-2 text-base font-semibold tracking-tight">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feat.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIAL ===================== */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex justify-center">
                <Quote className="h-10 w-10 text-accent" />
              </div>
              <p className="text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl">
                &ldquo;From the moment we booked to the final whistle at Wembley, DS Experiences
                handled every detail with a level of precision and warmth that made the entire
                weekend feel <span className="text-gradient-shimmer">truly extraordinary</span>.&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <Award className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">James Whitmore</div>
                  <div className="text-xs text-muted-foreground">Gold Member · London</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground via-foreground to-foreground/80 p-8 text-background shadow-premium-lg sm:p-12 lg:p-16">
            {/* Ambient orbs */}
            <div className="orb-ambient-1 pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/30 blur-[100px]" />
            <div className="orb-ambient-2 pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-rose-500/20 blur-[100px]" />

            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  Priority access
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Never miss the moment.
                </h2>
                <p className="mt-4 text-background/70">
                  Get priority access to ticket releases, exclusive hospitality packages, and
                  members-only offers — delivered to your inbox.
                </p>
              </div>
              <form onSubmit={handleNewsletter} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-12 flex-1 rounded-xl border-background/20 bg-background/10 px-4 text-background placeholder:text-background/40 backdrop-blur-md focus-visible:border-accent focus-visible:ring-accent/20"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="btn-shimmer h-12 gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:brightness-110"
                >
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
