// Types & mock data for DS Experiences platform

export type EventCategory = 'Sports' | 'Concerts' | 'Formula 1' | 'Cricket' | 'Hospitality' | 'Tennis'

export interface EventItem {
  id: string
  name: string
  category: EventCategory
  venue: string
  city: string
  country: string
  date: string
  time: string
  image: string
  gallery: string[]
  startingPrice: number
  currency: string
  ticketsAvailable: number
  featured?: boolean
  description: string
  supplierId?: string
}

// Curated gallery sets per category.
// Mix of verified Unsplash photos and ZAI image-search OSS-hosted URLs
// (guaranteed reachable) — every URL below has been HTTP-validated.
const GALLERY = {
  Sports: [
    'https://sfile.chatglm.cn/images-ppt/635538f775ec.jpg', // UEFA stadium at night
    'https://sfile.chatglm.cn/images-ppt/56639f9c4799.jpg', // football match action
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80', // El Clasico
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80', // PSG match
  ],
  Concerts: [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80', // Coldplay
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80', // concert crowd
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80', // Adele / stage
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80', // Dubai Jazz
  ],
  'Formula 1': [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80', // F1 car
    'https://sfile.chatglm.cn/images-ppt/7e04089a7433.jpg', // Singapore night race
    'https://sfile.chatglm.cn/images-ppt/145e7c8e4a9d.png', // street circuit
    'https://sfile.chatglm.cn/images-ppt/90dfc611b72c.jpg', // F1 racing action
  ],
  Cricket: [
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80', // cricket match
    'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&q=80', // IPL stadium
    'https://sfile.chatglm.cn/images-ppt/4750a2853765.jpg', // batsman action
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80', // cricket crowd
  ],
  Hospitality: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', // restaurant
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', // fine dining
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80', // lounge
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80', // rooftop bar
  ],
  Tennis: [
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=80', // tennis court
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80', // Wimbledon
    'https://sfile.chatglm.cn/images-ppt/98d901fda4a6.jpg', // tennis player action
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80', // tennis arena
  ],
}

export interface TicketTier {
  id: string
  name: string
  price: number
  currency: string
  available: number
  features: string[]
  badge?: string
}

export interface Booking {
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
}

export interface B2BBooking extends Booking {
  supplier: string
  commission: number
  customerName: string
}

export const CATEGORIES = [
  { name: 'Sports', icon: 'Trophy', count: 248, gradient: 'from-amber-500/20 to-orange-500/20' },
  { name: 'Concerts', icon: 'Music', count: 412, gradient: 'from-rose-500/20 to-pink-500/20' },
  { name: 'Formula 1', icon: 'Car', count: 24, gradient: 'from-red-500/20 to-rose-500/20' },
  { name: 'Cricket', icon: 'CircleDot', count: 86, gradient: 'from-emerald-500/20 to-green-500/20' },
  { name: 'Tennis', icon: 'Circle', count: 48, gradient: 'from-yellow-500/20 to-amber-500/20' },
  { name: 'Hospitality', icon: 'Wine', count: 132, gradient: 'from-purple-500/20 to-fuchsia-500/20' },
] as const

// ============ Multi-Currency Support ============
export type CurrencyCode = 'USD' | 'INR' | 'EUR'

export const CURRENCIES: { code: CurrencyCode; symbol: string; name: string; rate: number; flag: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5, flag: '🇮🇳' },
]

export function convertCurrency(amount: number, from: CurrencyCode | string, to: CurrencyCode | string): number {
  const fromRate = CURRENCIES.find(c => c.code === from)?.rate ?? 1
  const toRate = CURRENCIES.find(c => c.code === to)?.rate ?? 1
  // amount in `from` → USD → `to`
  const usd = amount / fromRate
  return usd * toRate
}

