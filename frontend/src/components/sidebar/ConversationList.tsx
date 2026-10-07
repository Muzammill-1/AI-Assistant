const conversations = [
  "React authentication",
  "Fix API error",
  "Dashboard architecture",
];

export function ConversationList() {
  return (
    <div className="space-y-1">
      <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
        Recent
      </p>

      {conversations.map((conversation) => (
        <button
          key={conversation}
          className="w-full truncate rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
        >
          {conversation}
        </button>
      ))}
    </div>
  );
}