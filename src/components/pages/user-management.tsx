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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useStore, OrgUser } from '@/lib/store'
import {
  Bell, UserPlus, ShieldCheck, Crown,
  Mail, Edit, Trash2, UserCog
} from 'lucide-react'

const ROLES = [
  {
    name: 'Admin',
    icon: Crown,
    color: 'bg-purple-500/15 text-purple-600',
    desc: 'Full access to all features, billing, and user management.',
    permissions: ['All permissions', 'Manage users', 'Manage billing', 'Configure API keys', 'View all reports'],
  },
  {
    name: 'Manager',
    icon: ShieldCheck,
    color: 'bg-amber-500/15 text-amber-600',
    desc: 'Manage bookings, customers, and access reports. Cannot manage billing.',
    permissions: ['Create bookings', 'Manage customers', 'View reports', 'Download invoices', 'Limited user mgmt'],
  },
  {
    name: 'Sales Executive',
    icon: UserCog,
    color: 'bg-emerald-500/15 text-emerald-600',
    desc: 'Create bookings for assigned customers. No access to financial reports.',
    permissions: ['Create bookings', 'View own customers', 'Limited inventory access'],
  },
] as const

export function UserManagementPage() {
  const { navigate } = useRouter()
  const { orgUsers, addOrgUser, updateOrgUser, deleteOrgUser } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<OrgUser | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'Manager' as OrgUser['role'], status: 'Active' as OrgUser['status'] })

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', email: '', role: 'Manager', status: 'Active' })
    setDialogOpen(true)
  }
  const openEdit = (u: OrgUser) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status })
    setDialogOpen(true)
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateOrgUser(editing.id, form)
    else addOrgUser(form)
    setDialogOpen(false)
  }

  return (
    <DashboardShell
      brand="Global Sports Tours"
      brandSubtitle="B2B Partner · Gold"
      groups={B2B_GROUPS}
      currentRoute="user-management"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Organization Users"
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
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage team members, roles, and permissions across your organization.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Role overview cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ROLES.map((role) => {
          const Icon = role.icon
          const count = orgUsers.filter(u => u.role === role.name).length
          return (
            <Card key={role.name} className="p-5">
              <div className="flex items-start justify-between">
                <div className={`grid h-11 w-11 place-items-center rounded-lg ${role.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="outline">{count} {count === 1 ? 'user' : 'users'}</Badge>
              </div>
              <h3 className="mt-3 font-semibold">{role.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{role.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {role.permissions.slice(0, 3).map(p => (
                  <span key={p} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{p}</span>
                ))}
                {role.permissions.length > 3 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">+{role.permissions.length - 3} more</span>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Users table */}
      <Card>
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="font-semibold">Team Members</h3>
          <Badge variant="outline">{orgUsers.length} total</Badge>
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
                        <AvatarImage src={`https://i.pravatar.cc/100?u=${u.email}`} />
                        <AvatarFallback>{u.name.split(' ').map(s => s[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={
                      u.role === 'Admin' ? 'border-purple-500/30 text-purple-700' :
                      u.role === 'Manager' ? 'border-amber-500/30 text-amber-700' :
                      'border-emerald-500/30 text-emerald-700'
                    }>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => updateOrgUser(u.id, { status: u.status === 'Active' ? 'Inactive' : 'Active' })}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span className={`h-2 w-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${u.status === 'Active' ? 'text-emerald-700' : 'text-muted-foreground'}`}>{u.status}</span>
                    </button>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(u)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600" onClick={() => setDeleteId(u.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>{editing ? 'Update user information and role' : 'Invite a new team member to your organization'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label className="text-xs">Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Sarah Mitchell" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="sarah@company.com" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Role</Label>
              <select value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value as OrgUser['role'] }))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Sales Executive">Sales Executive</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value as OrgUser['status'] }))} className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? 'Save changes' : 'Add user'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke the user&apos;s access to the organization. They will no longer be able to sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId !== null) deleteOrgUser(deleteId); setDeleteId(null) }} className="bg-rose-600 hover:bg-rose-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
