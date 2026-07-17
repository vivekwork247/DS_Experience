'use client'

import { useRouter } from '@/lib/router'
import { Ticket, Mail, Phone, MapPin, Twitter, Instagram, Facebook, Linkedin, Sparkles, ArrowRight } from 'lucide-react'

export function PublicFooter() {
  const { navigate } = useRouter()

  const cols = [
    {
      title: 'Discover',
      links: [
        { label: 'All Events', action: () => navigate('events') },
        { label: 'Sports', action: () => navigate('events', { category: 'Sports' }) },
        { label: 'Concerts', action: () => navigate('events', { category: 'Concerts' }) },
        { label: 'Formula 1', action: () => navigate('events', { category: 'Formula 1' }) },
        { label: 'Hospitality', action: () => navigate('events', { category: 'Hospitality' }) },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', action: () => navigate('home') },
        { label: 'B2B Partnership', action: () => navigate('b2b-login') },
        { label: 'Become a Partner', action: () => navigate('b2b-register') },
        { label: 'Admin Portal', action: () => navigate('admin-dashboard') },
        { label: 'Careers', action: () => navigate('home') },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', action: () => navigate('customer-dashboard') },
        { label: 'My Bookings', action: () => navigate('customer-dashboard') },
        { label: 'Refund Policy', action: () => navigate('home') },
        { label: 'Terms & Conditions', action: () => navigate('home') },
        { label: 'Privacy Policy', action: () => navigate('home') },
      ],
    },
  ]

  return (
    <footer className="mt-auto relative overflow-hidden border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Ambient orb */}
      <div className="orb-ambient-1 pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="orb-ambient-2 pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-rose-500/10 blur-[100px]" />

      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="container relative mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="text-base font-bold tracking-tight">DS Experiences</div>
                <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/60">
                  Premium Ticketing
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">
              The world&apos;s most exclusive live event experiences — from UEFA Champions League
              finals to Formula 1 hospitality.
            </p>
            <div className="mt-5 space-y-2 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-2 transition-colors hover:text-accent">
                <Mail className="h-4 w-4 text-accent" /> support@dsxperiences.com
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="h-4 w-4 text-accent" /> +44 20 7946 0958
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-accent">
                <MapPin className="h-4 w-4 text-accent" /> 1 Mayfair Place, London SW1
              </div>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/60">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="group flex items-center gap-1 text-sm text-sidebar-foreground/80 transition-all hover:translate-x-1 hover:text-accent"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/50">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            100% Official Tickets
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            PCI-DSS Secure Payments
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Instant Confirmation
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            24/7 Concierge Support
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-sidebar-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-sidebar-foreground/60">
            © 2026 DS Experiences Ltd. Registered in England No. 08247196. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
              <button
                key={i}
                className="grid h-9 w-9 place-items-center rounded-full border border-sidebar-border text-sidebar-foreground/70 transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                aria-label="Social media link"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
