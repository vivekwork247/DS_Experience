'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Users, Info, Check, X, ArrowRight, Minus, Plus, Star,
  ShieldCheck, Eye, Grid3x3
} from 'lucide-react'
import { formatCurrency } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export interface SeatingBlock {
  id: string
  name: string
  tier: string
  price: number
  currency: string
  available: number
  total: number
  // Block geometry on the stadium canvas (percentages)
  x: number
  y: number
  w: number
  h: number
  // Visual styling
  color: string
  // Seat layout for detail view
  rows: number
  seatsPerRow: number
  // View quality
  viewQuality: 'Premium' | 'Excellent' | 'Good' | 'Restricted'
  features: string[]
}

export interface SelectedSeat {
  blockId: string
  blockName: string
  row: number
  seat: number
  price: number
  currency: string
}

interface Props {
  currency?: string
  onSelect: (seats: SelectedSeat[]) => void
  onContinue?: (seats: SelectedSeat[]) => void
  maxSeats?: number
}

// Standard stadium-style block layout — pitch in center, blocks around
// Coordinates are in % of canvas (0..100)
const BLOCKS: SeatingBlock[] = [
  // West Stand (left of pitch) — Premium
  { id: 'W-PRE', name: 'West Stand — Premium', tier: 'Premium Category 1', price: 1450, currency: 'USD', available: 32, total: 80, x: 8, y: 30, w: 12, h: 40, color: '#f59e0b', rows: 8, seatsPerRow: 10, viewQuality: 'Premium', features: ['Best lower-tier view', 'Lounge access', 'Pre-match dining'] },
  // West Stand — Mid
  { id: 'W-MID', name: 'West Stand — Mid', tier: 'Category 2', price: 780, currency: 'USD', available: 48, total: 120, x: 22, y: 32, w: 8, h: 36, color: '#3b82f6', rows: 12, seatsPerRow: 10, viewQuality: 'Excellent', features: ['Mid-tier seating', 'Concessions access'] },
  // East Stand (right of pitch)
  { id: 'E-MID', name: 'East Stand — Mid', tier: 'Category 2', price: 780, currency: 'USD', available: 36, total: 120, x: 70, y: 32, w: 8, h: 36, color: '#3b82f6', rows: 12, seatsPerRow: 10, viewQuality: 'Excellent', features: ['Mid-tier seating', 'Concessions access'] },
  { id: 'E-UP', name: 'East Stand — Upper', tier: 'Category 3', price: 450, currency: 'USD', available: 26, total: 100, x: 80, y: 28, w: 12, h: 44, color: '#10b981', rows: 10, seatsPerRow: 10, viewQuality: 'Good', features: ['Upper-tier seating', 'Panoramic view'] },
  // North Stand (top)
  { id: 'N-VIP', name: 'North Stand — VIP Suite', tier: 'Hospitality VIP', price: 2400, currency: 'USD', available: 18, total: 30, x: 38, y: 6, w: 24, h: 18, color: '#a855f7', rows: 3, seatsPerRow: 10, viewQuality: 'Premium', features: ['Private suite', 'Gourmet 4-course meal', 'Open bar', 'Meet & greet', 'Parking'] },
  { id: 'N-UP', name: 'North Stand — Upper', tier: 'Category 3', price: 450, currency: 'USD', available: 24, total: 100, x: 30, y: 6, w: 6, h: 18, color: '#10b981', rows: 10, seatsPerRow: 10, viewQuality: 'Good', features: ['Upper-tier seating'] },
  { id: 'N-UP2', name: 'North Stand — Upper 2', tier: 'Category 3', price: 450, currency: 'USD', available: 28, total: 100, x: 64, y: 6, w: 6, h: 18, color: '#10b981', rows: 10, seatsPerRow: 10, viewQuality: 'Good', features: ['Upper-tier seating'] },
  // South Stand (bottom)
  { id: 'S-UP', name: 'South Stand — Upper', tier: 'Category 3', price: 450, currency: 'USD', available: 22, total: 100, x: 30, y: 76, w: 6, h: 18, color: '#10b981', rows: 10, seatsPerRow: 10, viewQuality: 'Good', features: ['Upper-tier seating'] },
  { id: 'S-UP2', name: 'South Stand — Upper 2', tier: 'Category 3', price: 450, currency: 'USD', available: 26, total: 100, x: 64, y: 76, w: 6, h: 18, color: '#10b981', rows: 10, seatsPerRow: 10, viewQuality: 'Good', features: ['Upper-tier seating'] },
  { id: 'S-MID', name: 'South Stand — Mid', tier: 'Category 2', price: 780, currency: 'USD', available: 30, total: 80, x: 38, y: 76, w: 24, h: 18, color: '#3b82f6', rows: 8, seatsPerRow: 10, viewQuality: 'Excellent', features: ['Mid-tier seating', 'Atmosphere stand'] },
]

