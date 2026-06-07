import { NextRequest } from 'next/server';

const AI_URL = process.env.AI_URL ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const upstream = await fetch(`${AI_URL}/v1/rag/documents`, {
    method: 'POST',
    headers: {
      authorization: req.headers.get('authorization') ?? '',
    },
    body: form,
  });

  const body = await upstream.json().catch(() => ({}));
  return Response.json(body, { status: upstream.status });
}
