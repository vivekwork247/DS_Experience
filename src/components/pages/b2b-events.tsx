'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { B2B_GROUPS } from '@/components/pages/b2b-groups'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useStore } from '@/lib/store'
import { EVENTS, CATEGORIES, formatCurrency, formatDate } from '@/lib/mock-data'
import { Bell, Search, ShoppingCart, Filter, Star, MapPin, Calendar, Check } from 'lucide-react'

export function B2BEventsPage() {
  const { navigate } = useRouter()
  const { addToCart } = useStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('date')

  let filtered = EVENTS.filter(e =>
    (category === 'all' || e.category === category) &&
    (search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase()))
  )
  if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.startingPrice - b.startingPrice)
  if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.startingPrice - a.startingPrice)

  const bookEvent = (eventId: string) => {
    navigate('event-detail', { eventId })
  }

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-events"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Search Events"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=23" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Event Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse and book B2B-rate tickets across all categories.</p>
      </div>

      {/* Filters */}
      <Card className="mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events or cities…"
              className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-full sm:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-9 w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort: Date</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <Card key={event.id} className="group cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => bookEvent(event.id)}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={event.image} alt={event.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-medium backdrop-blur">{event.category}</span>
              <Badge className="absolute right-3 top-3 gap-1 bg-emerald-500/90 text-white hover:bg-emerald-500">
                <Star className="h-3 w-3" />
                B2B Rate
              </Badge>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1.5 text-xs"><MapPin className="h-3.5 w-3.5" />{event.venue}, {event.city}</div>
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
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From (B2B)</div>
                  <div className="text-lg font-semibold text-emerald-700">
                    {formatCurrency(Math.round(event.startingPrice * 0.85), event.currency)}
                  </div>
                  <div className="text-[10px] text-muted-foreground line-through">
                    {formatCurrency(event.startingPrice, event.currency)} retail
                  </div>
                </div>
                <Button size="sm" className="gap-1">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Book
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="grid place-items-center py-16 text-center">
          <Filter className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No events match your filters.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(''); setCategory('all') }}>
            Clear filters
          </Button>
        </div>
      )}
    </DashboardShell>
  )
}
