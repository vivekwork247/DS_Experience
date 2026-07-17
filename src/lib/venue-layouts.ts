// Venue-specific seating layouts for DS Experiences
// Each event category maps to a dedicated venue layout (football stadium,
// cricket ground, F1 circuit, tennis arena, concert venue). Every layout
// ships with named ticket blocks/stands, descriptions, inclusions, pricing,
// availability, on-canvas geometry, and a per-block seat grid definition.

import { EventCategory } from './mock-data'

export type VenueType = 'football' | 'cricket' | 'f1' | 'tennis' | 'concert'

export type ViewQuality = 'Premium' | 'Excellent' | 'Good' | 'Restricted'

export interface VenueBlock {
  id: string
  /** Display code shown on the map, e.g. "5", "11", "139", "N1" */
  code: string
  /** Full name of the block/stand, e.g. "Silver 5 — 3-Day", "Club 67 Lounge" */
  name: string
  /** Tier label used for colour coding + filtering */
  tier: 'VIP' | 'Hospitality' | 'Premium' | 'Gold' | 'Silver' | 'Bronze'
  /** Price per seat in USD (converted at display time) */
  price: number
  currency: string
  /** Short description of the view / location, e.g. "Views of Double Gauche exit and Fagnes" */
  description: string
  /** Bulleted inclusions shown with checkmarks */
  inclusions: string[]
  available: number
  total: number
  /** On-canvas geometry (percentages 0..100 of the venue canvas) */
  x: number
  y: number
  w: number
  h: number
  /** Tailwind-friendly hex colour for the block fill */
  color: string
  rows: number
  seatsPerRow: number
  viewQuality: ViewQuality
}

export interface VenueLayout {
  type: VenueType
  /** Display name of the venue template, e.g. "Football Stadium" */
  name: string
  /** Short helper shown under the layout selector */
  subtitle: string
  blocks: VenueBlock[]
}

const COMMON_INCLUSIONS = [
  'Official E-tickets',
  'Seats together',
  'Instant confirmation',
  '100% guaranteed entry',
]

// ============================================================
// FOOTBALL — rectangular pitch, stands on all four sides
// ============================================================
const FOOTBALL_LAYOUT: VenueLayout = {
  type: 'football',
  name: 'Football Stadium',
  subtitle: 'Panoramic stands surrounding the pitch — choose your end first.',
  blocks: [
    {
      id: 'fb-vip', code: 'V1', name: 'VIP Suite — North Stand', tier: 'VIP',
      price: 2400, currency: 'USD',
      description: 'Private hospitality suite on the halfway line with padded seats, gourmet dining and an open bar.',
      inclusions: ['Private suite', '4-course gourmet meal', 'Open bar', 'Legends meet & greet', 'VIP parking', ...COMMON_INCLUSIONS],
      available: 18, total: 30, x: 36, y: 5, w: 28, h: 20, color: '#a855f7',
      rows: 3, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'fb-hosp', code: 'H1', name: 'Hospitality Box — West Stand', tier: 'Hospitality',
      price: 1450, currency: 'USD',
      description: 'West stand hospitality box with padded seats, lounge access and pre-match fine dining.',
      inclusions: ['Padded seats', 'Lounge access', 'Pre-match dining', 'Complimentary drinks', ...COMMON_INCLUSIONS],
      available: 24, total: 60, x: 5, y: 33, w: 18, h: 34, color: '#f59e0b',
      rows: 6, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'fb-prem', code: '101', name: 'Premium Cat 1 — West Lower', tier: 'Premium',
      price: 980, currency: 'USD',
      description: 'Best lower-tier views close to the pitch near the halfway line. Electric atmosphere.',
      inclusions: ['Lower-tier seats', 'Close to pitch', 'Lounge access', ...COMMON_INCLUSIONS],
      available: 42, total: 120, x: 26, y: 38, w: 9, h: 24, color: '#ef4444',
      rows: 12, seatsPerRow: 10, viewQuality: 'Excellent',
    },
    {
      id: 'fb-cat2-w', code: '201', name: 'Cat 2 — West Mid', tier: 'Gold',
      price: 620, currency: 'USD',
      description: 'Mid-tier seating on the west stand with great sightlines and concessions nearby.',
      inclusions: ['Mid-tier seats', 'Concessions access', ...COMMON_INCLUSIONS],
      available: 56, total: 140, x: 37, y: 64, w: 12, h: 18, color: '#3b82f6',
      rows: 14, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'fb-cat2-e', code: '202', name: 'Cat 2 — East Mid', tier: 'Gold',
      price: 620, currency: 'USD',
      description: 'Mid-tier seating on the east stand — ideal for away supporters and neutral views.',
      inclusions: ['Mid-tier seats', 'Concessions access', ...COMMON_INCLUSIONS],
      available: 48, total: 140, x: 51, y: 64, w: 12, h: 18, color: '#3b82f6',
      rows: 14, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'fb-cat3-n', code: '401', name: 'Cat 3 — North Upper', tier: 'Silver',
      price: 380, currency: 'USD',
      description: 'Upper-tier panoramic views of the entire stadium. Lively atmosphere stand.',
      inclusions: ['Upper-tier seats', 'Panoramic view', ...COMMON_INCLUSIONS],
      available: 72, total: 200, x: 8, y: 6, w: 24, h: 20, color: '#10b981',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'fb-cat3-s', code: '402', name: 'Cat 3 — South Upper', tier: 'Silver',
      price: 380, currency: 'USD',
      description: 'South stand upper tier behind the goal — home end atmosphere at its loudest.',
      inclusions: ['Upper-tier seats', 'Behind the goal', ...COMMON_INCLUSIONS],
      available: 64, total: 200, x: 68, y: 6, w: 24, h: 20, color: '#10b981',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'fb-east', code: '102', name: 'Cat 1 — East Lower', tier: 'Premium',
      price: 980, currency: 'USD',
      description: 'Lower-tier east stand seats close to the action with premium lounge access.',
      inclusions: ['Lower-tier seats', 'Close to pitch', 'Lounge access', ...COMMON_INCLUSIONS],
      available: 38, total: 120, x: 65, y: 38, w: 9, h: 24, color: '#ef4444',
      rows: 12, seatsPerRow: 10, viewQuality: 'Excellent',
    },
  ],
}

