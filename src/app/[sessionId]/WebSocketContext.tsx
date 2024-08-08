"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface WebSocketContextProps {
  socket: WebSocket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{
  sessionId: string;
  children: React.ReactNode;
}> = ({ sessionId, children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      socketRef.current = new WebSocket(`ws://localhost:4000/connection`);
      socketRef.current.binaryType = "arraybuffer";

      socketRef.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connection established");
      };

      socketRef.current.onclose = (event) => {
        setIsConnected(false);
        console.log("WebSocket connection closed", event);
        retryConnection();
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
        retryConnection();
      };
    };

    const retryConnection = () => {
      setTimeout(() => {
        console.log("Retrying WebSocket connection...");
        connectWebSocket();
      }, 5000); // Retry after 5 seconds
    };

    connectWebSocket();

    return () => {
      // Do not close the WebSocket connection on cleanup
      // socketRef.current?.close();
    };
  }, [sessionId]);

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, isConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
