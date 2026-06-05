---
name: add-ai-tool
description: Use when giving the Dev2Win AI mentor agent a new capability/tool (apps/ai). Defines the tool JSON schema, handler (calling apps/api over signed JWT), authz scope, budget cost, confirmation rules for mutations, and an eval case. Trigger on "add a tool to the agent", "let the AI do X", "agent should be able to Y".
---

# Add an AI Agent Tool (Dev2Win mentor agent)

Tools let the agent **act on the platform**. They are called **only when needed**
by Claude's tool-use loop. Keep them lean and token-efficient. Full design:
[docs/AI_AGENT.md](../../../docs/AI_AGENT.md).

## Steps
1. **Decide read vs mutate.** Mutating tools (book, remind, escalate) require
   **user confirmation** in the UI and re-validation by `server/`. The agent never
   touches the DB directly — tools call `server/` with a short-lived signed JWT.

2. **Define the JSON schema** in the tool registry (`ai/app/agent/tools/`):
   - Clear, minimal params (every param costs tokens + reasoning).
   - A precise `description` — this is how Claude decides when to use it.

3. **Implement the handler**:
   - Call the relevant `server/` endpoint (authz enforced there).
   - **Trim the result** before returning to the model (ids + concise summary, not
     full rows). Expand only on explicit follow-up.

4. **Set authz scope + budget cost** — register the tool's `mutates` flag and a
   `budget_cost` weight (see `ai/app/agent/tools/__init__.py`) so the budget gate
   (Redis) can throttle it.

5. **Confirmation + audit** — for mutations, gate behind UI confirmation and write
   an audit-log entry of the tool call (who/what/when/result).

6. **RAG tools** — retrieve top-k from Qdrant and pass only those chunks with source
   ids; the agent must cite sources.

7. **Add an eval case** to the agent eval set (does Claude pick this tool when it
   should? correct params? safe?).

8. **Track** — update [task.md](../../../task.md) Phase 8.

## Token-efficiency rules (always)
- Lean schema + sharp description (cheap to include via prompt caching).
- Return summaries, not dumps. Cache deterministic results where possible.
- Don't pre-call tools; let the loop decide.

## Checklist
- [ ] Read vs mutate decided (confirmation + audit if mutate)
- [ ] JSON schema (minimal params, precise description)
- [ ] Handler calls server/ (signed JWT) + trims result
- [ ] Authz scope + budget cost registered
- [ ] Eval case added
- [ ] task.md updated
