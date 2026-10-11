
import {
  ChevronDown,
  Search,
  Settings,
  Share2,
} from "lucide-react";

import { IconButton } from "../ui/IconButton";

export function Topbar() {
  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center justify-between  bg-[#212127]/95 px-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium text-[#F4F0F8]">
            New chat
          </h2>
        </div>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-lg border border-[#45414C] bg-[#2B2B32] px-3 py-1.5 text-xs text-[#D4D4D8] transition-colors hover:bg-[#34343C] sm:flex"
          aria-label="Select AI model"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#C4B5D9]" />
          <span>GPT-OSS 120B</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#AAA5B4]" />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton label="Share conversation">
          <Share2 className="h-4 w-4" />
        </IconButton>

        <IconButton label="Search chats">
          <Search className="h-4 w-4" />
        </IconButton>

        <IconButton label="Settings">
          <Settings className="h-4 w-4" />
        </IconButton>
      </div>
    </header>
  );
}
