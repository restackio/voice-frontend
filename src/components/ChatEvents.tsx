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
      <h3>Received Events for session {sessionId}</h3>
      <div className="h-full overflow-y-auto p-4">
        <ul className="space-y-4">
          {events
            .filter((event) => ["message"].includes(event.event))
            .map((event, index) => (
              <li
                key={index}
                className={`flex ${
                  event.data.username === username
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div className="flex gap-2 text-left max-w-xs">
                  <p
                    className={`${
                      event.data.username === username
                        ? "bg-blue-500"
                        : "bg-neutral-700 "
                    } text-white p-4 rounded-xl`}
                  >
                    {event.data?.text.replaceAll("•", "")}
                  </p>
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
