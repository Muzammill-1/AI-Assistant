import { IconButton } from "../ui/IconButton";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
      <div>
        <h2 className="text-sm font-medium text-white">
          AI Developer Assistant
        </h2>

        <p className="text-xs text-slate-600">
          Build faster with AI
        </p>
      </div>

      <div className="flex items-center gap-1">
        <IconButton label="Search">
          ⌕
        </IconButton>

        <IconButton label="Settings">
          ⚙
        </IconButton>

        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-300">
          M
        </div>
      </div>
    </header>
  );
}