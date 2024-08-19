"use client";

import { useRouter } from "next/navigation";
import { useMicVAD } from "@ricky0123/vad-react";
import { useState, useEffect } from "react";
import {
  getColorFromUsername,
  getEmojiFromUsername,
  randomUser,
} from "./utils/random";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const randomUsername = randomUser();
  useEffect(() => {
    setUsername(randomUsername);
  }, []);

  useMicVAD({
    startOnLoad: false,
  });

  const createRoom = async () => {
    if (!username) {
      alert("Please select emoji");
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

  const handleEmojiClick = () => {
    const randomUsername = randomUser();
    setUsername(randomUsername);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        onClick={handleEmojiClick}
        className="mt-4 w-32 h-32 flex items-center justify-center rounded-full cursor-pointer text-7xl"
        style={{ backgroundColor: getColorFromUsername(username) }}
      >
        {getEmojiFromUsername(username)}
      </div>
      <button
        onClick={createRoom}
        className="mt-4 px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-blue-400"
        disabled={loading}
      >
        {loading ? "Loading..." : "Create room"}
      </button>
    </div>
  );
}
