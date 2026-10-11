import { MessageSquare } from "lucide-react";

const conversations = [
  {
    title: "React authentication",
    time: "Today",
  },
  {
    title: "Fix API error",
    time: "Yesterday",
  },
  {
    title: "Dashboard architecture",
    time: "Yesterday",
  },
];

export function ConversationList() {
  return (
    <div className="space-y-1">
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Recent
        </p>

        <span className="text-[10px] text-slate-700">
          {conversations.length}
        </span>
      </div>

      {conversations.map((conversation) => (
        <button
          key={conversation.title}
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-900"
        >
          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-colors group-hover:text-slate-400" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-400 group-hover:text-slate-200">
              {conversation.title}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-700">
              {conversation.time}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}