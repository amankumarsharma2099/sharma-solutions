-- Services RLS: admin full access; public read active only
-- Fixes: "new row violates row-level security policy for table services"

-- Drop the old permissive SELECT policy (everyone could see all services)
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;

-- Public can read active services only (anon + authenticated)
CREATE POLICY "Public can read active services"
ON public.services
FOR SELECT
USING (is_active = true);

-- Admin can INSERT services
CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Admin can UPDATE services
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Admin can DELETE services
CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
