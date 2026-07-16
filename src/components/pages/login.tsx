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
import {
  Ticket, ArrowRight, ChevronLeft, Eye, EyeOff, ShieldCheck,
  Mail, Lock, AlertCircle, CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'

export function LoginPage() {
  const { navigate } = useRouter()
  const { login } = useStore()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(true)

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      login(email, password, 'customer')
      setLoading(false)
      navigate('customer-dashboard')
    }, 700)
  }

  const fillDemo = () => {
    setEmail('james.whitmore@example.com')
    setPassword('demo1234')
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-foreground text-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80"
            alt="Stadium atmosphere"
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
                Welcome back to extraordinary moments.
              </motion.h1>
              <p className="mt-4 text-background/70">
                Sign in to access your bookings, track upcoming events, manage your hospitality packages, and unlock member-exclusive offers.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: '200+', sub: 'events worldwide' },
                  { label: '38', sub: 'countries covered' },
                  { label: '$26M+', sub: 'tickets delivered' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold">{stat.label}</div>
                    <div className="text-xs text-background/60">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <button onClick={() => navigate('home')} className="mb-8 flex items-center gap-1 text-sm text-background/60 hover:text-background lg:hidden">
              <ChevronLeft className="h-4 w-4" />
              Back to home
            </button>

            <div className="lg:hidden mb-8 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="leading-none">
                <div className="text-base font-semibold">DS Experiences</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-background/60">Premium Ticketing</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Sign In</h2>
            <p className="mt-2 text-sm text-background/70">
              Enter your credentials to access your account.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <Label htmlFor="email" className="text-xs">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <button type="button" className="text-xs text-background/60 hover:text-accent">Forgot password?</button>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                    placeholder="••••••••"
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
                {errors.password && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <Label htmlFor="remember" className="cursor-pointer text-xs text-background/70">Keep me signed in for 30 days</Label>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full text-center text-xs text-background/50 hover:text-accent"
              >
                Use demo credentials
              </button>
            </form>

            <Separator className="my-6 bg-background/10" />

            <div className="text-center text-sm text-background/70">
              Don&apos;t have an account?{' '}
              <button onClick={() => navigate('register')} className="font-medium text-accent hover:underline">
                Create one
              </button>
            </div>

            <div className="mt-8 rounded-lg border border-background/10 bg-background/5 p-3 text-center text-xs text-background/60">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />
              Protected by 256-bit SSL encryption · PCI-DSS compliant
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