// ============================================================
// CRICKET — oval field, circular ring of stands
// ============================================================
const CRICKET_LAYOUT: VenueLayout = {
  type: 'cricket',
  name: 'Cricket Ground',
  subtitle: 'Oval field surrounded by a ring of stands — pick your pavilion.',
  blocks: [
    {
      id: 'cr-pav', code: 'P1', name: 'Pavilion Stand — Members', tier: 'VIP',
      price: 1850, currency: 'USD',
      description: 'Historic members\' pavilion with the best sightlines behind the bowler\'s arm.',
      inclusions: ['Members\' enclosure', 'Tea & lunch included', 'Bar access', 'Padded seats', ...COMMON_INCLUSIONS],
      available: 22, total: 50, x: 37, y: 4, w: 26, h: 18, color: '#a855f7',
      rows: 5, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'cr-corp', code: 'C1', name: 'Corporate Suite — East', tier: 'Hospitality',
      price: 1200, currency: 'USD',
      description: 'Private corporate box on the east stand with catering and dedicated host.',
      inclusions: ['Private box', 'Catered buffet', 'Open bar', 'AC lounge', ...COMMON_INCLUSIONS],
      available: 30, total: 60, x: 74, y: 30, w: 20, h: 30, color: '#f59e0b',
      rows: 6, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'cr-prem', code: '201', name: 'Premium — North Stand', tier: 'Premium',
      price: 420, currency: 'USD',
      description: 'Lower-tier north stand seats offering straight-on views of the pitch.',
      inclusions: ['Lower-tier seats', 'Straight-on view', ...COMMON_INCLUSIONS],
      available: 84, total: 200, x: 8, y: 4, w: 26, h: 18, color: '#ef4444',
      rows: 20, seatsPerRow: 10, viewQuality: 'Excellent',
    },
    {
      id: 'cr-gold-w', code: '301', name: 'Gold — West Stand', tier: 'Gold',
      price: 260, currency: 'USD',
      description: 'Mid-tier west stand — great view of the square and close to refreshments.',
      inclusions: ['Mid-tier seats', 'Concessions nearby', ...COMMON_INCLUSIONS],
      available: 120, total: 240, x: 4, y: 30, w: 18, h: 30, color: '#3b82f6',
      rows: 24, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'cr-gold-s', code: '302', name: 'Gold — South Stand', tier: 'Gold',
      price: 240, currency: 'USD',
      description: 'Family-friendly south stand with shaded seating in the evening.',
      inclusions: ['Mid-tier seats', 'Family section', ...COMMON_INCLUSIONS],
      available: 110, total: 240, x: 37, y: 78, w: 26, h: 16, color: '#3b82f6',
      rows: 24, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'cr-bron', code: '401', name: 'Bronze — East Upper', tier: 'Bronze',
      price: 110, currency: 'USD',
      description: 'Affordable upper-tier seating with a full panoramic view of the ground.',
      inclusions: ['Upper-tier seats', 'Panoramic view', ...COMMON_INCLUSIONS],
      available: 180, total: 300, x: 74, y: 4, w: 20, h: 22, color: '#10b981',
      rows: 30, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'cr-bron2', code: '402', name: 'Bronze — West Upper', tier: 'Bronze',
      price: 110, currency: 'USD',
      description: 'Upper-tier west stand — budget-friendly entry to the match.',
      inclusions: ['Upper-tier seats', 'Panoramic view', ...COMMON_INCLUSIONS],
      available: 160, total: 300, x: 4, y: 62, w: 18, h: 22, color: '#10b981',
      rows: 30, seatsPerRow: 10, viewQuality: 'Restricted',
    },
  ],
}

