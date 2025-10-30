import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import type { Message } from "../../types/message";
import { useOllama } from "../../hooks/ollama";

// @TODO maybe use this a customer aqusition example
export const LLMChat = () => {
  const { messages, addMessage } = useOllama();
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
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex justify-center">
        <ChatInput
          onMessage={(message: string, files: File[] = []) => {
            addMessage(message, files);
          }}
        />
      </div>
    </div>
  );
};

export default LLMChat;
