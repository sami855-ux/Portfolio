# Portfolio — React client + Node.js API

The project is split into two independently deployable applications:

```text
client/   React 19, Vite, React Query, admin dashboard
server/   Express 5, Prisma, PostgreSQL, JWT auth, Cloudinary uploads
```

Supabase is no longer used at runtime. The only Supabase-specific code left is
`server/scripts/import-supabase.ts`, a one-time migration tool that can be
deleted after the production data is copied.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- A Cloudinary account

## Local setup

Install both workspaces from the repository root:

```bash
npm install
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Fill in `server/.env`. Use a random value of at least 32 characters for
`JWT_SECRET` and a strong bootstrap password for `ADMIN_PASSWORD`.

Create the schema and initial admin:

```bash
npm run db:migrate
npm run db:seed
```

Start both applications:

```bash
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at
`http://localhost:4000`.

## Import existing Supabase data once

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `server/.env`, then run:

```bash
npm run db:import:supabase --workspace server
```

The importer copies projects, skills, journey items, contact links, floating
cards, messages, and profile settings while keeping their UUIDs. Existing image
URLs are preserved. New avatar and project uploads go through the authenticated
`POST /api/uploads/image` endpoint and are stored in Cloudinary.

Never expose the Supabase service-role key in `client/.env` or any `VITE_*`
variable. Remove it after the import.

## API overview

Public, cached reads:

- `GET /api/public/projects`
- `GET /api/public/skills`
- `GET /api/public/journey`
- `GET /api/public/contact-links`
- `GET /api/public/floating-cards`
- `GET /api/public/profile`
- `POST /api/public/messages` (validated and rate-limited)

Authentication:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/password`

Authenticated management:

- `GET|POST /api/admin/:resource`
- `PATCH|DELETE /api/admin/:resource/:id`
- `POST /api/uploads/image`

Allowed resources are strictly limited to the portfolio tables. Request bodies
are validated with Zod, passwords are hashed with bcrypt, and uploads accept
only JPEG, PNG, WebP, or AVIF images up to 8 MB.

## Verification

```bash
npm run build --workspace client
npm run build --workspace server
```

The client and server may be deployed separately. Set `VITE_API_URL` to the
public server URL (ending in `/api`) for the client deployment, and list the
client origin in the server's `CORS_ORIGINS`.
