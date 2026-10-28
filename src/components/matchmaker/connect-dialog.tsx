'use client'

import { useMemo, useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { InitialsAvatar } from './initials-avatar'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/lib/store'
import type { Developer, Creator, PersonaType } from '@/lib/types'
import { Send } from 'lucide-react'

export function ConnectDialog({
  target,
  onClose,
  onConnected,
}: {
  target: { type: 'developer' | 'creator'; developer: Developer | null; creator: Creator | null } | null
  onClose: () => void
  onConnected: () => void
}) {
  const { toast } = useToast()
  const { personaType, personaDev, personaCreator } = useAppStore()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const defaultIntro = useMemo(() => {
    if (!target) return ''
    if (target.type === 'creator' && personaDev) {
      return `Hi! I'm ${personaDev.name}, a ${personaDev.title.toLowerCase()}. Your ${target.creator?.niche} projects look like a perfect fit for my stack (${personaDev.skills.slice(0, 3).join(', ')}). I'd love to hear more about what you're building.`
    }
    if (target.type === 'developer' && personaCreator) {
      return `Hi ${target.developer?.name?.split(' ')[0] ?? ''}! I run ${personaCreator.channelName} (${personaCreator.platform}, ${personaCreator.niche}) and I'm looking for exactly your skillset. Open to a quick chat this week?`
    }
    return ''
  }, [target, personaDev, personaCreator])

  if (!target || !personaType) return null

  const fromName = personaType === 'developer' ? personaDev?.name : personaCreator?.channelName

  const send = async () => {
    if (!personaDev && !personaCreator) return
    setSending(true)
    try {
      const body =
        personaType === 'developer' && personaDev
          ? { developerId: personaDev.id, creatorId: target.creator!.id, initiatedBy: 'developer', message: message || defaultIntro }
          : { developerId: target.developer!.id, creatorId: personaCreator!.id, initiatedBy: 'creator', message: message || defaultIntro }
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.status === 201) {
        toast({ title: 'Intro sent 🎉', description: `${fromName} → ${target.type === 'creator' ? target.creator!.channelName : target.developer!.name}. Track it in your Dashboard.` })
        onConnected()
        onClose()
      } else {
        toast({ title: 'Could not send intro', description: data.error ?? 'Please try again.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not reach the server. Try again.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">Send an intro</DialogTitle>
          <DialogDescription>
            Short and specific wins. Say what you would build first.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 rounded-xl bg-stone-50 p-3">
          <span className="flex flex-col items-center gap-1">
            <InitialsAvatar name={fromName ?? 'Me'} variant={personaType as PersonaType} size="md" />
            <span className="max-w-20 truncate text-xs font-medium">{fromName}</span>
          </span>
          <Send className="h-4 w-4 text-stone-400" aria-hidden="true" />
          <span className="flex flex-col items-center gap-1">
            <InitialsAvatar
              name={target.type === 'creator' ? target.creator!.channelName : target.developer!.name}
              variant={target.type}
              size="md"
            />
            <span className="max-w-20 truncate text-xs font-medium">
              {target.type === 'creator' ? target.creator!.channelName : target.developer!.name}
            </span>
          </span>
        </div>

        <Textarea
          value={message || defaultIntro}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          aria-label="Intro message"
          placeholder="Write your intro..."
        />
        <p className="text-xs text-stone-400">{(message || defaultIntro).length}/1000 characters</p>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={send} disabled={sending} className="font-semibold">
            {sending ? 'Sending…' : 'Send intro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
