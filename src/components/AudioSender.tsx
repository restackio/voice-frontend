import { useMicVAD, utils } from "@ricky0123/vad-react";
import { useEffect } from "react";
import { WaveFile } from "wavefile";
import { useWebSocket } from "@/app/[sessionId]/WebSocketContext";
import { useRouter } from "next/navigation";

export const AudioSender = ({ sessionId }: { sessionId: string }) => {
  const router = useRouter();
  const { socket, isConnected } = useWebSocket();

  const vad = useMicVAD({
    startOnLoad: true,
    modelURL: "http://localhost:3000/_next/static/chunks/silero_vad.onnx",
    workletURL:
      "http://localhost:3000/_next/static/chunks/vad.worklet.bundle.min.js",
    onSpeechEnd: (audio) => {
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
      // const url = `data:audio/wav;base64,${base64}`;
      // setAudioList((old) => [url, ...old]);
      if (isConnected && socket) {
        const event = {
          streamSid: sessionId,
          event: "media",
          media: {
            track: "inbound",
            payload: base64,
          },
        };
        console.log("send", event);
        socket.send(JSON.stringify(event));
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
      };
      console.log("send", event);
      socket.send(JSON.stringify(event));
      router.push("/");
    } else {
      console.log("not connected");
    }
  };

  useEffect(() => {
    vad.start();

    return () => {
      vad.pause();
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="bg-neutral-900 px-5 py-3 rounded-lg ">
        <p className="text-neutral-100">
          {vad.listening && "Ask your question"}
        </p>
      </div>
      <p className="text-center h-10 text-neutral-500">
        {vad.loading && "loading"}
        {vad.errored && "error"}
        {vad.userSpeaking && "Sending..."}
      </p>
      <button
        onClick={handleCloseSession}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Close Session
      </button>
    </div>
  );
};

export default AudioSender;
