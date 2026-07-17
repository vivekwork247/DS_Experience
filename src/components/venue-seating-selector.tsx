'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import {
  VenueLayout, VenueBlock, getVenueLayout, TIER_COLORS, VIEW_QUALITY_BADGE,
} from '@/lib/venue-layouts'
import { EventItem } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  Users, Check, ArrowRight, ShieldCheck, MapPin, Eye, ChevronRight,
  Info, Ticket as TicketIcon, Minus, Plus,
} from 'lucide-react'

/**
 * The booking payload produced by this selector.
 *
 * Per the client's booking workflow, customers do NOT pick individual seats.
 * They pick a block (ticket category) and then a quantity of attendees.
 * The system allocates specific seats at fulfilment time.
 */
export interface SelectedBooking {
  blockId: string
  blockName: string
  blockCode: string
  blockTier: string
  blockColor: string
  /** Per-seat price in the block's native currency */
  price: number
  currency: string
  /** Number of attendees / tickets */
  qty: number
  /** qty * price */
  total: number
}

interface Props {
  event: EventItem
  /** Live notification of the current booking (block + qty) so the parent
   *  can update its sticky bar in real time. */
  onSelect?: (booking: SelectedBooking | null) => void
  /** Fired when the customer clicks "Continue to checkout". */
  onContinue?: (booking: SelectedBooking) => void
  /** Max tickets per booking (default 8). */
  maxSeats?: number
}

// ---------- Field renderers (venue-specific background) ----------

function FootballField() {
  return (
    <div className="absolute left-[28%] top-[36%] h-[28%] w-[44%] rounded border-2 border-emerald-700/40 bg-emerald-500/25">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-700/30" />
      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-700/30" />
      <div className="absolute left-0 top-1/2 h-14 w-px -translate-y-1/2 border-l border-emerald-700/30" />
      <div className="absolute right-0 top-1/2 h-14 w-px -translate-y-1/2 border-l border-emerald-700/30" />
      <div className="absolute bottom-0 left-1/2 h-7 w-14 -translate-x-1/2 border-x border-b border-emerald-700/30" />
      <div className="absolute top-0 left-1/2 h-7 w-14 -translate-x-1/2 border-x border-t border-emerald-700/30" />
    </div>
  )
}

function CricketField() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[44%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-emerald-700/30 bg-emerald-500/20" />
      <div className="absolute left-1/2 top-1/2 h-[34%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-emerald-700/20" />
      <div className="absolute left-1/2 top-1/2 h-[18%] w-[6%] -translate-x-1/2 -translate-y-1/2 rounded bg-amber-200/50">
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-amber-700/40" />
      </div>
    </>
  )
}

function F1Circuit() {
  return (
    <svg
      viewBox="0 0 100 70"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <path
        d="M 15,55 L 15,20 L 30,10 L 55,10 L 65,18 L 65,30 L 75,33 L 85,28 L 88,40 L 80,50 L 62,52 L 56,60 L 36,62 L 26,60 Z"
        fill="none"
        stroke="#475569"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="dark:stroke-slate-500"
        opacity="0.55"
      />
      <path
        d="M 15,55 L 15,20 L 30,10 L 55,10 L 65,18 L 65,30 L 75,33 L 85,28 L 88,40 L 80,50 L 62,52 L 56,60 L 36,62 L 26,60 Z"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="0.6"
        strokeDasharray="1.5,1.5"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <line x1="15" y1="48" x2="15" y2="55" stroke="#ef4444" strokeWidth="1.2" />
      <circle cx="15" cy="51" r="1.2" fill="#ef4444" />
    </svg>
  )
}

function TennisCourt() {
  return (
    <div className="absolute left-[30%] top-[34%] h-[32%] w-[40%] rounded border-2 border-emerald-700/50 bg-emerald-600/25">
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/70" />
      <div className="absolute left-1/2 top-[18%] h-[64%] w-px -translate-x-1/2 bg-white/50" />
      <div className="absolute left-[12%] top-[18%] h-[64%] w-px bg-white/40" />
      <div className="absolute right-[12%] top-[18%] h-[64%] w-px bg-white/40" />
      <div className="absolute left-[12%] top-[18%] right-[12%] h-px bg-white/40" />
      <div className="absolute left-[12%] bottom-[18%] right-[12%] h-px bg-white/40" />
    </div>
  )
}

