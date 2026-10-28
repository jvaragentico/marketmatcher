'use client'

function compact(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

export function formatSubs(n: number): string {
  return compact(n)
}

export function formatBudget(min: number, max: number): string {
  return `$${compact(min)}–$${compact(max)}`
}

export function formatMoney(n: number): string {
  return `$${compact(n)}`
}
