import {
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";

import { sendChatMessage } from "@/services/api";

const chatModel: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    const chatMessages = messages
      .filter((message) => {
        return message.role === "user" || message.role === "assistant";
      })
      .map((message) => {
        const text = message.content
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");

        return {
          role: message.role,
          content: text,
        };
      })
      .filter((message) => message.content.trim());

    if (chatMessages.length === 0) {
      throw new Error("No user message found.");
    }

    const response = await sendChatMessage(
      {
        messages: chatMessages,
      },
      abortSignal
    );

    return {
      content: [
        {
          type: "text",
          text: response.reply,
        },
      ],
    };
  },
};

export function useAIRuntime() {
  return useLocalRuntime(chatModel);
}