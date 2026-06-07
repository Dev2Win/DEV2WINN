import { NextRequest } from 'next/server';

const AI_URL = process.env.AI_URL ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const upstream = await fetch(`${AI_URL}/v1/agent/chat`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: req.headers.get('authorization') ?? '',
    },
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return Response.json(
      {
        error: {
          code: 'AI_CHAT_FAILED',
          message: text || 'AI mentor service is unavailable.',
        },
      },
      { status: upstream.status || 502 },
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    },
  });
}