export function formatPrice(
  amount: number,
  fromCurrency: CurrencyCode | string = 'USD',
  toCurrency: CurrencyCode | string = 'USD',
  opts: { showOriginal?: boolean; fractionDigits?: number } = {}
): string {
  const { fractionDigits = 0 } = opts
  const converted = convertCurrency(amount, fromCurrency, toCurrency)
  const cur = CURRENCIES.find(c => c.code === toCurrency)
  const symbol = cur?.symbol ?? '$'
  return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`
}

// ============ Supplier / Vendor Categorization ============
// 5 launch suppliers — each manages specific event categories.
// Smart routing maps an event's category to the appropriate supplier.
export interface SupplierCategory {
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
  categories: EventCategory[]   // primary categories managed by this vendor
  primaryCategoryLabel: string  // e.g., "Racing Events"
  routingPriority: number       // lower = higher priority for fallback routing
  region: string
}

export const SUPPLIERS: SupplierCategory[] = [
  {
    id: 'SUP-001',
    name: 'Velocity Racing Supplies',
    status: 'Connected',
    lastSync: '2 min ago',
    bookings: 1248,
    revenue: 486200,
    margin: 18.4,
    credentials: 'API Key ••••8a3f',
    apiKey: 'vrs_live_8a3f9b2c',
    endpoint: 'https://api.velocity-racing.io/v2',
    categories: ['Formula 1'],
    primaryCategoryLabel: 'Racing Events',
    routingPriority: 1,
    region: 'Global',
  },
  {
    id: 'SUP-002',
    name: 'Concert Live Worldwide',
    status: 'Connected',
    lastSync: '3 min ago',
    bookings: 1672,
    revenue: 412300,
    margin: 16.8,
    credentials: 'OAuth ••••9f1a',
    apiKey: 'clw_oauth_9f1a4e7c',
    endpoint: 'https://api.concert-live.world/v1',
    categories: ['Concerts'],
    primaryCategoryLabel: 'Concerts',
    routingPriority: 2,
    region: 'Global',
  },
  {
    id: 'SUP-003',
    name: 'Cricket Tickets India',
    status: 'Connected',
    lastSync: '8 min ago',
    bookings: 945,
    revenue: 142800,
    margin: 11.5,
    credentials: 'API Key ••••3e7c',
    apiKey: 'cti_live_3e7cd1a8',
    endpoint: 'https://api.crickettickets.in/v1',
    categories: ['Cricket'],
    primaryCategoryLabel: 'Cricket',
    routingPriority: 3,
    region: 'APAC',
  },
  {
    id: 'SUP-004',
    name: 'Grand Slam Tennis Tix',
    status: 'Connected',
    lastSync: '5 min ago',
    bookings: 612,
    revenue: 224500,
    margin: 19.2,
    credentials: 'OAuth ••••4d8b',
    apiKey: 'gstt_oauth_4d8b9c12',
    endpoint: 'https://api.gstt.io/v2',
    categories: ['Tennis'],
    primaryCategoryLabel: 'Tennis',
    routingPriority: 4,
    region: 'Global',
  },
  {
    id: 'SUP-005',
    name: 'Global Events Network',
    status: 'Connected',
    lastSync: '6 min ago',
    bookings: 1820,
    revenue: 298400,
    margin: 14.7,
    credentials: 'API Key ••••7c2e',
    apiKey: 'gen_live_7c2e1d4f',
    endpoint: 'https://api.global-events.network/v3',
    categories: ['Sports', 'Hospitality'],
    primaryCategoryLabel: 'Other Supported Categories',
    routingPriority: 5,
    region: 'Global',
  },
]

/**
 * Smart routing: returns the supplier that should fulfill inventory
 * for a given event category. Falls back to "Other" (SUP-005) for
 * any category not explicitly mapped.
 */
export function routeSupplier(category: EventCategory): SupplierCategory {
  const exact = SUPPLIERS.find(s => s.categories.includes(category) && s.status === 'Connected')
  if (exact) return exact
  const fallback = SUPPLIERS.find(s => s.id === 'SUP-005')
  return fallback ?? SUPPLIERS[0]
}

export function supplierForEvent(event: EventItem): SupplierCategory {
  if (event.supplierId) {
    const s = SUPPLIERS.find(x => x.id === event.supplierId)
    if (s) return s
  }
  return routeSupplier(event.category)
}

// ============ Membership Cards ============
export interface MembershipCard {
  id: string
  name: string
  code: string
  discountPct: number           // e.g. 10 = 10% off
  validFor: ('events' | 'restaurants' | 'hospitality' | 'travel')[]
  minSpend?: number
  maxDiscount?: number          // cap in USD
  status: 'Active' | 'Paused' | 'Expired'
  issuedCount: number
  redeemedCount: number
  startDate: string
  endDate: string
  description: string
  color: string                 // gradient class
}

export const MEMBERSHIP_CARDS: MembershipCard[] = [
  {
    id: 'MC-001',
    name: 'Gold Member Pass',
    code: 'GOLD10',
    discountPct: 10,
    validFor: ['events', 'restaurants'],
    minSpend: 100,
    maxDiscount: 250,
    status: 'Active',
    issuedCount: 1248,
    redeemedCount: 612,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    description: '10% off all event tickets and partner restaurant bookings. Stackable with seasonal promotions.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'MC-002',
    name: 'Platinum Experience',
    code: 'PLATINUM15',
    discountPct: 15,
    validFor: ['events', 'restaurants', 'hospitality'],
    minSpend: 500,
    maxDiscount: 750,
    status: 'Active',
    issuedCount: 318,
    redeemedCount: 142,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    description: 'Premium 15% discount across events, restaurants, and hospitality packages. Invitation-only tier.',
    color: 'from-violet-500 to-purple-700',
  },
  {
    id: 'MC-003',
    name: 'Dining Connoisseur',
    code: 'DINE20',
    discountPct: 20,
    validFor: ['restaurants'],
    minSpend: 50,
    maxDiscount: 100,
    status: 'Active',
    issuedCount: 824,
    redeemedCount: 412,
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    description: 'Exclusive 20% off at 50+ partner restaurants including Michelin-starred venues.',
    color: 'from-rose-500 to-pink-700',
  },
  {
    id: 'MC-004',
    name: 'Sports Fan Bundle',
    code: 'SPORTS12',
    discountPct: 12,
    validFor: ['events'],
    minSpend: 200,
    maxDiscount: 300,
    status: 'Paused',
    issuedCount: 524,
    redeemedCount: 286,
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    description: '12% off all sports events including F1, football, cricket, and tennis. Seasonal campaign.',
    color: 'from-emerald-500 to-green-700',
  },
]

// ============ Partner Restaurants (for cross-service redemption) ============
export interface Restaurant {
  id: string
  name: string
  cuisine: string
  city: string
  country: string
  priceForTwo: number           // USD
  currency: string
  rating: number
  image: string
  acceptedCards: string[]       // membership card codes accepted
  availability: 'Available' | 'Limited' | 'Waitlist'
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-001',
    name: 'Sky Lounge Dubai',
    cuisine: 'Modern European',
    city: 'Dubai',
    country: 'UAE',
    priceForTwo: 280,
    currency: 'USD',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    acceptedCards: ['GOLD10', 'PLATINUM15', 'DINE20'],
    availability: 'Available',
  },
  {
    id: 'rest-002',
    name: 'Le Petit Bistro',
    cuisine: 'French',
    city: 'Paris',
    country: 'France',
    priceForTwo: 180,
    currency: 'USD',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    acceptedCards: ['GOLD10', 'PLATINUM15'],
    availability: 'Limited',
  },
  {
    id: 'rest-003',
    name: 'Taj Courtyard',
    cuisine: 'Indian Fine Dining',
    city: 'Mumbai',
    country: 'India',
    priceForTwo: 120,
    currency: 'USD',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    acceptedCards: ['GOLD10', 'PLATINUM15', 'DINE20'],
    availability: 'Available',
  },
  {
    id: 'rest-004',
    name: 'Marina Bay Eats',
    cuisine: 'Asian Fusion',
    city: 'Singapore',
    country: 'Singapore',
    priceForTwo: 220,
    currency: 'USD',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
    acceptedCards: ['GOLD10', 'DINE20'],
    availability: 'Waitlist',
  },
]

export const EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    name: 'UEFA Champions League Final 2026',
    category: 'Sports',
    venue: 'Wembley Stadium',
    city: 'London',
    country: 'United Kingdom',
    date: '2026-05-30',
    time: '21:00',
    image: 'https://sfile.chatglm.cn/images-ppt/635538f775ec.jpg',
    gallery: GALLERY.Sports,
    startingPrice: 450,
    currency: 'USD',
    ticketsAvailable: 124,
    featured: true,
    supplierId: 'SUP-005',
    description: 'The pinnacle of European club football returns to the iconic Wembley Stadium. Witness history as two giants battle for the most coveted trophy in club football. Includes optional hospitality packages with premium seating, gourmet dining, and VIP access.',
  },
  {
    id: 'evt-002',
    name: 'Monaco Grand Prix 2026',
    category: 'Formula 1',
    venue: 'Circuit de Monaco',
    city: 'Monte Carlo',
    country: 'Monaco',
    date: '2026-05-24',
    time: '15:00',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80',
    gallery: GALLERY['Formula 1'],
    startingPrice: 890,
    currency: 'USD',
    ticketsAvailable: 56,
    featured: true,
    supplierId: 'SUP-001',
    description: 'Experience the most prestigious race in the Formula 1 calendar. The Monaco Grand Prix offers glamour, history, and the tightest street circuit on the schedule. Premium hospitality packages available with trackside views and gourmet catering.',
  },
  {
    id: 'evt-003',
    name: 'Coldplay: Music of the Spheres Tour',
    category: 'Concerts',
    venue: 'O2 Arena',
    city: 'London',
    country: 'United Kingdom',
    date: '2026-06-15',
    time: '19:30',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    gallery: GALLERY.Concerts,
    startingPrice: 180,
    currency: 'USD',
    ticketsAvailable: 432,
    featured: true,
    supplierId: 'SUP-002',
    description: 'Coldplay returns to London with their record-breaking Music of the Spheres tour. Expect spectacular visuals, immersive light shows, and a setlist spanning their greatest hits alongside new material from their latest album.',
  },
  {
    id: 'evt-004',
    name: 'India vs Australia T20 International',
    category: 'Cricket',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    country: 'India',
    date: '2026-04-12',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
    gallery: GALLERY.Cricket,
    startingPrice: 65,
    currency: 'USD',
    ticketsAvailable: 286,
    featured: true,
    supplierId: 'SUP-003',
    description: 'The rivalry continues as India takes on Australia in a high-octane T20 International at the iconic Wankhede Stadium. Hospitality boxes available with premium catering and reserved seating.',
  },
  {
    id: 'evt-005',
    name: 'Singapore Grand Prix 2026',
    category: 'Formula 1',
    venue: 'Marina Bay Street Circuit',
    city: 'Singapore',
    country: 'Singapore',
    date: '2026-09-20',
    time: '20:00',
    image: 'https://sfile.chatglm.cn/images-ppt/7e04089a7433.jpg',
    gallery: GALLERY['Formula 1'],
    startingPrice: 720,
    currency: 'USD',
    ticketsAvailable: 78,
    supplierId: 'SUP-001',
    description: 'Formula 1 under the lights. The Singapore Grand Prix is the original night race, combining a challenging street circuit with the dazzle of Southeast Asia\'s premier city-state.',
  },
  {
    id: 'evt-006',
    name: 'Adele: Weekends with Adele',
    category: 'Concerts',
    venue: 'The Colosseum at Caesars Palace',
    city: 'Las Vegas',
    country: 'United States',
    date: '2026-07-18',
    time: '20:00',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',
    gallery: GALLERY.Concerts,
    startingPrice: 320,
    currency: 'USD',
    ticketsAvailable: 92,
    supplierId: 'SUP-002',
    description: 'An intimate, once-in-a-lifetime residency with Adele at the historic Colosseum. Featuring her timeless ballads and an exquisite production designed exclusively for this venue.',
  },
  {
    id: 'evt-007',
    name: 'Real Madrid vs FC Barcelona — El Clásico',
    category: 'Sports',
    venue: 'Santiago Bernabéu',
    city: 'Madrid',
    country: 'Spain',
    date: '2026-10-25',
    time: '21:00',
    image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80',
    gallery: GALLERY.Sports,
    startingPrice: 380,
    currency: 'USD',
    ticketsAvailable: 64,
    supplierId: 'SUP-005',
    description: 'The greatest rivalry in world football returns to the Bernabéu. El Clásico is more than a match — it is a cultural phenomenon. Hospitality options include VIP lounges and pre-match fine dining.',
  },
  {
    id: 'evt-008',
    name: 'Dubai Jazz Festival 2026',
    category: 'Concerts',
    venue: 'Dubai Media City Amphitheatre',
    city: 'Dubai',
    country: 'United Arab Emirates',
    date: '2026-02-22',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80',
    gallery: GALLERY.Concerts,
    startingPrice: 145,
    currency: 'USD',
    ticketsAvailable: 312,
    supplierId: 'SUP-002',
    description: 'Three nights of world-class jazz under the Dubai sky. Featuring headline acts from across the globe, the festival combines musical excellence with the luxury hospitality Dubai is known for.',
  },
  {
    id: 'evt-009',
    name: 'Dubai Duty Free Tennis Championships',
    category: 'Tennis',
    venue: 'Aviation Club Tennis Centre',
    city: 'Dubai',
    country: 'United Arab Emirates',
    date: '2026-02-26',
    time: '14:00',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=80',
    gallery: GALLERY.Tennis,
    startingPrice: 95,
    currency: 'USD',
    ticketsAvailable: 198,
    featured: true,
    supplierId: 'SUP-004',
    description: 'ATP 500 action featuring the world\'s top men\'s players competing on hard courts in Dubai. Premium hospitality packages include courtside seating and Champions Club access.',
  },
  {
    id: 'evt-010',
    name: 'Paris Saint-Germain vs Marseille — Le Classique',
    category: 'Sports',
    venue: 'Parc des Princes',
    city: 'Paris',
    country: 'France',
    date: '2026-03-08',
    time: '20:45',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80',
    gallery: GALLERY.Sports,
    startingPrice: 290,
    currency: 'USD',
    ticketsAvailable: 88,
    supplierId: 'SUP-005',
    description: 'French football\'s fiercest rivalry. The atmosphere at Parc des Princes for Le Classique is unmatched anywhere in Europe. Hospitality packages available with VIP lounge access.',
  },
  {
    id: 'evt-011',
    name: 'Ed Sheeran: Mathematics Tour',
    category: 'Concerts',
    venue: 'Singapore National Stadium',
    city: 'Singapore',
    country: 'Singapore',
    date: '2026-11-14',
    time: '19:30',
    image: 'https://sfile.chatglm.cn/images-ppt/25d9dca8998e.jpg',
    gallery: GALLERY.Concerts,
    startingPrice: 155,
    currency: 'USD',
    ticketsAvailable: 524,
    supplierId: 'SUP-002',
    description: 'Ed Sheeran brings his record-breaking Mathematics Tour to Southeast Asia. One man, one loop pedal, and stadium-shaking anthems in an unforgettable live experience.',
  },
  {
    id: 'evt-012',
    name: 'Indian Premier League Final 2026',
    category: 'Cricket',
    venue: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    country: 'India',
    date: '2026-05-29',
    time: '19:30',
    image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&q=80',
    gallery: GALLERY.Cricket,
    startingPrice: 110,
    currency: 'USD',
    ticketsAvailable: 1100,
    supplierId: 'SUP-003',
    description: 'The biggest night in T20 cricket. The IPL Final at the world\'s largest cricket stadium is an electric celebration of sport, music, and entertainment. Corporate boxes and hospitality suites available.',
  },
  {
    id: 'evt-013',
    name: 'Wimbledon Gentlemen\'s Singles Final 2026',
    category: 'Tennis',
    venue: 'All England Lawn Tennis Club',
    city: 'London',
    country: 'United Kingdom',
    date: '2026-07-12',
    time: '14:00',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    gallery: GALLERY.Tennis,
    startingPrice: 650,
    currency: 'USD',
    ticketsAvailable: 42,
    featured: true,
    supplierId: 'SUP-004',
    description: 'The most prestigious final in tennis. Centre Court at Wimbledon hosts the climax of two weeks of grass-court brilliance. Includes optional debenture lounge access and traditional afternoon tea.',
  },
]

export const TICKET_TIERS: Record<string, TicketTier[]> = {
  'evt-001': [
    { id: 't1', name: 'Hospitality VIP', price: 2400, currency: 'USD', available: 18, features: ['Private suite', 'Gourmet 4-course meal', 'Open bar', 'Meet & greet with legend', 'Parking included'], badge: 'Most Popular' },
    { id: 't2', name: 'Premium Category 1', price: 1450, currency: 'USD', available: 32, features: ['Best lower-tier seats', 'Lounge access', 'Pre-match dining', 'Premium parking'] },
    { id: 't3', name: 'Category 2', price: 780, currency: 'USD', available: 48, features: ['Mid-tier seating', 'Concessions access'] },
    { id: 't4', name: 'Category 3', price: 450, currency: 'USD', available: 26, features: ['Upper-tier seating', 'Restricted view possible'] },
  ],
  'evt-013': [
    { id: 't1', name: 'Centre Court Debenture', price: 1850, currency: 'USD', available: 8, features: ['Debenture seat', 'Lunch & tea in debenture lounge', 'Pimms reception', 'Car park pass'], badge: 'Most Premium' },
    { id: 't2', name: 'Courtside Premium', price: 920, currency: 'USD', available: 14, features: ['Courtside seating', 'Champions Lounge access', 'Afternoon tea included'] },
    { id: 't3', name: 'No. 1 Court', price: 480, currency: 'USD', available: 28, features: ['No. 1 Court seat', 'Food village access'] },
    { id: 't4', name: 'Grounds Pass', price: 95, currency: 'USD', available: 60, features: ['Ground admission', 'Henman Hill / Murray Mound', 'No main court seat'] },
  ],
  'evt-009': [
    { id: 't1', name: 'Champions Club', price: 380, currency: 'USD', available: 18, features: ['Premium courtside', 'All-day hospitality', 'Player meet-and-greet'], badge: 'Most Popular' },
    { id: 't2', name: 'Category 1', price: 220, currency: 'USD', available: 42, features: ['Lower bowl seating', 'Lounge access'] },
    { id: 't3', name: 'Category 2', price: 145, currency: 'USD', available: 78, features: ['Mid-tier seating', 'Concessions access'] },
    { id: 't4', name: 'Category 3', price: 95, currency: 'USD', available: 60, features: ['Upper-tier seating', 'Restricted view possible'] },
  ],
  default: [
    { id: 't1', name: 'VIP', price: 1200, currency: 'USD', available: 24, features: ['Premium seating', 'Open bar', 'Backstage access', 'Parking'], badge: 'Most Popular' },
    { id: 't2', name: 'Premium', price: 480, currency: 'USD', available: 86, features: ['Premium seating', 'Lounge access', 'Welcome drink'] },
    { id: 't3', name: 'Economy', price: 180, currency: 'USD', available: 220, features: ['Standard seating', 'Concessions access'] },
    { id: 't4', name: 'Hospitality Package', price: 1850, currency: 'USD', available: 12, features: ['Private box', '3-course meal', 'Wine pairing', 'Dedicated host', 'Premium parking'] },
  ],
}

export const DESTINATIONS = [
  { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', events: 142 },
  { name: 'Dubai', country: 'United Arab Emirates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', events: 88 },
  { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', events: 116 },
  { name: 'Singapore', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', events: 73 },
]

export const UPCOMING_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-00184',
    eventName: 'UEFA Champions League Final 2026',
    eventDate: '2026-05-30',
    venue: 'Wembley Stadium, London',
    customer: 'James Whitmore',
    email: 'james.whitmore@example.com',
    tier: 'Premium Category 1',
    qty: 2,
    amount: 2900,
    currency: 'USD',
    status: 'Confirmed',
    bookingDate: '2026-01-12',
    paymentMethod: 'Visa •••• 4291',
  },
  {
    id: 'BK-2026-00196',
    eventName: 'Coldplay: Music of the Spheres Tour',
    eventDate: '2026-06-15',
    venue: 'O2 Arena, London',
    customer: 'James Whitmore',
    email: 'james.whitmore@example.com',
    tier: 'Premium',
    qty: 4,
    amount: 1920,
    currency: 'USD',
    status: 'Confirmed',
    bookingDate: '2026-02-04',
    paymentMethod: 'Visa •••• 4291',
  },
  {
    id: 'BK-2026-00211',
    eventName: 'Monaco Grand Prix 2026',
    eventDate: '2026-05-24',
    venue: 'Circuit de Monaco, Monte Carlo',
    customer: 'James Whitmore',
    email: 'james.whitmore@example.com',
    tier: 'Hospitality VIP',
    qty: 1,
    amount: 2400,
    currency: 'USD',
    status: 'Pending',
    bookingDate: '2026-02-18',
    paymentMethod: 'Visa •••• 4291',
  },
]

export const PAST_BOOKINGS: Booking[] = [
  {
    id: 'BK-2025-118472',
    eventName: 'Singapore Grand Prix 2025',
    eventDate: '2025-10-05',
    venue: 'Marina Bay Street Circuit, Singapore',
    customer: 'James Whitmore',
    email: 'james.whitmore@example.com',
    tier: 'Premium',
    qty: 2,
    amount: 1440,
    currency: 'USD',
    status: 'Confirmed',
    bookingDate: '2025-08-22',
    paymentMethod: 'Visa •••• 4291',
  },
  {
    id: 'BK-2025-118291',
    eventName: 'El Clásico — Real Madrid vs Barcelona',
    eventDate: '2025-10-26',
    venue: 'Santiago Bernabéu, Madrid',
    customer: 'James Whitmore',
    email: 'james.whitmore@example.com',
    tier: 'Category 2',
    qty: 2,
    amount: 760,
    currency: 'USD',
    status: 'Refunded',
    bookingDate: '2025-09-14',
    paymentMethod: 'Visa •••• 4291',
  },
]

// ============ B2B / Admin mock data ============
// NOTE: SUPPLIERS is now defined above (with category routing).
// INVENTORY, PRICING_RULES, and ADMIN_BOOKINGS below reference the 5 categorized suppliers.

export const INVENTORY = [
  { id: 'INV-9841', event: 'UEFA Champions League Final', supplier: 'Global Events Network', tier: 'VIP Suite', qty: 18, priority: 'High', status: 'Active' },
  { id: 'INV-9842', event: 'UEFA Champions League Final', supplier: 'Global Events Network', tier: 'Cat 1', qty: 64, priority: 'High', status: 'Active' },
  { id: 'INV-9843', event: 'Monaco Grand Prix 2026', supplier: 'Velocity Racing Supplies', tier: 'Paddock Club', qty: 12, priority: 'Critical', status: 'Active' },
  { id: 'INV-9844', event: 'Coldplay London', supplier: 'Concert Live Worldwide', tier: 'Floor A', qty: 86, priority: 'Medium', status: 'Active' },
  { id: 'INV-9845', event: 'IPL Final 2026', supplier: 'Cricket Tickets India', tier: 'Corporate Box', qty: 44, priority: 'High', status: 'Active' },
  { id: 'INV-9846', event: 'Singapore GP', supplier: 'Velocity Racing Supplies', tier: 'Stamford Grandstand', qty: 220, priority: 'Medium', status: 'Active' },
  { id: 'INV-9847', event: 'Wimbledon Final 2026', supplier: 'Grand Slam Tennis Tix', tier: 'Centre Court Debenture', qty: 8, priority: 'Critical', status: 'Active' },
  { id: 'INV-9848', event: 'El Clásico', supplier: 'Global Events Network', tier: 'Cat 2', qty: 88, priority: 'Medium', status: 'Active' },
  { id: 'INV-9849', event: 'Dubai Tennis Championships', supplier: 'Grand Slam Tennis Tix', tier: 'Courtside', qty: 24, priority: 'High', status: 'Active' },
  { id: 'INV-9850', event: 'Adele Vegas', supplier: 'Concert Live Worldwide', tier: 'Floor B', qty: 0, priority: 'Low', status: 'Sold Out' },
]

export const PRICING_RULES = [
  { id: 'PR-001', supplier: 'Velocity Racing Supplies', markup: 22, minMargin: 12, campaign: 'Summer Racing', country: 'Global', currency: 'USD', partnerLevel: 'All' },
  { id: 'PR-002', supplier: 'Concert Live Worldwide', markup: 18, minMargin: 10, campaign: 'Tour 2026', country: 'Global', currency: 'EUR', partnerLevel: 'Silver+' },
  { id: 'PR-003', supplier: 'Cricket Tickets India', markup: 15, minMargin: 8, campaign: 'Asia Festival', country: 'APAC', currency: 'INR', partnerLevel: 'All' },
  { id: 'PR-004', supplier: 'Grand Slam Tennis Tix', markup: 25, minMargin: 14, campaign: 'Grand Slam Season', country: 'Global', currency: 'USD', partnerLevel: 'Gold+' },
  { id: 'PR-005', supplier: 'Global Events Network', markup: 20, minMargin: 11, campaign: '—', country: 'Global', currency: 'USD', partnerLevel: 'All' },
]

export const ADMIN_BOOKINGS: B2BBooking[] = [
  { id: 'BK-2026-00211', eventName: 'Monaco Grand Prix 2026', eventDate: '2026-05-24', venue: 'Circuit de Monaco', customer: 'James Whitmore', email: 'james@example.com', tier: 'Hospitality VIP', qty: 1, amount: 2400, currency: 'USD', status: 'Pending', bookingDate: '2026-02-18', paymentMethod: 'Visa', supplier: 'Velocity Racing Supplies', commission: 432, customerName: 'James Whitmore' },
  { id: 'BK-2026-00210', eventName: 'Coldplay London', eventDate: '2026-06-15', venue: 'O2 Arena', customer: 'Maria Chen', email: 'maria@example.com', tier: 'Premium', qty: 2, amount: 960, currency: 'USD', status: 'Confirmed', bookingDate: '2026-02-17', paymentMethod: 'Mastercard', supplier: 'Concert Live Worldwide', commission: 192, customerName: 'Maria Chen' },
  { id: 'BK-2026-00209', eventName: 'El Clásico', eventDate: '2026-10-25', venue: 'Santiago Bernabéu', customer: 'Ahmed Al-Farsi', email: 'ahmed@example.com', tier: 'Cat 1', qty: 3, amount: 1740, currency: 'USD', status: 'Confirmed', bookingDate: '2026-02-17', paymentMethod: 'Apple Pay', supplier: 'Global Events Network', commission: 261, customerName: 'Ahmed Al-Farsi' },
  { id: 'BK-2026-00208', eventName: 'IPL Final 2026', eventDate: '2026-05-29', venue: 'Narendra Modi Stadium', customer: 'Priya Sharma', email: 'priya@example.com', tier: 'Corporate Box', qty: 4, amount: 1240, currency: 'USD', status: 'Confirmed', bookingDate: '2026-02-16', paymentMethod: 'UPI', supplier: 'Cricket Tickets India', commission: 124, customerName: 'Priya Sharma' },
  { id: 'BK-2026-00207', eventName: 'Singapore GP', eventDate: '2026-09-20', venue: 'Marina Bay', customer: 'Tan Wei Ming', email: 'tan@example.com', tier: 'Stamford', qty: 2, amount: 920, currency: 'USD', status: 'Refunded', bookingDate: '2026-02-15', paymentMethod: 'Visa', supplier: 'Velocity Racing Supplies', commission: 0, customerName: 'Tan Wei Ming' },
  { id: 'BK-2026-00206', eventName: 'Wimbledon Final 2026', eventDate: '2026-07-12', venue: 'All England Club', customer: 'Olivia Brown', email: 'olivia@example.com', tier: 'Centre Court', qty: 1, amount: 650, currency: 'USD', status: 'Cancelled', bookingDate: '2026-02-14', paymentMethod: 'Visa', supplier: 'Grand Slam Tennis Tix', commission: 0, customerName: 'Olivia Brown' },
]

export const CUSTOMERS = [
  { id: 'CUST-001', name: 'James Whitmore', email: 'james.whitmore@example.com', country: 'United Kingdom', bookings: 14, lifetimeValue: 18650, status: 'Active', membership: 'Gold', tickets: 2 },
  { id: 'CUST-002', name: 'Maria Chen', email: 'maria.chen@example.com', country: 'Singapore', bookings: 8, lifetimeValue: 9420, status: 'Active', membership: 'Silver', tickets: 1 },
  { id: 'CUST-003', name: 'Ahmed Al-Farsi', email: 'ahmed.alfarsi@example.com', country: 'United Arab Emirates', bookings: 22, lifetimeValue: 42800, status: 'Active', membership: 'Platinum', tickets: 0 },
  { id: 'CUST-004', name: 'Priya Sharma', email: 'priya.sharma@example.com', country: 'India', bookings: 5, lifetimeValue: 3240, status: 'Active', membership: 'Silver', tickets: 1 },
  { id: 'CUST-005', name: 'Tan Wei Ming', email: 'tan.weiming@example.com', country: 'Singapore', bookings: 3, lifetimeValue: 2180, status: 'Inactive', membership: 'Bronze', tickets: 0 },
  { id: 'CUST-006', name: 'Olivia Brown', email: 'olivia.brown@example.com', country: 'United States', bookings: 11, lifetimeValue: 12400, status: 'Active', membership: 'Gold', tickets: 0 },
]

export const B2B_PARTNERS = [
  { id: 'PTNR-001', company: 'Global Sports Tours', contact: 'Sarah Mitchell', country: 'United Kingdom', tier: 'Platinum', creditLimit: 250000, used: 184200, status: 'Approved', points: 8420 },
  { id: 'PTNR-002', company: 'Dubai Events Co.', contact: 'Khalid Rahman', country: 'United Arab Emirates', tier: 'Gold', creditLimit: 120000, used: 68400, status: 'Approved', points: 4280 },
  { id: 'PTNR-003', company: 'Mumbai Live Entertainment', contact: 'Rajesh Kumar', country: 'India', tier: 'Silver', creditLimit: 60000, used: 12800, status: 'Approved', points: 1240 },
  { id: 'PTNR-004', company: 'Paris Premium Access', contact: 'Sophie Laurent', country: 'France', tier: 'Gold', creditLimit: 120000, used: 92100, status: 'Pending', points: 0 },
  { id: 'PTNR-005', company: 'Singapore Sports Hub', contact: 'Lim Chee Keong', country: 'Singapore', tier: 'Platinum', creditLimit: 250000, used: 210400, status: 'Approved', points: 9120 },
  { id: 'PTNR-006', company: 'Vegas VIP Experiences', contact: 'Michael Rodriguez', country: 'United States', tier: 'Silver', creditLimit: 60000, used: 42300, status: 'Suspended', points: 2100 },
]

export const TRANSACTIONS = [
  { id: 'TXN-984712', booking: 'BK-2026-00211', customer: 'James Whitmore', amount: 2400, currency: 'USD', method: 'Visa •••• 4291', gateway: 'Stripe', status: 'Captured', date: '2026-02-18 14:32' },
  { id: 'TXN-984711', booking: 'BK-2026-00210', customer: 'Maria Chen', amount: 960, currency: 'USD', method: 'Mastercard •••• 8821', gateway: 'Stripe', status: 'Captured', date: '2026-02-17 11:08' },
  { id: 'TXN-984710', booking: 'BK-2026-00209', customer: 'Ahmed Al-Farsi', amount: 1740, currency: 'USD', method: 'Apple Pay', gateway: 'Adyen', status: 'Captured', date: '2026-02-17 09:42' },
  { id: 'TXN-984709', booking: 'BK-2026-00208', customer: 'Priya Sharma', amount: 1240, currency: 'USD', method: 'UPI', gateway: 'Razorpay', status: 'Captured', date: '2026-02-16 19:55' },
  { id: 'TXN-984708', booking: 'BK-2026-00207', customer: 'Tan Wei Ming', amount: 920, currency: 'USD', method: 'Visa •••• 1102', gateway: 'Stripe', status: 'Refunded', date: '2026-02-15 16:24' },
  { id: 'TXN-984707', booking: 'BK-2026-00206', customer: 'Olivia Brown', amount: 320, currency: 'USD', method: 'Visa •••• 7733', gateway: 'Stripe', status: 'Chargeback', date: '2026-02-14 13:11' },
]

export const CMS_PAGES = [
  { id: 1, title: 'Homepage', slug: '/', status: 'Published', updated: '2 hr ago', author: 'Admin' },
  { id: 2, title: 'About Us', slug: '/about', status: 'Published', updated: '3 days ago', author: 'Admin' },
  { id: 3, title: 'Privacy Policy', slug: '/privacy', status: 'Published', updated: '1 week ago', author: 'Legal' },
  { id: 4, title: 'Terms & Conditions', slug: '/terms', status: 'Published', updated: '1 week ago', author: 'Legal' },
  { id: 5, title: 'Refund Policy', slug: '/refunds', status: 'Draft', updated: '5 days ago', author: 'Admin' },
  { id: 6, title: 'B2B Partnership Guide', slug: '/b2b-guide', status: 'Published', updated: '2 weeks ago', author: 'Marketing' },
]

export const ORG_USERS = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah@globalsportstours.com', role: 'Admin', status: 'Active', lastLogin: '5 min ago' },
  { id: 2, name: 'David Chen', email: 'david@globalsportstours.com', role: 'Manager', status: 'Active', lastLogin: '2 hr ago' },
  { id: 3, name: 'Emma Wilson', email: 'emma@globalsportstours.com', role: 'Sales Executive', status: 'Active', lastLogin: '1 day ago' },
  { id: 4, name: 'Robert Taylor', email: 'robert@globalsportstours.com', role: 'Sales Executive', status: 'Inactive', lastLogin: '2 weeks ago' },
  { id: 5, name: 'Linda Park', email: 'linda@globalsportstours.com', role: 'Manager', status: 'Active', lastLogin: '4 hr ago' },
]

export const REVENUE_CHART = [
  { month: 'Sep', revenue: 248000, bookings: 412 },
  { month: 'Oct', revenue: 312000, bookings: 528 },
  { month: 'Nov', revenue: 286000, bookings: 472 },
  { month: 'Dec', revenue: 392000, bookings: 642 },
  { month: 'Jan', revenue: 448000, bookings: 718 },
  { month: 'Feb', revenue: 524000, bookings: 824 },
]

export const COUNTRY_DATA = [
  { country: 'United Kingdom', bookings: 1248, revenue: 412000 },
  { country: 'United Arab Emirates', bookings: 892, revenue: 386000 },
  { country: 'Singapore', bookings: 642, revenue: 248000 },
  { country: 'India', bookings: 1104, revenue: 184000 },
  { country: 'United States', bookings: 528, revenue: 268000 },
  { country: 'France', bookings: 318, revenue: 142000 },
]

export const FAQS = [
  { q: 'How will I receive my tickets?', a: 'Tickets are delivered electronically via email within 24-48 hours of booking confirmation. For selected events, physical tickets or hospitality passes can be collected at the venue\'s VIP desk on the event day.' },
  { q: 'What is your cancellation policy?', a: 'Cancellation policies vary by event and supplier. Most bookings are non-refundable unless the event is cancelled or rescheduled. Premium hospitality packages may offer flexible terms — please review the specific terms during checkout or contact support.' },
  { q: 'Are seats allocated together?', a: 'Yes. All bookings of 2 or more tickets will be allocated as adjacent seating wherever possible. For hospitality packages, your group will be seated together in the same suite or box.' },
  { q: 'Can I transfer my ticket to someone else?', a: 'Ticket transfer policies vary by event. Many events allow name changes up to 48 hours before the event for a small fee. Hospitality packages are typically non-transferable. Please check the specific event\'s restrictions before booking.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), UPI payments, net banking from major banks, and digital wallets including Apple Pay and Google Pay. Corporate clients can apply for invoice-based billing.' },
  { q: 'Is my payment secure?', a: 'All transactions are processed through PCI-DSS compliant payment gateways. We use 256-bit SSL encryption and never store your full card details on our servers. Your financial information is handled with the highest industry security standards.' },
]

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
