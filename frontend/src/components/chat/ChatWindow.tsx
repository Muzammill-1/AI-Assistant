import { useChat } from "../../hooks/useChat";
import { EmptyState } from "./EmptyState";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

export function ChatWindow() {
  const { messages, loading, sendMessage } = useChat();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-slate-950">
      {messages.length === 0 ? (
        <EmptyState onPrompt={sendMessage} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MessageList messages={messages} />

          {loading && (
            <div className="mx-auto w-full max-w-4xl px-4">
              <TypingIndicator />
            </div>
          )}
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
}