const VIEW_BADGE = {
  Premium: 'bg-purple-500/15 text-purple-700',
  Excellent: 'bg-blue-500/15 text-blue-700',
  Good: 'bg-emerald-500/15 text-emerald-700',
  Restricted: 'bg-amber-500/15 text-amber-700',
}

export function StadiumSeatingMap({ onSelect, onContinue, maxSeats = 8 }: Props) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<SeatingBlock | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([])

  const total = selectedSeats.reduce((s, x) => s + x.price, 0)
  const currency = selectedSeats[0]?.currency || 'USD'

  const handleSeatClick = (block: SeatingBlock, row: number, seat: number) => {
    const exists = selectedSeats.find(s => s.blockId === block.id && s.row === row && s.seat === seat)
    if (exists) {
      setSelectedSeats(selectedSeats.filter(s => !(s.blockId === block.id && s.row === row && s.seat === seat)))
    } else {
      if (selectedSeats.length >= maxSeats) return
      setSelectedSeats([...selectedSeats, {
        blockId: block.id,
        blockName: block.name,
        row, seat,
        price: block.price,
        currency: block.currency,
      }])
    }
  }

  // Memoize seat availability map (deterministic per block)
  const seatAvailability = useMemo(() => {
    const map: Record<string, Set<string>> = {}
    BLOCKS.forEach(block => {
      const sold = new Set<string>()
      const total = block.rows * block.seatsPerRow
      const soldCount = total - block.available
      // Deterministic sold seats
      for (let i = 0; i < soldCount; i++) {
        const r = Math.floor((i * 7 + block.id.charCodeAt(0)) % block.rows) + 1
        const s = Math.floor((i * 13 + block.id.charCodeAt(1)) % block.seatsPerRow) + 1
        sold.add(`${r}-${s}`)
      }
      map[block.id] = sold
    })
    return map
  }, [])

  // Notify parent
  useMemo(() => {
    onSelect(selectedSeats)
  }, [selectedSeats, onSelect])

  return (
    <div className="space-y-5">
      {/* Stadium overview */}
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Grid3x3 className="h-4 w-4" />
              Stadium Seating Map
            </h3>
            <p className="text-xs text-muted-foreground">Hover a block to preview, click to select your seats</p>
          </div>
          <div className="hidden items-center gap-3 text-[10px] sm:flex">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#a855f7' }} /> VIP</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#f59e0b' }} /> Premium</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#3b82f6' }} /> Cat 2</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm" style={{ background: '#10b981' }} /> Cat 3</span>
          </div>
        </div>

        {/* Stadium canvas */}
        <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30">
          {/* Outer stadium ring */}
          <div className="absolute inset-[3%] rounded-[40%/50%] border-2 border-dashed border-muted-foreground/30" />
          <div className="absolute inset-[6%] rounded-[36%/45%] border border-muted-foreground/20" />

          {/* Pitch */}
          <div className="absolute left-[36%] top-[28%] h-[44%] w-[28%] rounded border-2 border-emerald-600/40 bg-emerald-500/20">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-600/30" />
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-600/30" />
            <div className="absolute left-0 top-1/2 h-16 w-px -translate-y-1/2 border-l border-emerald-600/30" />
            <div className="absolute right-0 top-1/2 h-16 w-px -translate-y-1/2 border-l border-emerald-600/30" />
            <div className="absolute bottom-0 left-1/2 h-8 w-16 -translate-x-1/2 border-x border-b border-emerald-600/30" />
            <div className="absolute top-0 left-1/2 h-8 w-16 -translate-x-1/2 border-x border-t border-emerald-600/30" />
          </div>

          {/* Blocks */}
          {BLOCKS.map((block) => {
            const isHovered = hoveredBlock === block.id
            const isSelected = selectedBlock?.id === block.id
            const isSoldOut = block.available === 0
            const fillPct = (block.available / block.total) * 100
            return (
              <motion.button
                key={block.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => setHoveredBlock(block.id)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => !isSoldOut && setSelectedBlock(block)}
                className={cn(
                  'absolute flex flex-col items-center justify-center rounded-md border-2 p-1 text-center transition-all',
                  isSoldOut && 'cursor-not-allowed opacity-40',
                  isSelected ? 'border-foreground ring-2 ring-accent ring-offset-1' : 'border-white/40',
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
                <div className="text-[9px] font-semibold leading-tight">{block.name.split('—')[0].trim()}</div>
                <div className="text-[8px] opacity-90">{formatCurrency(block.price, block.currency)}</div>
                <div className="mt-0.5 h-0.5 w-3/4 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full bg-white" style={{ width: `${fillPct}%` }} />
                </div>
              </motion.button>
            )
          })}

          {/* Stand labels */}
          <div className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">North Stand</div>
          <div className="absolute left-1/2 bottom-1 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">South Stand</div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">West</div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">East</div>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredBlock && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-lg border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur"
              >
                {(() => {
                  const b = BLOCKS.find(x => x.id === hoveredBlock)!
                  return (
                    <div className="text-xs">
                      <div className="font-semibold">{b.name}</div>
                      <div className="mt-0.5 text-muted-foreground">{b.tier} · {formatCurrency(b.price, b.currency)}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className={cn('h-4 text-[9px]', VIEW_BADGE[b.viewQuality])}>{b.viewQuality}</Badge>
                        <span className="text-muted-foreground">{b.available} of {b.total} seats left</span>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Block detail / seat picker */}
      <AnimatePresence mode="wait">
        {selectedBlock && (
          <motion.div
            key={selectedBlock.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-5">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{selectedBlock.name}</h3>
                    <Badge variant="outline" className={VIEW_BADGE[selectedBlock.viewQuality]}>
                      <Eye className="mr-1 h-3 w-3" />
                      {selectedBlock.viewQuality} view
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{selectedBlock.tier}</span>
                    <span>·</span>
                    <span>{formatCurrency(selectedBlock.price, selectedBlock.currency)} per seat</span>
                    <span>·</span>
                    <span>{selectedBlock.available} available</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBlock(null)}>
                  <X className="mr-1 h-4 w-4" />
                  Close
                </Button>
              </div>

              {/* Features */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedBlock.features.map((f) => (
                  <span key={f} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{f}</span>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Seat grid */}
              <div className="text-xs text-muted-foreground">Click seats to select · Max {maxSeats} per booking</div>
              <div className="mt-3 overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Pitch indicator */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded bg-emerald-500/30" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Pitch</span>
                    <div className="h-1 flex-1 rounded bg-emerald-500/30" />
                  </div>

                  <div className="space-y-1.5">
                    {Array.from({ length: selectedBlock.rows }).map((_, rIdx) => {
                      const row = rIdx + 1
                      return (
                        <div key={row} className="flex items-center gap-2">
                          <div className="w-6 text-right text-[10px] font-medium text-muted-foreground">{row}</div>
                          <div className="flex gap-1">
                            {Array.from({ length: selectedBlock.seatsPerRow }).map((_, sIdx) => {
                              const seat = sIdx + 1
                              const seatKey = `${row}-${seat}`
                              const sold = seatAvailability[selectedBlock.id].has(seatKey)
                              const sel = selectedSeats.find(s => s.blockId === selectedBlock.id && s.row === row && s.seat === seat)
                              return (
                                <button
                                  key={seatKey}
                                  disabled={sold}
                                  onClick={() => handleSeatClick(selectedBlock, row, seat)}
                                  className={cn(
                                    'grid h-6 w-6 place-items-center rounded text-[9px] font-medium transition-all',
                                    sold && 'cursor-not-allowed bg-rose-200 text-rose-400',
                                    !sold && sel && 'bg-foreground text-background',
                                    !sold && !sel && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-300',
                                  )}
                                  title={sold ? 'Sold' : `Row ${row}, Seat ${seat}`}
                                >
                                  {sold ? '×' : sel ? <Check className="h-3 w-3" /> : seat}
                                </button>
                              )
                            })}
                          </div>
                          <div className="w-6 text-[10px] font-medium text-muted-foreground">{row}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-300" /> Available</span>
                    <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-foreground" /> Selected</span>
                    <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-rose-200" /> Sold</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                Selected Seats ({selectedSeats.length})
              </h3>
              <button
                onClick={() => setSelectedSeats([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {selectedSeats.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5 text-xs">
                  <div>
                    <div className="font-medium">{s.blockName}</div>
                    <div className="text-muted-foreground">Row {s.row}, Seat {s.seat}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(s.price, s.currency)}</div>
                    <button
                      onClick={() => setSelectedSeats(selectedSeats.filter((_, idx) => idx !== i))}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Total ({selectedSeats.length} seats)</div>
                <div className="text-2xl font-bold">{formatCurrency(total, currency)}</div>
              </div>
              <Button className="gap-2" onClick={() => onContinue?.(selectedSeats)}>
                Continue to checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Pricing info bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>All seats allocated together · 100% official tickets · Instant confirmation</span>
      </div>
    </div>
  )
}
