import { FolderKanban } from "lucide-react";

const projects = [
  "AI Developer Assistant",
  "GFC Management",
  "Gemnixx",
];

export function ProjectList() {
  return (
    <div className="space-y-1">
      <div className="mb-2 px-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Projects
        </p>
      </div>

      {projects.map((project, index) => (
        <button
          key={project}
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-900"
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
              index === 0
                ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                : "border-slate-800 bg-slate-900 text-slate-500"
            }`}
          >
            <FolderKanban className="h-3.5 w-3.5" />
          </div>

          <span className="truncate text-xs text-slate-400 group-hover:text-slate-200">
            {project}
          </span>
        </button>
      ))}
    </div>
  );
}