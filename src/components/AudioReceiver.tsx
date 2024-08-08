import React, { useEffect, useRef, useState } from "react";
import { WaveFile } from "wavefile";
import { useWebSocket } from "@/app/[sessionId]/WebSocketContext";

interface AudioReceiverProps {
  sessionId: string;
}

const AudioReceiver: React.FC<AudioReceiverProps> = ({ sessionId }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const { socket, isConnected } = useWebSocket();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    audioContextRef.current = new AudioContext();

    if (isConnected && socket) {
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("data", data);

        if (data.streamSid !== sessionId) {
          return;
        }

        if (data.event === "media") {
          const wav = new WaveFile();
          wav.fromScratch(
            1,
            8000,
            "8m",
            Buffer.from(data.media.payload, "base64")
          );
          wav.fromMuLaw();
          const arrayBuffer = wav.toBuffer();
          await playAudio(arrayBuffer);
        } else {
          // Push new event to the state
          setEvents((prevEvents) => [...prevEvents, data]);
        }
      };
    }
  }, [isConnected, socket, sessionId]);

  const playAudio = async (audioData: Uint8Array) => {
    try {
      console.log("audioData:", audioData);
      console.log("Received audio data length:", audioData.byteLength);
      if (audioData.byteLength === 0) {
        throw new Error("Received empty audio data");
      }

      const arrayBuffer = audioData.buffer.slice(
        audioData.byteOffset,
        audioData.byteOffset + audioData.byteLength
      );

      const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
        audioContextRef.current!.decodeAudioData(arrayBuffer, resolve, reject);
      });

      let finalBuffer = audioBuffer;

      const targetSampleRate = 8000;
      console.log("audioBuffer.sampleRate", audioBuffer.sampleRate);
      if (audioBuffer.sampleRate !== targetSampleRate) {
        const offlineContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          audioBuffer.duration * targetSampleRate,
          targetSampleRate
        );

        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start(0);

        finalBuffer = await offlineContext.startRendering();
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }

      sourceNodeRef.current = audioContextRef.current!.createBufferSource();
      sourceNodeRef.current.buffer = finalBuffer;
      sourceNodeRef.current.connect(audioContextRef.current!.destination);
      sourceNodeRef.current.start();
    } catch (error) {
      console.error("Error decoding audio data:", error);
    }
  };

  return (
    <div>
      <p>Receiving audio for session: {sessionId}</p>
      <div>
        <h3>Received Events:</h3>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AudioReceiver;
