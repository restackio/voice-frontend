import { useWebSocket } from "@/app/[sessionId]/WebSocketContext";
import { useState } from "react";

export default function MessageInput({ sessionId }: { sessionId: string }) {
  const [message, setMessage] = useState("");
  const { socket, isConnected, username } = useWebSocket();

  const sendMessage = () => {
    if (message.trim()) {
      const newEvent = {
        streamSid: sessionId,
        event: "user",
        data: {
          text: message,
          trackId: username,
        },
      };

      console.log("newEvent", newEvent);
      if (isConnected && socket) {
        socket.send(JSON.stringify(newEvent));
        setMessage("");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-neutral-800 rounded-full gap-2 border border-neutral-600 p-1">
      <input
        type="text"
        placeholder="Message room"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="px-4 py-2 placeholder:text-neutral-500 border-transparent bg-neutral-800 rounded-full w-full"
      />
      <button
        onClick={sendMessage}
        className="text-sm px-4 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-600"
      >
        Send
      </button>
    </div>
  );
}
