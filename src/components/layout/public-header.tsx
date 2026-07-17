'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Menu, X, User, ChevronDown, Ticket, LogOut, LayoutDashboard, Heart, Bell, Sparkles } from 'lucide-react'
import { CurrencySwitcher } from '@/components/currency-switcher'
import { motion, AnimatePresence } from 'framer-motion'

export function PublicHeader() {
  const { navigate } = useRouter()
  const { user, logout, wishlist } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  // Scroll-aware styling — switch to glass-strong after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = () => {
    navigate('events', { search: searchQuery })
  }

  const initials = user ? user.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2) : ''

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-premium-sm'
          : 'border-b border-white/10 bg-transparent'
      }`}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-18">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="group flex items-center gap-2.5 transition-all hover:opacity-90"
            aria-label="DS Experiences home"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="hidden text-left leading-none sm:block">
              <div className="text-base font-bold tracking-tight">DS Experiences</div>
              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Premium Ticketing
              </div>
            </div>
          </button>

          {/* Search bar — desktop */}
          <div className="hidden flex-1 max-w-xl md:flex">
            <div className="group flex w-full items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2.5 transition-all duration-300 focus-within:border-accent/50 focus-within:bg-background focus-within:shadow-premium-sm">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search events, teams, cities or dates…"
                className="h-5 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
              />
              <Button
                size="sm"
                onClick={handleSearch}
                className="btn-shimmer rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-white shadow-md shadow-amber-500/20 hover:brightness-110"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:inline-flex"
                  onClick={() => navigate('customer-dashboard', { tab: 'wishlist' })}
                  aria-label="Wishlist"
                >
                  <Heart className="h-4 w-4" />
                  {wishlist.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-[9px] font-bold text-white shadow-md">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden sm:inline-flex"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent pulse-ring" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-border bg-background p-1 pr-3 transition-all hover:border-accent/40 hover:shadow-premium-sm">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="hidden text-xs font-medium sm:inline">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('customer-dashboard')} className="gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('customer-dashboard', { tab: 'bookings' })} className="gap-2 cursor-pointer">
                      <Ticket className="h-4 w-4" />
                      My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('customer-dashboard', { tab: 'profile' })} className="gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); navigate('home') }} className="gap-2 cursor-pointer text-rose-600 focus:text-rose-700">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('login')}
                  className="hidden sm:inline-flex"
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('register')}
                  className="btn-shimmer hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:brightness-110 sm:inline-flex"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Register
                </Button>
              </>
            )}

            <CurrencySwitcher compact />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  B2B
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">B2B Portal</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('b2b-login')} className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Company Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('b2b-register')} className="gap-2 cursor-pointer">
                  <Ticket className="h-4 w-4" />
                  Register Company
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('admin-dashboard')} className="gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile search slide-down */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto px-4 py-4 sm:px-6">
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search events…"
                  className="h-5 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                />
                <Button size="sm" onClick={handleSearch}>Go</Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {user ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { navigate('customer-dashboard'); setMobileOpen(false) }}>Dashboard</Button>
                    <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); navigate('home') }}>Sign out</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { navigate('login'); setMobileOpen(false) }}>Login</Button>
                    <Button size="sm" onClick={() => { navigate('register'); setMobileOpen(false) }} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
