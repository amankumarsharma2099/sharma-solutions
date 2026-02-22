-- =============================================
-- Orders: price and document_urls; Storage bucket for order documents
-- =============================================

-- Orders: add price (rupees) and document_urls (array of storage paths)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS price INTEGER;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS document_urls TEXT[] DEFAULT '{}';

-- Storage bucket: order-documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-documents', 'order-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: authenticated users can upload only to their own folder: {user_id}/...
CREATE POLICY "Users can upload own order documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'order-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS: authenticated users can read only their own folder
CREATE POLICY "Users can read own order documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'order-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
