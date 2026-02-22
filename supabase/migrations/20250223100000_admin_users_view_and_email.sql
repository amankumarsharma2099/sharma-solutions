-- Allow admins to read public.users so Admin Orders can show customer name/email.
-- Without this, RLS "Users can view own profile" blocks admin from reading other users → user map empty → "-" in UI.

CREATE POLICY "Admins can view users"
  ON public.users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Add email to public.users so admin orders can display it (auth.users holds email; we mirror for display).
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS email text;

-- Update trigger to set email on signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
