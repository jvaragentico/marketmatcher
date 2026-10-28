'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InitialsAvatar } from './initials-avatar'
import { MatchBadge } from './match-badge'
import { formatBudget, formatMoney, formatSubs } from './format'
import { scoreDevForCreator } from '@/lib/match'
import { useAppStore } from '@/lib/store'
import type { Developer, Creator } from '@/lib/types'
import {
  Search, MapPin, Star, Wallet, CalendarClock, Code2, Megaphone, Users, Eye, SlidersHorizontal, SearchX,
} from 'lucide-react'

function CreatorCard({
  creator, score, onOpen,
}: {
  creator: Creator
  score: number | null
  onOpen: () => void
}) {
  return (
    <Card className="group cursor-pointer border-stone-200 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md" onClick={onOpen}>
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex min-w-0 items-start gap-3">
          <InitialsAvatar name={creator.channelName} variant="creator" size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold">{creator.channelName}</h3>
            <p className="truncate text-xs text-stone-500">{creator.name} · {creator.platform}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden="true" />{creator.location}</span>
              <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-3 w-3 fill-amber-500 text-amber-500" aria-hidden="true" />{creator.rating} ({creator.collabsDone})</span>
            </div>
          </div>
          {score !== null && <MatchBadge score={score} compact className="shrink-0" />}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">{creator.niche}</Badge>
          <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" aria-hidden="true" />{formatSubs(creator.subscribers)}</Badge>
          <Badge variant="secondary" className="gap-1"><Eye className="h-3 w-3" aria-hidden="true" />avg {formatSubs(creator.avgViews)}</Badge>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">{creator.lookingFor}</p>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 flex-wrap gap-1">
            {creator.skillsNeeded.slice(0, 3).map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            {creator.skillsNeeded.length > 3 && <Badge variant="secondary" className="text-xs">+{creator.skillsNeeded.length - 3}</Badge>}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-stone-800">
            <Wallet className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />{formatBudget(creator.budgetMin, creator.budgetMax)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function DeveloperCard({
  developer, score, onOpen,
}: {
  developer: Developer
  score: number | null
  onOpen: () => void
}) {
  return (
    <Card className="group cursor-pointer border-stone-200 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md" onClick={onOpen}>
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex min-w-0 items-start gap-3">
          <InitialsAvatar name={developer.name} variant="dev" size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold">{developer.name}</h3>
            <p className="truncate text-xs text-stone-500">{developer.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden="true" />{developer.location}</span>
              <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-3 w-3 fill-amber-500 text-amber-500" aria-hidden="true" />{developer.rating} ({developer.projectsDone})</span>
            </div>
          </div>
          {score !== null && <MatchBadge score={score} compact className="shrink-0" />}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {developer.niches.slice(0, 2).map((n) => (
            <Badge key={n} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">{n}</Badge>
          ))}
          <Badge variant="secondary" className="gap-1"><CalendarClock className="h-3 w-3" aria-hidden="true" />{developer.availability}</Badge>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">{developer.bio}</p>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 flex-wrap gap-1">
            {developer.skills.slice(0, 3).map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            {developer.skills.length > 3 && <Badge variant="secondary" className="text-xs">+{developer.skills.length - 3}</Badge>}
          </div>
          <span className="shrink-0 text-sm font-bold text-stone-800">{formatMoney(developer.hourlyRate)}/hr</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function Discover({
  developers,
  creators,
  loading,
  onOpenProfile,
}: {
  developers: Developer[]
  creators: Creator[]
  loading: boolean
  onOpenProfile: (target: { developer: Developer | null; creator: Creator | null }) => void
}) {
  const { personaType, personaDev, personaCreator } = useAppStore()
  const [tab, setTab] = useState<'creators' | 'developers'>(personaType === 'creator' ? 'developers' : 'creators')
  const [q, setQ] = useState('')
  const [niche, setNiche] = useState('all')
  const [extra, setExtra] = useState('all')

  const niches = useMemo(() => {
    const set = new Set<string>()
    creators.forEach((c) => set.add(c.niche))
    developers.forEach((d) => d.niches.forEach((n) => set.add(n)))
    return [...set].sort()
  }, [creators, developers])

  const platforms = useMemo(() => [...new Set(creators.map((c) => c.platform))].sort(), [creators])
  const availabilities = useMemo(() => [...new Set(developers.map((d) => d.availability))].sort(), [developers])

  const scoredCreators = useMemo(() => {
    return creators
      .filter((c) => {
        if (niche !== 'all' && c.niche !== niche) return false
        if (extra !== 'all' && c.platform !== extra) return false
        if (q) {
          const hay = `${c.channelName} ${c.name} ${c.bio} ${c.lookingFor} ${c.niche} ${c.skillsNeeded.join(' ')}`.toLowerCase()
          if (!hay.includes(q.toLowerCase())) return false
        }
        return true
      })
      .map((c) => ({
        creator: c,
        score:
          personaType === 'developer' && personaDev
            ? scoreDevForCreator(
                { skills: personaDev.skills, niches: personaDev.niches, hourlyRate: personaDev.hourlyRate, timezone: personaDev.timezone, availability: personaDev.availability },
                { skillsNeeded: c.skillsNeeded, niche: c.niche, budgetMin: c.budgetMin, budgetMax: c.budgetMax, timezone: c.timezone }
              )
            : null,
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || b.creator.subscribers - a.creator.subscribers)
  }, [creators, q, niche, extra, personaType, personaDev])

  const scoredDevelopers = useMemo(() => {
    return developers
      .filter((d) => {
        if (niche !== 'all' && !d.niches.includes(niche)) return false
        if (extra !== 'all' && d.availability !== extra) return false
        if (q) {
          const hay = `${d.name} ${d.title} ${d.bio} ${d.skills.join(' ')} ${d.niches.join(' ')} ${d.location}`.toLowerCase()
          if (!hay.includes(q.toLowerCase())) return false
        }
        return true
      })
      .map((d) => ({
        developer: d,
        score:
          personaType === 'creator' && personaCreator
            ? scoreDevForCreator(
                { skills: d.skills, niches: d.niches, hourlyRate: d.hourlyRate, timezone: d.timezone, availability: d.availability },
                { skillsNeeded: personaCreator.skillsNeeded, niche: personaCreator.niche, budgetMin: personaCreator.budgetMin, budgetMax: personaCreator.budgetMax, timezone: personaCreator.timezone }
              )
            : null,
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || b.developer.rating - a.developer.rating)
  }, [developers, q, niche, extra, personaType, personaCreator])

  const extraLabel = tab === 'creators' ? (personaType === 'creator' ? undefined : 'Platform') : 'Availability'
  const extraOptions = tab === 'creators' ? platforms : availabilities

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover your build partner</h1>
        <p className="text-stone-600">
          {personaType === 'developer' && 'Match scores below are computed against your skills, niche, rate and time zone.'}
          {personaType === 'creator' && 'Match scores below are computed against your channel’s needs and budget.'}
          {!personaType && 'Tip: pick a persona (top right) to unlock personalized match scores on every card.'}
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as 'creators' | 'developers'); setExtra('all'); setNiche('all') }} className="mt-6">
        <TabsList className="h-11 w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="creators" className="gap-1.5 data-[state=active]:text-orange-700">
            <Megaphone className="h-4 w-4" aria-hidden="true" /> Creators ({creators.length})
          </TabsTrigger>
          <TabsTrigger value="developers" className="gap-1.5 data-[state=active]:text-emerald-700">
            <Code2 className="h-4 w-4" aria-hidden="true" /> Developers ({developers.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter bar */}
      <div className="mt-4 flex flex-col gap-2 rounded-2xl border bg-stone-50/70 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tab === 'creators' ? 'Search creators, niches, skills needed…' : 'Search devs, stacks, niches…'}
            className="pl-9"
            aria-label="Search profiles"
          />
        </div>
        <div className="flex gap-2">
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by niche">
              <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
              <SelectValue placeholder="Niche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All niches</SelectItem>
              {niches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          {extraLabel && (
            <Select value={extra} onValueChange={setExtra}>
              <SelectTrigger className="w-full sm:w-40" aria-label={extraLabel}>
                <SelectValue placeholder={extraLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{extraLabel === 'Platform' ? 'All platforms' : 'Any availability'}</SelectItem>
                {extraOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : tab === 'creators' ? (
        scoredCreators.length === 0 ? (
          <EmptyState text="No creators match those filters. Try clearing the search." />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoredCreators.map(({ creator, score }) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                score={score}
                onOpen={() => onOpenProfile({ developer: null, creator })}
              />
            ))}
          </div>
        )
      ) : scoredDevelopers.length === 0 ? (
        <EmptyState text="No developers match those filters. Try clearing the search." />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scoredDevelopers.map(({ developer, score }) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              score={score}
              onOpen={() => onOpenProfile({ developer, creator: null })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
      <SearchX className="h-10 w-10 text-stone-300" aria-hidden="true" />
      <p className="text-sm text-stone-500">{text}</p>
    </div>
  )
}
