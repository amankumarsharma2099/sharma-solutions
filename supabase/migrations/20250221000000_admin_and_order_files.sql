-- Admin role: add role to users (default 'user')
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- Services table: ensure columns exist (id, name used by app; add title/description/icon/category/is_active for admin)
-- If services table doesn't exist, create it. If it exists with only id/name, add columns.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
    CREATE TABLE public.services (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text,
      title text,
      description text,
      icon text,
      category text,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  ELSE
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS title text;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS description text;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon text;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category text;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

-- Order status: ensure we use pending, in_process, completed (orders table already exists)
-- order_files_user: user-uploaded files per order
CREATE TABLE IF NOT EXISTS public.order_files_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_files_user_order_id ON public.order_files_user(order_id);

-- order_files_admin: admin-uploaded result files per order
CREATE TABLE IF NOT EXISTS public.order_files_admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_files_admin_order_id ON public.order_files_admin(order_id);

-- RLS: allow authenticated users to read their own order_files_user; allow service role / admin for order_files_admin
ALTER TABLE public.order_files_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files_admin ENABLE ROW LEVEL SECURITY;

-- Users can read their own order's user files (order belongs to user)
CREATE POLICY "Users can read own order user files"
  ON public.order_files_user FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_files_user.order_id AND o.user_id = auth.uid()
    )
  );

-- Users can insert user files for their own order (when placing order)
CREATE POLICY "Users can insert own order user files"
  ON public.order_files_user FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_files_user.order_id AND o.user_id = auth.uid()
    )
  );

-- Admins (role = 'admin') can do all on order_files_user for management
CREATE POLICY "Admins can all order_files_user"
  ON public.order_files_user FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can read admin files only for their own orders
CREATE POLICY "Users can read own order admin files"
  ON public.order_files_admin FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_files_admin.order_id AND o.user_id = auth.uid()
    )
  );

-- Admins can do all on order_files_admin
CREATE POLICY "Admins can all order_files_admin"
  ON public.order_files_admin FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Storage bucket for admin uploads:
-- In Supabase Dashboard > Storage, create bucket "order-documents-admin" (private).
-- Add policy: Allow authenticated users with role 'admin' to upload and read,
-- or use "Allow all for authenticated" if you restrict admin at app level.

COMMENT ON COLUMN public.users.role IS 'user | admin';

-- To make a user admin (run after replacing USER_UUID):
-- UPDATE public.users SET role = 'admin' WHERE id = 'USER_UUID';
