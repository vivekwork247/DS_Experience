'use client'

import { useState } from 'react'
import { useRouter } from '@/lib/router'
import { PublicHeader } from '@/components/layout/public-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '@/lib/mock-data'
import { useCurrencyFormatter } from '@/components/currency-switcher'
import { useStore } from '@/lib/store'
import {
  CreditCard, Smartphone, Building2, Wallet, Lock, ShieldCheck,
  ChevronRight, Check, Sparkles
} from 'lucide-react'

export function PaymentPage() {
  const { route, navigate } = useRouter()
  const fmt = useCurrencyFormatter()
  const { earnRewardPoints } = useStore()
  const total = (route.params?.total as number) || 4536
  const currency = (route.params?.currency as string) || 'USD'
  const eventId = route.params?.eventId
  const pointsEarned = (route.params?.pointsEarned as number) || Math.round(total)

  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvc: '' })

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      // Award reward points for this booking
      earnRewardPoints(pointsEarned, 'Booking checkout', `Earned ${pointsEarned} points from booking`)
      navigate('order-success', { eventId, total, currency, pointsEarned })
    }, 1800)
  }

  const methods = [
    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: CreditCard },
    { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
    { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: Building2 },
    { id: 'wallet', label: 'Digital Wallet', desc: 'Apple Pay, PayPal', icon: Wallet },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <div className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Steps */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            {['Cart', 'Attendee Info', 'Payment', 'Confirmation'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`grid h-7 w-7 place-items-center rounded-full text-xs font-medium ${i <= 2 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                  {i < 2 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={i <= 2 ? 'font-medium' : 'text-muted-foreground'}>{step}</span>
                {i < 3 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Payment Methods */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <h1 className="text-xl font-semibold tracking-tight">Payment Method</h1>
                <p className="mt-1 text-sm text-muted-foreground">Choose how you want to pay. All transactions are encrypted end-to-end.</p>

                <RadioGroup value={method} onValueChange={setMethod} className="mt-6 space-y-3">
                  {methods.map((m) => {
                    const Icon = m.icon
                    return (
                      <Label
                        key={m.id}
                        htmlFor={m.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                          method === m.id ? 'border-foreground bg-muted/50' : 'border-border hover:border-foreground/30'
                        }`}
                      >
                        <RadioGroupItem value={m.id} id={m.id} />
                        <div className="grid h-10 w-10 place-items-center rounded-md bg-foreground text-background">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{m.label}</div>
                          <div className="text-xs text-muted-foreground">{m.desc}</div>
                        </div>
                      </Label>
                    )
                  })}
                </RadioGroup>

                <Separator className="my-6" />

                {/* Method-specific forms */}
                {method === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="text-xs">Card number</Label>
                      <div className="relative mt-1">
                        <Input
                          id="cardNumber"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="pr-12"
                        />
                        <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-xs">Name on card</Label>
                      <Input
                        id="cardName"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        placeholder="James Whitmore"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry" className="text-xs">Expiry date</Label>
                        <Input
                          id="expiry"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          placeholder="MM / YY"
                          maxLength={7}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc" className="text-xs">CVC</Label>
                        <Input
                          id="cvc"
                          type="password"
                          value={cardData.cvc}
                          onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      Your card details are encrypted and never stored on our servers. Processed via Stripe (PCI-DSS Level 1).
                    </div>
                  </div>
                )}

                {method === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upiId" className="text-xs">UPI ID</Label>
                      <Input id="upiId" placeholder="yourname@okhdfcbank" className="mt-1" />
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      A payment request will be sent to your UPI app. Approve it within 5 minutes to complete the booking.
                    </div>
                  </div>
                )}

                {method === 'netbanking' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bank" className="text-xs">Select bank</Label>
                      <select id="bank" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>HSBC</option>
                      </select>
                    </div>
                  </div>
                )}

                {method === 'wallet' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {['Apple Pay', 'Google Pay', 'PayPal', 'Amazon Pay'].map((w) => (
                        <button key={w} className="flex items-center justify-center rounded-lg border-2 border-border p-4 text-sm font-medium transition-colors hover:border-foreground">
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-20 p-6">
                <h2 className="text-base font-semibold">Order Summary</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UEFA Champions League Final</span>
                    <span className="font-medium">× 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Premium Category 1</span>
                    <span className="font-medium">{fmt(2900, currency)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{fmt(2900, currency)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes</span>
                    <span>{fmt(232, currency)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service fees</span>
                    <span>{fmt(145, currency)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{fmt(total, currency)}</div>
                    <div className="text-xs text-muted-foreground">{currency}</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Buyer protection</div>
                  <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-emerald-600" /> 256-bit SSL encrypted</div>
                  <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-600" /> Instant confirmation</div>
                </div>

                {pointsEarned > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-violet-500/10 p-3 text-xs text-violet-700">
                    <Sparkles className="h-4 w-4" />
                    <span>You&apos;ll earn <strong className="mx-0.5">{pointsEarned.toLocaleString()}</strong> reward points on this purchase</span>
                  </div>
                )}

                <Button
                  className="mt-5 w-full gap-2"
                  size="lg"
                  disabled={processing}
                  onClick={handlePay}
                >
                  {processing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Processing payment…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Pay {fmt(total, currency)}
                    </>
                  )}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  By clicking pay, you agree to our Terms & Refund Policy.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
