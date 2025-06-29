"use client";
import { useEffect, useState } from "react";
import { Wifi, BatteryFull } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function MobileStatusBar() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full flex items-center justify-between px-4 h-7 z-50 text-xs text-black font-bold pointer-events-none select-none drop-shadow-md"
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        letterSpacing: "0.08em",
        background: "transparent",
      }}
    >
      <span
        className="tracking-widest text-white/90"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
      >
        {formatTime(now)}
      </span>
      <div className="flex items-center gap-2">
        <Wifi size={22} className="text-white/90 drop-shadow" />
        <BatteryFull size={22} className="text-white/90 drop-shadow" />
      </div>
    </div>
  );
}