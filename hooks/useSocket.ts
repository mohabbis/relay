import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/lib/db/messages';
import { Note } from '@/lib/db/notes';
import { Link } from '@/lib/db/links';
import { File } from '@/lib/db/files';

interface SessionData {
  messages: Message[];
  notes: Note[];
  links: Link[];
  files: File[];
}

interface Participant {
  id: string;
  name: string;
}

interface ParticipantJoined {
  displayName: string;
}

export function useSocket(sessionId: string, displayName: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
    });

    socketInstance.on('connect', () => {
      socketInstance.emit('join-session', { sessionId, displayName });
    });

    socketInstance.on('session-data', (data: SessionData) => {
      setMessages(data.messages);
      setNotes(data.notes);
      setLinks(data.links);
      setFiles(data.files);
      setParticipants([]);
    });

    socketInstance.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on('new-note', (note: Note) => {
      setNotes((prev) => [note, ...prev]);
    });

    socketInstance.on('new-link', (link: Link) => {
      setLinks((prev) => [link, ...prev]);
    });

    socketInstance.on('new-file', (file: File) => {
      setFiles((prev) => [file, ...prev]);
    });

    socketInstance.on('participant-joined', (data: ParticipantJoined) => {
      setParticipants((prev) => [...prev, { id: socketInstance.id, name: data.displayName }]);
    });

    socketInstance.on('session-closed', () => {
      window.location.href = '/';
    });

    socketInstance.on('notes-updated', (updatedNotes: Note[]) => {
      setNotes(updatedNotes);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [sessionId, displayName]);

  const sendMessage = (content: string) => {
    socket?.emit('send-message', { sessionId, content, sender: displayName });
  };

  const addNote = (content: string) => {
    socket?.emit('add-note', { sessionId, content, createdBy: displayName });
  };

  const addLink = (url: string, title: string | null) => {
    socket?.emit('add-link', { sessionId, url, title, createdBy: displayName });
  };

  const notifyFileUpload = (file: { filename: string; url: string; size: number; uploadedBy: string }) => {
    socket?.emit('file-uploaded', { sessionId, file });
  };

  const pinNote = (id: number, pinned: boolean) => {
    socket?.emit('pin-note', { sessionId, id, pinned });
  };

  return {
    messages,
    notes,
    links,
    files,
    participants,
    sendMessage,
    addNote,
    addLink,
    notifyFileUpload,
    pinNote,
  };
}