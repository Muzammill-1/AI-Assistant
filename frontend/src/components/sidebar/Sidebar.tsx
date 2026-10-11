
import { useState } from "react";
import {
  FolderKanban,
  MessageSquare,
  Plus,
  Search,
  Settings,
} from "lucide-react";

import { ConversationList } from "./ConversationList";
import { ProjectList } from "./ProjectList";
import { Button } from "../ui/button";

type ActiveSection = "chats" | "projects";

export function Sidebar() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("chats");

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#34343C] bg-[#19191F] text-[#F4F0F8]">
      {/* MUVIZ Brand */}
      <div className="flex h-16 shrink-0 items-center  px-4">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/Logo%20(2).png"
            alt="muviz logo"
            className="h-10 w-auto max-w-12 shrink-0 object-contain"
          />

          <span
            className="bg-clip-text text-2xl text-transparent"
            style={{
              fontFamily: "'Momo Trust Display', sans-serif",
              backgroundImage:
                "linear-gradient(135deg, #d8d1e1 0%, #80749A 35%, #bcb0cc 50%, #655777 70%, #d8d1e1 100%)",
              WebkitBackgroundClip: "text",
            }}
          >
            muviz
          </span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2 p-3">
        <Button
          className="h-10 w-full justify-start gap-2 rounded-lg bg-[#80749A] text-sm font-medium text-white shadow-none transition-colors hover:bg-[#716587]"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4" />
          <span>New chat</span>

          <span className="ml-auto hidden rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/80 sm:block">
            N
          </span>
        </Button>

        <button
          type="button"
          className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#34343C] bg-[#212127] px-3 text-sm text-[#AAA5B4] transition-colors hover:border-[#45414C] hover:bg-[#2B2B32] hover:text-[#F4F0F8]"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span>Search chats</span>

          <span className="ml-auto hidden text-[10px] text-[#AAA5B4]/70 sm:block">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Chats / Projects Navigation */}
      <nav className="px-3">
        <div className="grid grid-cols-2 rounded-lg bg-[#212127] p-1">
          <button
            type="button"
            onClick={() => setActiveSection("chats")}
            aria-pressed={activeSection === "chats"}
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-colors ${
              activeSection === "chats"
                ? "bg-[#302C37] text-[#F4F0F8] shadow-sm"
                : "text-[#AAA5B4] hover:bg-[#2B2B32] hover:text-[#F4F0F8]"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chats
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("projects")}
            aria-pressed={activeSection === "projects"}
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium transition-colors ${
              activeSection === "projects"
                ? "bg-[#302C37] text-[#F4F0F8] shadow-sm"
                : "text-[#AAA5B4] hover:bg-[#2B2B32] hover:text-[#F4F0F8]"
            }`}
          >
            <FolderKanban className="h-3.5 w-3.5" />
            Projects
          </button>
        </div>
      </nav>

      {/* Dynamic Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {activeSection === "chats" ? (
          <ConversationList />
        ) : (
          <ProjectList />
        )}
      </div>

      {/* User Profile */}
      <div className="border-t border-[#34343C] p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#212127]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#625773] bg-[#302C37] text-xs font-semibold text-[#C4B5D9]">
            M
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#F4F0F8]">
              Muzammil
            </p>

            <p className="truncate text-[10px] text-[#AAA5B4]">
              Developer
            </p>
          </div>

          <Settings className="h-4 w-4 shrink-0 text-[#AAA5B4] transition-colors group-hover:text-[#C4B5D9]" />
        </button>
      </div>
    </aside>
  );
}
