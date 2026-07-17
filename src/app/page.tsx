'use client'

import { RouterProvider, useRouter } from '@/lib/router'
import { ToastContainer } from '@/components/ui/toast-container'
import { LandingPage } from '@/components/pages/landing-page'
import { EventListingPage } from '@/components/pages/event-listing'
import { EventDetailPage } from '@/components/pages/event-detail'
import { CheckoutPage } from '@/components/pages/checkout'
import { PaymentPage } from '@/components/pages/payment'
import { OrderSuccessPage } from '@/components/pages/order-success'
import { CustomerDashboardPage } from '@/components/pages/customer-dashboard'
import { BookingDetailsPage } from '@/components/pages/booking-details'
import { LoginPage } from '@/components/pages/login'
import { RegisterPage } from '@/components/pages/register'
import { B2BLoginPage } from '@/components/pages/b2b-login'
import { B2BRegistrationPage } from '@/components/pages/b2b-registration'
import { B2BDashboardPage } from '@/components/pages/b2b-dashboard'
import { B2BEventsPage } from '@/components/pages/b2b-events'
import { B2BBookingsPage } from '@/components/pages/b2b-bookings'
import { B2BCustomersPage } from '@/components/pages/b2b-customers'
import { B2BInvoicesPage } from '@/components/pages/b2b-invoices'
import { B2BReportsPage } from '@/components/pages/b2b-reports'
import { B2BSettingsPage } from '@/components/pages/b2b-settings'
import { RewardsPage } from '@/components/pages/rewards'
import { UserManagementPage } from '@/components/pages/user-management'
import { AdminDashboardPage } from '@/components/pages/admin-dashboard'
import { SupplierManagementPage } from '@/components/pages/supplier-management'
import { InventoryManagementPage } from '@/components/pages/inventory-management'
import { PricingEnginePage } from '@/components/pages/pricing-engine'
import { BookingManagementPage } from '@/components/pages/booking-management'
import { CustomerManagementPage } from '@/components/pages/customer-management'
import { B2BPartnerManagementPage } from '@/components/pages/b2b-partner-management'
import { RewardsManagementPage } from '@/components/pages/rewards-management'
import { PaymentManagementPage } from '@/components/pages/payment-management'
import { ReportsPage } from '@/components/pages/reports'
import { CMSPage } from '@/components/pages/cms'
import { SettingsPage } from '@/components/pages/settings'
import { MembershipCardsPage } from '@/components/pages/membership-cards'

function Router() {
  const { route } = useRouter()

  switch (route.name) {
    // Public B2C
    case 'home': return <LandingPage />
    case 'events': return <EventListingPage />
    case 'event-detail': return <EventDetailPage />
    case 'checkout': return <CheckoutPage />
    case 'payment': return <PaymentPage />
    case 'order-success': return <OrderSuccessPage />
    case 'customer-dashboard': return <CustomerDashboardPage />
    case 'booking-details': return <BookingDetailsPage />
    case 'login': return <LoginPage />
    case 'register': return <RegisterPage />
    // B2B
    case 'b2b-login': return <B2BLoginPage />
    case 'b2b-register': return <B2BRegistrationPage />
    case 'b2b-dashboard': return <B2BDashboardPage />
    case 'b2b-events': return <B2BEventsPage />
    case 'b2b-bookings': return <B2BBookingsPage />
    case 'b2b-customers': return <B2BCustomersPage />
    case 'b2b-invoices': return <B2BInvoicesPage />
    case 'b2b-reports': return <B2BReportsPage />
    case 'b2b-settings': return <B2BSettingsPage />
    case 'rewards': return <RewardsPage />
    case 'user-management': return <UserManagementPage />
    // Admin
    case 'admin-dashboard': return <AdminDashboardPage />
    case 'suppliers': return <SupplierManagementPage />
    case 'inventory': return <InventoryManagementPage />
    case 'pricing': return <PricingEnginePage />
    case 'admin-bookings': return <BookingManagementPage />
    case 'customers': return <CustomerManagementPage />
    case 'partners': return <B2BPartnerManagementPage />
    case 'rewards-mgmt': return <RewardsManagementPage />
    case 'membership-cards': return <MembershipCardsPage />
    case 'payments': return <PaymentManagementPage />
    case 'reports': return <ReportsPage />
    case 'cms': return <CMSPage />
    case 'settings': return <SettingsPage />
    default: return <LandingPage />
  }
}

export default function Home() {
  return (
    <RouterProvider>
      <Router />
      <ToastContainer />
    </RouterProvider>
  )
}
