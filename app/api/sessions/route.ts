import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession, isSessionValid } from '@/lib/db/sessions';

export async function POST(request: NextRequest) {
  const session = createSession();
  return NextResponse.json(session);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  if (!isSessionValid(sessionId)) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  const session = getSession(sessionId);
  return NextResponse.json({ valid: true, ...session });
}
