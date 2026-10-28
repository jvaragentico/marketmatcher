'use client'

import { Badge } from '@/components/ui/badge'
import { scoreLabel } from '@/lib/match'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

export function MatchBadge({ score, compact = false, className }: { score: number; compact?: boolean; className?: string }) {
  const { label, tone } = scoreLabel(score)
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1 border-transparent text-white',
        compact ? 'shrink-0 px-1.5 font-semibold text-xs' : 'font-semibold',
        tone === 'great' && 'bg-emerald-600',
        tone === 'good' && 'bg-emerald-500/80',
        tone === 'ok' && 'bg-stone-400',
        className
      )}
      title={`Match score: ${score}/100 — ${label}`}
    >
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {score}%{!compact && ` ${label}`}
    </Badge>
  )
}

export function PlatformBadge({ platform }: { platform: string }) {
  return (
    <Badge variant="secondary" className="font-medium">
      {platform}
    </Badge>
  )
}
