// Match-scoring logic shared by API routes and client components.
// Scores a developer against a creator (or a project) on:
//   skill overlap, niche fit, budget fit, availability/timezone proximity.

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []
  } catch {
    return []
  }
}

function skillOverlap(required: string[], offered: string[]): number {
  if (required.length === 0) return 0
  const offeredLower = new Set(offered.map((s) => s.toLowerCase()))
  const matched = required.filter((s) => offeredLower.has(s.toLowerCase())).length
  return matched / required.length
}

function nicheFit(devNiches: string[], creatorNiche: string): boolean {
  const n = creatorNiche.toLowerCase()
  return devNiches.some((d) => {
    const dn = d.toLowerCase()
    return n.includes(dn) || dn.includes(n.split(' ')[0])
  })
}

function budgetFit(devRate: number, budgetMin: number, budgetMax: number): number {
  // Treat monthly budget as roughly rate * 40 hours (half-month engagement).
  const impliedRate = (budgetMin + budgetMax) / 2 / 40
  if (devRate <= impliedRate * 1.4) return 1
  if (devRate <= impliedRate * 2) return 0.5
  return 0.15
}

function timezoneBonus(tzA: string, tzB: string): number {
  const parseOffset = (tz: string): number => {
    const m = tz.match(/UTC([+-]\d{1,2})/)
    return m ? parseInt(m[1], 10) : 0
  }
  const diff = Math.abs(parseOffset(tzA) - parseOffset(tzB))
  if (diff <= 3) return 1
  if (diff <= 7) return 0.6
  return 0.3
}

export interface ScoredDev {
  dev: { skills: string[]; niches: string[]; hourlyRate: number; timezone: string; availability: string }
}

export interface ScoredCreator {
  creator: { skillsNeeded: string[]; niche: string; budgetMin: number; budgetMax: number; timezone: string }
}

/** Score how well a developer fits a creator (0-100). */
export function scoreDevForCreator(dev: ScoredDev['dev'], creator: ScoredCreator['creator']): number {
  const skills = skillOverlap(creator.skillsNeeded, dev.skills) * 50
  const niche = (nicheFit(dev.niches, creator.niche) ? 1 : 0.25) * 20
  const budget = budgetFit(dev.hourlyRate, creator.budgetMin, creator.budgetMax) * 18
  const tz = timezoneBonus(dev.timezone, creator.timezone) * 7
  const availability = (dev.availability !== 'Weekends' ? 1 : 0.6) * 5
  return Math.min(99, Math.round(skills + niche + budget + tz + availability))
}

/** Score how well a developer fits a specific project (0-100). */
export function scoreDevForProject(
  dev: { skills: string[]; niches: string[]; hourlyRate: number },
  project: { skillsNeeded: string[]; niche: string; budgetMin: number; budgetMax: number }
): number {
  const skills = skillOverlap(project.skillsNeeded, dev.skills) * 60
  const niche = (nicheFit(dev.niches, project.niche) ? 1 : 0.25) * 15
  const budget = budgetFit(dev.hourlyRate, project.budgetMin, project.budgetMax) * 25
  return Math.min(99, Math.round(skills + niche + budget))
}

export function scoreLabel(score: number): { label: string; tone: 'great' | 'good' | 'ok' } {
  if (score >= 75) return { label: 'Strong match', tone: 'great' }
  if (score >= 50) return { label: 'Good match', tone: 'good' }
  return { label: 'Possible fit', tone: 'ok' }
}
