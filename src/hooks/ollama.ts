import { oa } from "@amatelic/oa";
import { useState } from "react";
import type { Message } from "../types/message";

const instance = await oa({
  model: "qwen2.5-coder:7b",
  stream: true,
});

export const useOllama = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  function addMessage(message: string, files: File[] = []) {
    setMessages((messages) => [
      ...messages,
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        content: message,
        files: files,
        role: "user",
        type: "text",
        avatar: "gdo customer",
      },
    ]);
    chatResponse(message);
  }

  async function chatResponse(text: string) {
    try {
      // Adding loading state???
      const size = messages.length + 1;
      setMessages((messages) => {
        return [
          ...messages,
          {
            id: Date.now().toString() + "-assistant",
            timestamp: new Date(),
            content: "loading",
            files: [],
            role: "assistant",
            type: "text",
            avatar: "assitent",
          },
        ];
      });

      if (text.includes("@geojson")) {
        const geojson = await fetch("http://localhost:5173/api/map/resource", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            type: text,
          }),
        });
        const payload = await geojson.json();
        setMessages((messages) => {
          if (messages[size]) {
            messages[size].content = payload;
            return [...messages];
          }
        });
        return;
      }

      const response = await instance.prompt(text).call();

      setMessages((messages) => {
        if (messages[size]) {
          messages[size].content = "";
          return [...messages];
        }
      });

      for await (const chunk of response) {
        setMessages((messages) => {
          if (messages[size]) {
            messages[size].content += chunk.message.content;
            return [...messages];
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    chatResponse,
    messages,
    addMessage,
  };
};
