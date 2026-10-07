interface EmptyStateProps {
  onPrompt: (prompt: string) => void;
}

const prompts = [
  {
    title: "Explain code",
    prompt: "Explain this code and tell me how it works.",
  },
  {
    title: "Debug an error",
    prompt: "Help me debug this error.",
  },
  {
    title: "Review code",
    prompt: "Review my code and suggest improvements.",
  },
  {
    title: "Generate code",
    prompt: "Generate a clean React component for me.",
  },
];

export function EmptyState({
  onPrompt,
}: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-xl text-blue-400">
        AI
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-white">
        How can I help you build?
      </h1>

      <p className="mt-2 max-w-md text-center text-sm leading-6 text-slate-500">
        Ask me to explain, debug, review, refactor or generate code.
      </p>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {prompts.map((item) => (
          <button
            key={item.title}
            onClick={() => onPrompt(item.prompt)}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition-colors hover:border-slate-700 hover:bg-slate-900"
          >
            <p className="text-sm font-medium text-slate-200">
              {item.title}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}