export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface ChatRequest {
  messages: {
    role: MessageRole;
    content: string;
  }[];
}

export interface ChatResponse {
  reply: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}