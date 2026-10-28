'use client'

import { Handshake } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-stone-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 pb-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-900 text-white">
            <Handshake className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">ShipMates</span>
          <span className="text-sm text-stone-500">— where indie devs & creators ship together.</span>
        </div>
        <p className="text-xs text-stone-400">
          Demo platform · Market data: Goldman Sachs (2023), EMARKETER (2025) · © 2026 ShipMates
        </p>
      </div>
    </footer>
  )
}
