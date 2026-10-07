import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({
  children,
}: MainContentProps) {
  return (
    <main className="min-w-0 flex-1 overflow-hidden">
      {children}
    </main>
  );
}