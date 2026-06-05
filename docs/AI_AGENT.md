# Dev2Win AI Mentor Agent ("24/7 Mentor")

> Design for the AI agent in `apps/ai` (FastAPI + Claude API, custom tool loop).
> Last reviewed 2026-06-04. Pairs with [plan.md](../plan.md) Phase 8.

The AI mentor is an always-available assistant that **acts on the platform** via
tools — booking sessions, fetching the mentee's roadmap, looking up mentors,
summarizing progress, and answering questions from course content (RAG). It is
**not** a generic chatbot: tools are invoked **as and when needed**, and the whole
system is engineered for **token efficiency** and cost control.

---

## 1. Goals & non-goals
**Goals:** personalized, accountable guidance; do real actions; cite course
content; escalate to a human mentor when appropriate; stay within a token/cost budget.
**Non-goals:** replace human mentors; give unsafe/financial/medical advice; act
outside the user's permissions.

---

## 2. Why Claude API + custom tool loop
- **Token-level control** (we own context assembly, caching, compaction).
- **Tool-use** via Anthropic's `tool_use`/`tool_result` cycle.
- **Prompt caching** for the system prompt, tool schemas, and stable context.
- **Model routing** (Haiku for cheap/simple turns, Sonnet/Opus for hard reasoning).

> Build with the **claude-api** skill conventions (prompt caching on by default,
> latest models: Opus 4.8 `claude-opus-4-8`, Sonnet 4.6 `claude-sonnet-4-6`,
> Haiku 4.5 `claude-haiku-4-5-20251001`).

---

## 3. Architecture

```
web (SSE chat) ──► apps/ai  FastAPI  /v1/agent/chat (stream)
                     │
                     ├─ Context builder ──► RAG (Qdrant) + user state (via api tools)
                     ├─ Token budgeter (Redis) ── per-user/session caps
                     ├─ Claude Messages API (prompt caching, model routing)
                     └─ Tool loop:
                          tool_use → execute tool → tool_result → continue
                              │
                              └─ tools call back into apps/api (signed JWT)
```

- **Stateless per request**; conversation state is persisted (summarized) and
  reloaded. Streaming responses via **SSE**.
- Tools that mutate (e.g., `book_session`) go through `apps/api` so all business
  rules, authz, and stored procedures apply — the agent never touches the DB directly.

---

## 4. The tool loop (custom)

```python
# sketch (apps/ai/agent/loop.py)
messages = build_initial_context(user, conversation)   # cached blocks first
while True:
    resp = claude.messages.create(
        model=route_model(turn_difficulty),
        system=SYSTEM_PROMPT,                  # cache_control: ephemeral
        tools=tool_schemas,                    # cache_control: ephemeral
        messages=messages,
        max_tokens=cap_for(user),
        stream=True,
    )
    if resp.stop_reason == "tool_use":
        for call in resp.tool_calls:
            if not budget.allow(user, call): break
            result = registry.execute(call, ctx)        # calls apps/api
            messages.append(tool_result(call.id, trim(result)))
        continue            # loop again with tool results
    else:
        persist_and_stream(resp)
        break
```

Key points:
- **Tools only when needed** — Claude decides; we don't pre-call. Keep tool schemas
  lean (good descriptions, minimal params) so they're cheap to include and reason about.
- **Trim tool results** before feeding back (return ids + summaries, not full rows).
- **Budget gate** each tool call and each turn.

---

## 5. Tool registry (initial set)

| Tool | Purpose | Mutates? | Backed by |
|------|---------|----------|-----------|
| `get_roadmap` | Fetch the mentee's course roadmap + progress | no | `api` lms |
| `summarize_progress` | Summarize what the mentee has done/next steps | no | `api` lms |
| `lookup_mentor` | Find/explain a matched mentor | no | `api` matching |
| `course_qa` (RAG) | Answer from course content with citations | no | Qdrant + content |
| `book_session` | Book a session with a mentor (idempotent) | **yes** | `api` bookings |
| `create_reminder` | Schedule a nudge/notification | **yes** | `api` notifications |
| `escalate_to_human` | Hand off to a human mentor | **yes** | `api` chat/notifications |

- Each tool = JSON schema (params) + handler + authz scope + budget cost.
- Mutating tools require explicit user confirmation in the UI before execution.
- Add new tools via the [add-ai-tool skill](../.claude/skills/add-ai-tool/SKILL.md).

---

## 6. RAG over course content
- Course modules/submodules + curated resources are **chunked + embedded** into
  **Qdrant** (worker job; re-embed on content change).
- `course_qa` retrieves top-k chunks, passes only those (with source ids) to Claude,
  and the agent **cites sources**. Retrieval beats stuffing the whole curriculum
  into context (token efficiency + accuracy).

---

## 7. Token-efficiency system (first-class requirement)

1. **Prompt caching** — mark the system prompt, tool schemas, and stable
   long-lived context with `cache_control` so repeat turns are cheap.
2. **Context compaction** — keep recent turns verbatim; **summarize older turns**
   into a rolling summary stored with the conversation. Reload summary + last N turns.
3. **Retrieval over stuffing** — never dump roadmaps/course text; fetch slices via
   tools/RAG and **trim** results before re-feeding.
4. **Model routing** — classify turn difficulty: small talk / lookups → **Haiku**;
   reasoning/planning → **Sonnet**; rare deep cases → **Opus**.
5. **Per-user / per-session budgets** — token + cost caps tracked in **Redis**;
   soft-warn then hard-stop with a graceful message; daily reset; admin overrides.
6. **Output caps** — `max_tokens` sized to the task; stream so users see progress.
7. **Tool result minimization** — return ids + concise summaries, expand only on demand.
8. **Caching answers** — cache deterministic RAG answers (content + query hash).
9. **Batch/off-peak** — non-interactive jobs (digests, embeddings) use Batch API /
   workers, not the interactive path.

**Cost observability:** log tokens (input/cached/output) + model + cost per turn;
Grafana dashboard for cost-per-user and cache-hit-rate; alert on anomalies.

---

## 8. Safety & guardrails
- **System prompt** defines scope (tech-career mentoring), tone, and refusals
  (no medical/legal/financial advice; escalate sensitive topics).
- **Authz**: agent acts only within the user's permissions; mutations re-checked by `api`.
- **PII**: minimize what's sent to the model; redact where possible.
- **Confirmation** for mutating actions; full **audit log** of tool calls.
- **Escalation** path to a human mentor; clear "this is an AI" disclosure.
- **Eval set** of prompts to catch regressions (helpfulness, safety, tool-use correctness).

---

## 9. API
- `POST /v1/agent/chat` (SSE stream) — `{ conversationId, message }` → streamed
  tokens + tool-call events. Service-JWT + user session required.
- `POST /v1/match` — matching endpoint (see [MATCHING_ALGORITHM.md](./MATCHING_ALGORITHM.md)).
- Internal: tool handlers call `apps/api` with short-lived signed JWT.

---

## 10. Rollout (plan.md Phase 8)
1. Spike: bare tool loop + 2 read-only tools (`get_roadmap`, `course_qa`) + caching.
2. Add budgeting + compaction + model routing.
3. Add mutating tools (`book_session`, `create_reminder`) with confirmation + audit.
4. RAG hardening + citations + eval set.
5. Cost dashboards + guardrail review before GA.
