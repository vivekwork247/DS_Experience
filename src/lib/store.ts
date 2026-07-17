'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  SUPPLIERS, INVENTORY, PRICING_RULES, ADMIN_BOOKINGS, CUSTOMERS,
  B2B_PARTNERS, TRANSACTIONS, CMS_PAGES, ORG_USERS, EVENTS, TICKET_TIERS,
  MEMBERSHIP_CARDS, RESTAURANTS, CurrencyCode
} from './mock-data'

// ============ Types ============
export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'b2b' | 'admin'
  avatar?: string
  membership?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
}

export type EventCategory = 'Sports' | 'Concerts' | 'Formula 1' | 'Cricket' | 'Hospitality' | 'Tennis'

export interface Supplier {
  id: string
  name: string
  status: 'Connected' | 'Disabled' | 'Error'
  lastSync: string
  bookings: number
  revenue: number
  margin: number
  credentials: string
  apiKey?: string
  endpoint?: string
  categories: EventCategory[]
  primaryCategoryLabel: string
  routingPriority: number
  region: string
}

export interface InventoryItem {
  id: string
  event: string
  supplier: string
  tier: string
  qty: number
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Active' | 'Sold Out' | 'Reserved'
}

export interface PricingRule {
  id: string
  supplier: string
  markup: number
  minMargin: number
  campaign: string
  country: string
  currency: string
  partnerLevel: string
}

export interface BookingItem {
  id: string
  eventName: string
  eventDate: string
  venue: string
  customer: string
  email: string
  tier: string
  qty: number
  amount: number
  currency: string
  status: 'Confirmed' | 'Pending' | 'Refunded' | 'Cancelled'
  bookingDate: string
  paymentMethod: string
  supplier: string
  commission: number
  customerName: string
}

export interface Customer {
  id: string
  name: string
  email: string
  country: string
  bookings: number
  lifetimeValue: number
  status: 'Active' | 'Inactive' | 'Suspended'
  membership: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  tickets: number
}

export interface Partner {
  id: string
  company: string
  contact: string
  country: string
  tier: 'Silver' | 'Gold' | 'Platinum'
  creditLimit: number
  used: number
  status: 'Approved' | 'Pending' | 'Suspended'
  points: number
}

export interface Transaction {
  id: string
  booking: string
  customer: string
  amount: number
  currency: string
  method: string
  gateway: string
  status: 'Captured' | 'Refunded' | 'Chargeback' | 'Pending'
  date: string
}

export interface CMSPage {
  id: number
  title: string
  slug: string
  status: 'Published' | 'Draft'
  updated: string
  author: string
  content?: string
}

export interface OrgUser {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Sales Executive'
  status: 'Active' | 'Inactive'
  lastLogin: string
}

export interface CartItem {
  eventId: string
  eventName: string
  tierId: string
  tierName: string
  price: number
  currency: string
  qty: number
  seats?: string[]
  block?: string
  eventDate: string
  venue: string
}

export interface MembershipCard {
  id: string
  name: string
  code: string
  discountPct: number
  validFor: ('events' | 'restaurants' | 'hospitality' | 'travel')[]
  minSpend?: number
  maxDiscount?: number
  status: 'Active' | 'Paused' | 'Expired'
  issuedCount: number
  redeemedCount: number
  startDate: string
  endDate: string
  description: string
  color: string
}

export interface RewardTransaction {
  id: string
  type: 'earn' | 'redeem'
  points: number                 // positive for earn, negative for redeem
  source: string                 // e.g. "Booking BK-2026-00184" or "Restaurant rest-001"
  description: string
  date: string                   // ISO
  balanceAfter: number
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  city: string
  country: string
  priceForTwo: number
  currency: string
  rating: number
  image: string
  acceptedCards: string[]
  availability: 'Available' | 'Limited' | 'Waitlist'
}

// ============ Store ============
interface AppState {
  // Auth
  user: User | null
  login: (email: string, password: string, role: 'customer' | 'b2b' | 'admin') => boolean
  register: (data: { name: string; email: string; password: string }) => boolean
  logout: () => void

