'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Developer, PersonaType, Creator } from '@/lib/types'

export type View = 'landing' | 'discover' | 'listings' | 'dashboard'

interface AppState {
  view: View
  personaType: PersonaType | null
  personaDev: Developer | null
  personaCreator: Creator | null
  personaPickerOpen: boolean
  navigate: (view: View) => void
  setPersona: (type: PersonaType, dev: Developer | null, creator: Creator | null) => void
  clearPersona: () => void
  openPersonaPicker: () => void
  closePersonaPicker: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'landing',
      personaType: null,
      personaDev: null,
      personaCreator: null,
      personaPickerOpen: false,
      navigate: (view) => {
        set({ view })
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      },
      setPersona: (type, dev, creator) =>
        set({ personaType: type, personaDev: dev, personaCreator: creator, personaPickerOpen: false }),
      clearPersona: () => set({ personaType: null, personaDev: null, personaCreator: null }),
      openPersonaPicker: () => set({ personaPickerOpen: true }),
      closePersonaPicker: () => set({ personaPickerOpen: false }),
    }),
    {
      name: 'shipmates-state',
      // Only persist the persona & view — transient dialog state stays in memory.
      partialize: (state) => ({
        view: state.view,
        personaType: state.personaType,
        personaDev: state.personaDev,
        personaCreator: state.personaCreator,
      }),
    }
  )
)
