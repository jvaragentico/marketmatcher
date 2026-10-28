'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InitialsAvatar } from './initials-avatar'
import { MatchBadge } from './match-badge'
import { formatBudget, formatSubs } from './format'
import { scoreDevForProject } from '@/lib/match'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import type { Project, Developer, Creator } from '@/lib/types'
import {
  Wallet, CalendarClock, Plus, Search, SearchX, Users, Send, Megaphone, ListChecks,
} from 'lucide-react'

const COMMON_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Stripe',
  'Unity', 'C#', 'React Native', 'Expo', 'Firebase', 'Tailwind', 'Web Audio API',
  'LangChain', 'OpenAI API', 'Web Scraping', 'Discord Bots', 'Go', 'FFmpeg',
]

function ApplyDialog({
  project, onClose, onApplied,
}: {
  project: Project | null
  onClose: () => void
  onApplied: () => void
}) {
  const { toast } = useToast()
  const { personaDev } = useAppStore()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  if (!project || !personaDev) return null

  const defaultMsg = `Hi ${project.creator?.channelName ?? ''}! I'm ${personaDev.name} (${personaDev.title}). Relevant to "${project.title}": ${personaDev.pastWork.split(';')[0]}. I can start within two weeks.`

  const apply = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, developerId: personaDev.id, message: message || defaultMsg }),
      })
      const data = await res.json()
      if (res.status === 201) {
        toast({ title: 'Application sent ✅', description: `Your proposal for “${project.title.slice(0, 40)}…” is in. Track it in your Dashboard.` })
        onApplied()
        onClose()
      } else {
        toast({ title: 'Could not apply', description: data.error ?? 'Try again.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not reach the server.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Apply: {project.title}</DialogTitle>
          <DialogDescription>Budget {formatBudget(project.budgetMin, project.budgetMax)} · {project.timeline}. Devs with a specific first step get replies.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={message || defaultMsg}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          aria-label="Application message"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={apply} disabled={sending} className="font-semibold">
            {sending ? 'Sending…' : 'Submit application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PostProjectDialog({
  open, creator, onClose, onPosted,
}: {
  open: boolean
  creator: Creator
  onClose: () => void
  onPosted: () => void
}) {
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState('2000')
  const [budgetMax, setBudgetMax] = useState('4000')
  const [timeline, setTimeline] = useState('4 weeks')
  const [posting, setPosting] = useState(false)

  const toggleSkill = (s: string) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 8 ? [...prev, s] : prev))

  const valid = title.trim().length >= 8 && description.trim().length >= 20 && skills.length > 0 &&
    Number(budgetMin) > 0 && Number(budgetMax) >= Number(budgetMin)

  const post = async () => {
    if (!valid) return
    setPosting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: creator.id,
          title: title.trim(),
          description: description.trim(),
          skillsNeeded: skills,
          niche: creator.niche,
          budgetMin: Number(budgetMin),
          budgetMax: Number(budgetMax),
          timeline: timeline.trim() || 'Flexible',
        }),
      })
      const data = await res.json()
      if (res.status === 201) {
        toast({ title: 'Brief posted 🚀', description: 'Matched developers will see it on the board and can apply now.' })
        setTitle(''); setDescription(''); setSkills([]); setBudgetMin('2000'); setBudgetMax('4000'); setTimeline('4 weeks')
        onPosted()
        onClose()
      } else {
        toast({ title: 'Could not post brief', description: data.error ?? 'Try again.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not reach the server.', variant: 'destructive' })
    } finally {
      setPosting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Post a project brief</DialogTitle>
          <DialogDescription>Posted as <span className="font-semibold text-stone-700">{creator.channelName}</span>. Be specific — devs match on skills you list.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="pp-title">Title</Label>
            <Input id="pp-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a subscriber analytics dashboard" />
          </div>
          <div>
            <Label htmlFor="pp-desc">What do you need built?</Label>
            <Textarea id="pp-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe the outcome, must-haves, and what success looks like…" />
          </div>
          <div>
            <Label>Skills needed <span className="text-stone-400">({skills.length}/8)</span></Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  aria-pressed={skills.includes(s)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    skills.includes(s)
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-orange-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="pp-bmin">Budget min ($)</Label>
              <Input id="pp-bmin" type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pp-bmax">Budget max ($)</Label>
              <Input id="pp-bmax" type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pp-timeline">Timeline</Label>
              <Input id="pp-timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="4 weeks" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={post} disabled={!valid || posting} className="font-semibold">
            {posting ? 'Posting…' : 'Post brief'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Listings({
  projects,
  developers,
  loading,
  onDataChanged,
  onOpenCreatorProfile,
}: {
  projects: Project[]
  developers: Developer[]
  loading: boolean
  onDataChanged: () => void
  onOpenCreatorProfile: (creator: Creator) => void
}) {
  const { personaType, personaDev, personaCreator, openPersonaPicker } = useAppStore()
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [applyTarget, setApplyTarget] = useState<Project | null>(null)
  const [postOpen, setPostOpen] = useState(false)
  const [connectTarget, setConnectTarget] = useState<{ developer: Developer; project: Project } | null>(null)
  const [connectMsg, setConnectMsg] = useState('')

  const filtered = useMemo(() => {
    if (!q.trim()) return projects
    const needle = q.toLowerCase()
    return projects.filter((p) =>
      `${p.title} ${p.description} ${p.skillsNeeded.join(' ')} ${p.creator?.channelName ?? ''} ${p.niche}`.toLowerCase().includes(needle)
    )
  }, [projects, q])

  const sendIntro = async () => {
    if (!personaDev || !connectTarget) return
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerId: personaDev.id,
          creatorId: connectTarget.project.creatorId,
          initiatedBy: 'developer',
          message: connectMsg,
        }),
      })
      const data = await res.json()
      if (res.status === 201) {
        toast({ title: 'Intro sent 🎉', description: `You reached out to ${connectTarget.project.creator?.channelName}. Track it in your Dashboard.` })
        setConnectTarget(null)
        onDataChanged()
      } else {
        toast({ title: 'Could not send intro', description: data.error ?? 'Try again.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not reach the server.', variant: 'destructive' })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project listings</h1>
          <p className="mt-1 text-stone-600">
            Briefs from creators with budgets and timelines upfront — no bidding wars, no scope roulette.
          </p>
        </div>
        {personaType === 'creator' && personaCreator ? (
          <Button onClick={() => setPostOpen(true)} className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" aria-hidden="true" /> Post a project
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              if (!personaType) { openPersonaPicker(); return }
              toast({ title: 'Creator accounts only', description: 'Switch your persona to a creator to post project briefs.', variant: 'destructive' })
            }}
            className="gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Post a project
          </Button>
        )}
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search briefs by title, skill, or creator…" className="pl-9" aria-label="Search listings" />
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <SearchX className="h-10 w-10 text-stone-300" aria-hidden="true" />
          <p className="text-sm text-stone-500">No briefs match that search.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const score = personaDev
              ? scoreDevForProject(
                  { skills: personaDev.skills, niches: personaDev.niches, hourlyRate: personaDev.hourlyRate },
                  { skillsNeeded: p.skillsNeeded, niche: p.niche, budgetMin: p.budgetMin, budgetMax: p.budgetMax }
                )
              : null
            const isMyProject = personaType === 'creator' && personaCreator?.id === p.creatorId

            return (
              <Card key={p.id} className="flex border-stone-200 shadow-sm transition hover:shadow-md">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-bold leading-snug">{p.title}</h3>
                    {score !== null && <MatchBadge score={score} className="shrink-0" />}
                  </div>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">{p.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.skillsNeeded.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                    <span className="inline-flex items-center gap-1"><Wallet className="h-3 w-3" aria-hidden="true" />{formatBudget(p.budgetMin, p.budgetMax)}</span>
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" aria-hidden="true" />{p.timeline}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" aria-hidden="true" />{p.applicationCount ?? 0} applicant{(p.applicationCount ?? 0) === 1 ? '' : 's'}</span>
                  </div>

                  <div className="mt-auto flex min-w-0 items-center justify-between gap-2 border-t pt-3">
                    <button
                      className="flex min-w-0 items-center gap-2 rounded-lg text-left transition hover:opacity-80"
                      onClick={() => p.creator && onOpenCreatorProfile(p.creator)}
                      title={`View ${p.creator?.channelName}`}
                    >
                      <InitialsAvatar name={p.creator?.channelName ?? '?'} variant="creator" size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold">{p.creator?.channelName}</span>
                        <span className="block truncate text-[11px] text-stone-400">
                          {formatSubs(p.creator?.subscribers ?? 0)} · {p.creator?.platform}
                        </span>
                      </span>
                    </button>

                    {isMyProject ? (
                      <Badge className="shrink-0 bg-orange-500 text-white"><Megaphone className="mr-1 h-3 w-3" aria-hidden="true" />Your brief</Badge>
                    ) : personaType === 'developer' && personaDev ? (
                      <div className="flex shrink-0 gap-1.5">
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => { setConnectTarget({ developer: personaDev, project: p }); setConnectMsg(`Hi ${p.creator?.channelName}! I'd love to help with "${p.title}".`) }}
                        >
                          Intro
                        </Button>
                        <Button size="sm" className="font-semibold" onClick={() => setApplyTarget(p)}>
                          <Send className="mr-1 h-3.5 w-3.5" aria-hidden="true" /> Apply
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm" variant="outline" className="shrink-0 font-semibold"
                        onClick={() => { if (!personaType) openPersonaPicker() }}
                      >
                        <ListChecks className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                        {personaType === 'creator' ? 'View' : 'Apply'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ApplyDialog
        project={applyTarget}
        onClose={() => setApplyTarget(null)}
        onApplied={onDataChanged}
      />

      {personaCreator && (
        <PostProjectDialog
          open={postOpen}
          creator={personaCreator}
          onClose={() => setPostOpen(false)}
          onPosted={onDataChanged}
        />
      )}

      {/* Quick intro dialog from listing */}
      <Dialog open={!!connectTarget} onOpenChange={(o) => !o && setConnectTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Intro to {connectTarget?.project.creator?.channelName}</DialogTitle>
            <DialogDescription>Reference the brief directly — creators reply to specifics.</DialogDescription>
          </DialogHeader>
          <Textarea value={connectMsg} onChange={(e) => setConnectMsg(e.target.value)} rows={4} aria-label="Intro message" />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConnectTarget(null)}>Cancel</Button>
            <Button onClick={sendIntro} className="font-semibold">Send intro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