function ConcertStage() {
  return (
    <>
      <div className="absolute left-[20%] top-[4%] h-[8%] w-[60%] rounded-b-lg rounded-t-md bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-fuchsia-500/40 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-semibold uppercase tracking-[0.3em] text-fuchsia-200/80">
          Stage
        </div>
      </div>
      <div className="absolute left-[14%] top-[5%] h-[7%] w-[5%] rounded-sm bg-slate-700" />
      <div className="absolute right-[14%] top-[5%] h-[7%] w-[5%] rounded-sm bg-slate-700" />
      <div className="absolute left-[25%] top-[12%] h-[20%] w-[50%] bg-gradient-to-b from-amber-300/15 to-transparent" style={{ clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)' }} />
    </>
  )
}

function fieldFor(type: VenueLayout['type']) {
  switch (type) {
    case 'football': return <FootballField />
    case 'cricket': return <CricketField />
    case 'f1': return <F1Circuit />
    case 'tennis': return <TennisCourt />
    case 'concert': return <ConcertStage />
  }
}

function standLabelsFor(type: VenueLayout['type']) {
  const base = 'pointer-events-none absolute text-[9px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/70'
  switch (type) {
    case 'football':
      return (
        <>
          <div className={cn(base, 'left-1/2 top-1 -translate-x-1/2')}>North Stand</div>
          <div className={cn(base, 'bottom-1 left-1/2 -translate-x-1/2')}>South Stand</div>
          <div className={cn(base, 'left-1 top-1/2 -rotate-90 -translate-y-1/2 origin-center')}>West</div>
          <div className={cn(base, 'right-1 top-1/2 rotate-90 -translate-y-1/2 origin-center')}>East</div>
        </>
      )
    case 'cricket':
      return (
        <>
          <div className={cn(base, 'left-1/2 top-1 -translate-x-1/2')}>Pavilion End</div>
          <div className={cn(base, 'bottom-1 left-1/2 -translate-x-1/2')}>Member&apos;s End</div>
        </>
      )
    case 'f1':
      return (
        <div className={cn(base, 'left-1/2 top-1 -translate-x-1/2')}>
          Start / Finish
        </div>
      )
    case 'tennis':
      return (
        <>
          <div className={cn(base, 'left-1/2 top-1 -translate-x-1/2')}>Royal Box</div>
          <div className={cn(base, 'bottom-1 left-1/2 -translate-x-1/2')}>Umpire&apos;s Chair</div>
        </>
      )
    case 'concert':
      return null
  }
}

// ---------- Venue canvas (shared) ----------

interface CanvasProps {
  layout: VenueLayout
  selectedId: string | null
}

/**
 * VenueCanvas — STATIC visual reference only.
 *
 * Per the client's booking workflow, the venue map is NOT interactive.
 * Customers select a block from the BlockCard list (Step 1), and this map
 * simply renders the venue with the selected block highlighted for visual
 * context. There is no clicking, no hovering, no seat-level interaction.
 *
 * The blocks here are non-interactive <div>s (not buttons), so they cannot
 * be focused, clicked, or tabbed into.
 */
function VenueCanvas({ layout, selectedId }: CanvasProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl border border-border',
        layout.type === 'football' || layout.type === 'cricket' || layout.type === 'tennis'
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20'
          : layout.type === 'f1'
            ? 'bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900/60 dark:to-slate-800/40'
            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      )}
    >
      {/* outer bowl ring */}
      <div className="absolute inset-[3%] rounded-[42%/48%] border-2 border-dashed border-muted-foreground/25" />
      <div className="absolute inset-[6%] rounded-[38%/44%] border border-muted-foreground/15" />

      {/* venue-specific field (pitch / oval / circuit / court / stage) */}
      {fieldFor(layout.type)}

      {/* compass / stand labels */}
      {standLabelsFor(layout.type)}

      {/* blocks — rendered as static visual regions, NOT interactive */}
      {layout.blocks.map((block) => {
        const isSelected = selectedId === block.id
        const isSoldOut = block.available === 0
        const isDimmed = selectedId !== null && !isSelected
        const fillPct = (block.available / block.total) * 100
        return (
          <div
            key={block.id}
            className={cn(
              'absolute flex flex-col items-center justify-center rounded-md border-2 p-1 text-center transition-opacity duration-300',
              isSelected
                ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-black/40 z-20 shadow-[0_0_0_3px_rgba(0,0,0,0.35),0_8px_24px_rgba(0,0,0,0.45)]'
                : 'border-white/30',
              isDimmed && !isSelected && 'opacity-45 saturate-50',
              isSoldOut && 'opacity-40',
            )}
            style={{
              left: `${block.x}%`,
              top: `${block.y}%`,
              width: `${block.w}%`,
              height: `${block.h}%`,
              background: isSoldOut ? '#94a3b8' : block.color,
              color: 'white',
            }}
          >
            <div className="text-[11px] font-bold leading-none drop-shadow">{block.code}</div>
            <div className="mt-0.5 hidden text-[8px] font-medium leading-tight opacity-90 sm:block">
              {block.tier}
            </div>
            {/* availability bar */}
            <div className="mt-1 h-0.5 w-3/4 overflow-hidden rounded-full bg-white/25">
              <div className="h-full bg-white" style={{ width: `${fillPct}%` }} />
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-foreground text-background"
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </motion.div>
            )}
          </div>
        )
      })}

      {/* Selected block label badge (top of map) */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-1/2 top-2 z-30 -translate-x-1/2 rounded-lg border border-border bg-background/95 px-3 py-1.5 text-center shadow-lg backdrop-blur"
          >
            {(() => {
              const b = layout.blocks.find(x => x.id === selectedId)
              if (!b) return null
              return (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} />
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-muted-foreground">· {b.code}</span>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------- Block selection card ----------

function BlockCard({
  block,
  selected,
  onSelect,
  fmt,
}: {
  block: VenueBlock
  selected: boolean
  onSelect: () => void
  fmt: (amount: number, from?: string) => string
}) {
  const soldOut = block.available === 0
  const lowAvail = !soldOut && block.available <= 20
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={soldOut}
      whileHover={!soldOut ? { y: -2 } : undefined}
      whileTap={!soldOut ? { scale: 0.99 } : undefined}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
        selected
          ? 'border-foreground bg-foreground/5 shadow-md'
          : 'border-border bg-card hover:border-foreground/30',
        soldOut && 'cursor-not-allowed opacity-60',
      )}
    >
      {/* tier colour stripe */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: block.color }}
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-xs font-bold text-white"
              style={{ background: block.color }}
            >
              {block.code}
            </span>
            <h4 className="text-sm font-semibold leading-tight">{block.name}</h4>
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{block.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className={cn('h-5 text-[10px]', VIEW_QUALITY_BADGE[block.viewQuality])}>
              <Eye className="mr-1 h-3 w-3" />
              {block.viewQuality}
            </Badge>
            {lowAvail && (
              <Badge variant="outline" className="h-5 bg-rose-500/10 text-[10px] text-rose-600">
                Only {block.available} left
              </Badge>
            )}
            {soldOut && (
              <Badge variant="outline" className="h-5 bg-muted text-[10px] text-muted-foreground">
                Sold out
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Per ticket</div>
          <div className="text-lg font-bold leading-tight">{fmt(block.price, block.currency)}</div>
        </div>
      </div>

      {/* inclusions */}
      <div className="mt-3 grid grid-cols-1 gap-1 pl-2 sm:grid-cols-2">
        {block.inclusions.slice(0, 4).map((inc) => (
          <div key={inc} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Check className="h-3 w-3 shrink-0 text-emerald-600" />
            <span className="truncate">{inc}</span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="mt-3 flex items-center justify-between pl-2">
        <span className="text-[11px] text-muted-foreground">
          {block.available} / {block.total} tickets available
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            selected
              ? 'bg-foreground text-background'
              : soldOut
                ? 'bg-muted text-muted-foreground'
                : 'bg-foreground/5 text-foreground group-hover:bg-foreground/10',
          )}
        >
          {selected ? (
            <>
              <Check className="h-3.5 w-3.5" /> Selected
            </>
          ) : soldOut ? (
            'Sold out'
          ) : (
            <>
              Select block <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
        </span>
      </div>
    </motion.button>
  )
}

// ---------- Quantity stepper (dropdown + plus/minus) ----------

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max: number
}) {
  // Build the dropdown options (1..max)
  const options = Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i)

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Plus / minus stepper for quick adjustments */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center text-base font-semibold tabular-nums">{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Dropdown — covers larger jumps and accessibility */}
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="h-10 w-[140px]" aria-label="Number of tickets">
          <SelectValue placeholder="Select quantity" />
        </SelectTrigger>
        <SelectContent>
          {options.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} {n === 1 ? 'ticket' : 'tickets'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// ---------- Main component ----------

export function VenueSeatingSelector({ event, onSelect, onContinue, maxSeats = 8 }: Props) {
  const layout = useMemo(() => getVenueLayout(event.category, event.venue), [event])
  const [selectedBlock, setSelectedBlock] = useState<VenueBlock | null>(null)
  const [qty, setQty] = useState<number>(1)
  const fmt = useCurrencyFormatter()

  // Build the live booking payload so the parent's sticky bar can reflect it.
  const booking: SelectedBooking | null = useMemo(() => {
    if (!selectedBlock) return null
    return {
      blockId: selectedBlock.id,
      blockName: selectedBlock.name,
      blockCode: selectedBlock.code,
      blockTier: selectedBlock.tier,
      blockColor: selectedBlock.color,
      price: selectedBlock.price,
      currency: selectedBlock.currency,
      qty,
      total: selectedBlock.price * qty,
    }
  }, [selectedBlock, qty])

  // Notify parent whenever the booking changes.
  useEffect(() => {
    onSelect?.(booking)
  }, [booking, onSelect])

  const handleBlockSelect = (block: VenueBlock) => {
    setSelectedBlock(block)
    // Clamp the qty to a valid range for the newly selected block (1..min(maxSeats, block.available))
    const cap = Math.max(1, Math.min(maxSeats, block.available))
    setQty((q) => Math.min(Math.max(1, q), cap))
    // smooth scroll to the quantity panel so the customer can finish the booking
    requestAnimationFrame(() => {
      document.getElementById('qty-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const handleContinue = () => {
    if (!booking || booking.qty < 1) {
      return
    }
    onContinue?.(booking)
  }

  // Maximum quantity the customer can pick for the current block.
  const qtyMax = selectedBlock
    ? Math.max(1, Math.min(maxSeats, selectedBlock.available))
    : maxSeats

  return (
    <div className="space-y-6">
      {/* Header / step indicator */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">1</span>
            <h3 className="text-base font-semibold">{layout.name} — Choose your block</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{layout.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          {(['VIP', 'Hospitality', 'Premium', 'Gold', 'Silver', 'Bronze'] as const).map(t => (
            <span key={t} className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: TIER_COLORS[t] }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Two-column: block list + venue map */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Block list */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {layout.blocks.map(block => (
              <BlockCard
                key={block.id}
                block={block}
                selected={selectedBlock?.id === block.id}
                onSelect={() => handleBlockSelect(block)}
                fmt={fmt}
              />
            ))}
          </div>
        </div>

        {/* Venue map */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            <Card className="overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.venue}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedBlock ? 'Selected block highlighted below — map is for reference only' : 'Choose a block on the left to see it on the map'}
                  </p>
                </div>
                {selectedBlock && (
                  <Badge className="bg-foreground text-[10px] text-background hover:bg-foreground">
                    <span className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ background: selectedBlock.color }} />
                    Selected
                  </Badge>
                )}
              </div>
              <div className="p-3">
                <VenueCanvas
                  layout={layout}
                  selectedId={selectedBlock?.id ?? null}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/20 px-4 py-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Visual reference only — not interactive
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm border border-white/40" style={{ background: '#94a3b8' }} />
                  Sold out
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm border-2 border-white bg-card" />
                  Selected category
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm border border-white/30" style={{ background: '#3b82f6' }} />
                  Available
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Empty-state hint when no block selected */}
      <AnimatePresence>
        {!selectedBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="flex items-center gap-3 border-dashed p-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                Select a block on the left to see it highlighted on the {layout.name.toLowerCase()}. The map is for visual reference only — you will then choose the number of attendees.
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Quantity panel (replaces the old seat grid) */}
      <AnimatePresence mode="wait">
        {selectedBlock && (
          <motion.div
            key={selectedBlock.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            id="qty-panel"
            className="scroll-mt-24"
          >
            <Card className="overflow-hidden p-0">
              <div className="flex flex-col gap-1 border-b border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">2</span>
                    <h3 className="text-base font-semibold">Number of attendees — {selectedBlock.name}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Seats will be allocated together within the selected block.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={VIEW_QUALITY_BADGE[selectedBlock.viewQuality]}>
                    <Eye className="mr-1 h-3 w-3" />
                    {selectedBlock.viewQuality} view
                  </Badge>
                  <Badge variant="outline" className="bg-foreground/5">
                    {fmt(selectedBlock.price, selectedBlock.currency)} / ticket
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
                    {selectedBlock.available} available
                  </Badge>
                </div>
              </div>

              {/* inclusions */}
              <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
                {selectedBlock.inclusions.map(inc => (
                  <span key={inc} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Check className="h-2.5 w-2.5 text-emerald-600" />
                    {inc}
                  </span>
                ))}
              </div>

              {/* quantity + live total */}
              <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="qty-select" className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Select number of tickets
                  </label>
                  <QuantityStepper
                    value={qty}
                    onChange={setQty}
                    max={qtyMax}
                  />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Maximum {qtyMax} per booking · {selectedBlock.available} currently available in this block.
                  </p>
                </div>

                <div className="flex flex-col justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Block</span>
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: selectedBlock.color }} />
                        {selectedBlock.code} · {selectedBlock.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Per ticket</span>
                      <span className="font-medium text-foreground">{fmt(selectedBlock.price, selectedBlock.currency)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Quantity</span>
                      <span className="font-medium text-foreground">{qty}</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Subtotal</div>
                      <div className="text-2xl font-bold">{fmt(booking?.total ?? 0, selectedBlock.currency)}</div>
                    </div>
                    <TicketIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: Booking summary + checkout */}
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="h-4 w-4" />
                  Your booking
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBlock(null)
                    setQty(1)
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <Separator className="my-3" />
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 min-w-10 place-items-center rounded-md px-2 text-xs font-bold text-white"
                      style={{ background: booking.blockColor }}
                    >
                      {booking.blockCode}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{booking.blockName}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.blockTier} · {fmt(booking.price, booking.currency)} × {booking.qty}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Line total</div>
                    <div className="text-lg font-bold">{fmt(booking.total, booking.currency)}</div>
                  </div>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="text-xs text-muted-foreground">Total ({booking.qty} {booking.qty === 1 ? 'ticket' : 'tickets'})</div>
                  <div className="text-2xl font-bold">{fmt(booking.total, booking.currency)}</div>
                </div>
                <Button className="gap-2" onClick={handleContinue} disabled={booking.qty < 1}>
                  Add to cart &amp; continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* trust bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Seats allocated together · 100% official tickets · Instant confirmation · Venue-specific layout</span>
      </div>
    </div>
  )
}
