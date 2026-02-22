-- =============================================
-- Allow orders without service_id (e.g. when using static list)
-- Run this only if you already ran 001_initial_schema.sql before it included
-- service_name and nullable service_id. New installs: 001 alone is enough.
-- =============================================

-- Add service_name so we can store the name when service_id is from static list (slug)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS service_name TEXT;

-- Make service_id nullable so we can insert orders with only service_name (no services table rows)
ALTER TABLE public.orders
  ALTER COLUMN service_id DROP NOT NULL;

-- Backfill: set service_name from services table where missing
UPDATE public.orders o
SET service_name = s.name
FROM public.services s
WHERE o.service_id = s.id AND (o.service_name IS NULL OR o.service_name = '');
