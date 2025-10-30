type MessageType = "text" | "image" | "audio" | "canvas" | "map";

export interface Message {
  id: string;
  content: string;
  files: File[];
  avatar: string;
  role: "user" | "assistant";
  type: MessageType;
  timestamp: Date;
}
