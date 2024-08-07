"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
      const { streamSid, websocketAddress } = data;

      // Assuming you want to use websocketAddress somewhere, otherwise you can remove it
      console.log("WebSocket Address:", websocketAddress);

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
