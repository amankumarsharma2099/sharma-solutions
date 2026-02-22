# Supabase setup (fix "Could not query the database for the schema cache")

Follow these steps so **Apply Now** and orders work without schema cache errors.

## 1. Tables in `public` schema

Run the migrations in the Supabase SQL Editor (**SQL Editor** → New query):

1. **First time:** Run `supabase/migrations/001_initial_schema.sql` (creates `public.users`, `public.services`, `public.orders` with RLS).
2. **If you already ran 001 before** (and orders table has no `service_name`): Run `supabase/migrations/002_orders_service_name.sql`.

Confirm in **Table Editor** that these exist under schema **public**:

- `public.users`
- `public.services`
- `public.orders`

`public.orders` must have: `id`, `user_id`, `service_id` (nullable), `service_name`, `status`, `created_at`.

## 2. Row Level Security (RLS)

001 enables RLS and adds policies. **For admin orders to work**, run `supabase/migrations/20250221110000_orders_admin_policies.sql` so admins can view and update all orders (otherwise the admin sees only their own orders and gets "Order not found" when updating others).

If you manage policies by hand, ensure:

- **orders**
  - **INSERT** for `authenticated` with `auth.uid() = user_id`
  - **SELECT** for users on their own rows (`auth.uid() = user_id`)
  - **UPDATE** for `authenticated` on own rows (optional, for status updates)

Example:

```sql
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);
```

## 3. Data API

- Supabase Dashboard → **Project Settings** → **API**.
- Ensure **Project API keys** are present and **Data API** (REST/PostgREST) is enabled for the project.

## 4. Environment variables

In project root, create or edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get both from Supabase Dashboard → **Project Settings** → **API** (Project URL and anon public key).

- Do not commit `.env.local`.
- In development, the app logs whether URL and anon key are set (values are not printed). If you see "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY", fix `.env.local` and restart the dev server.

## 5. Single Supabase client

The app uses one browser client (initialized once) in `src/lib/supabase/client.ts` and a server client in `src/lib/supabase/server.ts`. Do not create additional Supabase client instances elsewhere.

## 6. Insert query

Orders are inserted from `src/app/services/actions.ts` with:

- `user_id`, `status: 'pending'`, `service_id` (optional), `service_name` (optional).

The table must have columns `user_id`, `service_id`, `service_name`, `status` (and `id`, `created_at` usually auto-set).

## 7. After schema changes

- Restart the Next.js dev server (`npm run dev` or `yarn dev`).
- Hard refresh or clear browser cache for the app (e.g. Ctrl+Shift+R or clear site data).

## 8. Error logging

On insert or auth failure, the server logs:

- `Supabase Error:` (and details) for orders insert and users upsert.
- `Supabase Auth Error:` when getting the current user fails.

Check the terminal where `next dev` is running for these messages when **Apply Now** fails.
