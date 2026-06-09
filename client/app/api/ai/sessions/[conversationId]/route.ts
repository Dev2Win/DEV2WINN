import { NextRequest } from 'next/server';

const AI_URL = process.env.AI_URL ?? 'http://127.0.0.1:8000';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  const userId = req.nextUrl.searchParams.get('user_id') ?? 'demo-user';
  const upstream = await fetch(
    `${AI_URL}/v1/agent/users/${encodeURIComponent(userId)}/sessions/${encodeURIComponent(conversationId)}`,
  );

  const body = await upstream.json().catch(() => ({}));
  return Response.json(body, { status: upstream.status });
}
