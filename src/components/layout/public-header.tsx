'use client'

import { useState } from 'react'
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
import { Search, Menu, X, User, ChevronDown, Ticket, LogOut, LayoutDashboard, Heart, Bell } from 'lucide-react'
import { CurrencySwitcher } from '@/components/currency-switcher'

export function PublicHeader() {
  const { navigate } = useRouter()
  const { user, logout, wishlist } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    navigate('events', { search: searchQuery })
  }

  const initials = user ? user.name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2) : ''

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="DS Experiences home"
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="hidden sm:block text-left leading-none">
              <div className="text-base font-semibold tracking-tight">DS Experiences</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Premium Ticketing</div>
            </div>
          </button>

          {/* Search bar — desktop */}
          <div className="hidden flex-1 max-w-xl md:flex">
            <div className="flex w-full items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search events, teams, cities or dates…"
                className="h-5 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
              <Button size="sm" onClick={handleSearch} className="rounded-full px-4">Search</Button>
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
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
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
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full border border-border bg-background p-1 pr-3 transition-colors hover:bg-muted">
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
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('register')}
                  className="hidden sm:inline-flex"
                >
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

        {/* Mobile search */}
        {mobileOpen && (
          <div className="border-t border-border/60 py-3 md:hidden">
            <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search events…"
                className="h-5 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
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
                  <Button variant="outline" size="sm" onClick={() => { navigate('register'); setMobileOpen(false) }}>Register</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