// ============================================================
// FORMULA 1 — race circuit with grandstands around the track
// ============================================================
const F1_LAYOUT: VenueLayout = {
  type: 'f1',
  name: 'Race Circuit',
  subtitle: 'Grandstands placed around the circuit — select your vantage point.',
  blocks: [
    {
      id: 'f1-paddock', code: 'P1', name: 'Paddock Club — Above Pit Lane', tier: 'VIP',
      price: 5200, currency: 'USD',
      description: 'Rooftop hospitality suite directly above the pit lane with trackside balcony and paddock access.',
      inclusions: ['Paddock access', 'Grid walk', 'Gourmet catering', 'Open bar', 'Driver meet & greet', ...COMMON_INCLUSIONS],
      available: 12, total: 30, x: 41, y: 6, w: 18, h: 16, color: '#a855f7',
      rows: 3, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'f1-champ', code: 'C1', name: 'Champions Club — Main Straight', tier: 'Hospitality',
      price: 3100, currency: 'USD',
      description: 'Climate-controlled lounge overlooking the main straight and start/finish line.',
      inclusions: ['Lounge seating', 'All-day dining', 'Open bar', 'Pit-lane walk', ...COMMON_INCLUSIONS],
      available: 24, total: 60, x: 62, y: 8, w: 18, h: 18, color: '#f59e0b',
      rows: 6, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'f1-gold-1', code: '11', name: 'Gold 11 — 3-Day', tier: 'Gold',
      price: 500, currency: 'USD',
      description: 'Elevated grandstand at the apex of Turn 1 — the best overtaking spot on the circuit.',
      inclusions: ['Reserved grandstand seat', 'Big-screen view', '3-day access', ...COMMON_INCLUSIONS],
      available: 48, total: 120, x: 8, y: 12, w: 16, h: 20, color: '#3b82f6',
      rows: 12, seatsPerRow: 10, viewQuality: 'Excellent',
    },
    {
      id: 'f1-gold-2', code: '12', name: 'Gold 12 — 3-Day', tier: 'Gold',
      price: 520, currency: 'USD',
      description: 'Grandstand overlooking the chicane — witness heavy braking and late moves.',
      inclusions: ['Reserved grandstand seat', 'Big-screen view', '3-day access', ...COMMON_INCLUSIONS],
      available: 52, total: 120, x: 76, y: 36, w: 16, h: 20, color: '#3b82f6',
      rows: 12, seatsPerRow: 10, viewQuality: 'Excellent',
    },
    {
      id: 'f1-silver-1', code: '5', name: 'Silver 5 — 3-Day', tier: 'Silver',
      price: 275, currency: 'USD',
      description: 'Covered grandstand with views of the Double Gauche exit and Fagnes section.',
      inclusions: ['Covered grandstand seat', 'Big-screen view', '3-day access', ...COMMON_INCLUSIONS],
      available: 96, total: 200, x: 8, y: 50, w: 18, h: 22, color: '#10b981',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'f1-silver-2', code: '7', name: 'Silver 7 — 3-Day', tier: 'Silver',
      price: 295, currency: 'USD',
      description: 'Grandstand at the exit of the fast sweepers — see cars at full speed.',
      inclusions: ['Covered grandstand seat', 'Big-screen view', '3-day access', ...COMMON_INCLUSIONS],
      available: 88, total: 200, x: 70, y: 64, w: 18, h: 22, color: '#10b981',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'f1-ga', code: 'GA', name: 'General Admission — 3-Day', tier: 'Bronze',
      price: 180, currency: 'USD',
      description: 'Roaming access to natural banking and viewing mounds around the circuit.',
      inclusions: ['Unreserved standing', 'All zones access', '3-day access', ...COMMON_INCLUSIONS],
      available: 240, total: 500, x: 38, y: 78, w: 24, h: 14, color: '#94a3b8',
      rows: 20, seatsPerRow: 10, viewQuality: 'Restricted',
    },
  ],
}

