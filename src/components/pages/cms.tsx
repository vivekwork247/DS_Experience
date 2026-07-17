'use client'

import { useState, useMemo } from 'react'
import { useRouter, RouteName } from '@/lib/router'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { ADMIN_GROUPS } from '@/components/pages/admin-dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useStore } from '@/lib/store'
import type { CMSPage as CMSPageT } from '@/lib/store'
import {
  Bell, Plus, FileText, Search, Pencil, Eye, Trash2, Copy,
  Clock, CheckCircle2, FileEdit, Globe, ExternalLink
} from 'lucide-react'

type DialogMode = 'add' | 'edit' | 'detail'

const EMPTY_FORM = {
  title: '',
  slug: '',
  status: 'Draft' as CMSPageT['status'],
  author: 'Admin',
  content: '',
}

function slugify(s: string) {
  return '/' + s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^\/-/, '/').replace(/-$/, '') || '/'
}

export function CMSPage() {
  const { navigate } = useRouter()
  const { cmsPages, addCMSPage, updateCMSPage, deleteCMSPage, addToast } = useStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<DialogMode>('add')
  const [editing, setEditing] = useState<CMSPageT | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return cmsPages.filter(p => {
      const matchesSearch = q === '' || p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [cmsPages, search, statusFilter])

  const stats = {
    total: cmsPages.length,
    published: cmsPages.filter(p => p.status === 'Published').length,
    drafts: cmsPages.filter(p => p.status === 'Draft').length,
    lastUpdated: cmsPages.length > 0 ? cmsPages[0].updated : '—',
  }

  const openAdd = () => {
    setEditing(null)
    setDialogMode('add')
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (p: CMSPageT) => {
    setEditing(p)
    setDialogMode('edit')
    setForm({ title: p.title, slug: p.slug, status: p.status, author: p.author, content: p.content || '' })
    setDialogOpen(true)
  }

  const openDetail = (p: CMSPageT) => {
    setEditing(p)
    setDialogMode('detail')
    setForm({ title: p.title, slug: p.slug, status: p.status, author: p.author, content: p.content || '' })
    setDialogOpen(true)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || slugify(form.title)
    if (dialogMode === 'edit' && editing) {
      updateCMSPage(editing.id, { title: form.title, slug, status: form.status, author: form.author, content: form.content })
    } else if (dialogMode === 'detail' && editing) {
      updateCMSPage(editing.id, { content: form.content, title: form.title, slug, status: form.status, author: form.author })
    } else {
      addCMSPage({ title: form.title, slug, status: form.status, author: form.author, content: form.content })
    }
    setDialogOpen(false)
  }

  const toggleStatus = (p: CMSPageT) => {
    updateCMSPage(p.id, { status: p.status === 'Published' ? 'Draft' : 'Published' })
  }

  const duplicate = (p: CMSPageT) => {
    addCMSPage({
      title: `${p.title} (Copy)`,
      slug: slugify(`${p.title} copy`),
      status: 'Draft',
      author: p.author,
      content: p.content,
    })
  }

  const dialogTitle = dialogMode === 'add' ? 'New Page' : dialogMode === 'edit' ? 'Edit Page' : 'Page Details'
  const dialogDesc = dialogMode === 'add' ? 'Create a new content page' : dialogMode === 'edit' ? 'Update page content and settings' : 'View and edit page content'

  return (
    <DashboardShell
      brand="DS Experiences"
      brandSubtitle="Admin Console"
      groups={ADMIN_GROUPS}
      currentRoute="cms"
      onNavigate={(r: RouteName) => navigate(r)}
      onExit={() => navigate('home')}
      topBarTitle="Content Management"
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
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage site pages, content, and publishing status.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Pages', value: stats.total, icon: FileText, sub: 'All time' },
          { label: 'Published', value: stats.published, icon: CheckCircle2, sub: 'Live on site' },
          { label: 'Drafts', value: stats.drafts, icon: FileEdit, sub: 'Pending review' },
          { label: 'Last Updated', value: stats.lastUpdated, icon: Clock, sub: 'Most recent edit' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{s.sub}</div>
            </Card>
          )
        })}
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, slug or author…" className="pl-9" />
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(['All', 'Published', 'Draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Pages table */}
      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Last Updated</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => openDetail(p)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><code className="text-xs text-muted-foreground">{p.slug}</code></td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleStatus(p)}
                      title="Toggle status"
                      className="transition-transform hover:scale-105"
                    >
                      <Badge
                        variant="outline"
                        className={p.status === 'Published'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'}
                      >
                        {p.status}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.author}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.updated}</td>
                  <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Preview" onClick={() => addToast({ title: 'Preview opened in new tab', description: p.title, type: 'info' })}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Duplicate" onClick={() => duplicate(p)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" title="Delete" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center py-12 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No pages found.</p>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5" /> Create a page
            </Button>
          </div>
        )}
      </Card>

      {/* Add / Edit / Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={dialogMode === 'detail' ? 'max-w-3xl' : 'max-w-xl'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>{dialogDesc}</DialogDescription>
          </DialogHeader>

          {dialogMode === 'detail' && editing && (
            <div className="mb-2 flex flex-wrap items-center gap-2 rounded-md bg-muted/40 p-3 text-xs">
              <span className="text-muted-foreground">ID:</span>
              <code className="font-mono">#{editing.id}</code>
              <SeparatorDot />
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium">{editing.updated}</span>
              <SeparatorDot />
              <span className="text-muted-foreground">Slug:</span>
              <code className="font-mono">{editing.slug}</code>
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(p => ({ ...p, title: e.target.value, slug: dialogMode === 'add' ? slugify(e.target.value) : p.slug }))}
                  placeholder="e.g. About Us"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
                  placeholder="/about"
                  className="mt-1 font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(p => ({ ...p, status: e.target.value as CMSPageT['status'] }))}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm(p => ({ ...p, author: e.target.value }))}
                  placeholder="Admin"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Write page content here…"
                rows={dialogMode === 'detail' ? 12 : dialogMode === 'edit' ? 8 : 5}
                className="mt-1 font-mono text-xs"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {form.content.length.toLocaleString()} characters · {form.content.trim() ? form.content.trim().split(/\s+/).length : 0} words
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-1.5"
                onClick={() => addToast({ title: 'Preview opened in new tab', description: form.title, type: 'info' })}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">
                {dialogMode === 'add' ? 'Create page' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the page. The slug will become available for reuse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId !== null) deleteCMSPage(deleteId); setDeleteId(null) }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}

function SeparatorDot() {
  return <span className="text-muted-foreground/40">·</span>
}
