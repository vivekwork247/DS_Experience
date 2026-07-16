'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { B2B_GROUPS } from '@/components/pages/b2b-groups'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStore } from '@/lib/store'
import { Bell, Save, Building2, Globe, CreditCard, ShieldCheck, Bell as BellIcon } from 'lucide-react'

export function B2BSettingsPage() {
  const { navigate } = useRouter()
  const { addToast } = useStore()
  const [form, setForm] = useState({
    company: 'Global Sports Tours',
    contact: 'Sarah Mitchell',
    email: 'sarah@globalsportstours.com',
    phone: '+44 20 7946 0958',
    address: '120 Mayfair Lane, London W1K 5AB, United Kingdom',
    vat: 'GB123456789',
    website: 'www.globalsportstours.com',
    notifyBookings: true,
    notifyInvoices: true,
    notifyMarketing: false,
  })

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({ title: 'Settings saved', description: 'Your company profile has been updated', type: 'success' })
  }

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="b2b-settings"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Company Settings"
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Company Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your company profile, billing and notification preferences.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Company Profile</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">This information appears on your invoices and partner profile.</p>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Company Name</Label>
              <Input value={form.company} onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))} className="mt-1.5" required />
            </div>
            <div>
              <Label className="text-xs">Primary Contact</Label>
              <Input value={form.contact} onChange={(e) => setForm(p => ({ ...p, contact: e.target.value }))} className="mt-1.5" required />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className="mt-1.5" required />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Business Address</Label>
              <Input value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs">VAT / GST Number</Label>
              <Input value={form.vat} onChange={(e) => setForm(p => ({ ...p, vat: e.target.value }))} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs">Website</Label>
              <Input value={form.website} onChange={(e) => setForm(p => ({ ...p, website: e.target.value }))} className="mt-1.5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Billing & Credit</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Your B2B credit line and payment terms.</p>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">Credit Limit</div>
              <div className="mt-1 text-xl font-bold">$120,000</div>
              <Badge className="mt-2 bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Gold Tier</Badge>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">Used</div>
              <div className="mt-1 text-xl font-bold text-amber-700">$68,400</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-amber-500" style={{ width: '57%' }} />
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground">Available</div>
              <div className="mt-1 text-xl font-bold text-emerald-700">$51,600</div>
              <div className="mt-2 text-[10px] text-muted-foreground">Payment terms: Net 30</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Choose what notifications you want to receive.</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            {[
              { key: 'notifyBookings', label: 'Booking confirmations', desc: 'Get notified when a booking is confirmed' },
              { key: 'notifyInvoices', label: 'Invoice reminders', desc: 'Receive reminders for due invoices' },
              { key: 'notifyMarketing', label: 'Marketing & offers', desc: 'Receive promotional offers and inventory alerts' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form[item.key as keyof typeof form] ? 'bg-foreground' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form[item.key as keyof typeof form] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Account security and access.</p>
          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">Two-factor authentication</div>
                <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-700">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">Password</div>
                <div className="text-xs text-muted-foreground">Last changed 32 days ago</div>
              </div>
              <Button variant="outline" size="sm">Change password</Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" className="gap-2"><Save className="h-4 w-4" />Save changes</Button>
        </div>
      </form>
    </DashboardShell>
  )
}
