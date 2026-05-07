import { WHATSAPP_BASE_URL } from "@/lib/constants";

interface WhatsAppLinkOptions {
  guestName: string;
  invitationUrl: string;
  groomName: string;
  brideName: string;
  phoneNumber?: string; // Format E.164: +6281234567890
}

/**
 * Generate link WhatsApp dengan pesan undangan yang sudah ter-encode.
 *
 * Jika phoneNumber disediakan, link diarahkan langsung ke kontak tersebut.
 * Jika tidak, buka WhatsApp dengan share universal (wa.me/?text=...).
 *
 * @example
 * generateWhatsAppLink({
 *   guestName: "Budi Santoso",
 *   invitationUrl: "https://undanganku.app/inv/ahmad-siti",
 *   groomName: "Ahmad",
 *   brideName: "Siti",
 *   phoneNumber: "+6281234567890"
 * })
 */
export function generateWhatsAppLink(options: WhatsAppLinkOptions): string {
  const { guestName, invitationUrl, groomName, brideName, phoneNumber } = options;

  const message = [
    `Assalamu'alaikum, ${guestName}. 🌸`,
    ``,
    `Dengan hormat, kami ${groomName} & ${brideName} mengundang Bapak/Ibu/Saudara/i untuk hadir di hari istimewa kami.`,
    ``,
    `📜 *Undangan Digital kami:*`,
    invitationUrl,
    ``,
    `Mohon konfirmasi kehadiran melalui link di atas.`,
    ``,
    `Terima kasih 🙏`,
    `${groomName} & ${brideName}`,
  ].join("\n");

  const encodedMessage = encodeURIComponent(message);

  if (phoneNumber) {
    // Bersihkan karakter non-digit selain tanda +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
    return `${WHATSAPP_BASE_URL}/${cleanPhone}?text=${encodedMessage}`;
  }

  return `${WHATSAPP_BASE_URL}/?text=${encodedMessage}`;
}

/**
 * Validasi format nomor telepon E.164.
 * @example isValidPhoneNumber("+6281234567890") => true
 */
export function isValidPhoneNumber(phone: string): boolean {
  return /^\+?[0-9]{8,15}$/.test(phone.replace(/\s/g, ""));
}

/**
 * Normalisasi nomor Indonesia ke format E.164.
 * @example normalizeIndonesianPhone("081234567890") => "+6281234567890"
 */
export function normalizeIndonesianPhone(phone: string): string {
  const clean = phone.replace(/[\s-]/g, "");
  if (clean.startsWith("0")) {
    return `+62${clean.slice(1)}`;
  }
  if (clean.startsWith("62")) {
    return `+${clean}`;
  }
  return clean;
}
