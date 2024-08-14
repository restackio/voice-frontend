"use client";

import { useRouter } from "next/navigation";
import { useMicVAD } from "@ricky0123/vad-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useMicVAD({
    startOnLoad: false,
  });

  const createSession = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }

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

      router.push(`/${streamSid}?username=${username}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-4 px-4 py-2 border rounded"
      />
      <button
        onClick={createSession}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
        disabled={loading}
      >
        {loading ? "Loading..." : "Create Session"}
      </button>
    </div>
  );
}
