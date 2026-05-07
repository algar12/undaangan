import { z } from "zod";

// ============================================================
// Invitation Schemas
// ============================================================

export const themeConfigSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format hex (#rrggbb)"),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format hex (#rrggbb)"),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format hex (#rrggbb)"),
  font_heading: z.string().min(1),
  font_body: z.string().min(1),
});

export const createInvitationSchema = z.object({
  bride_name: z.string().min(2, "Nama pengantin wanita minimal 2 karakter"),
  groom_name: z.string().min(2, "Nama pengantin pria minimal 2 karakter"),
  bride_parents: z.string().optional().nullable(),
  groom_parents: z.string().optional().nullable(),
  bride_photo: z.string().optional().nullable(),
  groom_photo: z.string().optional().nullable(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  event_time: z.string().regex(/^\d{2}:\d{2}$/, "Format waktu: HH:MM"),
  venue_name: z.string().min(3, "Nama lokasi minimal 3 karakter"),
  venue_address: z.string().min(10, "Alamat minimal 10 karakter"),
  venue_maps_url: z.string().url("URL Google Maps tidak valid").optional().or(z.literal("")),
  love_story: z.string().max(2000, "Maksimal 2000 karakter").optional(),
  gallery_urls: z.array(z.string()).optional(),
  music_url: z.string().optional().nullable(),
  theme_config: themeConfigSchema.optional(),
});

export const updateInvitationSchema = createInvitationSchema.partial().extend({
  is_published: z.boolean().optional(),
  cover_image_url: z.string().optional().nullable(),
  gallery_urls: z.array(z.string()).optional(),
  music_url: z.string().optional().nullable(),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
