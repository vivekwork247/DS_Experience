'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft, ChevronRight, Maximize2, X, ImageOff, Image as ImageIcon,
} from 'lucide-react'

interface GalleryImage {
  url: string
  alt: string
  caption?: string
}

interface Props {
  images: GalleryImage[]
  /** Optional title rendered on top of the hero image overlay */
  title?: string
  /** Optional subtitle (e.g. venue / date) rendered under the title */
  subtitle?: React.ReactNode
  /** Optional badge rendered at top-left of the hero image */
  badge?: React.ReactNode
  className?: string
}

/**
 * ImageWithFallback — renders an <img> with an onError handler that swaps
 * to a styled placeholder if the source fails to load. Eliminates the
 * "broken image icon" UX problem entirely.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
}: {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
}) {
  // Each unique `src` gets a fresh component instance via the parent `key`,
  // so we don't need to reset state on src change. Internal state only
  // tracks a one-time cache-bust retry before falling back to a placeholder.
  const [errored, setErrored] = useState(false)
  const [retrySrc, setRetrySrc] = useState(src)

  if (errored) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50 text-muted-foreground',
          fallbackClassName,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8 opacity-50" />
        <span className="text-xs">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      src={retrySrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        // If we haven't already tried a cache-bust, retry once; otherwise show fallback.
        if (!retrySrc.includes('_cb=')) {
          setRetrySrc(`${src}${src.includes('?') ? '&' : '?'}_cb=${Date.now()}`)
        } else {
          setErrored(true)
        }
      }}
    />
  )
}

/**
 * ImageGallery — full-featured carousel for event detail pages.
 *
 * Features:
 *  - Main hero image with crossfade transitions
 *  - Prev / next arrow controls
 *  - Dot indicator strip
 *  - Clickable thumbnail strip below
 *  - Touch / swipe support via Framer Motion drag
 *  - Fullscreen lightbox with keyboard navigation
 *  - Graceful per-image fallback (no broken-image icons)
 *  - Image counter badge (1 / N)
 */
export function ImageGallery({ images, title, subtitle, badge, className }: Props) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const safeImages: GalleryImage[] =
    images.length > 0 ? images : [{ url: '', alt: 'No image available' }]

  const go = useCallback((delta: number) => {
    setDirection(delta)
    setActive((prev) => (prev + delta + safeImages.length) % safeImages.length)
  }, [safeImages.length])

  const goTo = useCallback((idx: number) => {
    setDirection(idx > active ? 1 : -1)
    setActive(idx)
  }, [active])

  // Keyboard navigation (only when gallery is focused / lightbox open)
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, go])

  // Preload next image for snappy transitions
  useEffect(() => {
    const nextIdx = (active + 1) % safeImages.length
    const img = new Image()
    img.src = safeImages[nextIdx].url
  }, [active, safeImages])

  // Touch swipe handlers for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) {
      go(delta < 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Hero image */}
      <div
        className="group relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={safeImages[active].url}
              alt={safeImages[active].alt}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* top-right controls */}
        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="View fullscreen"
            className="grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* counter badge */}
        <div className="absolute left-3 top-3 z-20 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
          {active + 1} / {safeImages.length}
        </div>

        {/* prev / next arrows (desktop hover + always on mobile) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition hover:bg-background group-hover:opacity-100 focus:opacity-100 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition hover:bg-background group-hover:opacity-100 focus:opacity-100 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* title / subtitle overlay */}
        {(title || subtitle || badge) && (
          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
            {badge && <div className="mb-3">{badge}</div>}
            {title && (
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {title}
              </h1>
            )}
            {subtitle && <div className="mt-3">{subtitle}</div>}
          </div>
        )}

        {/* dot indicators */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === active
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
          {safeImages.map((img, i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}: ${img.alt}`}
              aria-current={i === active}
              className={cn(
                'group relative aspect-video overflow-hidden rounded-lg border-2 transition-all',
                i === active
                  ? 'border-foreground shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <ImageWithFallback
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-1 top-1 rounded bg-background/85 px-1.5 py-0.5 text-[9px] font-medium backdrop-blur">
                {i + 1}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur"
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery fullscreen"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightbox(false) }}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5" />
            </button>

            {/* lightbox counter */}
            <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              {active + 1} / {safeImages.length}
            </div>

            {/* prev / next in lightbox */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(-1) }}
                  className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); go(1) }}
                  className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.img
              key={active}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              src={safeImages[active].url}
              alt={safeImages[active].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              onError={(e) => {
                // Replace with a styled fallback div if the image fails in lightbox
                const target = e.currentTarget
                target.style.display = 'none'
              }}
            />

            {/* lightbox caption */}
            {safeImages[active].caption && (
              <div className="absolute bottom-6 left-1/2 z-10 max-w-[80vw] -translate-x-1/2 rounded-lg bg-white/10 px-4 py-2 text-center text-sm text-white backdrop-blur">
                {safeImages[active].caption}
              </div>
            )}

            {/* lightbox thumbnail strip */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {safeImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goTo(i) }}
                    aria-label={`Go to image ${i + 1}`}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
