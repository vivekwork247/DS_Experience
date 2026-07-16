'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { B2B_GROUPS } from '@/components/pages/b2b-groups'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency, formatDate } from '@/lib/mock-data'
import { Bell, Download, FileText, Search, Eye } from 'lucide-react'

const INVOICES = [
  { id: 'INV-2026-118', date: '2026-02-18', amount: 8400, currency: 'USD', status: 'Paid', bookings: 3, due: '2026-03-18' },
  { id: 'INV-2026-117', date: '2026-02-15', amount: 12400, currency: 'USD', status: 'Paid', bookings: 4, due: '2026-03-15' },
  { id: 'INV-2026-116', date: '2026-02-10', amount: 4280, currency: 'USD', status: 'Pending', bookings: 2, due: '2026-03-12' },
  { id: 'INV-2026-115', date: '2026-02-05', amount: 18400, currency: 'USD', status: 'Paid', bookings: 6, due: '2026-03-05' },
  { id: 'INV-2026-114', date: '2026-01-28', amount: 7200, currency: 'USD', status: 'Overdue', bookings: 2, due: '2026-02-28' },
  { id: 'INV-2026-113', date: '2026-01-22', amount: 9800, currency: 'USD', status: 'Paid', bookings: 3, due: '2026-02-22' },
]

export function B2BInvoicesPage() {
  const { navigate } = useRouter()
  const [filter, setFilter] = useState('all')
  const filtered = INVOICES.filter(i => filter === 'all' || i.status === filter)

  const totalPaid = INVOICES.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = INVOICES.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = INVOICES.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-invoices"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Invoices"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=23" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track and download all your invoices.</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Download All</Button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Paid</div>
          <div className="mt-1 text-2xl font-bold text-emerald-700">{formatCurrency(totalPaid)}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Pending</div>
          <div className="mt-1 text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Overdue</div>
          <div className="mt-1 text-2xl font-bold text-rose-600">{formatCurrency(totalOverdue)}</div>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {['all', 'Paid', 'Pending', 'Overdue'].map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f}
          </Button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Invoice #</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Bookings</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv) => (
                <tr key={inv.id} className="cursor-pointer transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs">{inv.id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(inv.date)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(inv.due)}</td>
                  <td className="px-5 py-3">{inv.bookings}</td>
                  <td className="px-5 py-3 font-semibold">{formatCurrency(inv.amount, inv.currency)}</td>
                  <td className="px-5 py-3">
                    <Badge variant="secondary" className={
                      inv.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15' :
                      inv.status === 'Pending' ? 'bg-amber-500/15 text-amber-700 hover:bg-amber-500/15' :
                      'bg-rose-500/15 text-rose-700 hover:bg-rose-500/15'
                    }>{inv.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Download className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  )
}
