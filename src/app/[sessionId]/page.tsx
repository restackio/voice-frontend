"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { WebSocketProvider } from "./WebSocketContext";
import { AudioSender } from "@/components/AudioSender";
import AudioReceiver from "@/components/AudioReceiver";
import ChatEvents from "@/components/ChatEvents";
import Image from 'next/image';

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
      <div className="flex flex-col items-center justify-center min-h-screen py-10">
        <div className="w-64 h-64 mb-4">
          <Image src="/image.jpeg" alt="Historical figure" width={256} height={256} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Epoche-Guess</h1>
        <h2 className="text-xl mb-6 text-center">
          Ask me 10 questions and guess from which year I am.
        </h2>
        <div className="max-w-4xl mx-auto w-full">
          <ChatEvents sessionId={sessionId} events={events} loading={loading} />
          <AudioReceiver
            sessionId={sessionId}
            addEvents={addEvents}
            loading={loading}
            setLoading={setLoading}
          />
          <AudioSender sessionId={sessionId} setLoading={setLoading} />
        </div>
      </div>
    </WebSocketProvider>
  );
}