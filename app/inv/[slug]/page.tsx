import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ThemeConfig, Invitation, RSVPResponse } from "@/types";
import { APP_URL } from "@/lib/constants";
import { InvitationTemplate } from "@/components/organisms/InvitationTemplate"; // Trigger TS server refresh

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("bride_name,groom_name,event_date,venue_name")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return { title: "Undangan Tidak Ditemukan" };
  const inv = data as unknown as Pick<
    Invitation,
    "bride_name" | "groom_name" | "event_date" | "venue_name"
  >;

  return {
    title: `Pernikahan ${inv.groom_name} & ${inv.bride_name}`,
  };
}

export default async function InvitationPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const inv = raw as Invitation | null;
  if (!inv) notFound();

  const { data: rawMessages } = await supabase
    .from("rsvp_responses")
    .select("id,guest_name,message,responded_at,status")
    .eq("invitation_id", inv.id)
    .not("message", "is", null)
    .order("responded_at", { ascending: false })
    .limit(50);

  const messages = (rawMessages ?? []) as unknown as Pick<
    RSVPResponse,
    "id" | "guest_name" | "message" | "responded_at" | "status"
  >[];

  const invitationUrl = `${APP_URL}/inv/${inv.slug}`;

  return (
    <InvitationTemplate 
      invitation={inv} 
      messages={messages} 
      invitationUrl={invitationUrl} 
    />
  );
}
