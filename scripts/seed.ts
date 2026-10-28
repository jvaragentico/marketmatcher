import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const developers = [
  {
    name: 'Maya Chen', title: 'Full-Stack SaaS Engineer', location: 'San Francisco, US', timezone: 'PT (UTC-8)',
    skills: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind'],
    niches: ['Dev Tools', 'SaaS & Startups', 'AI & ML'],
    hourlyRate: 85, availability: 'Part-time', experienceLevel: 'Senior',
    portfolioUrl: 'mayachen.dev', githubUrl: '@mayacodes',
    bio: 'Ex-Stripe engineer who builds polished SaaS dashboards, landing pages and billing flows. I help creators turn their tools into products their audience can actually buy.',
    pastWork: 'Shipped a founder-tooling dashboard for a 400K-sub dev-tools YouTuber; rebuilt a newsletter creator\'s paid subscription stack (Stripe + webhooks) used by 12K subscribers.',
    rating: 4.9, projectsDone: 23,
  },
  {
    name: 'Diego Ramírez', title: 'Audio & DSP Developer', location: 'Barcelona, ES', timezone: 'CET (UTC+1)',
    skills: ['C++', 'JUCE', 'Python', 'Web Audio API', 'Rust'],
    niches: ['Music Production', 'Podcasting'],
    hourlyRate: 70, availability: 'Weekends', experienceLevel: 'Senior',
    portfolioUrl: 'diegoaudio.com', githubUrl: '@dr-dsp',
    bio: 'I build audio plugins, real-time effects and browser-based audio tools. Former plugin-company intern turned freelance DSP engineer with a taste for weird sound design.',
    pastWork: 'Built a custom browser-based vocal chain used in a 90K-listener music-production podcast; shipped two paid VST plugins featured by producer channels.',
    rating: 4.8, projectsDone: 11,
  },
  {
    name: 'Tom Okafor', title: 'Mobile Developer (React Native)', location: 'London, UK', timezone: 'GMT (UTC+0)',
    skills: ['React Native', 'Expo', 'Swift', 'Kotlin', 'Firebase'],
    niches: ['Fitness & Health', 'Productivity', 'Education'],
    hourlyRate: 65, availability: 'Part-time', experienceLevel: 'Mid-level',
    portfolioUrl: 'tomokafor.io', githubUrl: '@tombuilds',
    bio: 'I ship cross-platform mobile apps fast — App Store setup, push notifications, offline sync, the unglamorous bits included. Love working with creators launching companion apps.',
    pastWork: 'Launched a habit-tracking app with a 300K-sub productivity YouTuber (50K downloads in month one); maintain a fitness app for an Instagram trainer.',
    rating: 4.7, projectsDone: 15,
  },
  {
    name: 'Anya Petrova', title: 'AI & LLM Integration Engineer', location: 'Berlin, DE', timezone: 'CET (UTC+1)',
    skills: ['Python', 'LangChain', 'OpenAI API', 'FastAPI', 'RAG Pipelines', 'Docker'],
    niches: ['AI & ML', 'Education', 'SaaS & Startups'],
    hourlyRate: 110, availability: 'Full-time', experienceLevel: 'Lead',
    portfolioUrl: 'anyapetrova.ai', githubUrl: '@anya-ai',
    bio: 'I help creators add real AI features — chatbots trained on their content, semantic search, auto-clip pipelines. Former ML platform lead, now building for the creator economy.',
    pastWork: 'Built a "chat with my back catalog" bot for a 320K-sub AI newsletter (1M+ messages served); automated clip-selection pipeline for a Twitch streamer, saving 10 hrs/week.',
    rating: 5.0, projectsDone: 19,
  },
  {
    name: 'Jake Morrison', title: 'Game Developer (Unity / Godot)', location: 'Austin, US', timezone: 'CT (UTC-6)',
    skills: ['Unity', 'C#', 'Godot', 'Shader Graph', 'Steam SDK'],
    niches: ['Indie Games', 'Retro Gaming'],
    hourlyRate: 60, availability: 'Part-time', experienceLevel: 'Mid-level',
    portfolioUrl: 'jakemakes.games', githubUrl: '@jakeships',
    bio: 'Indie game dev who has shipped 4 titles on Steam and itch.io. I co-build playable demos with gaming creators — prototypes, game-jam speedruns, Steam pages that convert.',
    pastWork: 'Co-developed a retro platformer demo played live on a 780K-sub TikTok channel (2.3M views); built Steam launch toolkit for a game-review channel.',
    rating: 4.6, projectsDone: 9,
  },
  {
    name: 'Priya Sharma', title: 'Automation & Integrations Engineer', location: 'Bengaluru, IN', timezone: 'IST (UTC+5:30)',
    skills: ['Python', 'Web Scraping', 'Zapier/n8n', 'Airtable API', 'Playwright'],
    niches: ['Marketing & Growth', 'SaaS & Startups', 'Finance & Investing'],
    hourlyRate: 45, availability: 'Full-time', experienceLevel: 'Senior',
    portfolioUrl: 'priya.sh', githubUrl: '@priya-automates',
    bio: 'I wire up the boring plumbing: scrapers, auto-posting pipelines, lead magnets, analytics dashboards. Creators call me "the ops department in one person".',
    pastWork: 'Built an auto-clipping + cross-posting pipeline for a 410K-sub growth channel; scraped and cleaned a 2M-row dataset behind a viral investing newsletter.',
    rating: 4.8, projectsDone: 31,
  },
  {
    name: 'Léo Dubois', title: 'Creative Developer (WebGL / Motion)', location: 'Paris, FR', timezone: 'CET (UTC+1)',
    skills: ['Three.js', 'WebGL', 'GSAP', 'React', 'Framer Motion'],
    niches: ['Design & Art', 'Dev Tools', 'Music Production'],
    hourlyRate: 90, availability: 'Part-time', experienceLevel: 'Senior',
    portfolioUrl: 'leodubois.design', githubUrl: '@leo-motion',
    bio: 'I build scroll-stopping interactive websites and product visualizations. If you want your portfolio site to look like an Apple keynote, I am your person.',
    pastWork: 'Built an interactive 3D gear showcase for a hardware YouTuber (140K subs); created award-nominated site for a design-tools review channel.',
    rating: 4.9, projectsDone: 17,
  },
  {
    name: 'Sam Whitfield', title: 'Desktop & Extensions Developer', location: 'Toronto, CA', timezone: 'ET (UTC-5)',
    skills: ['Electron', 'Chrome Extensions', 'TypeScript', 'Node.js', 'Tauri'],
    niches: ['Productivity', 'Dev Tools', 'Finance & Investing'],
    hourlyRate: 75, availability: 'Weekends', experienceLevel: 'Mid-level',
    portfolioUrl: 'samwhitfield.dev', githubUrl: '@samships',
    bio: 'I build the desktop tools creators dream up on stream: menu-bar apps, browser extensions, Electron wrappers. Quick to prototype, obsessive about polish.',
    pastWork: 'Shipped a menu-bar stock-ticker app with a finance YouTuber (8K paid users); built a research clipper extension used by a 320K-sub newsletter team.',
    rating: 4.7, projectsDone: 13,
  },
  {
    name: 'Hana Yoshida', title: 'Design Engineer', location: 'Tokyo, JP', timezone: 'JST (UTC+9)',
    skills: ['React', 'Tailwind', 'shadcn/ui', 'Figma', 'Next.js', 'Storybook'],
    niches: ['Design & Art', 'Education', 'Productivity'],
    hourlyRate: 80, availability: 'Part-time', experienceLevel: 'Senior',
    portfolioUrl: 'hanayoshida.jp', githubUrl: '@hana-dsgn',
    bio: 'Half designer, half engineer. I turn Figma chaos into accessible, beautiful front-ends. Specialists: design systems, course platforms, and landing pages that convert.',
    pastWork: 'Designed and built a course platform for a 195K-sub education creator (41% completion-rate lift); rebuilt design-channel brand site in 3 weeks.',
    rating: 4.9, projectsDone: 21,
  },
  {
    name: 'Marcus Bell', title: 'Backend & Bot Engineer (Go / Elixir)', location: 'Manchester, UK', timezone: 'GMT (UTC+0)',
    skills: ['Go', 'Elixir', 'Discord Bots', 'Telegram Bots', 'PostgreSQL', 'Redis'],
    niches: ['Retro Gaming', 'Indie Games', 'Crypto & Web3'],
    hourlyRate: 70, availability: 'Full-time', experienceLevel: 'Senior',
    portfolioUrl: 'marcusbell.dev', githubUrl: '@bell-backend',
    bio: 'I build the invisible infrastructure: Discord communities that moderate themselves, Telegram alert bots, APIs that survive traffic spikes from a viral video.',
    pastWork: 'Built a Discord economy bot for a 780K-sub retro-gaming community (80K active users); built rate-limit-hardened API for a newsletter that survived 3 viral spikes.',
    rating: 4.8, projectsDone: 26,
  },
]

