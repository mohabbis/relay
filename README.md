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