import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { isSessionValid } from '@/lib/db/sessions';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const [sessionId, filename] = resolvedParams.path;

  if (!sessionId || !filename) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  if (!isSessionValid(sessionId)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 404 });
  }

  try {
    const filepath = join(process.cwd(), 'uploads', sessionId, filename);
    const file = await readFile(filepath);
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
