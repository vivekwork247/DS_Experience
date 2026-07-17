'use client'

import { useRouter } from '@/lib/router'
import { useStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/image-gallery'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import { MapPin, Calendar, ArrowRight, Star, Flame, Clock } from 'lucide-react'
import { formatCurrency, formatDate, type EventItem } from '@/lib/mock-data'
import { motion } from 'framer-motion'

interface PremiumEventCardProps {
  event: EventItem
  index?: number
  variant?: 'default' | 'feature'
}

export function PremiumEventCard({ event, index = 0, variant = 'default' }: PremiumEventCardProps) {
  const { navigate } = useRouter()
  const { wishlist, toggleWishlist, addToast } = useStore()
  const fmt = useCurrencyFormatter()
  const isWishlisted = wishlist.includes(event.id)
  const isLowStock = event.ticketsAvailable < 50
  const isFeature = variant === 'feature'

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(event.id)
    addToast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      type: 'success',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card
        className="group relative h-full cursor-pointer overflow-hidden border-border/60 p-0 card-premium hover:border-accent/40"
        onClick={() => navigate('event-detail', { eventId: event.id })}
      >
        {/* Image */}
        <div className={`relative ${isFeature ? 'aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden image-zoom-tilt`}>
          <ImageWithFallback
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover"
          />
          {/* Multi-layer gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />

          {/* Top-left: category badge */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
              {event.category}
            </span>
            {isLowStock && (
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                <Flame className="h-3 w-3" />
                {event.ticketsAvailable} left
              </span>
            )}
          </div>

          {/* Top-right: wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/20 transition-all duration-300 hover:scale-110 hover:bg-white/25"
          >
            <Star
              className={`h-4 w-4 transition-all ${
                isWishlisted ? 'fill-rose-400 text-rose-400' : 'text-white'
              }`}
            />
          </button>

          {/* Bottom: location + date overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/80">
              <Calendar className="h-3 w-3" />
              {formatDate(event.date)} · {event.time}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent-foreground">
            {event.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          {/* Footer: price + CTA */}
          <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
              <div className="text-xl font-bold tracking-tight">
                <span className="text-gradient-shimmer">
                  {fmt(event.startingPrice, event.currency)}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="group/btn gap-1 px-3 text-xs font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

/* Compact card variant for grids */
export function PremiumEventCardCompact({ event, index = 0 }: PremiumEventCardProps) {
  const { navigate } = useRouter()
  const fmt = useCurrencyFormatter()
  const isLowStock = event.ticketsAvailable < 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card
        className="group relative h-full cursor-pointer overflow-hidden border-border/60 p-0 card-premium hover:border-accent/40"
        onClick={() => navigate('event-detail', { eventId: event.id })}
      >
        <div className="relative aspect-[4/3] overflow-hidden image-zoom-tilt">
          <ImageWithFallback
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
            {event.category}
          </span>
          {isLowStock && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-lg">
              <Clock className="h-2.5 w-2.5" />
              {event.ticketsAvailable} left
            </span>
          )}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1 text-[11px] font-medium drop-shadow-md">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{event.name}</h3>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(event.date)} · {event.time}
          </div>
          <div className="mt-3 flex items-end justify-between border-t border-border/60 pt-3">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">From</div>
              <div className="text-base font-bold tracking-tight">
                {fmt(event.startingPrice, event.currency)}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="group/btn gap-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground"
            >
              View
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
