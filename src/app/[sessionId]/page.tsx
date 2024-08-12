"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { WebSocketProvider } from "./WebSocketContext";
import { AudioSender } from "@/components/AudioSender";
import AudioReceiver from "@/components/AudioReceiver";
import ChatEvents from "@/components/ChatEvents";

export default function Session() {
  const sessionId = useParams().sessionId.toString();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    isLoading: true,
    track: "agent",
  });

  const addEvents = (newEvent: any) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <WebSocketProvider sessionId={sessionId}>
      <div className="flex flex-col items-center justify-center h-screen space-y-10">
        <div className="max-w-4xl mx-auto">
          <ChatEvents sessionId={sessionId} events={events} loading={loading} />
          <AudioReceiver
            sessionId={sessionId}
            addEvents={addEvents}
            setLoading={setLoading}
          />
          <AudioSender sessionId={sessionId} setLoading={setLoading} />
        </div>
      </div>
    </WebSocketProvider>
  );
}
