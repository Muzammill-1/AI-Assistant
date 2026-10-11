
import type { ReactNode } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { Topbar } from "./Topbar";
import { MainContent } from "./MainContent";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#212127] text-[#F4F0F8]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
