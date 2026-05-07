import { z } from "zod";

// ============================================================
// Guest Schemas
// ============================================================

export const createGuestSchema = z.object({
  name: z.string().min(2, "Nama tamu minimal 2 karakter"),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "Format nomor tidak valid (contoh: +6281234567890)")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().max(300).optional(),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
  max_pax: z.number().int().min(1, "Minimal 1 kursi").max(20, "Maksimal 20 kursi"),
});

export const updateGuestSchema = createGuestSchema.partial();

export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
