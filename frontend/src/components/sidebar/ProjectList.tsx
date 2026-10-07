const projects = [
  "AI Developer Assistant",
  "GFC Management",
  "Gemnixx",
];

export function ProjectList() {
  return (
    <div className="space-y-1">
      <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
        Projects
      </p>

      {projects.map((project) => (
        <button
          key={project}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="truncate">{project}</span>
        </button>
      ))}
    </div>
  );
}