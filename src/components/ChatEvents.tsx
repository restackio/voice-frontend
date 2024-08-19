import { getColorFromUsername, getEmojiFromUsername } from "@/app/utils/random";
import React from "react";

interface ChatEventsProps {
  sessionId: string;
  username: string;
  loading: {
    isLoading: boolean;
    track: string;
  };
  events: any[];
}

const ChatEvents: React.FC<ChatEventsProps> = ({
  sessionId,
  username,
  loading,
  events,
}) => {
  console.log("events", events);
  return (
    <div className="space-y-10">
      <div className="h-full overflow-y-auto p-4">
        <ul className="space-y-4 divide-y divide-neutral-800">
          {events
            .filter((event) => ["assistant", "user"].includes(event.event))
            .map((event, index) => (
              <li key={index}>
                <div className="p-2 grid grid-cols-6 sm:grid-cols-12 gap-4 text-left w-full items-center">
                  <div
                    className="mt-4 w-10 h-10 flex items-center justify-center rounded-full text-xl"
                    style={{
                      backgroundColor: getColorFromUsername(event.data.trackId),
                    }}
                  >
                    {getEmojiFromUsername(event.data.trackId)}
                  </div>
                  <div className="col-span-4 sm:col-span-11">
                    <p className="text-neutral-700 text-xs">
                      {event.data.trackId}
                    </p>
                    <span className="text-md font-sans font-light">
                      {event.data?.text.replaceAll("•", "")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          {loading.isLoading && (
            <li
              key="loading"
              className={`${
                loading.track === "agent" ? "justify-start" : "justify-end"
              } flex`}
            >
              <div className="max-w-xs">
                <p
                  className={`${
                    loading.track === "agent" ? "bg-neutral-700" : "bg-blue-500"
                  } text-white px-4 py-2 rounded-xl animate-pulse`}
                >
                  ...
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatEvents;
