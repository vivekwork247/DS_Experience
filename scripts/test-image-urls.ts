// Test all gallery + event image URLs and report which ones fail to load.
// Run with: npx tsx scripts/test-image-urls.ts
import https from 'https'

// Inline the gallery URLs to avoid TS path resolution issues with the mock-data module.
const GALLERY: Record<string, string[]> = {
  Sports: [
    'https://images.unsplash.com/photo-1570626827445-bd6f4f9b7f3e?w=1200&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80',
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80',
  ],
  Concerts: [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80',
  ],
  'Formula 1': [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69887?w=1200&q=80',
    'https://images.unsplash.com/photo-1540717945008-8c0e3e84b7b6?w=1200&q=80',
    'https://images.unsplash.com/photo-1505158498152-b3ad7c23f140?w=1200&q=80',
  ],
  Cricket: [
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
    'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&q=80',
    'https://images.unsplash.com/photo-1593766787879-91a82c0c0a92?w=1200&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
  ],
  Hospitality: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80',
  ],
  Tennis: [
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=80',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    'https://images.unsplash.com/photo-1593766787879-91a82c0c0a92?w=1200&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
  ],
}

// Per-event main image URLs (from EVENTS array in mock-data.ts)
const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1522778119026-d6a21f3e37d9?w=1200&q=80',  // UEFA
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80',  // Monaco GP
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',  // Coldplay
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',  // Ind v Aus
  'https://images.unsplash.com/photo-1583121274602-3e2820c69887?w=1200&q=80',  // Singapore GP
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80',  // Adele
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80',      // El Clasico
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80',  // Dubai Jazz
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=80',  // Dubai Tennis
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80',  // PSG v Marseille
  'https://images.unsplash.com/photo-1501281668745-f7f57925c855?w=1200&q=80',  // Ed Sheeran
  'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=1200&q=80',  // IPL Final
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',    // Wimbledon
]

const allUrls = new Set<string>([
  ...EVENT_IMAGES,
  ...Object.values(GALLERY).flat(),
])

function check(url: string): Promise<{ url: string; status: number | string; ok: boolean }> {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      resolve({ url, status: res.statusCode ?? 'no-status', ok: res.statusCode === 200 })
    })
    req.on('error', (err) => resolve({ url, status: `ERR: ${err.message}`, ok: false }))
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }) })
  })
}

async function main() {
  const urls = Array.from(allUrls)
  console.log(`Testing ${urls.length} unique image URLs...\n`)
  const results: { url: string; status: number | string; ok: boolean }[] = []
  for (const u of urls) {
    const r = await check(u)
    results.push(r)
    const tag = r.ok ? 'OK   ' : 'FAIL '
    const short = u.replace('https://images.unsplash.com/', '').replace('?w=1200&q=80', '')
    console.log(`${tag} ${String(r.status).padEnd(5)} ${short}`)
  }
  const okCount = results.filter(r => r.ok).length
  console.log(`\nSummary: ${okCount}/${results.length} OK`)
  const failed = results.filter(r => !r.ok)
  if (failed.length > 0) {
    console.log('\nFailed URLs:')
    for (const f of failed) console.log(`  - ${f.url}  (${f.status})`)
  }
}

main().catch(console.error)
