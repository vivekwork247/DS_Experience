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
import { Ticket, ArrowRight, ChevronLeft, Eye, EyeOff, ShieldCheck, Globe, TrendingUp, AlertCircle, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

export function B2BLoginPage() {
  const { navigate } = useRouter()
  const { login } = useStore()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Business email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      login(email, password, 'b2b')
      setLoading(false)
      navigate('b2b-dashboard')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-foreground text-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
            alt="B2B partnership"
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
                <div className="text-[10px] uppercase tracking-[0.18em] text-background/60">B2B Partner Portal</div>
              </div>
            </button>

            <div className="mt-auto max-w-md">
              <h1 className="text-3xl font-bold tracking-tight">
                Power your business with the world&apos;s premium event inventory.
              </h1>
              <p className="mt-4 text-background/70">
                Join 200+ travel agencies, DMCs, and corporate resellers accessing exclusive rates on hospitality packages, sports tickets, and concert experiences worldwide.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Globe, label: '38 countries', sub: 'global inventory' },
                  { icon: TrendingUp, label: '$26M+', sub: 'partner revenue' },
                  { icon: ShieldCheck, label: 'Tier 1', sub: 'official supplier' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label}>
                      <Icon className="h-5 w-5 text-accent" />
                      <div className="mt-2 text-lg font-bold">{stat.label}</div>
                      <div className="text-xs text-background/60">{stat.sub}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
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
                <div className="text-[10px] uppercase tracking-[0.18em] text-background/60">B2B Partner Portal</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Company Login</h2>
            <p className="mt-2 text-sm text-background/70">
              Sign in to your B2B partner account to access exclusive inventory and pricing.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleLogin} noValidate>
              <div>
                <Label htmlFor="email" className="text-xs">Business email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-background/40" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                    placeholder="you@company.com"
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
                <Checkbox id="remember" />
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
                    Login to dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-6 bg-background/10" />

            <div className="text-center text-sm text-background/70">
              New partner?{' '}
              <button onClick={() => navigate('b2b-register')} className="font-medium text-accent hover:underline">
                Register your company
              </button>
            </div>

            <div className="mt-8 rounded-lg border border-background/10 bg-background/5 p-3 text-center text-xs text-background/60">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />
              Protected by 256-bit SSL encryption · PCI-DSS compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
