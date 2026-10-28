import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseJsonArray } from '@/lib/match'
import type { Application } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const developerId = searchParams.get('developerId') ?? ''
  const creatorId = searchParams.get('creatorId') ?? ''

  const where = developerId
    ? { developerId }
    : creatorId
      ? { project: { creatorId } }
      : undefined

  const rows = await db.application.findMany({
    where,
    include: {
      developer: true,
      project: { include: { creator: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const mapped: Application[] = rows.map((r) => ({
    id: r.id,
    projectId: r.projectId,
    developerId: r.developerId,
    message: r.message,
    status: r.status as Application['status'],
    createdAt: r.createdAt.toISOString(),
    developer: { ...r.developer, skills: parseJsonArray(r.developer.skills), niches: parseJsonArray(r.developer.niches) },
    project: {
      ...r.project,
      createdAt: r.project.createdAt.toISOString(),
      skillsNeeded: parseJsonArray(r.project.skillsNeeded),
      creator: { ...r.project.creator, skillsNeeded: parseJsonArray(r.project.creator.skillsNeeded) },
    },
  }))

  return NextResponse.json({ applications: mapped })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectId, developerId, message } = body

    if (!projectId || !developerId) {
      return NextResponse.json({ error: 'projectId and developerId are required' }, { status: 400 })
    }

    const [project, dev] = await Promise.all([
      db.project.findUnique({ where: { id: projectId } }),
      db.developer.findUnique({ where: { id: developerId } }),
    ])
    if (!project || project.status !== 'open') {
      return NextResponse.json({ error: 'Project not found or closed' }, { status: 404 })
    }
    if (!dev) {
      return NextResponse.json({ error: 'Developer not found' }, { status: 404 })
    }

    const existing = await db.application.findFirst({ where: { projectId, developerId } })
    if (existing) {
      return NextResponse.json({ error: 'You already applied to this project' }, { status: 409 })
    }

    const application = await db.application.create({
      data: {
        projectId,
        developerId,
        message: message ? String(message).slice(0, 1000) : 'I would love to work on this project.',
        status: 'pending',
      },
    })

    return NextResponse.json({ application: { ...application, createdAt: application.createdAt.toISOString() } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
