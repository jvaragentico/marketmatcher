import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJsonArray } from '@/lib/match'
import type { Creator } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const skill = searchParams.get('skill') ?? ''
  const niche = searchParams.get('niche') ?? ''
  const platform = searchParams.get('platform') ?? ''
  const minBudget = searchParams.get('minBudget') ?? ''

  const rows = await db.creator.findMany({ orderBy: { subscribers: 'desc' } })

  const mapped: Creator[] = rows.map((r) => ({
    ...r,
    skillsNeeded: parseJsonArray(r.skillsNeeded),
  }))

  const filtered = mapped.filter((c) => {
    if (platform && c.platform !== platform) return false
    if (niche && c.niche.toLowerCase() !== niche.toLowerCase()) return false
    if (skill && !c.skillsNeeded.some((s) => s.toLowerCase() === skill.toLowerCase())) return false
    if (minBudget && c.budgetMax < Number(minBudget)) return false
    if (q) {
      const haystack = `${c.name} ${c.channelName} ${c.bio} ${c.lookingFor} ${c.niche} ${c.skillsNeeded.join(' ')} ${c.platform}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  return NextResponse.json({ creators: filtered })
}
