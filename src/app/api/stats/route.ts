import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [developers, creators, projects, matches, applications] = await Promise.all([
    db.developer.count(),
    db.creator.count(),
    db.project.count({ where: { status: 'open' } }),
    db.match.count(),
    db.application.count(),
  ])

  const creatorsRows = await db.creator.findMany({ select: { subscribers: true } })
  const totalAudienceReached = creatorsRows.reduce((sum, c) => sum + c.subscribers, 0)

  return NextResponse.json({
    developers,
    creators,
    projects,
    matches,
    applications,
    totalAudienceReached,
  })
}
