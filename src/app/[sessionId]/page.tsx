"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WebSocketProvider } from "./WebSocketContext";
import { AudioSender } from "@/components/AudioSender";
import AudioReceiver from "@/components/AudioReceiver";
import ChatEvents from "@/components/ChatEvents";
import {
  getColorFromUsername,
  getEmojiFromUsername,
  randomUser,
} from "../utils/random";
import MessageInput from "@/components/MessageInput";
import EmojiPicker from "@/components/EmojiPicker";

export default function Session() {
  const router = useRouter();
  const sessionId = useParams().sessionId.toString();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [emojiName, setEmojiname] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    isLoading: true,
    track: "agent",
  });

  const addEvents = (newEvent: any) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emojiName.length > 0) {
      router.push(`/${sessionId}?username=${emojiName}`);
    }
  };

  useEffect(() => {
    if (!username) {
      const randomUsername = randomUser();
      setEmojiname(randomUsername);
    }
  }, [username]);

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pink-200">
        <form
          onSubmit={handleUsernameSubmit}
          className="space-y-4 flex flex-col items-center justify-center"
        >
          <div>
            <EmojiPicker username={emojiName} setEmojiname={setEmojiname} />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 text-neutral-100 rounded hover:bg-pink-600"
          >
            Join room {sessionId.split("-")[0]}
          </button>
        </form>
      </div>
    );
  }

  const uniqueTrackIds = Array.from(
    new Set(events.map((event) => event.data.trackId))
  );

  return (
    <WebSocketProvider sessionId={sessionId} username={username}>
      <div className="sm:flex h-screen">
        <div className="sm:w-1/3 p-4 border-r border-neutral-800 flex flex-col">
          <div className="grid grid-cols-4 auto-cols-max auto-rows-max flex-grow p-8">
            {uniqueTrackIds.map((trackId, index) => (
              <div key={index} className="col-span-1 space-y-4">
                <div
                  className="mt-4 w-24 h-24 flex items-center justify-center rounded-full text-5xl"
                  style={{
                    backgroundColor: getColorFromUsername(trackId),
                  }}
                >
                  {getEmojiFromUsername(trackId)}
                </div>
                <p className="text-neutral-500 text-xs">{trackId}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <MessageInput sessionId={sessionId} />
            <AudioSender sessionId={sessionId} setLoading={setLoading} />
          </div>
        </div>
        <div className="sm:w-2/3 p-4">
          <div className="max-w-3xl mx-auto">
            <ChatEvents
              sessionId={sessionId}
              events={events}
              loading={loading}
              username={username}
            />
            <AudioReceiver
              sessionId={sessionId}
              addEvents={addEvents}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
}
