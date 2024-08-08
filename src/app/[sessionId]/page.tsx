"use client";

import { useParams } from "next/navigation";
import { WebSocketProvider } from "./WebSocketContext";
import AudioSender from "@/components/AudioSender";
import AudioReceiver from "@/components/AudioReceiver";

export default function Session() {
  const sessionId = useParams().sessionId.toString();
  return (
    <WebSocketProvider sessionId={sessionId}>
      <div className="flex flex-col items-center justify-center h-screen space-y-10">
        <div className="max-w-4xl mx-auto">
          <AudioReceiver sessionId={sessionId} />
        </div>
        <div>
          <AudioSender sessionId={sessionId} />
        </div>
      </div>
    </WebSocketProvider>
  );
}
