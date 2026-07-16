// Verify all current gallery + event image URLs in mock-data.ts load OK.
import https from 'https'
import { EVENTS } from '../src/lib/mock-data'

const allUrls = new Set<string>()
for (const e of EVENTS) {
  allUrls.add(e.image)
  for (const g of e.gallery) allUrls.add(g)
}

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
  console.log(`Verifying ${urls.length} unique image URLs...\n`)
  const results: { url: string; status: number | string; ok: boolean }[] = []
  for (const u of urls) {
    const r = await check(u)
    results.push(r)
    const tag = r.ok ? 'OK   ' : 'FAIL '
    const short = u.replace(/^https?:\/\//, '').slice(0, 80)
    console.log(`${tag} ${String(r.status).padEnd(5)} ${short}`)
  }
  const okCount = results.filter(r => r.ok).length
  console.log(`\nSummary: ${okCount}/${results.length} OK`)
  const failed = results.filter(r => !r.ok)
  if (failed.length > 0) {
    console.log('\nStill failing:')
    for (const f of failed) console.log(`  - ${f.url}  (${f.status})`)
    process.exit(1)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
