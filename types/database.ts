/**
 * Auto-generated database types dari Supabase.
 * 
 * Untuk generate ulang setelah update schema:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 * 
 * Untuk sementara, kita definisikan manual sesuai skema yang sudah dibuat.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          bride_name: string;
          groom_name: string;
          event_date: string;
          event_time: string;
          venue_name: string;
          venue_address: string;
          venue_maps_url: string | null;
          love_story: string | null;
          cover_image_url: string | null;
          gallery_urls: string[];
          music_url: string | null;
          theme_config: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          bride_parents: string | null;
          groom_parents: string | null;
          bride_photo: string | null;
          groom_photo: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          bride_name: string;
          groom_name: string;
          event_date: string;
          event_time: string;
          venue_name: string;
          venue_address: string;
          venue_maps_url?: string | null;
          love_story?: string | null;
          cover_image_url?: string | null;
          gallery_urls?: string[];
          music_url?: string | null;
          theme_config?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          bride_parents?: string | null;
          groom_parents?: string | null;
          bride_photo?: string | null;
          groom_photo?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          slug?: string;
          bride_name?: string;
          groom_name?: string;
          event_date?: string;
          event_time?: string;
          venue_name?: string;
          venue_address?: string;
          venue_maps_url?: string | null;
          love_story?: string | null;
          cover_image_url?: string | null;
          gallery_urls?: string[];
          music_url?: string | null;
          theme_config?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          bride_parents?: string | null;
          groom_parents?: string | null;
          bride_photo?: string | null;
          groom_photo?: string | null;
        };
      };
      guests: {
        Row: {
          id: string;
          invitation_id: string;
          name: string;
          phone_number: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          max_pax: number;
          wa_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          name: string;
          phone_number?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          max_pax?: number;
          wa_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          name?: string;
          phone_number?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          max_pax?: number;
          wa_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rsvp_responses: {
        Row: {
          id: string;
          invitation_id: string;
          guest_id: string | null;
          guest_name: string;
          status: "attending" | "not_attending" | "maybe";
          pax_count: number;
          message: string | null;
          responded_at: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          guest_id?: string | null;
          guest_name: string;
          status: "attending" | "not_attending" | "maybe";
          pax_count?: number;
          message?: string | null;
          responded_at?: string;
          ip_address?: string | null;
        };
        Update: {
          id?: string;
          invitation_id?: string;
          guest_id?: string | null;
          guest_name?: string;
          status?: "attending" | "not_attending" | "maybe";
          pax_count?: number;
          message?: string | null;
          responded_at?: string;
          ip_address?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
