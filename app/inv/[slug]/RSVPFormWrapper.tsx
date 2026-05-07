"use client";

import { RSVPForm } from "@/components/organisms/RSVPForm";
import { createClient } from "@/lib/supabase/client";
import type { RSVPResponseInput } from "@/features/rsvp/schemas";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RSVPFormContent({ invitationId, invitationUrl }: { invitationId: string; invitationUrl: string }) {
  const params = useSearchParams();
  const guestName = params.get("untuk") ?? undefined; // /inv/[slug]?untuk=BudiSantoso

  const handleSubmit = async (data: RSVPResponseInput) => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("rsvp_responses") as any).insert({
      invitation_id: invitationId,
      guest_name: data.guest_name,
      status: data.status,
      pax_count: data.pax_count,
      message: data.message || null,
    });
    if (error) throw new Error(error.message);
    void invitationUrl; // url tersedia untuk kebutuhan lain
  };

  return <RSVPForm invitationId={invitationId} guestName={guestName} onSubmit={handleSubmit} />;
}

export function RSVPFormWrapper(props: { invitationId: string; invitationUrl: string }) {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>Memuat form...</div>}>
      <RSVPFormContent {...props} />
    </Suspense>
  );
}
