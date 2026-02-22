-- =============================================
-- Sharma Solutions - Services Seed Data (7 services only)
-- Run after 001_initial_schema.sql (and 003_orders_documents.sql if used)
-- UI uses static SERVICES_LIST from src/data/services.ts; this seed is optional for DB consistency.
-- =============================================

-- Clear service_id on existing orders so we can replace services
UPDATE public.orders SET service_id = NULL WHERE service_id IS NOT NULL;
DELETE FROM public.services;

-- Include title, price, is_active so Services page and Apply Now show prices consistently (matches src/data/services.ts)
INSERT INTO public.services (id, name, title, description, icon, price, is_active) VALUES
  (uuid_generate_v4(), 'Aadhaar Update', 'Aadhaar Update', 'Mobile number update and HOF address-based address correction', 'id-card', 150, true),
  (uuid_generate_v4(), 'Voter Card Services', 'Voter Card Services', 'New voter card apply, correction of address, name, father name, mobile number, relation, date of birth', 'vote', 200, true),
  (uuid_generate_v4(), 'Caste, Income & Residential Certificate', 'Caste, Income & Residential Certificate', 'Caste certificate, income certificate, residential certificate etc.', 'file-text', 200, true),
  (uuid_generate_v4(), 'Police Verification', 'Police Verification', 'Police verification certificate', 'shield-check', 200, true),
  (uuid_generate_v4(), 'Character Certificate Challan', 'Character Certificate Challan', 'Challan for character certificate', 'award', 150, true),
  (uuid_generate_v4(), 'Driving License Services', 'Driving License Services', 'Learner license, driving license, renewal, correction etc.', 'car', 200, true),
  (uuid_generate_v4(), 'Ration Card Services', 'Ration Card Services', 'New ration card, correction, add member, delete member, dealer change etc.', 'credit-card', 200, true);
