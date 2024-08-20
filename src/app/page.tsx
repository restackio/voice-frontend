"use client";

import { useRouter } from "next/navigation";
import { useMicVAD } from "@ricky0123/vad-react";
import { useState, useEffect } from "react";
import { randomUser } from "./utils/random";
import Header from "@/components/Header";
import EmojiPicker from "@/components/EmojiPicker";
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

  return (
    <div className="h-screen bg-pink-200">
      <Header className="sticky top-0" />
      <div className="flex flex-col items-center justify-center py-96 space-y-20">
        <div className="text-center">
          <p className="text-7xl sm:text-8xl font-black text-pink-950">
            strawberry space
          </p>
        </div>
        <section id="room-creator">
          <EmojiPicker username={username} setEmojiname={setUsername} />
          <button
            onClick={createRoom}
            className="mt-4 px-4 py-2 bg-pink-500 text-gray-100 rounded hover:bg-pink-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create room"}
          </button>
        </section>
      </div>
    </div>
  );
}
