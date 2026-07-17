'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

export type RouteName =
  // Public B2C
  | 'home'
  | 'events'
  | 'event-detail'
  | 'checkout'
  | 'payment'
  | 'order-success'
  | 'customer-dashboard'
  | 'booking-details'
  | 'login'
  | 'register'
  // B2B
  | 'b2b-login'
  | 'b2b-register'
  | 'b2b-dashboard'
  | 'b2b-events'
  | 'b2b-bookings'
  | 'b2b-customers'
  | 'b2b-invoices'
  | 'rewards'
  | 'b2b-reports'
  | 'user-management'
  | 'b2b-settings'
  // Admin
  | 'admin-dashboard'
  | 'suppliers'
  | 'inventory'
  | 'pricing'
  | 'admin-bookings'
  | 'customers'
  | 'partners'
  | 'rewards-mgmt'
  | 'membership-cards'
  | 'payments'
  | 'reports'
  | 'cms'
  | 'settings'

export interface RouteState {
  name: RouteName
  params?: Record<string, any>
}

interface RouterContextValue {
  route: RouteState
  navigate: (name: RouteName, params?: Record<string, any>) => void
  goBack: () => void
}

const RouterContext = createContext<RouterContextValue | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<RouteState[]>([{ name: 'home' }])

  const navigate = useCallback((name: RouteName, params?: Record<string, any>) => {
    setHistory((prev) => [...prev, { name, params }])
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const current = history[history.length - 1]

  return (
    <RouterContext.Provider value={{ route: current, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}
