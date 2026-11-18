# Sidaama Region Web Portal & Digital Hub

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4?logo=google)](https://ai.google.dev/)
[![Localization](https://img.shields.io/badge/Languages-Sidaamu%20Afoo%20%7C%20%E1%8X%80%E1%88%9B%E1%88%AD%E1%8A%9B%20%7C%20English-darkgreen)](#multilingual-support)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

A modern, full-stack digital web portal and community platform dedicated to showcasing the rich cultural heritage, vibrant economy, world-renowned coffee origin, tourism destinations, and administrative services of the **Sidama Regional State** in southern Ethiopia.

Equipped with a native **multilingual interface** (Sidaamu Afoo, Amharic, English), a **PostgreSQL-backed data layer**, and an interactive **Google Gemini-powered AI regional assistant** with live Google Search grounding.

---

## Table of Contents

- [Core Pillars & Key Features](#core-pillars--key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started Locally](#getting-started-locally)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Configuration](#environment-configuration)
- [Sidama AI Regional Assistant](#sidama-ai-regional-assistant)
- [REST API Reference](#rest-api-reference)
- [Media Assets & Optimization](#media-assets--optimization)
- [Strategic Feature Roadmap](#strategic-feature-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Core Pillars & Key Features

### 1. Cultural Heritage & Living Traditions
- **Fichee–Chambalaalla**: Dedicated celebration guides and cultural insights for the UNESCO-inscribed Sidama New Year festival.
- **Indigenous Governance**: Showcasing traditional democratic institutions including the *Luwa* generational age-grade system and the *Seera* social justice code.
- **Gastronomy & Agriculture**: Celebrating *Wesse* (Enset / false banana) farming, traditional preparation methods, and ecological sustainability.

### 2. Tourism & Attractions
- **Lake Hawassa & Natural Wonders**: Exploration guides for Lake Hawassa, Mount Tabor, Logita Falls, and Loka Abaya National Park.
- **Ecotourism & Hot Springs**: Highlighting wellness destinations in Wondo Genet, Yirgalem, and lush highland rainforest trails.

### 3. Specialty Coffee & Economic Growth
- **Birthplace of Specialty Arabica**: Showcasing Sidama's world-famous washed and natural micro-lots, farmer cooperatives, and harvest traditions.
- **Trade & Regional Investment**: Highlighting agriculture, manufacturing, agro-processing, and the Hawassa Industrial Park.

### 4. Grounded AI Assistant (Gemini)
- In-browser interactive assistant answering resident and visitor inquiries in **Sidaamu Afoo**, **Amharic**, or **English**.
- Employs **Google Search Grounding** to provide live verification, citations, and up-to-date web sources.

### 5. Multilingual & Mobile-First
- Fast, client-side language switcher supporting **Sidaamu Afoo (Afan Sidama)**, **Amharic (አማርኛ)**, and **English**.
- Fully responsive design optimized for mobile screens (360px–414px) through large desktop monitors with zero layout shifts.

---

## Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Styling & UI** | Custom Responsive CSS Design System, CSS Variables, Typography for Ethiopic and Latin scripts |
| **Backend & APIs** | Next.js API Route Handlers (`/api/*`), Node.js 20/22 |
| **Database** | [PostgreSQL 15+](https://www.postgresql.org/) with automated schema migration & connection pooling |
| **Artificial Intelligence** | [Google Gemini 3.1 Flash](https://ai.google.dev/) via `@google/genai` with Search Grounding |
| **Containerization** | [Docker Compose](https://docs.docker.com/compose/) for one-command local database orchestration |

---

## Project Directory Structure

```text
Sidaama-Region-web/
├── docker-compose.yml         # Container configuration for PostgreSQL
├── package.json               # Root workspaces configuration & npm scripts
├── package-lock.json          # Deterministic dependency lockfile
├── .env.example               # Environment variables template
├── .gitignore                 # Root Git ignore rules (node_modules, .env, build output)
├── README.md                  # Comprehensive project documentation
└── client/                    # Next.js App Router workspace
    ├── package.json           # Client dependencies and Next.js scripts
    ├── next.config.js         # Next.js build & runtime configuration
    ├── schema.sql             # PostgreSQL tables (news, services, contact_submissions)
    ├── lib/
    │   ├── db.js              # PostgreSQL client connection pooling & health checks
    │   └── assistant-knowledge.js # Regional background data for AI grounding
    ├── app/
    │   ├── layout.jsx         # Root HTML layout with viewport & metadata
    │   ├── [[...slug]]/       # Dynamic Next.js catch-all page router
    │   └── api/
    │       └── [...segments]/ # Unified REST API handler (health, news, services, chat)
    ├── src/
    │   ├── App.jsx            # Core SPA portal component, views, & language provider
    │   └── site.css           # Custom design system with mobile-first media queries
    └── public/                # Static assets, branding, and regional photography
        ├── favicon.svg        # Sidama crest favicon
        ├── icons.svg          # SVG iconography sprite
        ├── sidama-mark.svg    # Official regional seal
        ├── fichee-chambalaalla.png     # Fichee-Chambalaalla festival photo
        ├── sidama-coffee-harvest.png   # Sidama coffee harvesting photo
        └── sidama-coffee-landscape.png # Highland landscape photo
```

---

## Getting Started Locally

### Prerequisites

- **Node.js**: `v20.19+` or `v22.12+`
- **Docker Desktop** (or a local PostgreSQL server)
- **Git**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/semagn24/Sidaama-Region-web.git
   cd Sidaama-Region-web
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *(See [Environment Configuration](#environment-configuration) below).*

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   *This command starts the PostgreSQL container via Docker Compose and launches Next.js.*

5. Open your browser and navigate to **`http://localhost:5173`**.

---

### Environment Configuration

In your `.env` file at the root of the project:

```env
# PostgreSQL connection string (matches docker-compose.yml defaults)
DATABASE_URL=postgresql://sidama:sidama_dev@localhost:5432/sidama_regional_state

# Google Gemini API Key for the AI regional assistant
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) Model override (defaults to gemini-3.1-flash-lite)
GEMINI_MODEL=gemini-3.1-flash-lite
```

> **Security Note:** Never commit `.env` containing your real `GEMINI_API_KEY` to public repositories.

---

## Sidama AI Regional Assistant

The portal includes an AI assistant designed to answer citizen and tourist inquiries in **English**, **Amharic**, or **Sidaamu Afoo**.

- **Grounding**: Queries use Google Search Grounding to complement the regional knowledge base with up-to-date information and source citations.
- **Safety & Rate Limiting**: The `/api/chat` route includes built-in rate-limiting (50 requests/hour per client IP) and server-side credential isolation.
- **Keyless Fallback**: When `GEMINI_API_KEY` is not present, the assistant displays a friendly setup notice while allowing all other portal features to function seamlessly.

---

## REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health status of the API and PostgreSQL connection |
| `/api/news` | `GET` | Retrieve published regional announcements and stories |
| `/api/news/:id` | `GET` | Fetch a single news article by its ID |
| `/api/services` | `GET` | List available citizen, business, and tourism services |
| `/api/chat` | `POST` | Chat with the grounded AI assistant (`{ question, language }`) |
| `/api/contact` | `POST` | Submit a public inquiry (`{ name, email, subject, message }`) |

---

## Media Assets & Optimization

The repository includes high-resolution imagery celebrating regional culture:
- `fichee-chambalaalla.png` (Celebrations and cultural attire)
- `sidama-coffee-harvest.png` (Coffee cherries harvesting)
- `sidama-coffee-landscape.png` (Sidama scenic agroforestry)

**Optimization Recommendation**:
For high-bandwidth production environments, serve modern `.webp` or `.avif` formats with progressive loading to ensure sub-second page loads over mobile cellular networks.

---

## Strategic Feature Roadmap

### Phase 1 — Immediate Polish & Deployment
- [x] Comprehensive, production-grade documentation (`README.md`).
- [x] Full-stack Next.js App Router and PostgreSQL integration.
- [x] Multilingual interface (Sidaamu Afoo, Amharic, English).
- [ ] Add Next.js OpenGraph / Twitter meta tags and automated sitemap generation.
- [ ] Automated WebP compression pipeline for media assets.

### Phase 2 — Enhanced Interactive Tourism & Culture
- [ ] **Interactive Leaflet/Mapbox Map**: Geographic markers for Hawassa, Yirgalem, Aleta Wondo, Bensaa, and regional coffee washing stations.
- [ ] **Cultural Audio & Pronunciation Guide**: Audio clips for common Sidaamu Afoo greetings, phrases, and festival chants.
- [ ] **Tourist Itinerary Planner**: Interactive 1-day, 3-day, and 7-day travel itinerary builder.

### Phase 3 — E-Government & Citizen Services
- [ ] Citizen service application tracking and status portal.
- [ ] Role-based administration dashboard for regional bureau updates and press releases.
- [ ] Offline-first Progressive Web App (PWA) support for rural accessibility.

---

## Contributing

Contributions, content translations, and feature suggestions are welcome!

1. Fork the Project
2. Create your Feature Branch: `git checkout -b feature/NewFeature`
3. Commit your Changes: `git commit -m "Add NewFeature"`
4. Push to the Branch: `git push origin feature/NewFeature`
5. Open a Pull Request

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.
