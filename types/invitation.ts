// ============================================================
// Domain Types — Digital Wedding Invitation
// ============================================================

export type RSVPStatus = "attending" | "not_attending" | "maybe";

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  font_heading: string;
  font_body: string;
}

export interface Invitation {
  id: string;
  user_id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  bride_parents?: string | null;
  groom_parents?: string | null;
  bride_photo?: string | null;
  groom_photo?: string | null;
  event_date: string; // ISO date: "YYYY-MM-DD"
  event_time: string; // "HH:MM:SS"
  venue_name: string;
  venue_address: string;
  venue_maps_url?: string | null;
  love_story?: string | null;
  cover_image_url?: string | null;
  gallery_urls: string[];
  music_url?: string | null;
  theme_config: ThemeConfig;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  phone_number?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  max_pax: number;
  wa_sent_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RSVPResponse {
  id: string;
  invitation_id: string;
  guest_id?: string | null;
  guest_name: string;
  status: RSVPStatus;
  pax_count: number;
  message?: string | null;
  responded_at: string;
  ip_address?: string | null;
}

export interface RSVPStats {
  total: number;
  attending: number;
  not_attending: number;
  maybe: number;
  total_pax: number;
}

// ============================================================
// User / Auth Types
// ============================================================

export interface UserProfile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// API / Action Response Types
// ============================================================

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
