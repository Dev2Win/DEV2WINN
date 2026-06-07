import { NextRequest } from 'next/server';

const AI_URL = process.env.AI_URL ?? 'http://127.0.0.1:8000';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id') ?? 'demo-user';
  const upstream = await fetch(`${AI_URL}/v1/agent/users/${encodeURIComponent(userId)}/sessions`);
  return proxyJson(upstream);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const upstream = await fetch(
    `${AI_URL}/v1/agent/users/${encodeURIComponent(body.user_id)}/sessions/${encodeURIComponent(
      body.conversation_id,
    )}`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: body.name }),
    },
  );
  return proxyJson(upstream);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const upstream = await fetch(
    `${AI_URL}/v1/agent/users/${encodeURIComponent(body.user_id)}/sessions/${encodeURIComponent(
      body.conversation_id,
    )}`,
    { method: 'DELETE' },
  );
  return proxyJson(upstream);
}

async function proxyJson(upstream: Response) {
  const body = await upstream.json().catch(() => ({}));
  return Response.json(body, { status: upstream.status });
}
