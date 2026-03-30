# Support Desk

Internal IT support portal built with Next.js, NextAuth, Prisma, and PostgreSQL.

## Why localhost felt slow

Two repo-level issues were contributing to slow local startup/build cycles:

- `npm run dev` used `next dev --turbo` by default. Turbopack can be faster on some apps, but in mixed server/client apps like this it can also be the source of slower or less predictable local compilation. The default dev script now uses plain `next dev`, and `dev:turbo` remains available if you want to compare.
- `docker-compose` built the expensive `builder` stage for the `migrate` service. That meant schema migration triggered a full Next.js production build before the app container even started. The migration service now uses a lightweight `migrate` stage instead.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL:

```bash
docker compose up -d db
```

3. Apply the Prisma schema:

```bash
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

If you want to compare Turbopack performance explicitly:

```bash
npm run dev:turbo
```

## Local server deployment

To run the app as a local production-style server:

1. Ensure `.env.local` has the required values:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=http://localhost:3000`
- `ADMIN_PASSWORD`
- `GEMINI_API_KEY` (optional)

2. Build and start with Docker Compose:

```bash
docker compose up --build
```

The app will be available on `http://localhost:3000`.

## Manual production-style run

If Node is installed locally and you do not want Docker for the app process:

```bash
npm install
npm run db:push
npm run build
npm run start:local
```
