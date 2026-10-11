
import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[#212127]">
      <div className="h-full min-w-0">{children}</div>
    </main>
  );
}
