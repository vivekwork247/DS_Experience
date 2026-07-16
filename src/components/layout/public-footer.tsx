'use client'

import { useRouter } from '@/lib/router'
import { Ticket, Mail, Phone, MapPin, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react'

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
    <footer className="mt-auto border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="text-base font-semibold tracking-tight">DS Experiences</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">Premium Ticketing</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">
              The world&apos;s most exclusive live event experiences — from UEFA Champions League finals to Formula 1 hospitality.
            </p>
            <div className="mt-4 space-y-2 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> support@dsxperiences.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +44 20 7946 0958</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> 1 Mayfair Place, London SW1</div>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-sm text-sidebar-foreground/80 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-sidebar-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-sidebar-foreground/60">
            © 2026 DS Experiences Ltd. Registered in England No. 08247196. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
              <button
                key={i}
                className="grid h-8 w-8 place-items-center rounded-full border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:border-accent hover:text-accent"
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
