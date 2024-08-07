"use client";

import Microphone from "@/components/Microphone";
import Stream from "@/components/Stream";
import { useParams } from "next/navigation";

export default function Session() {
  const sessionId = useParams().sessionId.toString();
  return (
    <div className="flex flex-row items-center justify-center h-screen space-y-10">
      <div>
        <Microphone sessionId={sessionId} />
      </div>
      <div>
        <Stream sessionId={sessionId} />
      </div>
    </div>
  );
}
