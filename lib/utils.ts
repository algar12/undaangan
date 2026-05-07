import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

/**
 * Menggabungkan class names Tailwind dengan resolusi konflik.
 * Gunakan ini di semua komponen sebagai pengganti template literal biasa.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format Indonesia.
 * @example formatDate("2024-12-31") => "31 Desember 2024"
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), "d MMMM yyyy", { locale: idLocale });
}

/**
 * Format waktu dari string "HH:MM:SS" ke "HH.MM WIB".
 * @example formatTime("09:00:00") => "09.00 WIB"
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  return `${hours}.${minutes} WIB`;
}

/**
 * Hitung jarak waktu relatif ke hari ini dalam Bahasa Indonesia.
 * @example timeFromNow("2024-12-31") => "dalam 3 bulan"
 */
export function timeFromNow(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: idLocale,
  });
}

/**
 * Slugify teks menjadi URL-friendly string.
 * @example slugify("Ahmad & Budi") => "ahmad-budi"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Potong teks dengan ellipsis jika melebihi panjang maksimum.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
