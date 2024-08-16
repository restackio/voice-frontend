"use client";

import { useRouter } from "next/navigation";
import { useMicVAD } from "@ricky0123/vad-react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useMicVAD({
    startOnLoad: false,
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 62;
      audioRef.current.play();
    }
  }, []);

  const createSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const { streamSid } = data;

      router.push(`/${streamSid}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullscreen-background overflow-hidden">
      <audio ref={audioRef} src="/255_The_Hearth_Inn.mp3" loop />
      <div className="flex flex-col items-center justify-center h-screen mt-60">
        <button
          onClick={createSession}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded-xl hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create a Party"}
        </button>
      </div>
    </div>
  );
}
