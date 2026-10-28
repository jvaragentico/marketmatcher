'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InitialsAvatar } from './initials-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { formatSubs } from './format'
import { Code2, Megaphone, Check } from 'lucide-react'
import type { Developer, Creator } from '@/lib/types'

export function PersonaDialog({
  developers,
  creators,
}: {
  developers: Developer[]
  creators: Creator[]
}) {
  const { personaPickerOpen, closePersonaPicker, setPersona, navigate } = useAppStore()
  const [tab, setTab] = useState<'developer' | 'creator'>('developer')

  const pick = (type: 'developer' | 'creator', dev: Developer | null, creator: Creator | null) => {
    setPersona(type, dev, creator)
    navigate('discover')
  }

  return (
    <Dialog open={personaPickerOpen} onOpenChange={(open) => !open && closePersonaPicker()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Who are you today?</DialogTitle>
          <DialogDescription>
            Pick a demo persona to personalize match scores, listings and your dashboard. You can switch anytime.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'developer' | 'creator')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="developer" className="gap-1.5">
              <Code2 className="h-4 w-4" aria-hidden="true" /> Developer
            </TabsTrigger>
            <TabsTrigger value="creator" className="gap-1.5">
              <Megaphone className="h-4 w-4" aria-hidden="true" /> Creator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="developer" className="mt-3">
            <p className="mb-2 text-sm text-stone-500">
              Browse creators who need exactly your stack — and get intro-message superpowers.
            </p>
            <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1">
              {developers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => pick('developer', d, null)}
                  className="flex items-center gap-3 rounded-xl border p-2.5 text-left transition hover:border-emerald-500 hover:bg-emerald-50/60"
                >
                  <InitialsAvatar name={d.name} variant="dev" size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{d.name}</span>
                    <span className="block truncate text-xs text-stone-500">
                      {d.title} · ${d.hourlyRate}/hr · {d.availability}
                    </span>
                  </span>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {d.skills.slice(0, 2).join(' · ')}
                  </Badge>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="creator" className="mt-3">
            <p className="mb-2 text-sm text-stone-500">
              Post briefs, review matched engineers, and stop losing weeks to bad freelance matches.
            </p>
            <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1">
              {creators.map((c) => (
                <button
                  key={c.id}
                  onClick={() => pick('creator', null, c)}
                  className="flex items-center gap-3 rounded-xl border p-2.5 text-left transition hover:border-orange-500 hover:bg-orange-50/60"
                >
                  <InitialsAvatar name={c.channelName} variant="creator" size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{c.channelName}</span>
                    <span className="block truncate text-xs text-stone-500">
                      {c.platform} · {formatSubs(c.subscribers)} subs · {c.niche}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-xs text-stone-400">No account needed — this is a demo sandbox.</p>
          <Button variant="ghost" size="sm" onClick={closePersonaPicker}>
            Continue as guest <Check className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
