import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJsonArray } from '@/lib/match'
import type { Match } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const developerId = searchParams.get('developerId') ?? ''
  const creatorId = searchParams.get('creatorId') ?? ''

  const where = developerId
    ? { developerId }
    : creatorId
      ? { creatorId }
      : undefined

  const rows = await db.match.findMany({
    where,
    include: { developer: true, creator: true },
    orderBy: { createdAt: 'desc' },
  })

  const mapped: Match[] = rows.map((r) => ({
    id: r.id,
    developerId: r.developerId,
    creatorId: r.creatorId,
    initiatedBy: r.initiatedBy as 'developer' | 'creator',
    message: r.message,
    status: r.status as 'pending' | 'accepted',
    createdAt: r.createdAt.toISOString(),
    developer: r.developer ? { ...r.developer, skills: parseJsonArray(r.developer.skills), niches: parseJsonArray(r.developer.niches) } : undefined,
    creator: r.creator ? { ...r.creator, skillsNeeded: parseJsonArray(r.creator.skillsNeeded) } : undefined,
  }))

  return NextResponse.json({ matches: mapped })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { developerId, creatorId, initiatedBy, message } = body

    if (!developerId || !creatorId || !initiatedBy) {
      return NextResponse.json({ error: 'developerId, creatorId and initiatedBy are required' }, { status: 400 })
    }
    if (initiatedBy !== 'developer' && initiatedBy !== 'creator') {
      return NextResponse.json({ error: 'initiatedBy must be "developer" or "creator"' }, { status: 400 })
    }

    const [dev, creator] = await Promise.all([
      db.developer.findUnique({ where: { id: developerId } }),
      db.creator.findUnique({ where: { id: creatorId } }),
    ])
    if (!dev || !creator) {
      return NextResponse.json({ error: 'Developer or creator not found' }, { status: 404 })
    }

    const existing = await db.match.findFirst({ where: { developerId, creatorId } })
    if (existing) {
      return NextResponse.json({ error: 'You already connected with this partner', matchId: existing.id }, { status: 409 })
    }

    const match = await db.match.create({
      data: {
        developerId,
        creatorId,
        initiatedBy,
        message: message ? String(message).slice(0, 1000) : 'Let\'s build together!',
        status: 'pending',
      },
      include: { developer: true, creator: true },
    })

    return NextResponse.json(
      { match: { ...match, createdAt: match.createdAt.toISOString() } },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
