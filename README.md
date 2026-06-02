# Relay

A lightweight, temporary collaboration session tool for collecting files, links, notes, and chat from multiple people in one place.

## Core Concept

**"Start a session. Share a link. Collect everything. Close it cleanly."**

Relay is designed to solve the temporary coordination problem — when a group needs to collect everything for one short-lived project, event, meeting, class assignment, case competition, trip, handoff, or file drop.

## Features

### MVP Features
- **Create session** - Start a new collaboration session with a unique link
- **Shareable invite link** - Share the session URL with participants
- **Guest join flow** - Join with just a display name (no account required)
- **File uploads** - Upload and share files within a session
- **Link submissions** - Paste and share URLs
- **Notes** - Add shared notes with pinning support
- **Real-time chat** - Simple group chat using Socket.IO
- **Pinned items** - Highlight important notes
- **Activity feed** - See all session activity in chronological order
- **Participant list** - See who's in the session
- **Session expiration** - Sessions automatically expire after 24 hours
- **Close session** - End sessions cleanly

### Permission Modes (Planned)
- Anyone with link can view and upload
- Upload-only mode
- View-only mode
- Require passcode
- Host approval before submissions appear
- Disable downloads
- Lock session
- Close session

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: SQLite (via better-sqlite3)
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS (inline styles)
- **File Storage**: Local filesystem (uploads directory)

## Database Schema

- **sessions** - Session metadata with expiration
- **messages** - Chat messages
- **notes** - Shared notes with pinning support
- **links** - Submitted URLs
- **files** - Uploaded file metadata
- **activity_events** - (Planned) Session activity tracking
- **pins** - (Planned) Pinned item references
- **participants** - (Planned) Participant tracking

## Session Lifecycle

```
Open → Collect → Organize → Closeout
```

### Closeout Features (Planned)
- Downloadable zip of all uploads
- Link list export
- Chat transcript
- Notes summary
- Upload log
- Final selected files
- Optional archive page

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

```bash
pnpm install
```

### Development

```bash
node server.js
```

Or alternatively:

```bash
npx tsx server.js
```

The application will be available at `http://localhost:3000`

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
/app
  /api
    /sessions       - Session creation and validation endpoints
    /upload         - File upload handling
    /files          - File serving
  /session
    /[id]           - Session page with tabs for chat, files, links, notes, activity
/components         - Shared UI components
/hooks
  useSocket.ts      - Socket.IO client hook for real-time updates
/lib
  /db
    index.ts        - Database initialization and schema
    sessions.ts     - Session CRUD operations
    messages.ts     - Message operations
    notes.ts        - Note operations
    links.ts        - Link operations
    files.ts        - File operations
/public              - Static assets
/relay.db            - SQLite database file
/uploads             - Uploaded files storage
server.js            - Next.js + Socket.IO server entry point
```

## API Endpoints

### POST /api/sessions
Create a new session. Returns `{ id, expiresAt }`.

### GET /api/sessions?id={sessionId}
Validate a session. Returns `{ valid, id, created_at, expires_at }`.

## Design Principles

- **Not AI-first** - Focus on human collaboration
- **Not a full productivity platform** - Avoid complexity
- **Not a project management system** - No tasks, calendars, or dashboards
- **Not permanent** - Everything is temporary and disposable
- **Frictionless** - Useful within 60 seconds
- **Fast & clean** - Minimal interface, maximum utility

## Roadmap

- [ ] Session permissions configuration
- [ ] Session export/zip download
- [ ] Activity feed improvements
- [ ] Pinned section view
- [ ] Session archiving
- [ ] Optional host authentication (Supabase Auth)
- [ ] Supabase integration for production deployment

## License

MIT

## Deployment Notes

### Railway (primary app host)

Relay should run as a long-lived Node process on Railway because the app uses a custom Next.js server, Socket.IO WebSockets, SQLite, and local upload storage. Railway should use the normal npm lifecycle:

```bash
npm ci
npm run build
npm start
```

`npm start` runs `node server.js`, which starts the custom Next.js + Socket.IO server and binds to Railway's `PORT` environment variable.

### Vercel (domain handoff)

Vercel serverless functions are not the primary runtime for this app because the real-time Socket.IO server and local SQLite/upload filesystem need a persistent Node process. To keep a Vercel-linked domain usable, this repository includes a Vercel static handoff build that redirects visitors to the Railway app instead of trying to run the full Relay server on Vercel.

In Vercel, set one of these environment variables to the Railway public URL, then redeploy:

- `RELAY_PRIMARY_URL` (recommended)
- `NEXT_PUBLIC_RELAY_PRIMARY_URL`
- `RAILWAY_PUBLIC_URL`
- `RAILWAY_PUBLIC_DOMAIN`

Example value:

```txt
https://your-relay-service.up.railway.app
```

The Vercel build command is `npm run build:vercel`, which writes a static page to `vercel-static/`. Any path on the Vercel domain is routed to that page, and the page preserves the original path/query/hash when redirecting to Railway.
