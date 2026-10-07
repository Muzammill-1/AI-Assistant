import type { ChatMessage } from "../../types/chat";
import { CodeBlock } from "./CodeBlock";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  const parts = message.content.split("```");

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl ${
          isUser
            ? "rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white"
            : "text-slate-200"
        }`}
      >
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <CodeBlock
                key={index}
                code={part}
                language="code"
              />
            );
          }

          return (
            <p
              key={index}
              className="whitespace-pre-wrap text-sm leading-7"
            >
              {part}
            </p>
          );
        })}
      </div>
    </div>
  );
}