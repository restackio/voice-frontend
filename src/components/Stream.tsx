"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const Stream = ({ sessionId }: { sessionId: string }) => {
  const [isConnected, setIsConnected] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const connectWebSocket = useCallback(() => {
    webSocketRef.current = new WebSocket("ws://localhost:4000/connection");

    webSocketRef.current.onmessage = (event) => {
      console.log("event", event);
      const data = JSON.parse(event.data);
      if (
        data.event === "media" &&
        data.media.payload &&
        data.streamSid === sessionId
      ) {
        const audioBuffer = Uint8Array.from(atob(data.media.payload), (c) =>
          c.charCodeAt(0)
        );
        audioQueueRef.current.push(audioBuffer);
        appendToSourceBuffer();
      }
    };

    webSocketRef.current.onopen = () => {
      setIsConnected(true);
    };

    webSocketRef.current.onclose = () => {
      setIsConnected(false);
    };

    webSocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
  }, []);

  const appendToSourceBuffer = useCallback(() => {
    if (
      sourceBufferRef.current &&
      !sourceBufferRef.current.updating &&
      audioQueueRef.current.length > 0
    ) {
      const buffer = audioQueueRef.current.shift();
      if (buffer) {
        try {
          sourceBufferRef.current.appendBuffer(buffer);
        } catch (error) {
          console.error("Error appending buffer:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    const audioContext = audioContextRef.current;

    if (audioContext) {
      mediaSourceRef.current = new MediaSource();
      const mediaSource = mediaSourceRef.current;

      if (audioElementRef.current) {
        audioElementRef.current.src = URL.createObjectURL(mediaSource);
        audioElementRef.current.oncanplay = () => {
          if (audioElementRef.current && audioElementRef.current.paused) {
            audioElementRef.current.play().catch((error) => {
              console.error("Error playing audio:", error);
            });
          }
        };
      }

      mediaSource.addEventListener("sourceopen", () => {
        try {
          sourceBufferRef.current = mediaSource.addSourceBuffer(
            "audio/webm; codecs=opus"
          );
          sourceBufferRef.current.mode = "sequence"; // Ensure low latency
          sourceBufferRef.current.addEventListener(
            "updateend",
            appendToSourceBuffer
          );
        } catch (error) {
          console.error("Error adding SourceBuffer:", error);
        }
      });
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [appendToSourceBuffer]);

  useEffect(() => {
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <p>
        <button onClick={isConnected ? disconnectWebSocket : connectWebSocket}>
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </p>

      <audio ref={audioElementRef} controls autoPlay />
    </div>
  );
};

export default Stream;
