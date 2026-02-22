-- Email sync: backfill existing users and ensure new signups get email (and phone).
-- Step 1: Copy email from auth.users into public.users for existing rows with NULL/empty email.
-- Step 2: Ensure handle_new_user() inserts email (and phone) for future signups.

-- Step 1 — Backfill existing emails
UPDATE public.users u
SET email = au.email
FROM auth.users au
WHERE au.id = u.id
  AND (u.email IS NULL OR u.email = '');

-- Step 2 — Trigger: new signups get email and phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
