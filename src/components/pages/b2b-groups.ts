import { SidebarGroup } from '@/components/layout/dashboard-shell'
import {
  LayoutDashboard, Search, Ticket, Users, FileText, Gift, BarChart3,
  UserCog, Building2
} from 'lucide-react'

export const B2B_GROUPS: SidebarGroup[] = [
  {
    items: [
      { label: 'Dashboard', route: 'b2b-dashboard', icon: LayoutDashboard },
      { label: 'Search Events', route: 'b2b-events', icon: Search },
      { label: 'Bookings', route: 'b2b-bookings', icon: Ticket },
      { label: 'Customers', route: 'b2b-customers', icon: Users },
      { label: 'Invoices', route: 'b2b-invoices', icon: FileText },
      { label: 'Rewards', route: 'rewards', icon: Gift },
      { label: 'Reports', route: 'b2b-reports', icon: BarChart3 },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Users', route: 'user-management', icon: UserCog },
      { label: 'Company Settings', route: 'b2b-settings', icon: Building2 },
    ],
  },
]
