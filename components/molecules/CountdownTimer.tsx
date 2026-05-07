"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(`${targetDate}T${targetTime}`).getTime();

    const updateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (!mounted) return <div className="h-28" />;

  const timeBlocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {timeBlocks.map((block) => (
        <div
          key={block.label}
          className="w-16 h-20 flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
          <div className="font-serif text-2xl font-bold text-white mb-1 leading-none">
            {block.value.toString().padStart(2, "0")}
          </div>
          <div className="text-[10px] tracking-widest uppercase text-white/50">
            {block.label}
          </div>
        </div>
      ))}
    </div>
  );
}
