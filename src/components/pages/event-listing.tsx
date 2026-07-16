'use client'

import { useState, useMemo } from 'react'
import { useRouter } from '@/lib/router'
import { PublicHeader } from '@/components/layout/public-header'
import { PublicFooter } from '@/components/layout/public-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { EVENTS, CATEGORIES, formatCurrency, formatDate } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import { ImageWithFallback } from '@/components/image-gallery'
import { Search, SlidersHorizontal, MapPin, Calendar, ArrowRight, X } from 'lucide-react'

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

      {/* Search hero strip */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <h1 className="text-xl font-semibold tracking-tight lg:w-48">Browse Events</h1>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by event, team, venue or city…"
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
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
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider">Filters</h2>
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
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
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-background p-5 scrollbar-thin">
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
              </div>
            </div>
          )}

          {/* Event Cards */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredEvents.length}</span> of {EVENTS.length} events
              </p>
              {(selectedCategories.length > 0 || selectedCities.length > 0) && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.map((c) => (
                    <Badge key={c} variant="secondary" className="gap-1">
                      {c}
                      <button onClick={() => toggleCategory(c)} aria-label="Remove"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                  {selectedCities.map((c) => (
                    <Badge key={c} variant="secondary" className="gap-1">
                      {c}
                      <button onClick={() => toggleCity(c)} aria-label="Remove"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {filteredEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No events match your filters.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="group cursor-pointer overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => navigate('event-detail', { eventId: event.id })}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                      <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                        {event.category}
                      </span>
                      {event.ticketsAvailable < 50 && (
                        <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white">
                          Only {event.ticketsAvailable} left
                        </span>
                      )}
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
                          <div className="text-lg font-semibold">
                            {fmt(event.startingPrice, event.currency)}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[11px]">
                          {event.ticketsAvailable} available
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredEvents.length > 0 && (
              <div className="mt-10 flex justify-center">
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
