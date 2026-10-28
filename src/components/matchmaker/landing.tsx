'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { InitialsAvatar } from './initials-avatar'
import { formatSubs } from './format'
import { useAppStore } from '@/lib/store'
import type { Developer, Creator, PlatformStats } from '@/lib/types'
import {
  ArrowRight, Compass, ListChecks, Code2, Megaphone, Sparkles, TrendingUp,
  Users, Percent, Target, Wrench, MessagesSquare, Rocket, CircleAlert, CircleCheck,
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export function Landing({
  stats,
  developers,
  creators,
  onOpenProfile,
}: {
  stats: PlatformStats | null
  developers: Developer[]
  creators: Creator[]
  onOpenProfile: (target: { developer: Developer | null; creator: Creator | null }) => void
}) {
  const { navigate, openPersonaPicker } = useAppStore()

  const topCreators = [...creators].sort((a, b) => b.rating - a.rating).slice(0, 3)
  const topDevs = [...developers].sort((a, b) => b.rating - a.rating).slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-emerald-50/80 via-white to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgb(16_185_129/0.25)_1px,transparent_0)] [background-size:22px_22px]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-5 gap-1.5 border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              The vertical matchmaker for the creator economy
            </Badge>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Indie devs and creators,{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                ship together.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Generic freelance platforms leave both sides stuck — creators get mismatched agencies,
              devs drown in low-signal gigs. ShipMates matches independent engineers with content
              creators on the things that actually predict a successful build: skills, niche, budget and time zone.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={openPersonaPicker} className="h-12 gap-2 px-6 text-base font-semibold">
                Find your match <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('listings')} className="h-12 gap-2 px-6 text-base font-semibold">
                <ListChecks className="h-4 w-4" aria-hidden="true" /> Browse project listings
              </Button>
            </div>

            <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Verified devs', value: stats ? String(stats.developers) : '—', icon: Code2 },
                { label: 'Creators hiring', value: stats ? String(stats.creators) : '—', icon: Megaphone },
                { label: 'Open briefs', value: stats ? String(stats.projects) : '—', icon: Target },
                { label: 'Combined audience', value: stats ? `${formatSubs(stats.totalAudienceReached)}+` : '—', icon: Users },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border bg-white/80 p-4 shadow-sm">
                  <dt className="flex items-center justify-center gap-1.5 text-xs font-medium text-stone-500">
                    <s.icon className="h-3.5 w-3.5" aria-hidden="true" /> {s.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-extrabold tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* ============ THE GAP ============ */}
      <section className="border-b py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">The gap</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              The market is booming. The matching is broken.
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-stone-600">
              The creator economy is doubling, yet when creators hire technical help on generic
              freelance marketplaces, projects overwhelmingly stall or die. The funnel leaks at the
              match step — not the talent step. A vertical platform fixes what horizontal markets
              structurally can&apos;t.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Percent, big: '<3%', label: 'project success rate', sub: 'on generic freelance platforms — the problem this platform exists to fix', source: 'Industry brief, 2026', tone: 'warn' },
              { icon: TrendingUp, big: '$480B', label: 'creator economy by 2027', sub: 'up from $250B — doubling in five years', source: 'Goldman Sachs', tone: 'good' },
              { icon: Users, big: '50M+', label: 'creators worldwide', sub: 'but only 4% earn $100K+ — most need leverage, not more hours', source: 'Goldman Sachs Research', tone: 'good' },
              { icon: Target, big: '70%', label: 'of creator revenue is brand deals', sub: 'products & tools are the untapped next engine — creators need builders', source: 'Goldman Sachs Research', tone: 'good' },
            ].map((s) => (
              <Card key={s.label} className="border-stone-200 shadow-sm">
                <CardContent className="p-5">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.tone === 'warn' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className={`text-3xl font-extrabold tabular-nums ${s.tone === 'warn' ? 'text-red-600' : 'text-stone-900'}`}>{s.big}</p>
                  <p className="mt-1 text-sm font-semibold">{s.label}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{s.sub}</p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-stone-400">{s.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMPARISON ============ */}
      <section className="border-b bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Why a vertical platform</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Built for one job, not a million gigs</h2>
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="border-red-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <CircleAlert className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold">Generic freelance platforms</h3>
                </div>
                <ul className="space-y-3 text-sm leading-relaxed text-stone-600">
                  {[
                    'Keyword-search hell: creators sort 200 identical “full-stack” bids with no niche context.',
                    'Mismatched incentives — platforms profit from volume of hires, not success of builds.',
                    'No shared vocabulary: “dev” spans Unity shaders and Stripe billing; creators can’t tell.',
                    'Rates anchored to a global race-to-the-bottom; quality engineers leave.',
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-emerald-300 shadow-sm ring-1 ring-emerald-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <CircleCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold">ShipMates — vertical by design</h3>
                </div>
                <ul className="space-y-3 text-sm leading-relaxed text-stone-600">
                  {[
                    'Match scores computed on skill overlap, niche fit, budget and time zone — before anyone messages.',
                    'Profiles speak creator: channel stats, past collabs, and the exact build they need next.',
                    'Project briefs with budgets and timelines upfront — no surprise scope, no bidding wars.',
                    'Curated two-sided community: every profile reviewed, every collab rated.',
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-b py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Three steps to your build partner</h2>
          </motion.div>

          <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { n: '1', icon: Users, title: 'Pick your side', text: 'Join as an independent developer or a content creator. Your profile carries what matters: stack & past builds on one side, channel stats & the next build on the other.' },
              { n: '2', icon: Wrench, title: 'Match on what predicts success', text: 'Every profile shows a match score computed from skill overlap, niche fit, budget alignment and time zone overlap. Filters cut weeks of cold outreach to minutes.' },
              { n: '3', icon: MessagesSquare, title: 'Send one intro, ship the build', text: 'Break the ice with a prefilled, specific intro message. Agree on a brief from the listings board, and get building — with ratings keeping both sides honest.' },
            ].map((step) => (
              <li key={step.n} className="relative rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 font-bold text-white">{step.n}</span>
                  <step.icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="border-b bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Top-rated this week</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Meet the community</h2>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Megaphone className="h-5 w-5 text-orange-500" aria-hidden="true" /> Creators hiring now
              </h3>
              <div className="flex flex-col gap-3">
                {topCreators.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onOpenProfile({ developer: null, creator: c })}
                    className="flex min-w-0 items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md"
                  >
                    <InitialsAvatar name={c.channelName} variant="creator" size="lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{c.channelName}</span>
                      <span className="block truncate text-xs text-stone-500">
                        {c.platform} · {formatSubs(c.subscribers)} subs · {c.niche}
                      </span>
                      <span className="mt-1 block truncate text-xs text-stone-600">Needs: {c.skillsNeeded.slice(0, 3).join(', ')}</span>
                    </span>
                    <Badge variant="outline" className="shrink-0 border-amber-300 bg-amber-50 text-amber-700">★ {c.rating}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <Code2 className="h-5 w-5 text-emerald-600" aria-hidden="true" /> Highest-rated developers
              </h3>
              <div className="flex flex-col gap-3">
                {topDevs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onOpenProfile({ developer: d, creator: null })}
                    className="flex min-w-0 items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  >
                    <InitialsAvatar name={d.name} variant="dev" size="lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{d.name}</span>
                      <span className="block truncate text-xs text-stone-500">{d.title}</span>
                      <span className="mt-1 block truncate text-xs text-stone-600">{d.skills.slice(0, 3).join(' · ')} — ${d.hourlyRate}/hr</span>
                    </span>
                    <Badge variant="outline" className="shrink-0 border-amber-300 bg-amber-50 text-amber-700">★ {d.rating}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-stone-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div {...fadeUp}>
            <Rocket className="mx-auto h-10 w-10 text-emerald-400" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Stop bidding into the void.</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-stone-300">
              Pick a demo persona and see the platform from either side — match scores, live listings
              and a dashboard that tracks every intro you send.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={openPersonaPicker} className="h-12 bg-emerald-500 px-6 text-base font-semibold text-stone-950 hover:bg-emerald-400">
                Enter the platform <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('discover')} className="h-12 gap-2 border-stone-700 bg-transparent px-6 text-base font-semibold text-white hover:bg-stone-800 hover:text-white">
                <Compass className="h-4 w-4" aria-hidden="true" /> Just look around
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
