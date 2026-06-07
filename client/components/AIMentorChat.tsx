'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ToolEvent = {
  name: string;
  result?: unknown;
};

type LearnerSkill = {
  skill: string;
  mastery_probability: number;
};

type ChatSession = {
  conversation_id: string;
  name: string;
  turn_count: number;
};

const starterPrompts = [
  'Build me a frontend roadmap for React and TypeScript.',
  'Find a mentor fit for a junior backend learner.',
  'What course lesson should I study next?',
];

export function AIMentorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'I can help with roadmaps, LMS questions, mentor matching, session planning, and progress next steps.',
    },
  ]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('demo-user');
  const [sessionId, setSessionId] = useState(`session-${Date.now()}`);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>([]);
  const [learnerSkills, setLearnerSkills] = useState<LearnerSkill[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const conversationId = useRef(sessionId);

  const history = useMemo(
    () =>
      messages.slice(-10).map((message) => ({
        role: message.role,
        content: message.content,
      })),
    [messages],
  );

  useEffect(() => {
    void loadSessions(userId);
  }, [userId]);

  async function loadSessions(activeUserId = userId) {
    const response = await fetch(`/api/ai/sessions?user_id=${encodeURIComponent(activeUserId.trim() || 'demo-user')}`);
    if (!response.ok) return;
    const body = await response.json();
    setSessions(Array.isArray(body.sessions) ? body.sessions : []);
  }

  function startNewChat() {
    const nextId = `session-${Date.now()}`;
    setSessionId(nextId);
    conversationId.current = nextId;
    setMessages([
      {
        role: 'assistant',
        content:
          'I can help with roadmaps, LMS questions, mentor matching, session planning, and progress next steps.',
      },
    ]);
    setToolEvents([]);
    setLearnerSkills([]);
  }

  function selectSession(session: ChatSession) {
    setSessionId(session.conversation_id);
    conversationId.current = session.conversation_id;
    setMessages([
      {
        role: 'assistant',
        content: `Loaded chat: ${session.name}`,
      },
    ]);
    setToolEvents([]);
  }

  async function renameSession(session: ChatSession) {
    const name = window.prompt('Rename chat', session.name);
    if (!name?.trim()) return;
    await fetch('/api/ai/sessions', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        user_id: userId.trim() || 'demo-user',
        conversation_id: session.conversation_id,
        name: name.trim(),
      }),
    });
    await loadSessions();
  }

  async function deleteSession(session: ChatSession) {
    const confirmed = window.confirm(`Delete "${session.name}"?`);
    if (!confirmed) return;
    await fetch('/api/ai/sessions', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        user_id: userId.trim() || 'demo-user',
        conversation_id: session.conversation_id,
      }),
    });
    if (session.conversation_id === conversationId.current) startNewChat();
    await loadSessions();
  }

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || pending) return;

    setInput('');
    setPending(true);
    setToolEvents([]);
    conversationId.current = sessionId.trim() || conversationId.current;
    setMessages((current) => [...current, { role: 'user', content: trimmed }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          user_id: userId.trim() || 'demo-user',
          conversation_id: conversationId.current,
          message: trimmed,
          history,
        }),
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message ?? 'AI mentor service is unavailable.');
      }

      const result = await readSseResponse(response.body);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: result.message || 'I could not produce a response for that turn.',
        },
      ]);
      setToolEvents(Array.isArray(result.tool_events) ? result.tool_events : []);
      setLearnerSkills(Array.isArray(result.learner?.skills) ? result.learner.skills : []);
      await loadSessions();
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: err instanceof Error ? err.message : 'AI mentor service is unavailable.',
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  async function uploadDocument() {
    if (!selectedFile || uploading) return;
    setUploading(true);
    conversationId.current = sessionId.trim() || conversationId.current;

    const form = new FormData();
    form.append('file', selectedFile);
    form.append('user_id', userId.trim() || 'demo-user');
    form.append('conversation_id', conversationId.current);
    form.append('title', selectedFile.name);
    form.append('chunk_tokens', '750');
    form.append('overlap_tokens', '100');

    try {
      const response = await fetch('/api/ai/documents', {
        method: 'POST',
        body: form,
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.detail ?? body?.error?.message ?? 'Document upload failed.');
      }
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: `Uploaded ${body.filename}; indexed ${body.inserted} document chunks for this chat.`,
        },
      ]);
      setSelectedFile(null);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: err instanceof Error ? err.message : 'Document upload failed.',
        },
      ]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6">
        <header className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">Dev2Win AI Mentor</h1>
            <p className="mt-1 text-sm text-slate-600">Roadmaps, LMS help, matching, and next steps.</p>
          </div>
          <div className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            AI service
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-4 py-4 lg:grid-cols-[1fr_280px]">
          <div className="flex min-h-[620px] flex-col overflow-hidden rounded border border-slate-200 bg-white">
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[78%] rounded bg-slate-900 px-3 py-2 text-sm leading-6 text-white'
                        : 'max-w-[78%] rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-800'
                    }
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {pending ? (
                <div className="inline-flex rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Thinking...
                </div>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="border-t border-slate-200 p-3">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept=".txt,.md,.markdown,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  className="min-h-10 flex-1 rounded border border-slate-300 px-2 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => void uploadDocument()}
                  disabled={!selectedFile || uploading}
                  className="min-h-10 rounded border border-slate-300 px-3 text-sm font-medium text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {uploading ? 'Uploading...' : 'Attach'}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  className="min-h-11 flex-1 rounded border border-slate-300 px-3 text-sm outline-none focus:border-slate-700"
                  placeholder="Ask about your roadmap, a course topic, or mentor fit"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="min-h-11 rounded bg-slate-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded border border-slate-200 bg-white p-3">
              <h2 className="text-sm font-semibold">Session</h2>
              <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium text-slate-600" htmlFor="user-id">
                  User
                </label>
                <input
                  id="user-id"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  className="min-h-9 w-full rounded border border-slate-300 px-2 text-sm outline-none focus:border-slate-700"
                />
                <label className="block text-xs font-medium text-slate-600" htmlFor="session-id">
                  Chat session
                </label>
                <input
                  id="session-id"
                  value={sessionId}
                  onChange={(event) => setSessionId(event.target.value)}
                  className="min-h-9 w-full rounded border border-slate-300 px-2 text-sm outline-none focus:border-slate-700"
                />
                <button
                  type="button"
                  onClick={startNewChat}
                  className="mt-2 min-h-9 w-full rounded bg-slate-950 px-3 text-sm font-medium text-white"
                >
                  New chat
                </button>
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-white p-3">
              <h2 className="text-sm font-semibold">Chats</h2>
              <div className="mt-3 space-y-2">
                {sessions.length ? (
                  sessions.map((session) => (
                    <div
                      key={session.conversation_id}
                      className="rounded border border-slate-200 p-2 text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => selectSession(session)}
                        className="block w-full truncate text-left font-medium text-slate-800"
                      >
                        {session.name}
                      </button>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => void renameSession(session)}
                          className="text-xs font-medium text-slate-600 underline"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteSession(session)}
                          className="text-xs font-medium text-red-600 underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No saved chats yet.</p>
                )}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-white p-3">
              <h2 className="text-sm font-semibold">Start With</h2>
              <div className="mt-3 space-y-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-400"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-white p-3">
              <h2 className="text-sm font-semibold">Tool Activity</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {toolEvents.length ? (
                  toolEvents.map((event, index) => (
                    <div key={`${event.name}-${index}`} className="rounded bg-slate-50 px-2 py-1">
                      {event.name}
                    </div>
                  ))
                ) : (
                  <p>No tools used in the latest turn.</p>
                )}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-white p-3">
              <h2 className="text-sm font-semibold">Learning Model</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {learnerSkills.length ? (
                  learnerSkills.slice(0, 5).map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex items-center justify-between gap-2">
                        <span>{skill.skill.replaceAll('_', ' ')}</span>
                        <span>{Math.round(skill.mastery_probability * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded bg-slate-100">
                        <div
                          className="h-1.5 rounded bg-emerald-500"
                          style={{ width: `${Math.round(skill.mastery_probability * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No learner signals yet.</p>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

async function readSseResponse(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let latest: any = {};

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';
    for (const event of events) {
      const dataLine = event
        .split('\n')
        .find((line) => line.startsWith('data: '));
      if (!dataLine) continue;
      const payload = dataLine.slice(6);
      if (payload === '{}') continue;
      latest = JSON.parse(payload);
    }
  }

  return latest;
}
