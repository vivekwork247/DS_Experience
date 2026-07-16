'use client'

import { useState } from 'react'
import { useRouter } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Ticket, ArrowRight, ChevronLeft, Upload, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export function B2BRegistrationPage() {
  const { navigate } = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30 p-4">
        <Card className="max-w-lg p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/15">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Application Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your B2B partnership application has been received. Our team will review your documents and respond within 2-3 business days.
          </p>

          <div className="mt-6 space-y-3 text-left">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Step 1: Application received</span>
              </div>
              <div className="ml-6 mt-1 text-xs text-muted-foreground">Just now</div>
            </div>
            <div className="rounded-lg border border-dashed border-border p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Step 2: Document review</span>
              </div>
              <div className="ml-6 mt-1 text-xs text-muted-foreground">In progress · ETA 24-48h</div>
            </div>
            <div className="rounded-lg border border-dashed border-border p-3 opacity-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Step 3: Approval & onboarding</span>
              </div>
              <div className="ml-6 mt-1 text-xs text-muted-foreground">Pending</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate('home')}>
              Return Home
            </Button>
            <Button className="flex-1" onClick={() => navigate('b2b-login')}>
              Proceed to Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('home')} className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="leading-none">
              <div className="text-base font-semibold">DS Experiences</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">B2B Partner Portal</div>
            </div>
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate('b2b-login')} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to login
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Register Your Company</h1>
            <p className="mt-2 text-muted-foreground">
              Apply to become a DS Experiences B2B partner. Approval typically takes 2-3 business days.
            </p>
          </div>

          {/* Benefits strip */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { label: 'Exclusive B2B rates', sub: 'Up to 25% off retail' },
              { label: 'Credit line access', sub: 'Up to $250K limit' },
              { label: 'Priority support', sub: 'Dedicated account manager' },
            ].map((b) => (
              <div key={b.label} className="rounded-lg border border-border bg-background p-4 text-center">
                <div className="text-sm font-semibold">{b.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{b.sub}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Company Information</h2>
              <p className="mt-1 text-xs text-muted-foreground">Tell us about your business.</p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="companyName" className="text-xs">Company Name *</Label>
                  <Input id="companyName" placeholder="Global Sports Tours Ltd." className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="gst" className="text-xs">GST / VAT Number *</Label>
                  <Input id="gst" placeholder="GB123456789" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="reg" className="text-xs">Business Registration # *</Label>
                  <Input id="reg" placeholder="08247196" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="country" className="text-xs">Country of Incorporation *</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="uae">United Arab Emirates</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-lg font-semibold">Primary Contact</h2>
              <p className="mt-1 text-xs text-muted-foreground">The person who will manage this account.</p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contactName" className="text-xs">Contact Person Name *</Label>
                  <Input id="contactName" placeholder="Sarah Mitchell" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="text-xs">Business Email *</Label>
                  <Input id="contactEmail" type="email" placeholder="sarah@company.com" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="text-xs">Phone Number *</Label>
                  <Input id="contactPhone" type="tel" placeholder="+44 20 7946 0958" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="jobTitle" className="text-xs">Job Title *</Label>
                  <Input id="jobTitle" placeholder="Managing Director" className="mt-1.5" required />
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-lg font-semibold">Upload Documents</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Please upload your business registration certificate, tax ID proof, and a recent bank statement.
              </p>

              <div className="mt-5 space-y-3">
                {['Business Registration Certificate', 'Tax ID / GST Certificate', 'Bank Statement (last 3 months)'].map((doc, i) => (
                  <div key={doc}>
                    <Label className="text-xs">{doc} *</Label>
                    <div className="mt-1.5 flex items-center justify-between rounded-lg border border-dashed border-border p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {files[i] ? files[i] : 'PDF, JPG or PNG · Max 10MB'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setFiles(prev => {
                          const next = [...prev]
                          next[i] = `${doc.replace(/\s/g, '_')}.pdf`
                          return next
                        })}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" className="mt-0.5" />
                  <Label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground">
                    I agree to the DS Experiences B2B Partner Agreement, Code of Conduct, and authorize verification of the submitted business documents.
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="marketing" className="mt-0.5" />
                  <Label htmlFor="marketing" className="text-xs leading-relaxed text-muted-foreground">
                    Send me product updates, exclusive inventory alerts, and B2B partner newsletters.
                  </Label>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => navigate('b2b-login')}>Cancel</Button>
                <Button type="submit" className="gap-2">
                  Submit application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
