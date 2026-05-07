"use client";

import { useState } from "react";
import { WelcomeCover } from "./WelcomeCover";
import { AudioPlayer } from "../molecules/AudioPlayer";

interface InvitationClientWrapperProps {
  groomName: string;
  brideName: string;
  musicUrl?: string | null;
}

export function InvitationClientWrapper({ groomName, brideName, musicUrl }: InvitationClientWrapperProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState<string>("");

  // In a real app, guest name could be parsed from URL params like ?to=NamaTamu
  useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to") || params.get("via");
      if (to) setGuestName(to);
    }
  });

  return (
    <>
      <WelcomeCover
        groomName={groomName}
        brideName={brideName}
        guestName={guestName}
        onOpen={() => setIsOpened(true)}
      />
      {musicUrl && <AudioPlayer musicUrl={musicUrl} isPlaying={isOpened} />}
    </>
  );
}
