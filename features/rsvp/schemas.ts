import { z } from "zod";

// ============================================================
// RSVP Schemas
// ============================================================

export const rsvpResponseSchema = z.object({
  guest_name: z.string().min(2, "Nama minimal 2 karakter"),
  status: z.enum(["attending", "not_attending", "maybe"] as const, {
    error: () => ({ message: "Pilih status kehadiran" }),
  }),
  pax_count: z
    .number()
    .int()
    .min(1, "Minimal 1 orang")
    .max(10, "Maksimal 10 orang per respon"),
  message: z
    .string()
    .max(500, "Ucapan maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
});

export type RSVPResponseInput = z.infer<typeof rsvpResponseSchema>;
