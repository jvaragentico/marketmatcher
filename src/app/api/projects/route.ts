import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJsonArray } from '@/lib/match'
import type { Project, Creator } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim().toLowerCase() ?? ''
  const niche = searchParams.get('niche') ?? ''
  const creatorId = searchParams.get('creatorId') ?? ''

  const rows = await db.project.findMany({
    where: { status: 'open' },
    include: { creator: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const mapped: Project[] = rows.map((r) => ({
    id: r.id,
    creatorId: r.creatorId,
    title: r.title,
    description: r.description,
    skillsNeeded: parseJsonArray(r.skillsNeeded),
    niche: r.niche,
    budgetMin: r.budgetMin,
    budgetMax: r.budgetMax,
    timeline: r.timeline,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    applicationCount: r._count.applications,
    creator: {
      ...r.creator,
      skillsNeeded: parseJsonArray(r.creator.skillsNeeded),
    } as Creator,
  }))

  const filtered = mapped.filter((p) => {
    if (niche && p.niche.toLowerCase() !== niche.toLowerCase()) return false
    if (creatorId && p.creatorId !== creatorId) return false
    if (q) {
      const haystack = `${p.title} ${p.description} ${p.skillsNeeded.join(' ')} ${p.creator?.channelName ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  return NextResponse.json({ projects: filtered })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creatorId, title, description, skillsNeeded, niche, budgetMin, budgetMax, timeline } = body

    if (!creatorId || !title || !description || !Array.isArray(skillsNeeded) || skillsNeeded.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: creatorId, title, description, skillsNeeded' }, { status: 400 })
    }
    if (typeof budgetMin !== 'number' || typeof budgetMax !== 'number' || budgetMin <= 0 || budgetMax < budgetMin) {
      return NextResponse.json({ error: 'Invalid budget range' }, { status: 400 })
    }

    const creator = await db.creator.findUnique({ where: { id: creatorId } })
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    const project = await db.project.create({
      data: {
        creatorId,
        title: String(title).slice(0, 140),
        description: String(description).slice(0, 2000),
        skillsNeeded: JSON.stringify(skillsNeeded.slice(0, 12).map((s: unknown) => String(s))),
        niche: niche ? String(niche) : creator.niche,
        budgetMin,
        budgetMax,
        timeline: timeline ? String(timeline) : 'Flexible',
      },
    })

    return NextResponse.json({ project: { ...project, skillsNeeded: parseJsonArray(project.skillsNeeded) } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