  // Cart
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  updateCartQty: (index: number, qty: number) => void
  clearCart: () => void

  // Wishlist
  wishlist: string[]
  toggleWishlist: (eventId: string) => void

  // Suppliers
  suppliers: Supplier[]
  addSupplier: (s: Omit<Supplier, 'id' | 'lastSync' | 'bookings' | 'revenue'>) => void
  updateSupplier: (id: string, patch: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  syncSupplier: (id: string) => void

  // Inventory
  inventory: InventoryItem[]
  addInventory: (i: Omit<InventoryItem, 'id'>) => void
  updateInventory: (id: string, patch: Partial<InventoryItem>) => void
  deleteInventory: (id: string) => void

  // Pricing
  pricingRules: PricingRule[]
  addPricingRule: (p: Omit<PricingRule, 'id'>) => void
  updatePricingRule: (id: string, patch: Partial<PricingRule>) => void
  deletePricingRule: (id: string) => void

  // Bookings
  bookings: BookingItem[]
  addBooking: (b: Omit<BookingItem, 'id' | 'bookingDate'>) => void
  updateBooking: (id: string, patch: Partial<BookingItem>) => void
  deleteBooking: (id: string) => void

  // Customers
  customers: Customer[]
  addCustomer: (c: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, patch: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Partners
  partners: Partner[]
  addPartner: (p: Omit<Partner, 'id' | 'points'>) => void
  updatePartner: (id: string, patch: Partial<Partner>) => void
  deletePartner: (id: string) => void

  // Transactions
  transactions: Transaction[]
  updateTransaction: (id: string, patch: Partial<Transaction>) => void

  // CMS
  cmsPages: CMSPage[]
  addCMSPage: (p: Omit<CMSPage, 'id' | 'updated'>) => void
  updateCMSPage: (id: number, patch: Partial<CMSPage>) => void
  deleteCMSPage: (id: number) => void

  // Org Users
  orgUsers: OrgUser[]
  addOrgUser: (u: Omit<OrgUser, 'id' | 'lastLogin'>) => void
  updateOrgUser: (id: number, patch: Partial<OrgUser>) => void
  deleteOrgUser: (id: number) => void

  // ============ Multi-Currency ============
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void

  // ============ Unified Rewards Wallet ============
  rewardsBalance: number
  rewardsHistory: RewardTransaction[]
  earnRewardPoints: (points: number, source: string, description: string) => void
  redeemRewardPoints: (points: number, source: string, description: string) => boolean

  // ============ Membership Cards ============
  membershipCards: MembershipCard[]
  ownedCardCodes: string[]            // codes the logged-in customer owns
  addMembershipCard: (c: Omit<MembershipCard, 'id' | 'issuedCount' | 'redeemedCount'>) => void
  updateMembershipCard: (id: string, patch: Partial<MembershipCard>) => void
  deleteMembershipCard: (id: string) => void
  grantMembershipCard: (code: string) => void        // grant card to current customer
  redeemMembershipCard: (code: string) => void       // increment redeemedCount

  // ============ Restaurants (cross-service) ============
  restaurants: Restaurant[]
  restaurantBookings: { id: string; restaurantId: string; restaurantName: string; date: string; pax: number; amount: number; currency: string; cardApplied?: string; status: 'Confirmed' | 'Pending' | 'Cancelled' }[]
  addRestaurantBooking: (b: { restaurantId: string; restaurantName: string; date: string; pax: number; amount: number; currency: string; cardApplied?: string }) => void
  cancelRestaurantBooking: (id: string) => void

  // Toast notifications
  toasts: { id: number; title: string; description?: string; type: 'success' | 'error' | 'info' }[]
  addToast: (t: { title: string; description?: string; type?: 'success' | 'error' | 'info' }) => void
  removeToast: (id: number) => void
}

let toastId = 0

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ============ Auth ============
      user: null,
      login: (email, _password, role) => {
        const user: User = {
          id: `usr-${Date.now()}`,
          name: role === 'admin' ? 'Alex Admin' : role === 'b2b' ? 'Sarah Mitchell' : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email,
          role,
          avatar: `https://i.pravatar.cc/100?img=${role === 'admin' ? 5 : role === 'b2b' ? 23 : 12}`,
          membership: role === 'customer' ? 'Gold' : undefined,
        }
        set({ user })
        get().addToast({ title: 'Welcome back!', description: `Signed in as ${user.name}`, type: 'success' })
        return true
      },
      register: ({ name, email }) => {
        const user: User = {
          id: `usr-${Date.now()}`,
          name,
          email,
          role: 'customer',
          avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`,
          membership: 'Bronze',
        }
        set({ user })
        get().addToast({ title: 'Account created!', description: 'Welcome to DS Experiences', type: 'success' })
        return true
      },
      logout: () => {
        set({ user: null })
        get().addToast({ title: 'Signed out', description: 'You have been logged out', type: 'info' })
      },

      // ============ Cart ============
      cart: [],
      addToCart: (item) => {
        set((s) => ({ cart: [...s.cart, item] }))
        get().addToast({ title: 'Added to cart', description: `${item.qty} × ${item.tierName}`, type: 'success' })
      },
      removeFromCart: (index) => set((s) => ({ cart: s.cart.filter((_, i) => i !== index) })),
      updateCartQty: (index, qty) => set((s) => ({
        cart: s.cart.map((item, i) => i === index ? { ...item, qty: Math.max(1, qty) } : item)
      })),
      clearCart: () => set({ cart: [] }),

      // ============ Wishlist ============
      wishlist: [],
      toggleWishlist: (eventId) => set((s) => ({
        wishlist: s.wishlist.includes(eventId)
          ? s.wishlist.filter(id => id !== eventId)
          : [...s.wishlist, eventId]
      })),

      // ============ Suppliers ============
      suppliers: SUPPLIERS as Supplier[],
      addSupplier: (s) => {
        const newSupplier: Supplier = {
          ...s,
          id: `SUP-${String(get().suppliers.length + 1).padStart(3, '0')}`,
          lastSync: 'just now',
          bookings: 0,
          revenue: 0,
        }
        set((state) => ({ suppliers: [newSupplier, ...state.suppliers] }))
        get().addToast({ title: 'Supplier added', description: newSupplier.name, type: 'success' })
      },
      updateSupplier: (id, patch) => {
        set((s) => ({ suppliers: s.suppliers.map(sup => sup.id === id ? { ...sup, ...patch } : sup) }))
        get().addToast({ title: 'Supplier updated', type: 'success' })
      },
      deleteSupplier: (id) => {
        set((s) => ({ suppliers: s.suppliers.filter(sup => sup.id !== id) }))
        get().addToast({ title: 'Supplier deleted', type: 'info' })
      },
      syncSupplier: (id) => {
        set((s) => ({ suppliers: s.suppliers.map(sup => sup.id === id ? { ...sup, lastSync: 'just now', status: 'Connected' } : sup) }))
        get().addToast({ title: 'Sync started', description: 'Inventory will refresh shortly', type: 'success' })
      },

      // ============ Inventory ============
      inventory: INVENTORY as InventoryItem[],
      addInventory: (i) => {
        const newItem: InventoryItem = {
          ...i,
          id: `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        }
        set((s) => ({ inventory: [newItem, ...s.inventory] }))
        get().addToast({ title: 'Inventory added', description: newItem.event, type: 'success' })
      },
      updateInventory: (id, patch) => {
        set((s) => ({ inventory: s.inventory.map(i => i.id === id ? { ...i, ...patch } : i) }))
        get().addToast({ title: 'Inventory updated', type: 'success' })
      },
      deleteInventory: (id) => {
        set((s) => ({ inventory: s.inventory.filter(i => i.id !== id) }))
        get().addToast({ title: 'Inventory deleted', type: 'info' })
      },

      // ============ Pricing ============
      pricingRules: PRICING_RULES as PricingRule[],
      addPricingRule: (p) => {
        const newRule: PricingRule = { ...p, id: `PR-${String(get().pricingRules.length + 1).padStart(3, '0')}` }
        set((s) => ({ pricingRules: [newRule, ...s.pricingRules] }))
        get().addToast({ title: 'Pricing rule created', type: 'success' })
      },
      updatePricingRule: (id, patch) => {
        set((s) => ({ pricingRules: s.pricingRules.map(p => p.id === id ? { ...p, ...patch } : p) }))
        get().addToast({ title: 'Pricing rule updated', type: 'success' })
      },
      deletePricingRule: (id) => {
        set((s) => ({ pricingRules: s.pricingRules.filter(p => p.id !== id) }))
        get().addToast({ title: 'Pricing rule deleted', type: 'info' })
      },

      // ============ Bookings ============
      bookings: ADMIN_BOOKINGS as BookingItem[],
      addBooking: (b) => {
        const newBooking: BookingItem = {
          ...b,
          id: `BK-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          bookingDate: new Date().toISOString().split('T')[0],
        }
        set((s) => ({ bookings: [newBooking, ...s.bookings] }))
        get().addToast({ title: 'Booking created', description: newBooking.id, type: 'success' })
      },
      updateBooking: (id, patch) => {
        set((s) => ({ bookings: s.bookings.map(b => b.id === id ? { ...b, ...patch } : b) }))
        get().addToast({ title: 'Booking updated', type: 'success' })
      },
      deleteBooking: (id) => {
        set((s) => ({ bookings: s.bookings.filter(b => b.id !== id) }))
        get().addToast({ title: 'Booking deleted', type: 'info' })
      },

      // ============ Customers ============
      customers: CUSTOMERS as Customer[],
      addCustomer: (c) => {
        const newCustomer: Customer = { ...c, id: `CUST-${String(get().customers.length + 1).padStart(3, '0')}` }
        set((s) => ({ customers: [newCustomer, ...s.customers] }))
        get().addToast({ title: 'Customer added', type: 'success' })
      },
      updateCustomer: (id, patch) => {
        set((s) => ({ customers: s.customers.map(c => c.id === id ? { ...c, ...patch } : c) }))
        get().addToast({ title: 'Customer updated', type: 'success' })
      },
      deleteCustomer: (id) => {
        set((s) => ({ customers: s.customers.filter(c => c.id !== id) }))
        get().addToast({ title: 'Customer deleted', type: 'info' })
      },

      // ============ Partners ============
      partners: B2B_PARTNERS as Partner[],
      addPartner: (p) => {
        const newPartner: Partner = { ...p, id: `PTNR-${String(get().partners.length + 1).padStart(3, '0')}`, points: 0 }
        set((s) => ({ partners: [newPartner, ...s.partners] }))
        get().addToast({ title: 'Partner added', type: 'success' })
      },
      updatePartner: (id, patch) => {
        set((s) => ({ partners: s.partners.map(p => p.id === id ? { ...p, ...patch } : p) }))
        get().addToast({ title: 'Partner updated', type: 'success' })
      },
      deletePartner: (id) => {
        set((s) => ({ partners: s.partners.filter(p => p.id !== id) }))
        get().addToast({ title: 'Partner deleted', type: 'info' })
      },

      // ============ Transactions ============
      transactions: TRANSACTIONS as Transaction[],
      updateTransaction: (id, patch) => {
        set((s) => ({ transactions: s.transactions.map(t => t.id === id ? { ...t, ...patch } : t) }))
        get().addToast({ title: 'Transaction updated', type: 'success' })
      },

      // ============ CMS ============
      cmsPages: CMS_PAGES as CMSPage[],
      addCMSPage: (p) => {
        const newPage: CMSPage = { ...p, id: Math.max(...get().cmsPages.map(x => x.id), 0) + 1, updated: 'just now' }
        set((s) => ({ cmsPages: [newPage, ...s.cmsPages] }))
        get().addToast({ title: 'Page created', description: newPage.title, type: 'success' })
      },
      updateCMSPage: (id, patch) => {
        set((s) => ({ cmsPages: s.cmsPages.map(p => p.id === id ? { ...p, ...patch, updated: 'just now' } : p) }))
        get().addToast({ title: 'Page updated', type: 'success' })
      },
      deleteCMSPage: (id) => {
        set((s) => ({ cmsPages: s.cmsPages.filter(p => p.id !== id) }))
        get().addToast({ title: 'Page deleted', type: 'info' })
      },

      // ============ Org Users ============
      orgUsers: ORG_USERS as OrgUser[],
      addOrgUser: (u) => {
        const newUser: OrgUser = { ...u, id: Math.max(...get().orgUsers.map(x => x.id), 0) + 1, lastLogin: 'never' }
        set((s) => ({ orgUsers: [newUser, ...s.orgUsers] }))
        get().addToast({ title: 'User added', description: newUser.name, type: 'success' })
      },
      updateOrgUser: (id, patch) => {
        set((s) => ({ orgUsers: s.orgUsers.map(u => u.id === id ? { ...u, ...patch } : u) }))
        get().addToast({ title: 'User updated', type: 'success' })
      },
      deleteOrgUser: (id) => {
        set((s) => ({ orgUsers: s.orgUsers.filter(u => u.id !== id) }))
        get().addToast({ title: 'User removed', type: 'info' })
      },

      // ============ Multi-Currency ============
      currency: 'USD',
      setCurrency: (c) => {
        set({ currency: c })
        get().addToast({ title: 'Currency changed', description: `Prices now shown in ${c}`, type: 'info' })
      },

      // ============ Unified Rewards Wallet ============
      rewardsBalance: 1842,
      rewardsHistory: [
        { id: 'rw-001', type: 'earn', points: 290, source: 'BK-2026-00184', description: 'UEFA Champions League Final — 2 tickets', date: '2026-01-12T10:30:00Z', balanceAfter: 1842 },
        { id: 'rw-002', type: 'earn', points: 192, source: 'BK-2026-00196', description: 'Coldplay London — 4 tickets', date: '2026-02-04T15:14:00Z', balanceAfter: 1552 },
        { id: 'rw-003', type: 'earn', points: 240, source: 'BK-2026-00211', description: 'Monaco Grand Prix — 1 hospitality', date: '2026-02-18T14:32:00Z', balanceAfter: 1360 },
        { id: 'rw-004', type: 'redeem', points: -150, source: 'Checkout discount', description: 'Redeemed 150 points at checkout', date: '2026-02-22T11:08:00Z', balanceAfter: 1120 },
      ],
      earnRewardPoints: (points, source, description) => {
        const newBalance = get().rewardsBalance + points
        const tx: RewardTransaction = {
          id: `rw-${Date.now()}`,
          type: 'earn',
          points,
          source,
          description,
          date: new Date().toISOString(),
          balanceAfter: newBalance,
        }
        set((s) => ({ rewardsBalance: newBalance, rewardsHistory: [tx, ...s.rewardsHistory] }))
      },
      redeemRewardPoints: (points, source, description) => {
        if (get().rewardsBalance < points) {
          get().addToast({ title: 'Not enough points', description: `You need ${points - get().rewardsBalance} more`, type: 'error' })
          return false
        }
        const newBalance = get().rewardsBalance - points
        const tx: RewardTransaction = {
          id: `rw-${Date.now()}`,
          type: 'redeem',
          points: -points,
          source,
          description,
          date: new Date().toISOString(),
          balanceAfter: newBalance,
        }
        set((s) => ({ rewardsBalance: newBalance, rewardsHistory: [tx, ...s.rewardsHistory] }))
        return true
      },

      // ============ Membership Cards ============
      membershipCards: MEMBERSHIP_CARDS as MembershipCard[],
      ownedCardCodes: ['GOLD10'],
      addMembershipCard: (c) => {
        const newCard: MembershipCard = {
          ...c,
          id: `MC-${String(get().membershipCards.length + 1).padStart(3, '0')}`,
          issuedCount: 0,
          redeemedCount: 0,
        }
        set((s) => ({ membershipCards: [newCard, ...s.membershipCards] }))
        get().addToast({ title: 'Membership card created', description: newCard.name, type: 'success' })
      },
      updateMembershipCard: (id, patch) => {
        set((s) => ({ membershipCards: s.membershipCards.map(c => c.id === id ? { ...c, ...patch } : c) }))
        get().addToast({ title: 'Membership card updated', type: 'success' })
      },
      deleteMembershipCard: (id) => {
        set((s) => ({ membershipCards: s.membershipCards.filter(c => c.id !== id) }))
        get().addToast({ title: 'Membership card deleted', type: 'info' })
      },
      grantMembershipCard: (code) => {
        const card = get().membershipCards.find(c => c.code === code && c.status === 'Active')
        if (!card) {
          get().addToast({ title: 'Invalid card code', description: 'Card not found or inactive', type: 'error' })
          return
        }
        if (get().ownedCardCodes.includes(code)) {
          get().addToast({ title: 'Already owned', description: 'You already have this card', type: 'info' })
          return
        }
        set((s) => ({
          ownedCardCodes: [...s.ownedCardCodes, code],
          membershipCards: s.membershipCards.map(c => c.code === code ? { ...c, issuedCount: c.issuedCount + 1 } : c),
        }))
        get().addToast({ title: 'Card added to wallet', description: `${card.name} is now active`, type: 'success' })
      },
      redeemMembershipCard: (code) => {
        set((s) => ({
          membershipCards: s.membershipCards.map(c => c.code === code ? { ...c, redeemedCount: c.redeemedCount + 1 } : c),
        }))
      },

      // ============ Restaurants (cross-service) ============
      restaurants: RESTAURANTS as Restaurant[],
      restaurantBookings: [
        { id: 'RB-001', restaurantId: 'rest-001', restaurantName: 'Sky Lounge Dubai', date: '2026-05-29', pax: 4, amount: 560, currency: 'USD', cardApplied: 'GOLD10', status: 'Confirmed' },
        { id: 'RB-002', restaurantId: 'rest-003', restaurantName: 'Taj Courtyard', date: '2026-04-11', pax: 2, amount: 240, currency: 'USD', cardApplied: 'GOLD10', status: 'Confirmed' },
      ],
      addRestaurantBooking: (b) => {
        const newBooking = {
          ...b,
          id: `RB-${String(get().restaurantBookings.length + 1).padStart(3, '0')}`,
          status: 'Confirmed' as const,
        }
        set((s) => ({ restaurantBookings: [newBooking, ...s.restaurantBookings] }))
        // Earn 1 reward point per $1 spent
        get().earnRewardPoints(Math.round(b.amount), `RB-${newBooking.id}`, `Restaurant booking: ${b.restaurantName}`)
        if (b.cardApplied) get().redeemMembershipCard(b.cardApplied)
        get().addToast({ title: 'Restaurant booked', description: `${b.restaurantName} — ${b.pax} guests`, type: 'success' })
      },
      cancelRestaurantBooking: (id) => {
        set((s) => ({ restaurantBookings: s.restaurantBookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b) }))
        get().addToast({ title: 'Restaurant booking cancelled', type: 'info' })
      },

      // ============ Toasts ============
      toasts: [],
      addToast: (t) => {
        const id = ++toastId
        set((s) => ({ toasts: [...s.toasts, { id, type: 'success', ...t }] }))
        setTimeout(() => get().removeToast(id), 3500)
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
    }),
    {
      name: 'ds-experiences-store',
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        wishlist: state.wishlist,
        suppliers: state.suppliers,
        inventory: state.inventory,
        pricingRules: state.pricingRules,
        bookings: state.bookings,
        customers: state.customers,
        partners: state.partners,
        transactions: state.transactions,
        cmsPages: state.cmsPages,
        orgUsers: state.orgUsers,
        currency: state.currency,
        rewardsBalance: state.rewardsBalance,
        rewardsHistory: state.rewardsHistory,
        membershipCards: state.membershipCards,
        ownedCardCodes: state.ownedCardCodes,
        restaurants: state.restaurants,
        restaurantBookings: state.restaurantBookings,
      }) as any,
    }
  )
)
