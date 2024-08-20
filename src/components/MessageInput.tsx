import { useWebSocket } from "@/app/[sessionId]/WebSocketContext";
import { useState } from "react";

export default function MessageInput({ sessionId }: { sessionId: string }) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { socket, isConnected, username } = useWebSocket();

  const sendMessage = () => {
    if (message.trim() || image) {
      const newEvent = {
        streamSid: sessionId,
        event: "user",
        data: {
          text: message,
          trackId: username,
          image: image ? URL.createObjectURL(image) : null,
        },
      };

      console.log("newEvent", newEvent);
      if (isConnected && socket) {
        socket.send(JSON.stringify(newEvent));
        setMessage("");
        setImage(null);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center bg-neutral-800 rounded-md gap-2 border border-neutral-600 p-1">
      <textarea
        rows={5}
        placeholder="Message room"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="px-4 py-2 placeholder:text-neutral-500 border-transparent bg-neutral-800 rounded-md w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="text-sm px-4 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-600 cursor-pointer"
      >
        Image
      </label>
      <button
        onClick={sendMessage}
        className="text-sm px-4 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-600"
      >
        Send
      </button>
    </div>
  );
}
