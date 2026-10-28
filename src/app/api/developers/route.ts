import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJsonArray } from '@/lib/match'
import type { Developer } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const skill = searchParams.get('skill') ?? ''
  const niche = searchParams.get('niche') ?? ''
  const availability = searchParams.get('availability') ?? ''
  const maxRate = searchParams.get('maxRate') ?? ''

  const rows = await db.developer.findMany({ orderBy: { rating: 'desc' } })

  const mapped: Developer[] = rows.map((r) => ({
    ...r,
    skills: parseJsonArray(r.skills),
    niches: parseJsonArray(r.niches),
  }))

  const filtered = mapped.filter((d) => {
    if (availability && d.availability !== availability) return false
    if (skill && !d.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) return false
    if (niche && !d.niches.some((n) => n.toLowerCase() === niche.toLowerCase())) return false
    if (maxRate && d.hourlyRate > Number(maxRate)) return false
    if (q) {
      const haystack = `${d.name} ${d.title} ${d.bio} ${d.skills.join(' ')} ${d.niches.join(' ')} ${d.location}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  return NextResponse.json({ developers: filtered })
}
