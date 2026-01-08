// import { oa } from "@amatelic/oa";
import { useState } from "react";
import type { Message } from "../types/message";

// const instance = await oa({
//   model: "qwen2.5-coder:7b",
//   stream: true,
// });

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

      // Geo json options
      if (text.includes("@geojson")) {
        const payload = await getGeoJSON(text);
        setMessages((messages) => {
          if (messages[size]) {
            messages[size].content = payload;
            return [...messages];
          }
        });
        return;
      }

      // Default ollama call
      // const response = await instance.prompt(text).call();

      setMessages((messages) => {
        if (messages[size]) {
          messages[size].content = "";
          return [...messages];
        }
      });

      const response = await wordGenerator(`
  **Need Help with Web Development or AI?**

  🚀
  Whether you’re building a new project, optimizing your stack, or exploring AI solutions, I’m here to help!

  📅
  **Schedule a free 15-minute consultation** to discuss your ideas, challenges, or goals:

  👉 [Book a slot on Calendly](https://calendly.com/amatelic93/15min)

  Let’s turn your vision into reality—one line of code at a time!
        `);

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

async function getGeoJSON(text: string) {
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
  return payload;
}

async function* wordGenerator(text: string, delay = 50) {
  const regex = /(\*\*[^*]+?\*\*|\*[^*]+?\*|[^\s*]+|\s+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const token = match[0];
    await new Promise((resolve) => setTimeout(resolve, delay));
    yield {
      message: {
        content: token,
      },
    };
  }
}

// function streamText(elementId, text, delay = 100) {
//   const generator = wordGenerator(text);
//   const element = document.getElementById(elementId);
//   element.textContent = "";

//   const timer = setInterval(() => {
//     const { value, done } = generator.next();
//     if (done) {
//       clearInterval(timer);
//       return;
//     }
//     element.textContent += (element.textContent ? " " : "") + value;
//   }, delay);
// }
