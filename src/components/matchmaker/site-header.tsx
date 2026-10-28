'use client'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { InitialsAvatar } from './initials-avatar'
import { cn } from '@/lib/utils'
import { Handshake, LayoutDashboard, ListChecks, Menu, Compass, House, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const NAV_ITEMS = [
  { view: 'landing' as const, label: 'Home', icon: House },
  { view: 'discover' as const, label: 'Discover', icon: Compass },
  { view: 'listings' as const, label: 'Listings', icon: ListChecks },
  { view: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
]

export function SiteHeader() {
  const { view, navigate, personaType, personaDev, personaCreator, openPersonaPicker, clearPersona } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const personaName = personaType === 'developer' ? personaDev?.name : personaCreator?.channelName

  return (
    <header className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-2 rounded-md px-1 py-1 transition hover:opacity-80"
          aria-label="ShipMates home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
            <Handshake className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">ShipMates</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.view}
              variant={view === item.view ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate(item.view)}
              className="font-medium"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {personaType ? (
            <div className="flex items-center gap-1.5 rounded-full border bg-white py-1 pl-1 pr-2 shadow-sm">
              <InitialsAvatar
                name={personaType === 'developer' ? personaDev!.name : personaCreator!.name}
                variant={personaType}
                size="sm"
              />
              <span className="hidden max-w-28 truncate text-xs font-medium sm:inline" title={personaName}>
                {personaName}
              </span>
              <button
                onClick={clearPersona}
                className="rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                aria-label="Switch persona"
                title="Switch persona"
              >
                <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Button size="sm" onClick={openPersonaPicker} className="font-semibold">
              Enter platform
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="text-base font-bold">ShipMates</SheetTitle>
              <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.view}
                    variant={view === item.view ? 'secondary' : 'ghost'}
                    className={cn('justify-start font-medium')}
                    onClick={() => {
                      navigate(item.view)
                      setMobileOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
