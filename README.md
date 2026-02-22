<div align="center">

<img src="https://raw.githubusercontent.com/lydianai/lydianai/main/assets/logo/ailydian-banner.svg" alt="AiLydian" width="100%">

<br><br>

# NewsAI Earth

**Global News Intelligence Platform — Multi-Source AI Aggregation**

Real-time news intelligence across 100+ languages, 2.4M+ indexed queries, and 16 analytical modules powered by AI.

[\![Website](https://img.shields.io/badge/Live-newsai.earth-000000?style=for-the-badge&logo=safari&logoColor=white)](https://newsai.earth)
[\![License](https://img.shields.io/badge/License-Proprietary-blue?style=for-the-badge)](LICENSE)
[\![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[\![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)

</div>

---

## Overview

NewsAI Earth is an enterprise-grade global news intelligence platform that aggregates, analyzes, and synthesizes information from thousands of sources worldwide. Built with AI-first architecture, it delivers real-time sentiment analysis, trend detection, and multi-dimensional news insights.

**Key Metrics:**
- 2.4M+ indexed queries
- 100+ language support
- Multi-source aggregation (RSS, APIs, web scraping)
- Real-time AI analysis pipeline

---

## Platform Modules

| Module | Description |
|--------|-------------|
| **EarthBrief** | AI-curated global briefings with priority scoring |
| **Digital Twin** | Real-world event simulation and impact modeling |
| **Research Engine** | Deep-dive topic research with citation tracking |
| **Quantum Analysis** | Pattern recognition across massive news datasets |
| **AI Agents** | Autonomous news monitoring and alert agents |
| **Media Intelligence** | Cross-platform media coverage analysis |
| **Automation Hub** | Workflow automation for news monitoring pipelines |
| **Analytics** | Trend analysis, sentiment scoring, reader insights |
| **IoT Hub** | Real-world data integration with news correlation |
| **FutureBuilding** | Predictive intelligence and scenario modeling |

---

## Tech Stack

\![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
\![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
\![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
\![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
\![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
\![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
\![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## Quick Start

```bash
# Clone
git clone https://github.com/lydianai/newsai-earth.git
cd newsai-earth

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your API keys

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# AI & News APIs
OPENAI_API_KEY=
NEWS_API_KEY=
GNEWS_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://newsai.earth
```

---

## Architecture

```
newsai-earth/
├── app/              # Next.js App Router
│   ├── (modules)/    # 16 platform modules
│   ├── api/          # REST API endpoints
│   └── layout.tsx    # Root layout
├── components/       # Shared UI components
├── lib/              # Core utilities, AI clients, scrapers
├── prisma/           # Database schema & migrations
└── public/           # Static assets
```

---

## Security

- All API keys stored in environment variables (never committed)
- Next.js security headers configured
- Rate limiting on all API endpoints
- Input sanitization and XSS protection
- Secret scanning enabled via GitHub Advanced Security

Report vulnerabilities to [security@ailydian.com](mailto:security@ailydian.com)

---

## License

This project is proprietary software. All rights reserved by AiLydian.
See [LICENSE](LICENSE) for details.

---

<div align="center">
<sub>Built by <a href="https://ailydian.com">AiLydian</a> — Enterprise AI Platform Studio</sub>
</div>
