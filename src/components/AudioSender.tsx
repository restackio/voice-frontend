import { useMicVAD, utils } from "@ricky0123/vad-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WaveFile } from "wavefile";
import { useWebSocket } from "@/app/[sessionId]/WebSocketContext";
import { useRouter } from "next/navigation";

export const AudioSender = ({
  sessionId,
  setLoading,
}: {
  sessionId: string;
  setLoading: Dispatch<
    SetStateAction<{
      isLoading: boolean;
      track: string;
    }>
  >;
}) => {
  const router = useRouter();
  const { socket, isConnected, username } = useWebSocket();
  const [isTalking, setIsTalking] = useState(false); // State to track push-to-talk

  const vad = useMicVAD({
    startOnLoad: true, // Do not start on load
    modelURL: "http://localhost:3000/_next/static/chunks/silero_vad.onnx",
    workletURL:
      "http://localhost:3000/_next/static/chunks/vad.worklet.bundle.min.js",
    onSpeechStart: () => {
      if (!isTalking) {
        return;
      }
      setLoading({
        isLoading: true,
        track: "user",
      });
    },
    onSpeechEnd: (audio) => {
      if (!isTalking) {
        return;
      }
      console.log("onSpeechEnd");
      setLoading({
        isLoading: true,
        track: "agent",
      });
      // Encode the audio to WAV format
      const wavBuffer = utils.encodeWAV(audio);

      // Convert the WAV to mu-law
      const wav = new WaveFile();
      wav.fromBuffer(new Uint8Array(wavBuffer));
      wav.toSampleRate(8000);
      wav.toMuLaw();

      const muLawBuffer = wav.toBuffer();

      // Convert the mu-law buffer to base64
      const base64 = utils.arrayBufferToBase64(muLawBuffer);

      if (isConnected && socket) {
        const event = {
          streamSid: sessionId,
          event: "media",
          media: {
            username,
            track: "inbound",
            payload: base64,
          },
        };
        console.log("send", event);
        socket.send(JSON.stringify(event));
        setIsTalking(false);
      } else {
        console.log("not connected");
      }
    },
  });

  const handleCloseSession = () => {
    if (isConnected && socket) {
      const event = {
        streamSid: sessionId,
        event: "stop",
        username,
      };
      console.log("send", event);
      socket.send(JSON.stringify(event));
      router.push("/");
    } else {
      console.log("not connected");
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space" && !isTalking) {
      setIsTalking(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTalking]);

  return (
    <div className="w-full space-y-4 mt-10">
      <div
        className={`bg-blue-500 text-white px-4 py-2 rounded w-full text-center ${
          isTalking ? "bg-green-500" : "bg-blue-500"
        }`}
      >
        {isTalking ? "Talking..." : "Hit Space Once to Talk"}
      </div>
      <button
        onClick={handleCloseSession}
        className="bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Close Session
      </button>
    </div>
  );
};
