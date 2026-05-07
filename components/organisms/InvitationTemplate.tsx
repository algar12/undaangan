"use client";

import { useState, useEffect, useRef } from "react";
import type { Invitation, RSVPResponse } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarHeart, MapPin, Heart, Quote, Play, Pause, Music, Users, Image as ImageIcon, MessageCircle, MailOpen } from "lucide-react";
import { RSVPFormWrapper } from "./RSVPFormWrapper";
import { CountdownTimer } from "../molecules/CountdownTimer";

interface Props {
  invitation: Invitation;
  messages: Pick<RSVPResponse, "id" | "guest_name" | "message" | "responded_at" | "status">[];
  invitationUrl: string;
}

export function InvitationTemplate({ invitation, messages, invitationUrl }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") || params.get("via");
    if (to) setGuestName(to);
  }, []);

  const handleOpen = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const bgImage = invitation.cover_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80";

  return (
    <>
      <audio ref={audioRef} src={invitation.music_url || "/assets/music/pure-love-304010.mp3"} loop className="hidden" />

      {/* Floating Audio Button */}
      {isOpened && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-24 right-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          {isPlaying ? <Music size={16} className="animate-spin" style={{ animationDuration: '3s' }} /> : <Pause size={16} />}
        </button>
      )}

      {/* Welcome Cover Overlay */}
      <div className={`fixed inset-0 z-[100] bg-[#121212] transition-transform duration-1000 ease-in-out ${isOpened ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Cover" className="w-full h-full object-cover opacity-40 grayscale-[20%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/80" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h2 className="text-2xl font-serif tracking-widest uppercase mb-4 text-white/80">The Wedding Of</h2>
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mb-8">
            <img src={bgImage} alt="Couple" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-5xl font-serif text-white mb-6">{invitation.groom_name} &amp; {invitation.bride_name}</h1>
          <p className="text-sm text-white/60 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="text-2xl font-serif text-white mb-10">{guestName || "Tamu Undangan"}</p>
          <button onClick={handleOpen} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all">
            <MailOpen size={18} /> Buka Undangan
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-screen bg-[#121212] text-white overflow-x-hidden">
        
        {/* Left Side: Desktop Fixed Background */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center h-screen sticky top-0 overflow-hidden border-r border-white/10">
          <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[10%]" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center bg-black/40 backdrop-blur-md px-12 py-10 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-5xl font-serif mb-4 text-white">{invitation.groom_name} &amp; {invitation.bride_name}</h2>
            <p className="text-xl text-white/80 tracking-widest">{formatDate(invitation.event_date)}</p>
          </div>
        </div>

        {/* Right Side: Mobile Content */}
        <div className="w-full lg:w-[500px] shrink-0 bg-[#151515] relative shadow-2xl h-[100svh] flex flex-col">
          
          <div className="flex-1 overflow-y-auto scroll-smooth" id="scroll-container">
            {/* SECTION: HOME */}
            <section id="home" className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 border-b border-white/5">
              <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-10" />
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
                <h1 className="text-2xl font-serif tracking-widest uppercase mb-8 text-white/70">Undangan Pernikahan</h1>
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mb-8">
                  <img src={bgImage} alt="Couple" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-4xl font-serif text-white mb-4">{invitation.groom_name} &amp; {invitation.bride_name}</h2>
                <p className="text-lg text-white/80 mb-8">{formatDate(invitation.event_date)}</p>
                
                <div className="mt-8 animate-bounce opacity-50">
                  <p className="text-xs mb-2 uppercase tracking-widest">Scroll Down</p>
                  <div className="w-px h-12 bg-white mx-auto" />
                </div>
              </div>
            </section>

            {/* SECTION: MEMPELAI */}
            <section id="bride" className="py-20 px-6 text-center border-b border-white/5">
              <h2 className="text-2xl font-serif mb-6">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-12">
                Assalamualaikum Warahmatullahi Wabarakatuh<br/><br/>
                Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:
              </p>

              <div className="mb-12">
                {invitation.groom_photo ? (
                  <div className="w-32 h-32 mx-auto rounded-full border border-white/10 mb-4 overflow-hidden">
                    <img src={invitation.groom_photo} alt={invitation.groom_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-3xl font-serif text-white/50">
                    {invitation.groom_name.charAt(0)}
                  </div>
                )}
                <h3 className="text-3xl font-serif text-white mb-2">{invitation.groom_name}</h3>
                <p className="text-sm text-white/60">{invitation.groom_parents || "Putra dari Keluarga Bapak & Ibu"}</p>
              </div>

              <h2 className="text-5xl font-serif text-white/30 my-8">&amp;</h2>

              <div className="mb-8">
                {invitation.bride_photo ? (
                  <div className="w-32 h-32 mx-auto rounded-full border border-white/10 mb-4 overflow-hidden">
                    <img src={invitation.bride_photo} alt={invitation.bride_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-3xl font-serif text-white/50">
                    {invitation.bride_name.charAt(0)}
                  </div>
                )}
                <h3 className="text-3xl font-serif text-white mb-2">{invitation.bride_name}</h3>
                <p className="text-sm text-white/60">{invitation.bride_parents || "Putri dari Keluarga Bapak & Ibu"}</p>
              </div>
            </section>

            {/* SECTION: QUOTE & LOVE STORY */}
            <section className="py-20 px-6 bg-[#1a1a1a] border-b border-white/5">
              <div className="text-center mb-16">
                <Quote className="mx-auto text-white/20 mb-6" size={32} />
                <p className="text-sm italic leading-relaxed text-white/80 mb-4">
                  "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."
                </p>
                <p className="text-xs font-bold text-white/50 tracking-widest">QS. Ar-Rum: 21</p>
              </div>

              {invitation.love_story && (
                <div className="bg-black/20 rounded-3xl p-6 border border-white/5">
                  <h3 className="text-2xl font-serif text-center mb-6">Kisah Cinta</h3>
                  <p className="text-sm text-white/70 leading-relaxed italic text-center">
                    "{invitation.love_story}"
                  </p>
                </div>
              )}
            </section>

            {/* SECTION: TANGGAL & LOKASI */}
            <section id="wedding-date" className="py-20 px-6 text-center border-b border-white/5">
              <h2 className="text-3xl font-serif mb-10">Waktu & Tempat</h2>
              
              <div className="mb-16">
                <CountdownTimer targetDate={invitation.event_date} targetTime={invitation.event_time} />
              </div>

              <div className="space-y-8">
                <div className="bg-black/20 rounded-3xl p-8 border border-white/5">
                  <CalendarHeart className="mx-auto text-white/50 mb-4" size={32} />
                  <h3 className="text-2xl font-serif mb-2">Akad & Resepsi</h3>
                  <p className="text-lg text-white mb-1">{formatDate(invitation.event_date)}</p>
                  <p className="text-sm text-white/60">{formatTime(invitation.event_time)} - Selesai</p>
                </div>

                <div className="bg-black/20 rounded-3xl p-8 border border-white/5">
                  <MapPin className="mx-auto text-white/50 mb-4" size={32} />
                  <h3 className="text-2xl font-serif mb-2">Lokasi Acara</h3>
                  <p className="text-lg text-white mb-2">{invitation.venue_name}</p>
                  <p className="text-sm text-white/60 mb-6 leading-relaxed">{invitation.venue_address}</p>
                  {invitation.venue_maps_url && (
                    <a href={invitation.venue_maps_url} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-gray-200 transition-colors">
                      Buka Google Maps
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* SECTION: GALERI */}
            {invitation.gallery_urls && invitation.gallery_urls.length > 0 && (
              <section id="gallery" className="py-20 px-6 border-b border-white/5 bg-[#1a1a1a]">
                <h2 className="text-3xl font-serif text-center mb-10">Galeri Momen</h2>
                <div className="grid grid-cols-2 gap-3">
                  {invitation.gallery_urls.map((url, idx) => (
                    <div key={idx} className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <img src={url} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION: LOVE GIFT & RSVP */}
            <section id="comment" className="py-20 px-6">
              <h2 className="text-3xl font-serif text-center mb-10">Love Gift & RSVP</h2>
              
              <div className="bg-black/20 rounded-3xl p-6 border border-white/5 mb-12">
                <RSVPFormWrapper invitationId={invitation.id} invitationUrl={invitationUrl} />
              </div>

              {messages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-serif text-center mb-6">Ucapan & Doa</h3>
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                      <p className="font-bold text-white text-sm mb-1">{msg.guest_name}</p>
                      <p className="text-white/70 text-sm italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <footer className="text-center py-10 opacity-50 text-xs">
              Build with ❤️ by Undanganku
            </footer>
          </div>

          {/* BOTTOM NAVBAR (Mobile Fixed) */}
          <nav className="w-full bg-[#1a1a1a]/90 backdrop-blur-lg border-t border-white/10 z-40 shrink-0">
            <div className="flex justify-around items-center px-2 py-3">
              <a href="#home" className="flex flex-col items-center text-white/50 hover:text-white transition-colors">
                <Heart size={18} className="mb-1" />
                <span className="text-[10px] uppercase">Home</span>
              </a>
              <a href="#bride" className="flex flex-col items-center text-white/50 hover:text-white transition-colors">
                <Users size={18} className="mb-1" />
                <span className="text-[10px] uppercase">Mempelai</span>
              </a>
              <a href="#wedding-date" className="flex flex-col items-center text-white/50 hover:text-white transition-colors">
                <CalendarHeart size={18} className="mb-1" />
                <span className="text-[10px] uppercase">Tanggal</span>
              </a>
              <a href="#gallery" className="flex flex-col items-center text-white/50 hover:text-white transition-colors">
                <ImageIcon size={18} className="mb-1" />
                <span className="text-[10px] uppercase">Galeri</span>
              </a>
              <a href="#comment" className="flex flex-col items-center text-white/50 hover:text-white transition-colors">
                <MessageCircle size={18} className="mb-1" />
                <span className="text-[10px] uppercase">Ucapan</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
