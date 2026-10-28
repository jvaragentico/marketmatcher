'use client'

import { useCallback, useEffect, useState } from 'react'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { Landing } from './landing'
import { Discover } from './discover'
import { Listings } from './listings'
import { Dashboard } from './dashboard'
import { PersonaDialog } from './persona-dialog'
import { ProfileDialog } from './profile-dialog'
import { ConnectDialog } from './connect-dialog'
import { useAppStore } from '@/lib/store'
import type { Developer, Creator, Project, Match, Application, PlatformStats } from '@/lib/types'

interface ProfileTarget {
  developer: Developer | null
  creator: Creator | null
}

export function AppShell() {
  const { view, personaType } = useAppStore()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  const [profileTarget, setProfileTarget] = useState<ProfileTarget | null>(null)
  const [connectTarget, setConnectTarget] = useState<{ type: 'developer' | 'creator'; developer: Developer | null; creator: Creator | null } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [devRes, creRes, projRes, matchRes, appRes, statsRes] = await Promise.all([
        fetch('/api/developers'),
        fetch('/api/creators'),
        fetch('/api/projects'),
        fetch('/api/matches'),
        fetch('/api/applications'),
        fetch('/api/stats'),
      ])
      const [dev, cre, proj, match, app, st] = await Promise.all([
        devRes.json(), creRes.json(), projRes.json(), matchRes.json(), appRes.json(), statsRes.json(),
      ])
      setDevelopers(dev.developers ?? [])
      setCreators(cre.creators ?? [])
      setProjects(proj.projects ?? [])
      setMatches(match.matches ?? [])
      setApplications(app.applications ?? [])
      setStats(st)
    } catch {
      // Keep previous data on transient errors; views show their own empty states.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openProfile = (target: ProfileTarget) => setProfileTarget(target)

  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />

      <main className="flex-1">
        {view === 'landing' && (
          <Landing stats={stats} developers={developers} creators={creators} onOpenProfile={openProfile} />
        )}
        {view === 'discover' && (
          <Discover
            developers={developers}
            creators={creators}
            loading={loading}
            onOpenProfile={openProfile}
          />
        )}
        {view === 'listings' && (
          <Listings
            projects={projects}
            developers={developers}
            loading={loading}
            onDataChanged={fetchData}
            onOpenCreatorProfile={(creator) => openProfile({ developer: null, creator })}
          />
        )}
        {view === 'dashboard' && (
          <Dashboard
            matches={matches}
            applications={applications}
            projects={projects}
            developers={developers}
            creators={creators}
            onOpenProfile={openProfile}
          />
        )}
      </main>

      <SiteFooter />

      <PersonaDialog developers={developers} creators={creators} />

      <ProfileDialog
        developer={profileTarget?.developer ?? null}
        creator={profileTarget?.creator ?? null}
        onClose={() => setProfileTarget(null)}
        onConnect={() => {
          if (profileTarget?.developer && personaType === 'creator') {
            setConnectTarget({ type: 'developer', developer: profileTarget.developer, creator: null })
          } else if (profileTarget?.creator && personaType === 'developer') {
            setConnectTarget({ type: 'creator', developer: null, creator: profileTarget.creator })
          }
          setProfileTarget(null)
        }}
      />

      <ConnectDialog
        target={connectTarget}
        onClose={() => setConnectTarget(null)}
        onConnected={fetchData}
      />
    </div>
  )
}
