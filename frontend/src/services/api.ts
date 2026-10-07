import type { ChatRequest, ChatResponse } from "../types/chat";

const API_URL = "http://localhost:8000";

export async function sendChatMessage(
  data: ChatRequest,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return response.json();
}