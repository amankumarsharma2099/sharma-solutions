-- Align orders.status with app: use 'in_process' instead of 'processing'
-- so admin status updates (pending | in_process | completed) persist correctly.

-- Migrate existing data
UPDATE public.orders SET status = 'in_process' WHERE status = 'processing';

-- Drop existing check constraint (name from 001_initial_schema or default)
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Allow only: pending, in_process, completed
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'in_process', 'completed'));

-- Enable Realtime for orders so My Orders page can sync when admin updates status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders' AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
