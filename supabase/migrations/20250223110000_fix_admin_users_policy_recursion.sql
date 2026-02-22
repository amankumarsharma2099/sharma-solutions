-- Fix: "Admins can view users" policy caused infinite RLS recursion.
-- The policy used EXISTS (SELECT 1 FROM public.users ...) on the same table,
-- so evaluating it triggered RLS on users again → recursion → admin page failed.
--
-- Solution: use a SECURITY DEFINER function so the admin check runs without RLS.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop the recursive policy and recreate using is_admin()
DROP POLICY IF EXISTS "Admins can view users" ON public.users;

CREATE POLICY "Admins can view users"
  ON public.users FOR SELECT
  TO authenticated
  USING (public.is_admin());
