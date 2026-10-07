export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-3">
      <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500 [animation-delay:300ms]" />
    </div>
  );
}