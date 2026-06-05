# Setup & Local Development

## Prerequisites
- **Node.js** 18+ (Next.js 15)
- **Yarn** (repo pins `yarn@1.22.19`) or npm
- A **MongoDB** connection (Atlas or local)
- **Clerk** application (keys + webhook secret)
- **Stream** Video application (API key + secret)

## 1. Install

```bash
yarn install
# or
npm install
```

## 2. Environment variables

Create `.env.local` in the project root:

```bash
# Database
MONGODB_URL="mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
WEBHOOK_SECRET="whsec_..."          # Clerk → svix webhook signing secret

# Stream Video
NEXT_PUBLIC_STREAM_API_KEY="..."
STREAM_SECRET_KEY="..."

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

> The Mongoose connection currently hardcodes db name **`testing-mentee`** in
> `lib/db.ts`. Change it there (or refactor to an env var) for other environments.

## 3. Configure Clerk webhook

1. In the Clerk dashboard → **Webhooks**, add an endpoint pointing to
   `https://<your-domain>/api/webhooks/clerk` (use a tunnel like ngrok for local).
2. Subscribe to `user.created` (and `user.updated`).
3. Copy the signing secret into `WEBHOOK_SECRET`.

This is required for new users to be written into MongoDB and for
`sessionClaims.userId` to be populated.

## 4. Run

```bash
yarn dev      # start Next.js dev server on http://localhost:3000
yarn build    # production build
yarn start    # run production build
yarn lint     # eslint
```

## 5. Chat server (optional / not included)

`components/chat/useChat.ts` expects a **Socket.io** server at
`http://localhost:3001`. There is no such server in this repo, so chat is
currently non-functional. To enable it you must build/run a separate socket
service (or migrate chat to Stream Chat). See [ROADMAP.md](./ROADMAP.md).

## 6. Project scripts (`package.json`)

| Script | Purpose |
|--------|---------|
| `dev` | Next.js dev server |
| `build` | Production build |
| `start` | Serve production build |
| `lint` | Run ESLint |

## 7. Tooling
- **ESLint** (`.eslintrc.json`) + **Prettier** (`.prettierrc`) with Tailwind plugin.
- **Tailwind** config in `tailwind.config.ts`; **PostCSS** with Mantine preset.
- **shadcn/ui** config in `components.json`.

## 8. Common gotchas
- Missing `WEBHOOK_SECRET` throws on the webhook route at runtime.
- Missing Stream keys throw inside the `tokenProvider` server action.
- Hardcoded URLs (`https://localhost:3000`, `localhost:3001`) will fail outside
  local dev — fix before deploying (see [TECH_DEBT.md](./TECH_DEBT.md)).
