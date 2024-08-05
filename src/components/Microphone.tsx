"use client";

import React, { useState, useRef, useCallback } from "react";
// import { v4 as uuidv4 } from "uuid";

const Microphone = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const sendAudioData = useCallback(
    ({
      streamId,
      audioBlob,
      mimeType,
    }: {
      streamId: string;
      audioBlob: Blob;
      mimeType: string;
    }) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const arrayBuffer = reader.result as ArrayBuffer;
          const base64String = Buffer.from(arrayBuffer).toString("base64");
          const event = {
            streamId,
            event: "media",
            media: {
              payload: base64String,
              mimeType,
            },
          };
          if (webSocketRef.current?.readyState === WebSocket.OPEN) {
            console.log("Sent event", event);
            webSocketRef.current.send(JSON.stringify(event));
          } else {
            console.error(
              "WebSocket is not open. ReadyState:",
              webSocketRef.current?.readyState
            );
          }
        } else {
          console.error("Failed to read audio blob");
        }
      };
      reader.onerror = () => {
        console.error("Error reading audio blob", reader.error);
      };
      reader.readAsArrayBuffer(audioBlob);
    },
    []
  );

  const startConnection = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia not supported on your browser!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const input = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      const dataArray = new Uint8Array(analyserRef.current.fftSize);
      input.connect(analyserRef.current);

      webSocketRef.current = new WebSocket("ws://localhost:4000/connection");

      // const newStreamId = uuidv4();
      const newStreamId = "new-1";

      setStreamId(newStreamId);

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && newStreamId) {
          console.log("Captured audioBlob:", event.data);
          sendAudioData({
            streamId: newStreamId,
            audioBlob: event.data,
            mimeType: mediaRecorderRef.current?.mimeType || "",
          });
        }
      };

      const checkVoiceActivity = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteTimeDomainData(dataArray);
          const isVoice = dataArray.some(
            (value) => value > 128 + 10 || value < 128 - 10
          );
          if (isVoice && mediaRecorderRef.current?.state === "inactive") {
            mediaRecorderRef.current.start(100); // Record in chunks of 100ms
          } else if (
            !isVoice &&
            mediaRecorderRef.current?.state === "recording"
          ) {
            mediaRecorderRef.current.stop();
          }
        }
      };

      const voiceActivityInterval = setInterval(checkVoiceActivity, 100);

      setIsConnected(true);

      return () => clearInterval(voiceActivityInterval);
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  }, [sendAudioData]);

  const stopConnection = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    setIsConnected(false);
    setStreamId(null);
  }, []);

  return (
    <div>
      <p>
        <button onClick={isConnected ? stopConnection : startConnection}>
          {isConnected ? "Stop Connection" : "Start Connection"}
        </button>
      </p>
      <p>{streamId}</p>
    </div>
  );
};

export default Microphone;
