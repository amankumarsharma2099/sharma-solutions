/**
 * Unified service type used across the app (cards, detail page, admin).
 * Optional fields are supported everywhere and shown only when available.
 */
export type Service = {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  processing_time?: string | null;
  documents_required?: string[] | null;
  icon?: string | null;
};
