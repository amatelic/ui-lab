import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import type { Message } from "../../types/message";

export const LLMChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  return (
    <div className="flex flex-col w-full relative p-2">
      <ChatList
        messages={messages}
        fetchMore={async () => {
          return [];
        }}
        hasMore={false}
      />
      <div className="h-40"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <ChatInput
          onMessage={(message: string) => {
            console.log("Message sent:", message);
            setMessages([
              ...messages,
              {
                id: Date.now().toString(),
                timestamp: new Date(),
                content: message,
                role: "user",
                type: "text",
              },
            ]);
          }}
        />
      </div>
    </div>
  );
};

export default LLMChat;
