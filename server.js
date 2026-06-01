const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const { isSessionValid, deleteSession } = require('./lib/db/sessions');
const { addMessage, getMessages } = require('./lib/db/messages');
const { addNote, getNotes } = require('./lib/db/notes');
const { addLink, getLinks } = require('./lib/db/links');
const { addFile, getFiles } = require('./lib/db/files');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-session', ({ sessionId, displayName }) => {
      if (!isSessionValid(sessionId)) {
        socket.emit('error', { message: 'Invalid session' });
        return;
      }
      
      socket.join(sessionId);
      
      const messages = getMessages(sessionId);
      const notes = getNotes(sessionId);
      const links = getLinks(sessionId);
      const files = getFiles(sessionId);
      
      socket.emit('session-data', { messages, notes, links, files });
      socket.to(sessionId).emit('participant-joined', { displayName });
    });

    socket.on('send-message', ({ sessionId, content, sender }) => {
      const message = addMessage(sessionId, content, sender);
      io.to(sessionId).emit('new-message', message);
    });

    socket.on('add-note', ({ sessionId, content, createdBy }) => {
      const note = addNote(sessionId, content, createdBy);
      io.to(sessionId).emit('new-note', note);
    });

    socket.on('add-link', ({ sessionId, url, title, createdBy }) => {
      const link = addLink(sessionId, url, title, createdBy);
      io.to(sessionId).emit('new-link', link);
    });

    socket.on('file-uploaded', ({ sessionId, file }) => {
      const f = addFile(sessionId, file.filename, file.url, file.size, file.uploadedBy);
      io.to(sessionId).emit('new-file', f);
    });

    socket.on('pin-note', ({ sessionId, id, pinned }) => {
      const pinNote = require('./lib/db/notes').pinNote;
      pinNote(id, sessionId, pinned);
      const updatedNotes = getNotes(sessionId);
      io.to(sessionId).emit('notes-updated', updatedNotes);
    });

    socket.on('close-session', ({ sessionId }) => {
      if (isSessionValid(sessionId)) {
        deleteSession(sessionId);
        io.to(sessionId).emit('session-closed');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer.io = io;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});