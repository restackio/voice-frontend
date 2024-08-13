import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { WaveFile } from "wavefile";
import { useWebSocket } from "@/app/[sessionId]/WebSocketContext";

interface AudioReceiverProps {
  sessionId: string;
  addEvents: (newEvent: any) => void;
  setLoading: Dispatch<
    SetStateAction<{
      isLoading: boolean;
      track: string;
    }>
  >;
  loading: {
    isLoading: boolean;
    track: string;
  };
}

const AudioReceiver: React.FC<AudioReceiverProps> = ({
  sessionId,
  addEvents,
  setLoading,
  loading,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { socket, isConnected } = useWebSocket();
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = volume;

    if (isConnected && socket) {
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("event data", data);

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
          setLoading({
            isLoading: false,
            track: "agent",
          });
        } else {
          addEvents(data);
        }
      };
    }
  }, [isConnected, socket, sessionId]);

  useEffect(() => {
    if (loading.track === "user" && loading.isLoading) {
      adjustVolume(0.2); // Lower volume to 20%
    } else {
      adjustVolume(1); // Restore volume to 100%
    }
  }, [loading]);

  const playAudio = async (audioData: Uint8Array) => {
    try {
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

      const targetSampleRate = 16000;
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
      sourceNodeRef.current
        .connect(gainNodeRef.current!)
        .connect(audioContextRef.current!.destination);
      sourceNodeRef.current.start();
    } catch (error) {
      console.error("Error decoding audio data:", error);
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  return null;
};

export default AudioReceiver;
