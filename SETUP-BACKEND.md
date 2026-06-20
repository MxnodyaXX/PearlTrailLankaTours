# Backend setup — Supabase (free cloud database)

This lets your client edit the **simple tour packages** without touching code.
The complex *Sacred Circuit* (route map + 10-day itinerary) stays code-managed.

> While Supabase isn't configured yet, the site keeps working — it falls back to
> the packages in `lib/packages-data.ts`. Nothing breaks during setup.

---

## Step 1 — Create a free Supabase project
1. Go to **https://supabase.com** → sign up (free).
2. **New project** → name it (e.g. `pearltrail`), set a database password, pick a region near Sri Lanka (e.g. *Singapore*).
3. Wait ~2 minutes for it to provision.

## Step 2 — Create the table + storage
1. In the project: **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, **copy all of it**, paste, and **Run**.
3. This creates the `packages` table, security rules, and a public `package-images` storage bucket.

## Step 3 — Add your keys
1. In Supabase: **Project Settings → API**. Copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (secret)
2. In the repo, copy `.env.local.example` → **`.env.local`** and fill them in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
   `.env.local` is git-ignored — never commit it.

## Step 4 — Seed your 8 packages into the DB
Run once (pushes the current simple packages from code into Supabase):
```
npx tsx --env-file=.env.local scripts/seed-packages.ts
```
You should see `✓ Seeded 8 packages.` Refresh `/packages` — it's now reading from the database.

## Step 5 — Create the admin login (for the client)
1. Supabase: **Authentication → Users → Add user** → enter the client's email + a password.
2. (Email confirmations can be turned off under **Authentication → Providers → Email** for an internal tool.)

## Step 6 — Deploy (Vercel, free)
1. Push the repo to GitHub → import into **Vercel**.
2. In Vercel → **Settings → Environment Variables**, add the same three variables from `.env.local`.
3. Redeploy.

---

## What's done vs. next
- ✅ Database + storage schema
- ✅ Site reads packages from the DB (with safe fallback)
- ✅ Seed script
- ⏳ **Admin UI** (`/admin`) — login + add/edit/delete packages + image upload.
  *This is the next build step, done once your Supabase project is live so it can be wired to your real table.*

Until the admin UI exists, the client can already edit packages from the
**Supabase dashboard → Table editor → `packages`**.
