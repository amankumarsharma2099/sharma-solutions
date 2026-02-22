# Sharma Solutions – CSC Website

Production-ready website for a Common Service Centre (CSC) business built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Features

- **Landing page** with hero carousel, featured services, about preview, and contact
- **Services page** – grid of all CSC services; “Apply Now” creates an order when logged in (redirects to login otherwise)
- **About & Contact** pages
- **Auth** – Sign up, Sign in, Forgot password (Supabase Auth)
- **Protected routes** – `/profile`, `/orders` (middleware redirects to login if not authenticated)
- **Profile** – view and edit name, phone; optional profile photo (Supabase Storage)
- **Orders** – list of user orders with receipt download (print/PDF)
- **Order success** – confirmation with order ID, service name, date, status, CSC contact
- **Row Level Security (RLS)** on Supabase for users and orders

---

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **Server Actions** where appropriate
- **react-hot-toast** for notifications

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Landing
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── services/
│   │   ├── page.tsx
│   │   └── ServicesGrid.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── auth/callback/route.ts   # OAuth & magic link handler
│   ├── profile/
│   │   ├── page.tsx
│   │   └── edit/page.tsx
│   └── orders/
│       ├── page.tsx
│       ├── success/page.tsx
│       └── receipt/[id]/page.tsx
├── components/
│   ├── layout/Header.tsx, Footer.tsx
│   ├── ui/Button.tsx, Card.tsx, Input.tsx
│   ├── icons/ServiceIcon.tsx
│   ├── home/HeroCarousel.tsx
│   └── services/ServiceCard.tsx
├── lib/supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
├── data/services.ts             # Static service list (fallback + featured)
├── types/database.ts
└── middleware.ts                 # Auth protection for /profile, /orders
supabase/
├── migrations/001_initial_schema.sql
├── migrations/002_orders_service_name.sql
└── seed.sql
```

---

## Setup Instructions

### 1. Clone and install

```bash
cd sharmasolutions
npm install
```

### 2. Environment variables

Copy the example env file and add your Supabase keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get these from [Supabase Dashboard](https://app.supabase.com) → your project → **Settings** → **API**.

### 3. Supabase database

In the Supabase **SQL Editor**, run in order:

1. **Schema and RLS** – run the contents of `supabase/migrations/001_initial_schema.sql`.
2. **Orders service_name (fixes "Apply Now" / schema cache)** – run the contents of `supabase/migrations/002_orders_service_name.sql`.
3. **Seed data** – run the contents of `supabase/seed.sql` to insert the services list.

If you see "Could not query the database for the schema cache" or orders failing when clicking Apply Now, ensure all three steps above have been run and that your `.env.local` has the correct Supabase URL and anon key.

### 4. Storage (optional – profile photos)

In Supabase **Storage**:

1. Create a bucket named `avatars` (public if you want direct URL access).
2. Add a policy so authenticated users can upload/update objects under a path like `{user_id}/*` (e.g. `auth.uid()::text` as folder).

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Note:** The production build (`npm run build`) can run without `.env.local` (e.g. in CI). Pages that need Supabase are rendered dynamically at request time when env vars are set. For local development and full functionality, always set `.env.local` with your Supabase URL and anon key.

---

## Database Design (Summary)

- **users** – extends Supabase auth: `id`, `full_name`, `phone`, `avatar_url`, `created_at`. Row created automatically on signup via trigger.
- **services** – `id`, `name`, `description`, `icon`, `created_at`. Populated by `seed.sql`.
- **orders** – `id`, `user_id`, `service_id`, `status` (pending | processing | completed), `created_at`.

**RLS:**

- **users** – select/update/insert only own row (`auth.uid() = id`).
- **services** – select allowed for all.
- **orders** – select and insert only for own `user_id` (`auth.uid() = user_id`).

Full SQL is in `supabase/migrations/001_initial_schema.sql`.

---

## Order Flow

1. User clicks **Apply Now** on a service.
2. If not logged in → redirect to `/login?redirect=/services`.
3. If logged in → insert row in `orders` (user_id, service_id, status: pending), then redirect to `/orders/success?orderId=...&serviceId=...`.
4. Success page shows order ID, service name, date, status, and CSC contact (9304327456).
5. **View My Orders** → `/orders`; **Download Receipt** → `/orders/receipt/[id]` (print/PDF).

---

## CSC Contact

Used across the app (e.g. success page, contact section, receipt):

- **Phone:** 9304327456  
- **Email / Address:** configured in `src/data/services.ts` (`CSC_CONTACT`).

Update `CSC_CONTACT` there to change contact details globally.

---

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – run ESLint

---

## Production Checklist

- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in production env.
- [ ] Run Supabase migrations and seed in production (or use Supabase CLI).
- [ ] Configure Supabase Auth redirect URLs (e.g. `https://yourdomain.com/auth/callback`).
- [ ] Optionally add profile photo upload using Supabase Storage and `avatar_url` on `users`.