// ============================================================
// TENNIS — rectangular court, intimate stands on all sides
// ============================================================
const TENNIS_LAYOUT: VenueLayout = {
  type: 'tennis',
  name: 'Tennis Arena',
  subtitle: 'Intimate bowl around Centre Court — choose your side.',
  blocks: [
    {
      id: 'tn-deb', code: 'D1', name: 'Centre Court Debenture', tier: 'VIP',
      price: 1850, currency: 'USD',
      description: 'Debenture holders\' seats on the royal side with lounge access and traditional afternoon tea.',
      inclusions: ['Debenture seat', 'Lunch & tea in lounge', 'Pimms reception', 'Car park pass', ...COMMON_INCLUSIONS],
      available: 8, total: 20, x: 36, y: 5, w: 28, h: 18, color: '#a855f7',
      rows: 2, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'tn-court', code: 'C1', name: 'Courtside Premium', tier: 'Hospitality',
      price: 920, currency: 'USD',
      description: 'Front-row courtside seating with Champions Club access and complimentary dining.',
      inclusions: ['Courtside seat', 'Champions Club access', 'Afternoon tea', ...COMMON_INCLUSIONS],
      available: 14, total: 40, x: 5, y: 32, w: 16, h: 28, color: '#f59e0b',
      rows: 4, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'tn-prem-n', code: '201', name: 'Premium — North Baseline', tier: 'Premium',
      price: 480, currency: 'USD',
      description: 'Lower-bowl seats directly behind the baseline — coach\'s-eye view of every point.',
      inclusions: ['Lower-bowl seats', 'Behind baseline', ...COMMON_INCLUSIONS],
      available: 36, total: 100, x: 79, y: 32, w: 16, h: 28, color: '#ef4444',
      rows: 10, seatsPerRow: 10, viewQuality: 'Excellent',
    },
    {
      id: 'tn-gold-w', code: '301', name: 'Gold — West Side', tier: 'Gold',
      price: 320, currency: 'USD',
      description: 'Mid-tier west side seating with a side-on view of the court and umpire.',
      inclusions: ['Mid-tier seats', 'Side-on view', ...COMMON_INCLUSIONS],
      available: 64, total: 140, x: 30, y: 68, w: 18, h: 22, color: '#3b82f6',
      rows: 14, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'tn-gold-e', code: '302', name: 'Gold — East Side', tier: 'Gold',
      price: 320, currency: 'USD',
      description: 'Mid-tier east side seating — shaded in the afternoon sessions.',
      inclusions: ['Mid-tier seats', 'Shaded seating', ...COMMON_INCLUSIONS],
      available: 58, total: 140, x: 52, y: 68, w: 18, h: 22, color: '#3b82f6',
      rows: 14, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'tn-bron', code: '401', name: 'Upper Bowl — South', tier: 'Bronze',
      price: 145, currency: 'USD',
      description: 'Upper-bowl seating with a full panoramic view of Centre Court.',
      inclusions: ['Upper-bowl seats', 'Panoramic view', ...COMMON_INCLUSIONS],
      available: 110, total: 200, x: 8, y: 6, w: 24, h: 18, color: '#10b981',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
  ],
}

// ============================================================
// CONCERT — stage at one end, fan-shaped sections facing it
// ============================================================
const CONCERT_LAYOUT: VenueLayout = {
  type: 'concert',
  name: 'Concert Venue',
  subtitle: 'Stage-front layout — pick your view of the show.',
  blocks: [
    {
      id: 'co-vip', code: 'V1', name: 'VIP Stage-Front Pit', tier: 'VIP',
      price: 1200, currency: 'USD',
      description: 'Standing pit directly in front of the stage — closest you can get to the artist.',
      inclusions: ['Front-pit access', 'Early entry', 'Exclusive merch', 'Open bar', ...COMMON_INCLUSIONS],
      available: 16, total: 40, x: 38, y: 8, w: 24, h: 14, color: '#a855f7',
      rows: 4, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'co-suit', code: 'S1', name: 'Hospitality Suite', tier: 'Hospitality',
      price: 850, currency: 'USD',
      description: 'Private suite with catering, balcony seating and a dedicated host.',
      inclusions: ['Private suite', 'Catered dining', 'Balcony view', 'Dedicated host', ...COMMON_INCLUSIONS],
      available: 20, total: 50, x: 6, y: 8, w: 18, h: 18, color: '#f59e0b',
      rows: 5, seatsPerRow: 10, viewQuality: 'Premium',
    },
    {
      id: 'co-floor', code: 'F1', name: 'Floor — Reserved Seated', tier: 'Premium',
      price: 480, currency: 'USD',
      description: 'Reserved floor seats on the flat — level with the stage, great sightlines.',
      inclusions: ['Reserved floor seat', 'Close to stage', ...COMMON_INCLUSIONS],
      available: 80, total: 180, x: 30, y: 26, w: 40, h: 22, color: '#ef4444',
      rows: 18, seatsPerRow: 10, viewQuality: 'Excellent',
    },
    {
      id: 'co-lower-w', code: '201', name: 'Lower Tier — West', tier: 'Gold',
      price: 280, currency: 'USD',
      description: 'Lower-tier seated section on the west side with raked views of the stage.',
      inclusions: ['Reserved tier seat', 'Raked view', ...COMMON_INCLUSIONS],
      available: 96, total: 200, x: 4, y: 32, w: 20, h: 30, color: '#3b82f6',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'co-lower-e', code: '202', name: 'Lower Tier — East', tier: 'Gold',
      price: 280, currency: 'USD',
      description: 'Lower-tier seated section on the east side — mirrored view of the west stand.',
      inclusions: ['Reserved tier seat', 'Raked view', ...COMMON_INCLUSIONS],
      available: 88, total: 200, x: 76, y: 32, w: 20, h: 30, color: '#3b82f6',
      rows: 20, seatsPerRow: 10, viewQuality: 'Good',
    },
    {
      id: 'co-upper', code: '401', name: 'Upper Tier — Back Bowl', tier: 'Bronze',
      price: 145, currency: 'USD',
      description: 'Affordable upper-tier seats at the back of the bowl with full-stage panorama.',
      inclusions: ['Upper-tier seat', 'Panoramic view', ...COMMON_INCLUSIONS],
      available: 160, total: 300, x: 30, y: 66, w: 40, h: 22, color: '#10b981',
      rows: 30, seatsPerRow: 10, viewQuality: 'Good',
    },
  ],
}

// ============================================================
// Category → Venue type mapping
// ============================================================
const CATEGORY_VENUE: Record<EventCategory, VenueType> = {
  Sports: 'football',
  Cricket: 'cricket',
  'Formula 1': 'f1',
  Tennis: 'tennis',
  Concerts: 'concert',
  Hospitality: 'football',
}

const VENUE_BY_TYPE: Record<VenueType, VenueLayout> = {
  football: FOOTBALL_LAYOUT,
  cricket: CRICKET_LAYOUT,
  f1: F1_LAYOUT,
  tennis: TENNIS_LAYOUT,
  concert: CONCERT_LAYOUT,
}

/**
 * Returns the venue layout for a given event. Falls back to the
 * category-level template so every event has a dedicated, venue-specific
 * seating plan rather than a generic placeholder.
 */
export function getVenueLayout(category: EventCategory, venueName?: string): VenueLayout {
  const type = CATEGORY_VENUE[category] ?? 'football'
  const layout = VENUE_BY_TYPE[type]
  // If a venue name is supplied, surface it in the layout subtitle for context
  if (venueName) {
    return { ...layout, name: venueName }
  }
  return layout
}

export const TIER_COLORS: Record<VenueBlock['tier'], string> = {
  VIP: '#a855f7',
  Hospitality: '#f59e0b',
  Premium: '#ef4444',
  Gold: '#3b82f6',
  Silver: '#10b981',
  Bronze: '#94a3b8',
}

export const VIEW_QUALITY_BADGE: Record<ViewQuality, string> = {
  Premium: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  Excellent: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  Good: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  Restricted: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
}
