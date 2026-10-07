import { useState } from "react";
import { ConversationList } from "./ConversationList";
import { ProjectList } from "./ProjectList";
import { Button } from "../ui/button";

export function Sidebar() {
  const [activeSection, setActiveSection] = useState<
    "chats" | "projects"
  >("chats");

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center border-b border-slate-800 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
            AI
          </div>

          <span className="font-semibold text-white">
            Dev Assistant
          </span>
        </div>
      </div>

      <div className="p-3">
        <Button
          className="w-full"
          onClick={() => {}}
        >
          + New Chat
        </Button>
      </div>

      <nav className="flex gap-1 px-3">
        <button
          onClick={() => setActiveSection("chats")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs ${
            activeSection === "chats"
              ? "bg-slate-800 text-white"
              : "text-slate-500 hover:text-white"
          }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveSection("projects")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs ${
            activeSection === "projects"
              ? "bg-slate-800 text-white"
              : "text-slate-500 hover:text-white"
          }`}
        >
          Projects
        </button>
      </nav>

      <div className="flex-1 overflow-y-auto p-3">
        {activeSection === "chats" ? (
          <ConversationList />
        ) : (
          <ProjectList />
        )}
      </div>

      <div className="border-t border-slate-800 p-3">
        <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-900 hover:text-white">
          ⚙ Settings
        </button>
      </div>
    </aside>
  );
}