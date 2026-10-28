'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { InitialsAvatar } from './initials-avatar'
import { MatchBadge } from './match-badge'
import { formatBudget, formatSubs } from './format'
import { useAppStore } from '@/lib/store'
import { scoreDevForCreator } from '@/lib/match'
import type { Developer, Creator } from '@/lib/types'
import {
  MapPin, Clock, Star, Briefcase, Link2, Github, Code2, Layers, Wallet, CalendarClock,
  Users, Eye, Megaphone, Target, Send, UserRoundSearch,
} from 'lucide-react'

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-stone-50/60 p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
      </div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  )
}

export function ProfileDialog({
  developer,
  creator,
  onClose,
  onConnect,
}: {
  developer: Developer | null
  creator: Creator | null
  onClose: () => void
  onConnect: () => void
}) {
  const open = !!developer || !!creator
  const { personaType, personaDev, personaCreator, openPersonaPicker } = useAppStore()
  const [pendingPersona, setPendingPersona] = useState(false)

  if (!open) return null

  const isMe = (personaType === 'developer' && developer && personaDev?.id === developer.id) ||
    (personaType === 'creator' && creator && personaCreator?.id === creator.id)

  const canConnect =
    (personaType === 'developer' && creator) || (personaType === 'creator' && developer)

  const score =
    personaType === 'developer' && personaDev && creator
      ? scoreDevForCreator(
          { skills: personaDev.skills, niches: personaDev.niches, hourlyRate: personaDev.hourlyRate, timezone: personaDev.timezone, availability: personaDev.availability },
          { skillsNeeded: creator.skillsNeeded, niche: creator.niche, budgetMin: creator.budgetMin, budgetMax: creator.budgetMax, timezone: creator.timezone }
        )
      : null

  const handleConnect = () => {
    if (!personaType) {
      setPendingPersona(true)
      openPersonaPicker()
      return
    }
    onConnect()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
        {developer ? (
          <>
            <DialogHeader>
              <div className="flex min-w-0 items-start gap-4">
                <InitialsAvatar name={developer.name} variant="dev" size="xl" />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-xl font-bold">
                    {developer.name}
                    {isMe && <Badge className="bg-emerald-600 text-white">You</Badge>}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 text-sm font-medium">
                    {developer.title} · {developer.experienceLevel}
                  </DialogDescription>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden="true" />{developer.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" />{developer.timezone}</span>
                    <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-3 w-3 fill-amber-500 text-amber-500" aria-hidden="true" />{developer.rating} ({developer.projectsDone} projects)</span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <p className="text-sm leading-relaxed text-stone-700">{developer.bio}</p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat icon={Wallet} label="Rate" value={`$${developer.hourlyRate}/hr`} />
              <Stat icon={CalendarClock} label="Availability" value={developer.availability} />
              <Stat icon={Briefcase} label="Projects" value={String(developer.projectsDone)} />
              <Stat icon={Star} label="Rating" value={String(developer.rating)} />
            </div>

            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold"><Code2 className="h-4 w-4" aria-hidden="true" /> Tech stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {developer.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold"><Layers className="h-4 w-4" aria-hidden="true" /> Creator niches served</h4>
              <div className="flex flex-wrap gap-1.5">
                {developer.niches.map((n) => <Badge key={n} variant="outline" className="border-emerald-300 text-emerald-800">{n}</Badge>)}
              </div>
            </div>

            <div>
              <h4 className="mb-1.5 text-sm font-semibold">Notable collaborations</h4>
              <p className="rounded-xl bg-stone-50 p-3 text-sm leading-relaxed text-stone-700">{developer.pastWork}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
              {developer.portfolioUrl && <span className="inline-flex items-center gap-1"><Link2 className="h-3 w-3" aria-hidden="true" />{developer.portfolioUrl}</span>}
              {developer.githubUrl && <span className="inline-flex items-center gap-1"><Github className="h-3 w-3" aria-hidden="true" />{developer.githubUrl}</span>}
            </div>
          </>
        ) : creator ? (
          <>
            <DialogHeader>
              <div className="flex min-w-0 items-start gap-4">
                <InitialsAvatar name={creator.channelName} variant="creator" size="xl" />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-xl font-bold">
                    {creator.channelName}
                    {isMe && <Badge className="bg-orange-500 text-white">You</Badge>}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 text-sm font-medium">
                    {creator.name} · {creator.platform} · {creator.niche}
                  </DialogDescription>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" aria-hidden="true" />{creator.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" />{creator.timezone}</span>
                    <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-3 w-3 fill-amber-500 text-amber-500" aria-hidden="true" />{creator.rating} ({creator.collabsDone} collabs)</span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <p className="text-sm leading-relaxed text-stone-700">{creator.bio}</p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat icon={Users} label="Audience" value={`${formatSubs(creator.subscribers)} subs`} />
              <Stat icon={Eye} label="Avg views" value={formatSubs(creator.avgViews)} />
              <Stat icon={Megaphone} label="Platform" value={creator.platform} />
              <Stat icon={Wallet} label="Budget" value={formatBudget(creator.budgetMin, creator.budgetMax)} />
            </div>

            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold"><Target className="h-4 w-4" aria-hidden="true" /> Looking for</h4>
              <p className="rounded-xl border border-orange-200 bg-orange-50/70 p-3 text-sm leading-relaxed text-stone-700">{creator.lookingFor}</p>
            </div>

            <div>
              <h4 className="mb-1.5 text-sm font-semibold">Skills needed</h4>
              <div className="flex flex-wrap gap-1.5">
                {creator.skillsNeeded.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>

            {creator.contentUrl && (
              <p className="inline-flex items-center gap-1 text-xs text-stone-500">
                <Link2 className="h-3 w-3" aria-hidden="true" /> {creator.contentUrl}
              </p>
            )}
          </>
        ) : null}

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {score !== null && <MatchBadge score={score} />}
            {!personaType && (
              <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                <UserRoundSearch className="h-3.5 w-3.5" aria-hidden="true" /> Pick a persona to unlock intros
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            {canConnect && !isMe && (
              <Button onClick={handleConnect} className="gap-1.5 font-semibold">
                <Send className="h-4 w-4" aria-hidden="true" /> Send intro
              </Button>
            )}
            {!canConnect && !isMe && !personaType && (
              <Button onClick={handleConnect} className="font-semibold">Enter platform to connect</Button>
            )}
          </div>
        </div>
        {pendingPersona && (
          <p className="-mt-1 text-xs text-stone-400">Choose your persona in the popup — then hit “Send intro” again.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
