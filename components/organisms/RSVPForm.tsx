"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { rsvpResponseSchema, type RSVPResponseInput } from "@/features/rsvp/schemas";
import { FormField } from "@/components/molecules/FormField";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface RSVPFormProps {
  invitationId: string;
  guestName?: string;
  onSubmit?: (data: any) => Promise<any>;
}

export function RSVPForm({ invitationId, guestName, onSubmit: externalOnSubmit }: RSVPFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RSVPResponseInput>({
    resolver: zodResolver(rsvpResponseSchema),
    defaultValues: {
      pax_count: 1,
      guest_name: guestName || "",
    },
  });


  const watchStatus = watch("status");

  const onSubmit = async (data: RSVPResponseInput) => {
    setStatus("idle");
    const supabase = createClient();
    
    const payload = {
      invitation_id: invitationId,
      guest_name: data.guest_name,
      status: data.status,
      pax_count: data.status === "not_attending" ? 0 : data.pax_count,
      message: data.message || null,
    };
    
    if (externalOnSubmit) {
      await externalOnSubmit(payload);
    }
    
    const { error } = await supabase.from("rsvp_responses").insert([payload] as any);

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8 animate-float-up">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="font-serif text-3xl mb-4 text-[var(--color-text)]">Terima Kasih!</h3>
        <p className="text-[var(--color-text-muted)] text-lg">
          Konfirmasi kehadiran Anda telah kami terima.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 text-left" noValidate>
      {status === "error" && (
        <div className="p-4 rounded-xl text-sm bg-rose-50 border border-rose-200 text-rose-600">
          {errorMessage}
        </div>
      )}

      <FormField label="Nama Lengkap" htmlFor="r-name" error={errors.guest_name?.message} required>
        <Input
          id="r-name"
          type="text"
          placeholder="Nama Anda"
          className="bg-black/20 border-white/10 text-white placeholder:text-white/30 py-3 px-4"
          {...register("guest_name")}
          error={!!errors.guest_name}
        />
      </FormField>

      <div>
        <p className="text-sm font-medium text-white mb-3">
          Apakah Anda berkenan hadir? <span className="text-rose-500">*</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: "attending", label: "Ya, Hadir" },
            { value: "maybe", label: "Mungkin" },
            { value: "not_attending", label: "Tidak Bisa" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "relative flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-sm font-medium",
                watchStatus === opt.value
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-black/20 border-white/5 text-white/50 hover:border-white/10"
              )}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("status")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {watchStatus !== "not_attending" && (
        <FormField label="Jumlah Kehadiran" htmlFor="r-pax" error={errors.pax_count?.message} required>
          <Input
            id="r-pax"
            type="number"
            min={1}
            max={10}
            className="bg-black/20 border-white/10 text-white py-3 px-4"
            {...register("pax_count", { valueAsNumber: true })}
            error={!!errors.pax_count}
          />
        </FormField>
      )}

      <FormField label="Pesan & Doa (Buku Tamu)" htmlFor="r-msg" error={errors.message?.message} hint="Opsional">
        <textarea
          id="r-msg"
          rows={4}
          className="input-field resize-none bg-black/20 border-white/10 text-white placeholder:text-white/30 py-3 px-4 focus:border-white/30"
          placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..."
          {...register("message")}
        />
      </FormField>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full mt-4 text-base shadow-lg bg-white/20 hover:bg-white/30 text-white border-none">
        {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Mengirim...</> : "Kirim Konfirmasi"}
      </Button>
    </form>
  );
}
