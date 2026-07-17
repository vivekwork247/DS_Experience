'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/lib/router'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { EVENTS, CATEGORIES } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import { PremiumEventCard } from '@/components/premium-event-card'
import { Search, SlidersHorizontal, X, Compass } from 'lucide-react'
import { motion } from 'framer-motion'

interface FilterPanelProps {
  selectedCategories: string[]
  selectedCities: string[]
  priceRange: number[]
  cities: string[]
  onToggleCategory: (cat: string) => void
  onToggleCity: (city: string) => void
  onPriceChange: (range: number[]) => void
  onClear: () => void
  fmt: (amount: number, fromCurrency?: string) => string
}

function FilterPanel({
  selectedCategories,
  selectedCities,
  priceRange,
  cities,
  onToggleCategory,
  onToggleCity,
  onPriceChange,
  onClear,
  fmt,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.name}`}
                checked={selectedCategories.includes(cat.name)}
                onCheckedChange={() => onToggleCategory(cat.name)}
              />
              <Label htmlFor={`cat-${cat.name}`} className="cursor-pointer text-sm font-normal">
                {cat.name} <span className="text-muted-foreground">({cat.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">City</h3>
        <div className="max-h-48 space-y-2 overflow-y-auto scrollbar-thin pr-1">
          {cities.map((city) => (
            <div key={city} className="flex items-center space-x-2">
              <Checkbox
                id={`city-${city}`}
                checked={selectedCities.includes(city)}
                onCheckedChange={() => onToggleCity(city)}
              />
              <Label htmlFor={`city-${city}`} className="cursor-pointer text-sm font-normal">{city}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={onPriceChange}
            min={0}
            max={3000}
            step={50}
            className="my-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="rounded-md bg-muted px-2 py-1">{fmt(priceRange[0])}</span>
            <span className="text-muted-foreground">to</span>
            <span className="rounded-md bg-muted px-2 py-1">{fmt(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold">Hospitality</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="hospitality-yes" />
            <Label htmlFor="hospitality-yes" className="cursor-pointer text-sm font-normal">Hospitality packages only</Label>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  )
}

export function EventListingPage() {
  const { route, navigate } = useRouter()
  const fmt = useCurrencyFormatter()
  const initialSearch = (route.params?.search as string) || ''
  const initialCategory = (route.params?.category as string) || ''

  const [search, setSearch] = useState(initialSearch)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<number[]>([0, 3000])
  const [sortBy, setSortBy] = useState('date-asc')
  const [showFilters, setShowFilters] = useState(false)

  const cities = useMemo(() => Array.from(new Set(EVENTS.map(e => e.city))), [])

  const filteredEvents = useMemo(() => {
    let result = EVENTS.filter((e) => {
      const matchesSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.city.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(e.category)
      const matchesCity = selectedCities.length === 0 || selectedCities.includes(e.city)
      const matchesPrice = e.startingPrice >= priceRange[0] && e.startingPrice <= priceRange[1]
      return matchesSearch && matchesCategory && matchesCity && matchesPrice
    })

    result = [...result].sort((a, b) => {
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice
      if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice
      return 0
    })

    return result
  }, [search, selectedCategories, selectedCities, priceRange, sortBy])

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }
  const toggleCity = (city: string) => {
    setSelectedCities((prev) => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city])
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedCities([])
    setPriceRange([0, 3000])
    setSearch('')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      {/* Cinematic hero strip */}
      <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=85"
            alt="Concert atmosphere"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/70 to-foreground" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-transparent to-foreground" />
        </div>
        {/* Ambient orbs */}
        <div className="orb-ambient-1 pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-amber-500/30 blur-[100px]" />
        <div className="orb-ambient-2 pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-rose-500/20 blur-[100px]" />

        <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 text-accent" />
              <span className="font-medium">Explore the world&apos;s premium events</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Browse Events
            </h1>
            <p className="mt-2 max-w-xl text-sm text-background/60">
              Search by event, team, venue, or city — then book your seat at the experience of a lifetime.
            </p>
          </motion.div>

          {/* Search + sort row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-3 lg:flex-row lg:items-center"
          >
            <div className="group relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-background/50 transition-colors group-focus-within:text-accent" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by event, team, venue or city…"
                className="h-12 rounded-xl border-white/15 bg-white/5 pl-11 text-background placeholder:text-background/40 backdrop-blur-md focus-visible:border-accent focus-visible:ring-accent/20"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 w-full rounded-xl border-white/15 bg-white/5 text-background backdrop-blur-md focus:border-accent sm:w-52">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date (earliest)</SelectItem>
                <SelectItem value="date-desc">Date (latest)</SelectItem>
                <SelectItem value="price-asc">Price (low to high)</SelectItem>
                <SelectItem value="price-desc">Price (high to low)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-white/15 bg-white/5 text-background backdrop-blur-md hover:bg-white/10 hover:text-background lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </motion.div>

          {/* Quick category chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setSelectedCategories([])}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                selectedCategories.length === 0
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-white/15 bg-white/5 text-background/80 hover:border-accent/50 hover:bg-accent/10 hover:text-accent'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => toggleCategory(cat.name)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                  selectedCategories.includes(cat.name)
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-white/15 bg-white/5 text-background/80 hover:border-accent/50 hover:bg-accent/10 hover:text-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-5 shadow-premium-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                  <SlidersHorizontal className="h-4 w-4 text-accent" />
                  Filters
                </h2>
              </div>
              <FilterPanel
                selectedCategories={selectedCategories}
                selectedCities={selectedCities}
                priceRange={priceRange}
                cities={cities}
                onToggleCategory={toggleCategory}
                onToggleCity={toggleCity}
                onPriceChange={setPriceRange}
                onClear={clearFilters}
                fmt={fmt}
              />
            </div>
          </aside>

          {/* Mobile Filters Sheet */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-background p-5 scrollbar-thin"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterPanel
                  selectedCategories={selectedCategories}
                  selectedCities={selectedCities}
                  priceRange={priceRange}
                  cities={cities}
                  onToggleCategory={toggleCategory}
                  onToggleCity={toggleCity}
                  onPriceChange={setPriceRange}
                  onClear={clearFilters}
                  fmt={fmt}
                />
              </motion.div>
            </div>
          )}

          {/* Event Cards */}
          <div className="flex-1">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> of {EVENTS.length} events
              </p>
              {(selectedCategories.length > 0 || selectedCities.length > 0) && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.map((c) => (
                    <Badge key={c} variant="secondary" className="gap-1 bg-accent/15 text-accent-foreground">
                      {c}
                      <button onClick={() => toggleCategory(c)} aria-label="Remove"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                  {selectedCities.map((c) => (
                    <Badge key={c} variant="secondary" className="gap-1 bg-accent/15 text-accent-foreground">
                      {c}
                      <button onClick={() => toggleCity(c)} aria-label="Remove"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-16 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-base font-medium text-foreground">No events match your filters.</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or clearing filters.</p>
                <Button variant="outline" size="sm" className="mt-5" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event, i) => (
                  <PremiumEventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredEvents.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
