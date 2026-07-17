'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Ticket, ChevronLeft, Menu, X } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  label: string
  route: RouteName
  icon: LucideIcon
}

export interface SidebarGroup {
  label?: string
  items: SidebarItem[]
}

interface DashboardShellProps {
  brand: string
  brandSubtitle: string
  groups: SidebarGroup[]
  currentRoute: RouteName
  onNavigate: (route: RouteName) => void
  onExit: () => void
  children: React.ReactNode
  topBarRight?: React.ReactNode
  topBarTitle: string
}

export function DashboardShell({
  brand,
  brandSubtitle,
  groups,
  currentRoute,
  onNavigate,
  onExit,
  children,
  topBarRight,
  topBarTitle,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground lg:hidden">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-foreground">
            <Ticket className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">{topBarTitle}</span>
        </div>
        <div className="w-5" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
            <button onClick={onExit} className="flex items-center gap-2 text-left">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="leading-none">
                <div className="text-sm font-semibold">{brand}</div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/60">{brandSubtitle}</div>
              </div>
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 py-4 scrollbar-thin">
            <div className="flex-1 space-y-6">
              {groups.map((group, gi) => (
                <div key={gi}>
                  {group.label && (
                    <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/40">
                      {group.label}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = currentRoute === item.route
                      return (
                        <li key={item.route}>
                          <button
                            onClick={() => {
                              onNavigate(item.route)
                              setMobileOpen(false)
                            }}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                              active
                                ? 'bg-accent font-medium text-accent-foreground'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-sidebar-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onExit}
                className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Exit to site
              </Button>
            </div>
          </nav>
        </aside>

        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <div className="flex min-h-screen flex-1 flex-col lg:w-[calc(100%-16rem)]">
          {/* Desktop top bar */}
          <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl lg:flex">
            <h1 className="text-base font-semibold">{topBarTitle}</h1>
            <div className="flex items-center gap-3">
              {topBarRight}
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
