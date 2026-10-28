'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { InitialsAvatar } from './initials-avatar'
import { MatchBadge } from './match-badge'
import { formatBudget, formatSubs } from './format'
import { scoreDevForCreator } from '@/lib/match'
import { useAppStore } from '@/lib/store'
import type { Developer, Creator, Match, Application, Project } from '@/lib/types'
import {
  Inbox, Send, Compass, ListChecks, CircleCheck, Clock, CircleDashed, UserPlus, Sparkles, Megaphone, Code2, Users,
} from 'lucide-react'

function StatusBadge({ status }: { status: string }) {
  if (status === 'accepted') return <Badge className="gap-1 border-transparent bg-emerald-600 text-white"><CircleCheck className="h-3 w-3" aria-hidden="true" />Accepted</Badge>
  if (status === 'declined') return <Badge variant="destructive" className="gap-1">Declined</Badge>
  return <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700"><Clock className="h-3 w-3" aria-hidden="true" />Pending</Badge>
}

export function Dashboard({
  matches,
  applications,
  projects,
  developers,
  creators,
  onOpenProfile,
}: {
  matches: Match[]
  applications: Application[]
  projects: Project[]
  developers: Developer[]
  creators: Creator[]
  onOpenProfile: (target: { developer: Developer | null; creator: Creator | null }) => void
}) {
  const { personaType, personaDev, personaCreator, openPersonaPicker, navigate } = useAppStore()

  const myMatches = useMemo(() => {
    if (personaType === 'developer' && personaDev) return matches.filter((m) => m.developerId === personaDev.id)
    if (personaType === 'creator' && personaCreator) return matches.filter((m) => m.creatorId === personaCreator.id)
    return []
  }, [matches, personaType, personaDev, personaCreator])

  const myApplications = useMemo(
    () => (personaDev ? applications.filter((a) => a.developerId === personaDev.id) : []),
    [applications, personaDev]
  )

  const myBriefs = useMemo(
    () => (personaCreator ? projects.filter((p) => p.creatorId === personaCreator.id) : []),
    [projects, personaCreator]
  )

  const incomingApplications = useMemo(
    () => (personaCreator ? applications.filter((a) => a.project?.creatorId === personaCreator.id) : []),
    [applications, personaCreator]
  )

  const recommendations = useMemo(() => {
    if (personaType === 'developer' && personaDev) {
      return creators
        .map((c) => ({
          creator: c,
          score: scoreDevForCreator(
            { skills: personaDev.skills, niches: personaDev.niches, hourlyRate: personaDev.hourlyRate, timezone: personaDev.timezone, availability: personaDev.availability },
            { skillsNeeded: c.skillsNeeded, niche: c.niche, budgetMin: c.budgetMin, budgetMax: c.budgetMax, timezone: c.timezone }
          ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    }
    if (personaType === 'creator' && personaCreator) {
      return developers
        .map((d) => ({
          developer: d,
          score: scoreDevForCreator(
            { skills: d.skills, niches: d.niches, hourlyRate: d.hourlyRate, timezone: d.timezone, availability: d.availability },
            { skillsNeeded: personaCreator.skillsNeeded, niche: personaCreator.niche, budgetMin: personaCreator.budgetMin, budgetMax: personaCreator.budgetMax, timezone: personaCreator.timezone }
          ),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    }
    return []
  }, [personaType, personaDev, personaCreator, creators, developers])

  // ---------- Guest ----------
  if (!personaType) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <UserPlus className="mx-auto h-12 w-12 text-stone-300" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold">Your dashboard lives here</h1>
        <p className="mx-auto mt-2 max-w-md text-stone-600">
          Pick a demo persona — developer or creator — and this space fills up with your intros,
          applications, briefs and personalized match recommendations.
        </p>
        <Button size="lg" onClick={openPersonaPicker} className="mt-6 font-semibold">
          Choose your persona
        </Button>
      </div>
    )
  }

  const isDev = personaType === 'developer'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isDev ? `${personaDev?.name.split(' ')[0]}'s` : personaCreator?.channelName} builder dashboard
          </h1>
          <p className="mt-1 text-stone-600">
            {isDev ? 'Track intros you sent, applications, and your best-fit creators.' : 'Track intros, your briefs, incoming applications and best-fit engineers.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('discover')} className="gap-1.5 font-semibold">
            <Compass className="h-4 w-4" aria-hidden="true" /> Discover
          </Button>
          <Button variant="outline" onClick={() => navigate('listings')} className="gap-1.5 font-semibold">
            <ListChecks className="h-4 w-4" aria-hidden="true" /> Listings
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Connections */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Inbox className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              My connections <Badge variant="secondary">{myMatches.length}</Badge>
            </h2>
            {myMatches.length === 0 ? (
              <EmptyInline
                icon={<Send className="h-8 w-8 text-stone-300" aria-hidden="true" />}
                text="No intros yet. Open a profile in Discover and send your first one."
                action={<Button size="sm" variant="outline" onClick={() => navigate('discover')}>Find partners</Button>}
              />
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {myMatches.map((m) => {
                  const other = isDev ? m.creator : m.developer
                  const name = isDev ? other?.channelName : other?.name
                  return (
                    <li key={m.id} className="flex min-w-0 items-start gap-3 rounded-2xl border p-4">
                      <InitialsAvatar name={name ?? '?'} variant={isDev ? 'creator' : 'dev'} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{name}</span>
                          <StatusBadge status={m.status} />
                          {m.initiatedBy === personaType && (
                            <Badge variant="secondary" className="gap-1 text-xs"><Send className="h-3 w-3" aria-hidden="true" />You initiated</Badge>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-stone-600">“{m.message}”</p>
                        <button
                          className="mt-1 text-xs font-medium text-emerald-700 hover:underline"
                          onClick={() => onOpenProfile(isDev ? { developer: null, creator: m.creator ?? null } : { developer: m.developer ?? null, creator: null })}
                        >
                          View profile →
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
              Best matches for you
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {recommendations.map((r) => (
                <li key={r.creator?.id ?? r.developer?.id} className="flex min-w-0 items-center gap-3">
                  <InitialsAvatar
                    name={isDev ? r.creator!.channelName : r.developer!.name}
                    variant={isDev ? 'creator' : 'dev'}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {isDev ? r.creator!.channelName : r.developer!.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">
                      {isDev ? `${r.creator!.platform} · ${formatSubs(r.creator!.subscribers)}` : r.developer!.title}
                    </p>
                  </div>
                  <MatchBadge score={r.score} compact />
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <Button size="sm" variant="ghost" className="w-full" onClick={() => navigate('discover')}>
              See all in Discover
            </Button>
          </CardContent>
        </Card>

        {/* Role-specific panel */}
        {isDev ? (
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <ListChecks className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                My applications <Badge variant="secondary">{myApplications.length}</Badge>
              </h2>
              {myApplications.length === 0 ? (
                <EmptyInline
                  icon={<CircleDashed className="h-8 w-8 text-stone-300" aria-hidden="true" />}
                  text="No applications yet. Briefs with budgets upfront are waiting on the board."
                  action={<Button size="sm" variant="outline" onClick={() => navigate('listings')}>Browse listings</Button>}
                />
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {myApplications.map((a) => (
                    <li key={a.id} className="rounded-2xl border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{a.project?.title}</span>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="mt-1 text-xs text-stone-500">
                        {a.project?.creator?.channelName} · {formatBudget(a.project?.budgetMin ?? 0, a.project?.budgetMax ?? 0)} · {a.project?.timeline}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-sm text-stone-600">“{a.message}”</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Megaphone className="h-5 w-5 text-orange-500" aria-hidden="true" />
                My briefs <Badge variant="secondary">{myBriefs.length}</Badge>
              </h2>
              {myBriefs.length === 0 ? (
                <EmptyInline
                  icon={<ListChecks className="h-8 w-8 text-stone-300" aria-hidden="true" />}
                  text="No briefs posted yet. Projects with clear budgets get 3x more applications."
                  action={<Button size="sm" variant="outline" onClick={() => navigate('listings')}>Post a brief</Button>}
                />
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {myBriefs.map((p) => {
                    const applicants = incomingApplications.filter((a) => a.projectId === p.id)
                    return (
                      <li key={p.id} className="rounded-2xl border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold">{p.title}</span>
                          <Badge variant="secondary" className="gap-1"><Users_ />{applicants.length} applicant{applicants.length === 1 ? '' : 's'}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">
                          {formatBudget(p.budgetMin, p.budgetMax)} · {p.timeline} · {p.status}
                        </p>
                        {applicants.length > 0 && (
                          <ul className="mt-2 flex flex-col gap-2">
                            {applicants.map((a) => (
                              <li key={a.id} className="flex min-w-0 items-center gap-2 rounded-xl bg-stone-50 p-2.5">
                                <InitialsAvatar name={a.developer?.name ?? '?'} variant="dev" size="sm" />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium">{a.developer?.name}</span>
                                  <span className="block truncate text-xs text-stone-500">“{a.message}”</span>
                                </span>
                                <StatusBadge status={a.status} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-900">
        <Code2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        <p>
          <span className="font-semibold">How matching works:</span> match scores blend skill overlap (50%),
          niche fit (20%), budget alignment (18%), time zone overlap (7%) and availability (5%) —
          so a 90%+ score means you can realistically start this week.
        </p>
      </div>
    </div>
  )
}

function Users_() {
  return <Users className="h-3 w-3" aria-hidden="true" />
}

function EmptyInline({ icon, text, action }: { icon: React.ReactNode; text: string; action?: React.ReactNode }) {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-10 text-center">
      {icon}
      <p className="max-w-xs text-sm text-stone-500">{text}</p>
      {action}
    </div>
  )
}
