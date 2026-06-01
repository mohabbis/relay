import { NextRequest, NextResponse } from 'next/server';
import { isSessionValid } from '@/lib/db/sessions';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const sessionId = formData.get('sessionId') as string;

  if (!file || !sessionId) {
    return NextResponse.json({ error: 'File and session ID required' }, { status: 400 });
  }

  if (!isSessionValid(sessionId)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 404 });
  }

  // Create upload directory
  const uploadDir = join(process.cwd(), 'uploads', sessionId);
  await mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop();
  const filename = `${nanoid(8)}.${ext}`;
  const filepath = join(uploadDir, filename);

  // Save file
  await writeFile(filepath, buffer);

  // Generate URL (in production, this would be a proper blob URL)
  const url = `/api/files/${sessionId}/${filename}`;

  return NextResponse.json({ 
    filename: file.name, 
    url, 
    size: file.size 
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if (!sessionId || !isSessionValid(sessionId)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 404 });
  }

  const files = await import('@/lib/db/files').then(m => m.getFiles(sessionId));
  return NextResponse.json(files);
}