const creators = [
  {
    name: 'Lena Torres', channelName: 'TechWithLena', platform: 'YouTube', niche: 'Dev Tools',
    subscribers: 890000, avgViews: 120000,
    location: 'Austin, US', timezone: 'CT (UTC-6)',
    lookingFor: 'A full-stack engineer to build and maintain "LaunchPad" — a SaaS tool my audience keeps asking for: project starter kits with a dashboard.',
    skillsNeeded: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    budgetMin: 3000, budgetMax: 6000,
    bio: 'I review dev tools for 890K subscribers. My audience of indie hackers keeps asking for a curated starter-kit product — I need a technical partner to build it with me.',
    contentUrl: 'youtube.com/@techwithlena', rating: 4.9, collabsDone: 6,
  },
  {
    name: 'Marcus "Pixel" Reed', channelName: 'PixelPapi', platform: 'TikTok', niche: 'Indie Games',
    subscribers: 1200000, avgViews: 450000,
    location: 'Atlanta, US', timezone: 'ET (UTC-5)',
    lookingFor: 'A Unity developer to co-create a playable demo series — we build a game live on stream over 8 weeks, audience votes on features.',
    skillsNeeded: ['Unity', 'C#', 'Shader Graph'],
    budgetMin: 2000, budgetMax: 4000,
    bio: '1.2M on TikTok watching indie games get made and broken. My "you design, I build" series needs an actual builder. Revenue share on the final game available.',
    contentUrl: 'tiktok.com/@pixelpapi', rating: 4.7, collabsDone: 3,
  },
  {
    name: 'Devon Park', channelName: 'TheSoloDev', platform: 'YouTube', niche: 'SaaS & Startups',
    subscribers: 240000, avgViews: 55000,
    location: 'Seattle, US', timezone: 'PT (UTC-8)',
    lookingFor: 'A part-time full-stack dev to help build in public — my SaaS (content-repurposing tool) needs auth, billing and an API before the next milestone video.',
    skillsNeeded: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
    budgetMin: 1500, budgetMax: 3000,
    bio: '240K people watch me build a SaaS from zero. Shipping velocity is the whole show — I need someone who can take tickets fast and appear (anonymously) in my videos.',
    contentUrl: 'youtube.com/@thesolodev', rating: 4.8, collabsDone: 4,
  },
  {
    name: 'Priya Nair', channelName: 'AudioGeek Radio', platform: 'Podcast', niche: 'Music Production',
    subscribers: 85000, avgViews: 20000,
    location: 'Mumbai, IN', timezone: 'IST (UTC+5:30)',
    lookingFor: 'A DSP developer to build a free browser-based "mix checker" tool for listeners — a lead magnet that actually works with mobile browsers.',
    skillsNeeded: ['Web Audio API', 'JavaScript', 'Python'],
    budgetMin: 1000, budgetMax: 2500,
    bio: '85K weekly listeners, all producers and mixing nerds. I want to launch a web tool that analyzes your mix and suggests fixes — it becomes the flagship freebie of the show.',
    contentUrl: 'audiogeek.fm', rating: 4.6, collabsDone: 2,
  },
  {
    name: 'Mandy Chen', channelName: 'MakerMandy', platform: 'Twitch', niche: 'AI & ML',
    subscribers: 140000, avgViews: 8000,
    location: 'Vancouver, CA', timezone: 'PT (UTC-8)',
    lookingFor: 'An ML engineer to build "clip-wizard": auto-detect highlight moments from my VODs and export vertical clips with captions, ready for TikTok.',
    skillsNeeded: ['Python', 'OpenAI API', 'FFmpeg', 'Machine Learning'],
    budgetMin: 2500, budgetMax: 5000,
    bio: 'I stream AI-assisted hardware and software builds to 140K people. Editing clips eats 12 hours of my week — I would rather spend it streaming. Let us automate it live.',
    contentUrl: 'twitch.tv/makermandy', rating: 4.9, collabsDone: 5,
  },
  {
    name: 'Oliver Grant', channelName: 'AIExplained Daily', platform: 'Newsletter', niche: 'AI & ML',
    subscribers: 320000, avgViews: 95000,
    location: 'New York, US', timezone: 'ET (UTC-5)',
    lookingFor: 'An AI engineer to build an interactive archive: readers chat with five years of newsletter issues and get cited answers. Hybrid RAG, or something better.',
    skillsNeeded: ['LangChain', 'RAG Pipelines', 'Python', 'OpenAI API'],
    budgetMin: 3000, budgetMax: 7000,
    bio: '320K subscribers read my daily AI briefing. The archive is the moat — 1,800 issues of deep analysis. I want to make it queryable, cited, and honestly, magical.',
    contentUrl: 'aiexplained.email', rating: 5.0, collabsDone: 7,
  },
  {
    name: 'Sofia Marino', channelName: 'ChefByte', platform: 'YouTube', niche: 'Food & Cooking Tech',
    subscribers: 560000, avgViews: 210000,
    location: 'Milan, IT', timezone: 'CET (UTC+1)',
    lookingFor: 'A full-stack developer to build a recipe-scaler web app: adjust servings, auto-generate shopping lists, convert units — branded to my channel.',
    skillsNeeded: ['React', 'Next.js', 'Tailwind', 'PostgreSQL'],
    budgetMin: 2000, budgetMax: 4500,
    bio: '560K subscribers cook my recipes. Every comment asks "can you scale this for 12 people?" — I want a beautiful tool that does it for them, with my affiliate pantry in it.',
    contentUrl: 'youtube.com/@chefbyte', rating: 4.8, collabsDone: 3,
  },
  {
    name: 'Rachel Kim', channelName: 'GrowthHacked', platform: 'YouTube', niche: 'Marketing & Growth',
    subscribers: 410000, avgViews: 88000,
    location: 'Los Angeles, US', timezone: 'PT (UTC-8)',
    lookingFor: 'An automation engineer to productize my growth-playbook workflow: scrape leads, enrich, auto-outreach sequences — the exact stack I teach in videos.',
    skillsNeeded: ['Python', 'Web Scraping', 'Zapier/n8n', 'Airtable API'],
    budgetMin: 2500, budgetMax: 5000,
    bio: '410K founders watch my growth teardowns. I sell playbooks; I want to sell the machine that runs them. Need someone to make the demos real and keep them running.',
    contentUrl: 'youtube.com/@growthhacked', rating: 4.7, collabsDone: 6,
  },
  {
    name: 'Chris Doyle', channelName: 'RetroRewind', platform: 'TikTok', niche: 'Retro Gaming',
    subscribers: 780000, avgViews: 380000,
    location: 'Dublin, IE', timezone: 'GMT (UTC+0)',
    lookingFor: 'A backend developer for our 80K-member Discord: economy bot, ROM-hack night events, moderation that scales. The community IS the product now.',
    skillsNeeded: ['Discord Bots', 'Go', 'PostgreSQL', 'Redis'],
    budgetMin: 1200, budgetMax: 2800,
    bio: '780K TikTok followers nostalgic for the 90s. My Discord is where they actually live — 80K members and it is held together with duct tape and volunteer mods. Help.',
    contentUrl: 'tiktok.com/@retrorewind', rating: 4.6, collabsDone: 4,
  },
  {
    name: 'Aisha Bello', channelName: 'FitDev Life', platform: 'Instagram', niche: 'Fitness & Health',
    subscribers: 195000, avgViews: 35000,
    location: 'Lagos, NG', timezone: 'WAT (UTC+1)',
    lookingFor: 'A mobile developer to launch my training-app MVP: program builder, progress photos, wearable sync. iOS + Android from one codebase, please.',
    skillsNeeded: ['React Native', 'Expo', 'Firebase'],
    budgetMin: 2000, budgetMax: 4000,
    bio: '195K followers follow my athlete-engineer lifestyle. My DMs are full of "when does the app drop?" — Q3 is the target. Course revenue is already funding this.',
    contentUrl: 'instagram.com/@fitdevlife', rating: 4.8, collabsDone: 2,
  },
]

