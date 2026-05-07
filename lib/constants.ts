// ============================================================
// App Constants
// ============================================================

export const APP_NAME = "Undanganku";
export const APP_DESCRIPTION =
  "Platform undangan pernikahan digital yang modern, elegan, dan mudah disebarkan.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ============================================================
// Invitation Constants
// ============================================================

export const DEFAULT_THEME_CONFIG = {
  primary: "#b8860b",
  secondary: "#f5f0e8",
  accent: "#8b4513",
  font_heading: "Playfair Display",
  font_body: "Lato",
} as const;

export const RSVP_STATUS_LABELS = {
  attending: "Hadir",
  not_attending: "Tidak Hadir",
  maybe: "Mungkin Hadir",
} as const;

export const RSVP_STATUS_COLORS = {
  attending: "text-emerald-600 bg-emerald-50",
  not_attending: "text-rose-600 bg-rose-50",
  maybe: "text-amber-600 bg-amber-50",
} as const;

// ============================================================
// WhatsApp
// ============================================================
export const WHATSAPP_BASE_URL = "https://wa.me";

// ============================================================
// Supabase Storage Buckets
// ============================================================
export const STORAGE_BUCKETS = {
  covers: "invitation-covers",
  galleries: "invitation-galleries",
} as const;
