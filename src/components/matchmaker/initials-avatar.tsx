'use client'

import { cn } from '@/lib/utils'

const DEV_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-emerald-600 to-green-700',
  'from-teal-500 to-emerald-700',
  'from-green-500 to-emerald-600',
  'from-lime-600 to-emerald-700',
  'from-teal-600 to-cyan-700',
]

const CREATOR_GRADIENTS = [
  'from-orange-500 to-amber-600',
  'from-amber-500 to-orange-600',
  'from-orange-600 to-red-500',
  'from-amber-600 to-yellow-500',
  'from-rose-500 to-orange-600',
  'from-orange-500 to-pink-600',
]

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function initialsOf(name: string): string {
  const cleaned = name.replace(/["']/g, '')
  const parts = cleaned.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function InitialsAvatar({
  name,
  variant = 'dev',
  size = 'md',
  className,
}: {
  name: string
  variant?: 'dev' | 'creator'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const gradients = variant === 'dev' ? DEV_GRADIENTS : CREATOR_GRADIENTS
  const gradient = gradients[hashCode(name) % gradients.length]
  const sizeClass = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-2xl',
  }[size]

  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm select-none',
        gradient,
        sizeClass,
        className
      )}
    >
      {initialsOf(name)}
    </div>
  )
}
