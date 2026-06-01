# Relay [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, temporary collaboration session tool for collecting files, links, notes, and chat from multiple people in one place.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-black?logo=socket.io)](https://socket.io/)

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

- **sessions** - `id`, `created_at`, `expires_at`
- **messages** - `id`, `session_id`, `content`, `sender`, `created_at`
- **notes** - `id`, `session_id`, `content`, `created_by`, `created_at`, `pinned`
- **links** - `id`, `session_id`, `url`, `title`, `created_by`, `created_at`
- **files** - `id`, `session_id`, `filename`, `url`, `size`, `uploaded_by`, `created_at`

All tables have indexes on `session_id` for fast queries. Sessions expire automatically.

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
# Using tsx (recommended for dev)
tsx server.js

# Or run directly with node (after build)
node server.js
```

The application will be available at `http://localhost:3000`

### Supabase Migration (Vercel-Compatible)
To deploy on Vercel, migrate to Supabase for:
- Database (PostgreSQL)
- Storage (file uploads)
- Realtime (replaces Socket.IO)
- Optional Auth

See `docs/supabase-migration.md` for details (coming soon).

> **Note**: The app uses `server.js` with Socket.IO for real-time functionality. Use `tsx` if running TypeScript DB modules directly.

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
    chat-panel.tsx    - Real-time chat component
    files-panel.tsx   - File upload/display component
    links-panel.tsx   - Link submission component
    notes-panel.tsx   - Shared notes component
    activity-feed.tsx - Activity timeline component
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
/uploads             - Uploaded files storage (created automatically)
server.js            - Next.js + Socket.IO server entry point
```

## API Endpoints

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sessions` | Create a new session. Returns `{ id, expiresAt }`. |
| `GET` | `/api/sessions?id={sessionId}` | Validate session. Returns `{ valid, id, created_at, expires_at }`. |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload?sessionId={id}` | Upload a file to a session |
| `GET` | `/api/files/[...path]/route` | Serve uploaded files |

### Socket.IO Events
| Event | Payload | Description |
|-------|---------|-------------|
| `join-session` | `{ sessionId, displayName }` | Join a session and receive initial data |
| `send-message` | `{ sessionId, content, sender }` | Send a chat message |
| `add-note` | `{ sessionId, content, createdBy }` | Add a shared note |
| `add-link` | `{ sessionId, url, title, createdBy }` | Submit a URL |
| `file-uploaded` | `{ sessionId, file }` | Notify of file upload |
| `pin-note` | `{ sessionId, id, pinned }` | Pin/unpin a note |
| `close-session` | `{ sessionId }` | Close/end a session |

## Demo

![Relay Demo](https://via.placeholder.com/800x400/f9fafb/6b7280?text=Relay+Session+Demo)

1. Click "Start a Session" on the home page
2. Share the session URL with participants
3. Each participant enters their name and joins
4. Use the tabs to chat, share files, links, and notes
5. Pin important notes for visibility
6. Session expires automatically after 24 hours

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Muhammad Rafiq** - [GitHub](https://github.com/mohabbis)

## Deployment

### ⚠️ Vercel Limitation
This app uses Socket.IO for real-time chat/activity which requires persistent WebSocket connections. **Vercel's serverless platform does not support persistent connections**, so real-time features will not work on Vercel.

### Recommended Platforms
For full functionality, deploy to platforms that support WebSockets:

| Platform | WebSocket Support | Notes |
|----------|-------------------|-------|
| **Railway** | ✅ | Easy deploy, good for MVP |
| **Render** | ✅ | Full WebSocket support |
| **Fly.io** | ✅ | Recommended for production |
| **DigitalOcean App Platform** | ✅ | Supports WebSockets |

### Railway Deployment
```bash
# Install Railway CLI
npm install -g railway

# Deploy
railway init
railway deploy
```

### Render Deployment
1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: relay
    env: node
    buildCommand: npm run build
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
```

### Docker Deployment
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package*.json ./
RUN npm install --omit dev
EXPOSE 3000
CMD ["node", "server.js"]
```

## License

MIT