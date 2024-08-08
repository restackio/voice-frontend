"use client";

import { useRouter } from "next/navigation";
import { useMicVAD } from "@ricky0123/vad-react";

export default function Home() {
  const router = useRouter();
  useMicVAD({
    startOnLoad: false,
  });

  const createSession = async () => {
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={createSession}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Create Session
      </button>
    </div>
  );
}
