'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { CURRENCIES, CurrencyCode } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check } from 'lucide-react'

export function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useStore()
  const [open, setOpen] = useState(false)
  const current = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
          <span className="text-base leading-none">{current.flag}</span>
          {!compact && (
            <>
              <span className="font-mono text-xs">{current.code}</span>
              <span className="hidden text-muted-foreground sm:inline">{current.symbol}</span>
            </>
          )}
          <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Display Currency
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={(v) => {
            setCurrency(v as CurrencyCode)
            setOpen(false)
          }}
        >
          {CURRENCIES.map((c) => (
            <DropdownMenuRadioItem key={c.code} value={c.code} className="gap-2 py-2">
              <span className="text-base">{c.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-medium leading-tight">{c.code} · {c.symbol}</div>
                <div className="text-[10px] text-muted-foreground">{c.name}</div>
              </div>
              {c.code === currency && <Check className="h-3.5 w-3.5 text-emerald-600" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
          Prices are displayed in {current.name}. Payment will be processed in the selected currency with live FX conversion.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Helper hook to format any amount (assumed to be in `fromCurrency`) into the
 * currently selected display currency.
 */
export function useCurrencyFormatter() {
  const { currency } = useStore()
  const formatter = (amount: number, fromCurrency: string = 'USD') => {
    const fromRate = CURRENCIES.find(c => c.code === fromCurrency)?.rate ?? 1
    const toRate = CURRENCIES.find(c => c.code === currency)?.rate ?? 1
    const usd = amount / fromRate
    const converted = usd * toRate
    const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '$'
    const isINR = currency === 'INR'
    return `${symbol}${converted.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: isINR ? 0 : 0,
    })}`
  }
  return formatter
}

export { CURRENCIES }
