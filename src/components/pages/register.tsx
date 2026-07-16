'use client'

import { useState } from 'react'
import { useRouter } from '@/lib/router'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Ticket, ArrowRight, ChevronLeft, Eye, EyeOff, ShieldCheck,
  Mail, Lock, User, AlertCircle, CheckCircle2, Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Errors {
  name?: string
  email?: string
  password?: string
  confirm?: string
  country?: string
  terms?: string
}

export function RegisterPage() {
  const { navigate } = useRouter()
  const { register } = useStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', country: '', terms: false, marketing: true
  })
  const [errors, setErrors] = useState<Errors>({})

  const validate = () => {
    const e: Errors = {}
    if (!form.name) e.name = 'Full name is required'
    else if (form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) e.password = 'Include 1 uppercase and 1 number'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    if (!form.country) e.country = 'Please select your country'
    if (!form.terms) e.terms = 'You must accept the terms to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      register({ name: form.name, email: form.email, password: form.password })
      setLoading(false)
      navigate('customer-dashboard')
    }, 800)
  }

  const set = (k: keyof typeof form, v: any) => {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  // Password strength meter
  const strength = (() => {
    let s = 0
    if (form.password.length >= 8) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[0-9]/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s
  })()
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength]

  return (
    <div className="min-h-screen bg-foreground text-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
            alt="Live event"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/30" />

          <div className="relative flex h-full flex-col p-12">
            <button onClick={() => navigate('home')} className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="text-base font-semibold">DS Experiences</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-background/60">Premium Ticketing</div>
              </div>
            </button>

            <div className="mt-auto max-w-md">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold tracking-tight"
              >
                Join 200,000+ fans. Experience more.
              </motion.h1>
              <p className="mt-4 text-background/70">
                Create your free account to unlock priority access to ticket releases, save your favourite events, and earn loyalty points on every booking.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  'Priority access to UEFA Champions League, F1 & top concerts',
                  'Earn 1 loyalty point for every $1 spent',
                  'Save payment methods for faster checkout',
                  'Exclusive member-only hospitality offers',
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-background/80">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right register panel */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <button onClick={() => navigate('home')} className="mb-6 flex items-center gap-1 text-sm text-background/60 hover:text-background lg:hidden">
              <ChevronLeft className="h-4 w-4" />
              Back to home
            </button>

            <div className="lg:hidden mb-6 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="text-base font-semibold">DS Experiences</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-background/60">Premium Ticketing</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Create Your Account</h2>
            <p className="mt-2 text-sm text-background/70">
              It takes less than a minute. No credit card required.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <Label htmlFor="name" className="text-xs">Full name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="James Whitmore"
                    className="bg-background/5 border-background/20 text-background placeholder:text-background/40 pl-10"
                  />
                </div>
                {errors.name && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-xs">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com"
                    className="bg-background/5 border-background/20 text-background placeholder:text-background/40 pl-10"
                  />
                </div>
                {errors.email && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="country" className="text-xs">Country of residence</Label>
                <div className="relative mt-1.5">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40 z-10" />
                  <Select value={form.country} onValueChange={(v) => set('country', v)}>
                    <SelectTrigger className="bg-background/5 border-background/20 text-background placeholder:text-background/40 pl-10">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="UAE">United Arab Emirates</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="SG">Singapore</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.country && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.country}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-xs">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="Min 8 characters, 1 number, 1 uppercase"
                    className="bg-background/5 border-background/20 text-background placeholder:text-background/40 pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-background/40 hover:text-background"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : 'bg-background/10'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-background/60">{strengthLabel}</span>
                  </div>
                )}
                {errors.password && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirm" className="text-xs">Confirm password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    placeholder="Re-enter your password"
                    className="bg-background/5 border-background/20 text-background placeholder:text-background/40 pl-10"
                  />
                </div>
                {errors.confirm && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirm}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" checked={form.terms} onCheckedChange={(v) => set('terms', !!v)} className="mt-0.5" />
                  <Label htmlFor="terms" className="text-xs leading-relaxed text-background/70">
                    I agree to the{' '}
                    <button type="button" className="text-accent hover:underline">Terms of Service</button>,{' '}
                    <button type="button" className="text-accent hover:underline">Privacy Policy</button>, and consent to receive booking confirmations.
                  </Label>
                </div>
                {errors.terms && (
                  <div className="flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.terms}
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <Checkbox id="marketing" checked={form.marketing} onCheckedChange={(v) => set('marketing', !!v)} className="mt-0.5" />
                  <Label htmlFor="marketing" className="text-xs leading-relaxed text-background/70">
                    Send me exclusive offers, priority alerts, and event recommendations.
                  </Label>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-6 bg-background/10" />

            <div className="text-center text-sm text-background/70">
              Already have an account?{' '}
              <button onClick={() => navigate('login')} className="font-medium text-accent hover:underline">
                Sign in
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
