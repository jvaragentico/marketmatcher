// Shared types between API and client components

export interface Developer {
  id: string
  name: string
  title: string
  bio: string
  location: string
  timezone: string
  skills: string[]
  niches: string[]
  hourlyRate: number
  availability: string
  experienceLevel: string
  portfolioUrl: string | null
  githubUrl: string | null
  pastWork: string
  rating: number
  projectsDone: number
}

export interface Creator {
  id: string
  name: string
  channelName: string
  platform: string
  niche: string
  subscribers: number
  avgViews: number
  bio: string
  location: string
  timezone: string
  lookingFor: string
  skillsNeeded: string[]
  budgetMin: number
  budgetMax: number
  contentUrl: string | null
  rating: number
  collabsDone: number
}

export interface Project {
  id: string
  creatorId: string
  title: string
  description: string
  skillsNeeded: string[]
  niche: string
  budgetMin: number
  budgetMax: number
  timeline: string
  status: string
  createdAt: string
  creator?: Creator
  applicationCount?: number
}

export interface Match {
  id: string
  developerId: string
  creatorId: string
  initiatedBy: 'developer' | 'creator'
  message: string
  status: 'pending' | 'accepted'
  createdAt: string
  developer?: Developer
  creator?: Creator
}

export interface Application {
  id: string
  projectId: string
  developerId: string
  message: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  developer?: Developer
  project?: Project
}

export interface PlatformStats {
  developers: number
  creators: number
  projects: number
  matches: number
  applications: number
  totalAudienceReached: number
}

export type PersonaType = 'developer' | 'creator'

export interface Persona {
  type: PersonaType
  profile: Developer | Creator
}
