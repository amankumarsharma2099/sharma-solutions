-- Services: add optional fields for full parity with rich service display
-- All new columns nullable for backward compatibility

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS price numeric;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS processing_time text;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS documents_required text[];

-- icon already exists from 20250221000000_admin_and_order_files.sql
-- No change needed for icon

COMMENT ON COLUMN public.services.price IS 'Optional price in rupees';
COMMENT ON COLUMN public.services.processing_time IS 'Optional e.g. 1–2 days, 7–25 days';
COMMENT ON COLUMN public.services.documents_required IS 'Optional array of required document names';