const projects = [
  { c: 0, title: 'Build "LaunchPad" — starter-kit SaaS for indie hackers', description: 'MVP for a curated Next.js starter-kit product: marketing site, dashboard, license-key checkout with Stripe, and docs. My audience of 890K dev-tools fans is pre-validated — 14K voted yes in a poll. 6-week build, then revenue share option.', skillsNeeded: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'], budgetMin: 3000, budgetMax: 6000, timeline: '6 weeks' },
  { c: 0, title: 'Sponsor analytics dashboard for channel partners', description: 'Internal dashboard showing sponsor ROI across my videos: views, CTR, conversion per campaign. Clean UI, exports to PDF for sponsor calls.', skillsNeeded: ['React', 'Recharts', 'Node.js'], budgetMin: 1500, budgetMax: 3000, timeline: '2-3 weeks' },
  { c: 1, title: '8-week "build a game live" TikTok series', description: 'Co-create a retro arcade game on stream. You handle Unity dev between streams, I handle hype. Audience votes features weekly. Final game revenue share 30%.', skillsNeeded: ['Unity', 'C#'], budgetMin: 2000, budgetMax: 4000, timeline: '8 weeks' },
  { c: 2, title: 'Ship billing + API for content-repurposing SaaS', description: 'My build-in-public SaaS has 2K waitlist users. Need Stripe billing (usage-based), public API with keys, and auth hardening before the milestone video in 3 weeks.', skillsNeeded: ['Node.js', 'Stripe', 'React'], budgetMin: 1500, budgetMax: 3000, timeline: '3 weeks' },
  { c: 3, title: 'Browser-based mix-checker tool (lead magnet)', description: 'Web Audio API tool that analyzes an uploaded track and flags frequency masking, clipping and LUFS levels. Mobile-first — most listeners are on phones. Design assets ready.', skillsNeeded: ['Web Audio API', 'JavaScript', 'UI Design'], budgetMin: 1000, budgetMax: 2500, timeline: '4 weeks' },
  { c: 4, title: 'Auto-clip pipeline: VOD highlights to vertical clips', description: 'Python service that watches my Twitch VODs, finds highlight moments (chat spike + audio energy), cuts vertical clips with burned captions. Batch upload to TikTok/YT Shorts APIs.', skillsNeeded: ['Python', 'FFmpeg', 'OpenAI API'], budgetMin: 2500, budgetMax: 5000, timeline: '4-5 weeks' },
  { c: 5, title: 'RAG archive: chat with 1,800 newsletter issues', description: 'Hybrid search (keyword + semantic) over my full newsletter archive, with inline citations linking back to issues. Streaming chat UI, ~95% answer accuracy target on eval set.', skillsNeeded: ['LangChain', 'RAG Pipelines', 'Python'], budgetMin: 3000, budgetMax: 7000, timeline: '5-6 weeks' },
  { c: 6, title: 'Recipe-scaler web app with shopping lists', description: 'Public web app: paste any of my 300 recipes, scale servings, unit conversion (metric/imperial), generate shareable shopping list. SEO matters — each recipe gets an indexable page.', skillsNeeded: ['Next.js', 'React', 'Tailwind'], budgetMin: 2000, budgetMax: 4500, timeline: '5 weeks' },
  { c: 8, title: 'Discord economy bot + event system for 80K members', description: 'Rewrite the duct-taped Discord bot: XP economy, ROM-hack night signups, anti-raid moderation, mod dashboard. Go or Elixir — it must survive front-page TikTok spikes.', skillsNeeded: ['Discord Bots', 'Go', 'PostgreSQL'], budgetMin: 1200, budgetMax: 2800, timeline: '4 weeks' },
]

async function main() {
  console.log('Seeding database...')
  await db.application.deleteMany()
  await db.match.deleteMany()
  await db.project.deleteMany()
  await db.creator.deleteMany()
  await db.developer.deleteMany()

  const createdDevs = []
  for (const d of developers) {
    createdDevs.push(await db.developer.create({
      data: {
        name: d.name, title: d.title, bio: d.bio, location: d.location, timezone: d.timezone,
        skills: JSON.stringify(d.skills), niches: JSON.stringify(d.niches),
        hourlyRate: d.hourlyRate, availability: d.availability, experienceLevel: d.experienceLevel,
        portfolioUrl: d.portfolioUrl, githubUrl: d.githubUrl, pastWork: d.pastWork,
        rating: d.rating, projectsDone: d.projectsDone,
      },
    }))
  }

  const createdCreators = []
  for (const c of creators) {
    createdCreators.push(await db.creator.create({
      data: {
        name: c.name, channelName: c.channelName, platform: c.platform, niche: c.niche,
        subscribers: c.subscribers, avgViews: c.avgViews, bio: c.bio,
        location: c.location, timezone: c.timezone, lookingFor: c.lookingFor,
        skillsNeeded: JSON.stringify(c.skillsNeeded), budgetMin: c.budgetMin, budgetMax: c.budgetMax,
        contentUrl: c.contentUrl, rating: c.rating, collabsDone: c.collabsDone,
      },
    }))
  }

  for (const p of projects) {
    await db.project.create({
      data: {
        creatorId: createdCreators[p.c].id, title: p.title, description: p.description,
        skillsNeeded: JSON.stringify(p.skillsNeeded), niche: creators[p.c].niche,
        budgetMin: p.budgetMin, budgetMax: p.budgetMax, timeline: p.timeline,
      },
    })
  }

  // A few pre-existing matches to make the dashboard feel alive
  await db.match.create({
    data: {
      developerId: createdDevs[0].id, creatorId: createdCreators[2].id, initiatedBy: 'creator',
      message: 'Devon here — your Stripe work on the founder dashboard is exactly what TheSoloDev needs. Interested in a 3-week sprint?',
      status: 'accepted',
    },
  })
  await db.match.create({
    data: {
      developerId: createdDevs[3].id, creatorId: createdCreators[5].id, initiatedBy: 'developer',
      message: 'I built almost exactly this for another newsletter (1M+ messages served). Happy to walk you through the eval results.',
      status: 'pending',
    },
  })
  await db.match.create({
    data: {
      developerId: createdDevs[9].id, creatorId: createdCreators[8].id, initiatedBy: 'creator',
      message: 'Hey Marcus — the community would love you. Can you start with the moderation module?',
      status: 'accepted',
    },
  })
  await db.match.create({
    data: {
      developerId: createdDevs[5].id, creatorId: createdCreators[7].id, initiatedBy: 'developer',
      message: 'I built the auto-clipping pipeline for a 410K-sub channel last year — happy to show a live demo of my stack.',
      status: 'pending',
    },
  })

  // A few applications on open projects
  const launchpad = await db.project.findFirst({ where: { title: { contains: 'LaunchPad' } } })
  if (launchpad) {
    await db.application.create({
      data: {
        projectId: launchpad.id, developerId: createdDevs[0].id,
        message: 'This is squarely in my zone — I shipped a near-identical license-key + dashboard stack last year. Can start in 2 weeks.',
        status: 'pending',
      },
    })
  }
  const autoclip = await db.project.findFirst({ where: { title: { contains: 'Auto-clip pipeline' } } })
  if (autoclip) {
    await db.application.create({
      data: {
        projectId: autoclip.id, developerId: createdDevs[5].id,
        message: 'My previous pipeline ran for 14 months on a similar-sized channel. Demo available on request.',
        status: 'pending',
      },
    })
  }

  const devCount = await db.developer.count()
  const creatorCount = await db.creator.count()
  const projectCount = await db.project.count()
  console.log(`Seeded ${devCount} developers, ${creatorCount} creators, ${projectCount} projects + matches/applications.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
