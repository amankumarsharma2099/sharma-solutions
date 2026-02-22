# Admin Panel Setup (Sharma Solutions CSC)

## 1. Run database migration

Apply the migration that adds admin role and order file tables:

```bash
npx supabase db push
```

Or run the SQL in `supabase/migrations/20250221000000_admin_and_order_files.sql` manually in the Supabase SQL Editor.

## 2. Create storage bucket for admin uploads

1. In **Supabase Dashboard** go to **Storage**.
2. Create a new bucket named **`order-documents-admin`**.
3. Set it to **Private**.
4. Add a policy so that authenticated users can upload and read (e.g. "Allow authenticated users to upload and read in bucket order-documents-admin"), or restrict to admin-only via RLS if you use storage RLS.

## 3. Set a user as admin

After signing up or having a user account, set their role to admin:

```sql
UPDATE public.users SET role = 'admin' WHERE id = 'USER_UUID_HERE';
```

To find a user's ID: Supabase Dashboard → Authentication → Users, or use the `id` from the `users` table.

## 4. Access the admin panel

- Open **`/admin`** when logged in as an admin.
- Non-admin users are redirected to the home page if they try to access `/admin`.
- Sidebar: **Dashboard**, **Services**, **Orders**.

## 5. Order status and files

- Order statuses: **Pending** → **In Process** → **Completed**.
- When an order is **Completed**, the admin can upload result files (PDF, images, etc.) in **Admin attached files**.
- Users see **Completed documents** and a **Download** button for those files on their **My Orders** page.

## 6. RLS (if you use Row Level Security)

- The migration adds RLS and policies for `order_files_user` and `order_files_admin`.
- If your **orders** or **services** tables have RLS, add policies so that users with `role = 'admin'` can SELECT/UPDATE/INSERT/DELETE as needed.
