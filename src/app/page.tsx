"use client";

import { useRouter } from "next/navigation";
import { useMicVAD } from "@ricky0123/vad-react";
import { useState } from "react";
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useMicVAD({
    startOnLoad: false,
  });

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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-64 h-64 bg-gray-300 mb-4">
        {/* Placeholder for the image */}
        <Image src="/image.jpeg" alt="Historical figure" width={256} height={256} />
      </div>
      <h1 className="text-3xl font-bold mb-2">Epoque-Guess</h1>
      <h2 className="text-xl mb-6 text-center">
        Ask me 10 questions and guess from which year and place I am.
      </h2>
      <button
        onClick={createSession}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
        disabled={loading}
      >
        {loading ? "Loading..." : "Start Game"}
      </button>
    </div>
  );
}