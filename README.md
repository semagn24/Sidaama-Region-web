# Sidama Regional State website

A full-stack Next.js App Router application backed by PostgreSQL.

## Requirements

- Node.js 20.19+ or 22.12+
- Docker Desktop (or a local PostgreSQL 15+ server)

## Run locally

1. Copy `.env.example` to `.env`. Adjust `DATABASE_URL` if your PostgreSQL credentials differ.
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

The `npm run dev` command starts the PostgreSQL container and then the Next.js
application.

The website and API are available at <http://localhost:5173>. API routes live
under `/api`; the first database-backed request creates the tables and inserts
starter news and service records. PostgreSQL must be reachable for those
routes. The AI assistant does not require the database.

Useful commands:

- `npm run db` — start the PostgreSQL database container
- `npm run build` — production-build the Next.js website
- `npm run lint` — lint the Next.js website
- `npm run dev --workspace client` — run Next.js without starting Docker

Next.js API routes read `DATABASE_URL`, `GEMINI_API_KEY`, and `GEMINI_MODEL`
from the root `.env` file. Keep `GEMINI_API_KEY` server-side.

## Sidama Regional State AI assistant

The website assistant uses Gemini to answer questions in English, Amharic, or
Sidaamu Afoo. Gemini Google Search grounding lets it search the wider web and
return links to the web sources used. Selected site content is provided as
background, but is not the only permitted source. Visitors should verify
current or official information against the linked sources; generated
translations, especially Sidaamu Afoo, may need review by a fluent speaker.

To enable it:

1. Create a Gemini API key in Google AI Studio.
2. Set `GEMINI_API_KEY` in the root `.env` file. Keep the key server-side; do
   not put it in client-side code.
3. Optionally set `GEMINI_MODEL` to another text-generation model enabled for
   your API key. The default is the stable `gemini-3.1-flash-lite` model.
4. Restart Next.js. Without the key, the assistant displays a setup message.

`POST /api/chat` accepts a JSON `question` of up to 1000 characters and an
optional `language` (`en`, `am`, or `sid`). It allows 50 requests per client IP
per hour. Gemini API quotas and billing may apply.
Google Search grounding availability and charges depend on the Gemini API
account and model. If the assistant reports an exhausted quota, check the
Gemini API project’s usage, billing, and Google Search grounding quota; code
changes cannot raise provider-side limits.

## API

- `GET /api/health` — API and database health
- `GET /api/news` — published news
- `GET /api/news/:id` — a published news story
- `GET /api/services` — public services
- `POST /api/chat` — grounded multilingual Sidama AI assistant
- `POST /api/contact` — submit a contact message (`name`, `email`, `subject`,
  `message`)

Contact submissions are stored in PostgreSQL. An administrator workflow, user
accounts, file uploads, and production translation content are not included yet.
