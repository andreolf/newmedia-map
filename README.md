<div align="center">

# 🗺️ New Media Map

**A living map of emerging Web3 voices, curated by signal and contribution—not followers.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/andreolf/newmedia-map)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

[Live Demo](https://newmedia-map.vercel.app) · [Submit a Creator](https://newmedia-map.vercel.app/submit)

</div>

---

## ✨ What is New Media Map?

New Media Map surfaces **emerging Web3 creators** based on the quality of their work—not vanity metrics. We prioritize:

- 🎯 **Signal over clout** — No follower counts, no engagement metrics
- 🌍 **Global by default** — Voices from every continent, not just the conference circuit
- 📦 **Artifact-first profiles** — Every creator is represented by their actual work
- 🤝 **Community validation** — Peer endorsements over self-promotion

## 🌐 Regional Chapters

Creators are organized into regional chapters, each curated by local community members:

| Chapter | Region | Description |
|---------|--------|-------------|
| 🌍 **New Media Africa** | Africa | Lagos to Nairobi, Cairo to Cape Town |
| 🌍 **New Media Europe** | Europe | Berlin, Lisbon, London, and beyond |
| 🌎 **New Media Americas** | Americas | São Paulo to Mexico City, Buenos Aires to Toronto |
| 🌏 **New Media Asia** | Asia | Tokyo, Singapore, Seoul, Mumbai |
| 🌍 **New Media MENA** | Middle East & North Africa | Dubai to Beirut, Riyadh to Casablanca |

## 🚀 Features

### For Explorers
- **Interactive Map** — Discover creators geographically with clustering
- **Smart Filters** — Filter by signal type, category, location, and more
- **Near You** — Find creators in your city for local collaboration
- **Bookmarks** — Save creators to revisit later
- **Dark/Light Mode** — Easy on the eyes, day or night

### For Creators
- **Proof of Work Profiles** — Showcase your articles, repos, videos, and podcasts
- **Chapter Affiliation** — Connect with your regional community
- **No Vanity Metrics** — Your work speaks for itself
- **Shareable Cards** — Beautiful cards for social sharing

### For Companies
- **Experience Drops** — Propose authentic collaboration opportunities
- **No Paid Promotion** — We don't sell placement or visibility
- **Signal Alignment** — Connect with creators who match your values

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://typescriptlang.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Maps:** [Leaflet](https://leafletjs.com) + [React Leaflet](https://react-leaflet.js.org)
- **Auth:** [NextAuth.js](https://next-auth.js.org) (Twitter/X OAuth)
- **Icons:** [Lucide React](https://lucide.dev)
- **Deployment:** [Vercel](https://vercel.com)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/andreolf/newmedia-map.git
cd newmedia-map

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables (Optional)

For authentication features, create a `.env.local` file:

```env
# NextAuth
AUTH_SECRET=your-random-secret-here
AUTH_TWITTER_ID=your-twitter-oauth-client-id
AUTH_TWITTER_SECRET=your-twitter-oauth-client-secret

# Supabase (optional, for database features)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── chapters/          # Regional chapter pages
│   ├── creators/          # Creator directory & profiles
│   ├── companies/         # Experience Drops for companies
│   ├── near-you/          # Local discovery
│   ├── map/               # Full-screen map view
│   └── ...
├── components/            # React components
│   ├── CreatorsMap.tsx   # Interactive Leaflet map
│   ├── CreatorCard.tsx   # Creator profile card
│   ├── Header.tsx        # Navigation header
│   └── ...
├── data/                  # Static JSON data
│   ├── creators.json     # Creator profiles
│   └── chapters.json     # Chapter definitions
├── lib/                   # Utilities and helpers
│   ├── chapters.ts       # Chapter data utilities
│   └── utils.ts          # General utilities
└── types/                 # TypeScript type definitions
```

## 🎨 Design Philosophy

### Signal Types

Creators are tagged with signal types that represent their focus areas:

| Signal | Description |
|--------|-------------|
| `defi` | DeFi protocols, yield, liquidity |
| `nft` | Digital art, collectibles, provenance |
| `gaming` | Web3 gaming, play-to-earn |
| `privacy` | Privacy tech, ZK proofs |
| `infra` | Infrastructure, tooling |
| `education` | Teaching, explainers |
| `research` | Academic, deep dives |
| `security` | Audits, vulnerability research |
| `wallets` | Self-custody, UX |
| `social` | Social protocols, identity |

### Categories

- **Build** — Creating tools, protocols, or infrastructure
- **Explain** — Breaking down complex topics
- **Apply** — Real-world Web3 use cases
- **Document** — Recording history and culture
- **Critique** — Constructive analysis and accountability

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Submit a Creator** — Know someone doing great work? [Submit them](https://newmedia-map.vercel.app/submit)
2. **Report Issues** — Found a bug? [Open an issue](https://github.com/andreolf/newmedia-map/issues)
3. **Improve Code** — PRs welcome for bug fixes and enhancements
4. **Curate a Chapter** — Want to curate your region? [Apply here](https://newmedia-map.vercel.app/submit)

## 📄 License

MIT License — feel free to fork and build upon this project.

---

<div align="center">

**Built with ❤️ for the emerging Web3 creator community**

[newmedia-map.vercel.app](https://newmedia-map.vercel.app)

</div>
