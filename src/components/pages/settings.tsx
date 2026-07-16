'use client'

import { useState } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ADMIN_GROUPS } from '@/components/pages/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useStore, OrgUser } from '@/lib/store'
import {
  Bell, Settings, Globe, BellRing, Shield, Users, Save, RefreshCw,
  Plus, Pencil, Trash2, Mail, Phone, MapPin, Building2, Lock, Key, Clock
} from 'lucide-react'

export function SettingsPage() {
  const { navigate } = useRouter()
  const { orgUsers, addOrgUser, updateOrgUser, deleteOrgUser, addToast } = useStore()

  // General tab state
  const [general, setGeneral] = useState({
    siteName: 'DS Experiences',
    supportEmail: 'support@dsxperiences.com',
    phone: '+44 20 7946 0958',
    address: '21 New Street, London EC2M 1HQ, United Kingdom',
    currency: 'USD',
    language: 'en',
    timezone: 'Europe/London',
  })

  // Localization tab state
  const [rates, setRates] = useState([
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: '1.0000' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: '0.9240' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: '0.7920' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: '3.6725' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: '1.3420' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: '83.2400' },
  ])

  // Notifications tab state
  const [notifications, setNotifications] = useState({
    newBooking: true,
    supplierSync: true,
    lowInventory: true,
    dailyReports: false,
    marketing: false,
  })

  // Security tab state
  const [security, setSecurity] = useState({
    twoFactor: true,
    passwordMinLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    sessionTimeout: '30',
    ipWhitelist: '192.168.1.0/24\n10.0.0.0/8\n203.0.113.42',
  })

  // Users tab state
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<OrgUser | null>(null)
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Sales Executive' as OrgUser['role'], status: 'Active' as OrgUser['status'] })
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)

  const openAddUser = () => {
    setEditingUser(null)
    setUserForm({ name: '', email: '', role: 'Sales Executive', status: 'Active' })
    setUserDialogOpen(true)
  }
  const openEditUser = (u: OrgUser) => {
    setEditingUser(u)
    setUserForm({ name: u.name, email: u.email, role: u.role, status: u.status })
    setUserDialogOpen(true)
  }
  const submitUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      updateOrgUser(editingUser.id, { name: userForm.name, email: userForm.email, role: userForm.role, status: userForm.status })
    } else {
      addOrgUser({ name: userForm.name, email: userForm.email, role: userForm.role, status: userForm.status })
    }
    setUserDialogOpen(false)
  }

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="settings"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Settings"
      topBarRight={
        <>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/100?img=5" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </>
      }
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform configuration: general, localization, notifications, security, and team.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="gap-1.5"><Settings className="h-3.5 w-3.5" />General</TabsTrigger>
          <TabsTrigger value="localization" className="gap-1.5"><Globe className="h-3.5 w-3.5" />Localization</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><BellRing className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Shield className="h-3.5 w-3.5" />Security</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" />Users</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">General Configuration</h3>
            <p className="mt-1 text-xs text-muted-foreground">Basic platform settings and contact details.</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Site Name</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input value={general.siteName} onChange={(e) => setGeneral(p => ({ ...p, siteName: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Support Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" value={general.supportEmail} onChange={(e) => setGeneral(p => ({ ...p, supportEmail: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input value={general.phone} onChange={(e) => setGeneral(p => ({ ...p, phone: e.target.value }))} className="pl-9" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Default Currency</Label>
                <select
                  value={general.currency}
                  onChange={(e) => setGeneral(p => ({ ...p, currency: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="AED">AED — UAE Dirham</option>
                  <option value="SGD">SGD — Singapore Dollar</option>
                  <option value="INR">INR — Indian Rupee</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Default Language</Label>
                <select
                  value={general.language}
                  onChange={(e) => setGeneral(p => ({ ...p, language: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="hi">Hindi</option>
                  <option value="zh">Mandarin</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Timezone</Label>
                <select
                  value={general.timezone}
                  onChange={(e) => setGeneral(p => ({ ...p, timezone: e.target.value }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                  <Textarea value={general.address} onChange={(e) => setGeneral(p => ({ ...p, address: e.target.value }))} rows={2} className="pl-9" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button className="gap-2" onClick={() => addToast({ title: 'Settings saved', description: 'General configuration updated', type: 'success' })}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Localization */}
        <TabsContent value="localization" className="mt-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Currencies & Exchange Rates</h3>
                <p className="mt-1 text-xs text-muted-foreground">Manage supported currencies and their exchange rates against USD.</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => addToast({ title: 'Refreshing rates', description: 'Fetching latest ECB rates…', type: 'info' })}>
                <RefreshCw className="h-4 w-4" />
                Refresh rates
              </Button>
            </div>

            <div className="mt-5 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Currency</th>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Symbol</th>
                    <th className="px-4 py-3 font-medium">Rate (vs USD)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rates.map((c, idx) => (
                    <tr key={c.code} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3"><code className="text-xs">{c.code}</code></td>
                      <td className="px-4 py-3">{c.symbol}</td>
                      <td className="px-4 py-3">
                        <Input
                          value={c.rate}
                          onChange={(e) => setRates(rs => rs.map((r, i) => i === idx ? { ...r, rate: e.target.value } : r))}
                          className="h-8 w-28 font-mono text-xs"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-600">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 p-3 text-xs">
              <span className="text-muted-foreground">Rates auto-refresh every 4 hours via European Central Bank API</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => addToast({ title: 'Settings saved', description: 'Exchange rates updated', type: 'success' })}
              >
                <Save className="h-3.5 w-3.5" />
                Save rates
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <p className="mt-1 text-xs text-muted-foreground">Choose which alerts you and your team receive.</p>

            <div className="mt-5 space-y-3">
              {[
                { key: 'newBooking' as const, title: 'New booking alerts', desc: 'Notify when a customer makes a booking' },
                { key: 'supplierSync' as const, title: 'Supplier sync errors', desc: 'Alert when supplier API sync fails' },
                { key: 'lowInventory' as const, title: 'Low inventory warnings', desc: 'Alert when ticket stock falls below threshold' },
                { key: 'dailyReports' as const, title: 'Daily reports', desc: 'Email daily summary at 9:00 AM local time' },
                { key: 'marketing' as const, title: 'Marketing campaigns', desc: 'Notify when scheduled campaign launches' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <BellRing className={`mt-0.5 h-4 w-4 ${notifications[n.key] ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.desc}</div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[n.key]}
                    onCheckedChange={(v) => {
                      setNotifications(p => ({ ...p, [n.key]: v }))
                      addToast({ title: `${n.title} ${v ? 'enabled' : 'disabled'}`, type: 'info' })
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Lock className="h-4 w-4" />
                Authentication
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">Control 2FA and session security.</p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <div className="text-sm font-medium">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground">Require 2FA for all admin accounts</div>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(v) => setSecurity(p => ({ ...p, twoFactor: v }))}
                  />
                </div>
                <div>
                  <Label className="text-xs">Session timeout</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))}
                      className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Key className="h-4 w-4" />
                Password Policy
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">Define password complexity rules.</p>
              <div className="mt-5 space-y-3">
                <div>
                  <Label className="text-xs">Minimum password length</Label>
                  <Input
                    type="number"
                    min={6}
                    max={64}
                    value={security.passwordMinLength}
                    onChange={(e) => setSecurity(p => ({ ...p, passwordMinLength: parseInt(e.target.value) || 8 }))}
                    className="mt-1 w-32"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  {[
                    { key: 'requireUppercase' as const, label: 'Require uppercase letter (A-Z)' },
                    { key: 'requireNumbers' as const, label: 'Require number (0-9)' },
                    { key: 'requireSymbols' as const, label: 'Require symbol (!@#$%…)' },
                  ].map((c) => (
                    <label key={c.key} className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-2.5 hover:bg-muted/30">
                      <Checkbox
                        checked={security[c.key]}
                        onCheckedChange={(v) => setSecurity(p => ({ ...p, [c.key]: !!v }))}
                      />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-4 w-4" />
                IP Allowlist
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">Restrict admin access to specific IP ranges (one per line, CIDR notation supported).</p>
              <Textarea
                value={security.ipWhitelist}
                onChange={(e) => setSecurity(p => ({ ...p, ipWhitelist: e.target.value }))}
                rows={4}
                className="mt-3 font-mono text-xs"
                placeholder="192.168.1.0/24"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  className="gap-2"
                  onClick={() => addToast({ title: 'Security settings saved', description: 'All security policies updated', type: 'success' })}
                >
                  <Save className="h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="font-semibold">Organization Users</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Manage admin team members and their access.</p>
              </div>
              <Button className="gap-2" onClick={openAddUser}>
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* User stats */}
            <div className="grid grid-cols-3 gap-4 border-b border-border p-5">
              {[
                { label: 'Total', value: orgUsers.length, color: 'text-foreground' },
                { label: 'Active', value: orgUsers.filter(u => u.status === 'Active').length, color: 'text-emerald-600' },
                { label: 'Inactive', value: orgUsers.filter(u => u.status === 'Inactive').length, color: 'text-amber-600' },
              ].map((s) => (
                <div key={s.label}>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Last Login</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orgUsers.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://i.pravatar.cc/80?u=${u.email}`} />
                            <AvatarFallback>{u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className={
                          u.role === 'Admin' ? 'border-purple-500/30 text-purple-600' :
                          u.role === 'Manager' ? 'border-blue-500/30 text-blue-600' :
                          'border-slate-500/30 text-slate-600'
                        }>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => updateOrgUser(u.id, { status: u.status === 'Active' ? 'Inactive' : 'Active' })}
                          className="transition-transform hover:scale-105"
                          title="Toggle status"
                        >
                          <Badge variant="outline" className={
                            u.status === 'Active'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                              : 'border-amber-500/30 bg-amber-500/10 text-amber-600'
                          }>
                            <span className={`mr-1 h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {u.status}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEditUser(u)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Remove" onClick={() => setDeleteUserId(u.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orgUsers.length === 0 && (
                <div className="grid place-items-center py-12 text-center">
                  <Users className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No users yet.</p>
                  <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={openAddUser}>
                    <Plus className="h-3.5 w-3.5" /> Add a user
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>{editingUser ? 'Update team member details and access' : 'Invite a new team member to the platform'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitUser} className="space-y-3">
            <div>
              <Label className="text-xs">Full Name *</Label>
              <Input value={userForm.name} onChange={(e) => setUserForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Jane Smith" required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email *</Label>
              <Input type="email" value={userForm.email} onChange={(e) => setUserForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@dsxperiences.com" required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Role</Label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm(p => ({ ...p, role: e.target.value as OrgUser['role'] }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales Executive">Sales Executive</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm(p => ({ ...p, status: e.target.value as OrgUser['status'] }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingUser ? 'Save changes' : 'Add user'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={(o) => !o && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this user?</AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access to the platform immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteUserId !== null) deleteOrgUser(deleteUserId); setDeleteUserId(null) }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
