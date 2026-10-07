import { useState } from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || loading) return;

    onSend(value);
    setValue("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-4">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={3}
          placeholder="Ask your AI developer assistant..."
          className="w-full resize-none bg-transparent px-4 pt-4 text-sm leading-6 text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <span className="text-xs text-slate-600">
            Enter to send · Shift + Enter for new line
          </span>

          <Button
            onClick={submit}
            disabled={!value.trim() || loading}
          >
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}