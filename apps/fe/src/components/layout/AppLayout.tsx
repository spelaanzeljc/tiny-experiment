import type { ReactNode } from "react";

import { AppHeader } from "./app-header/AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <AppHeader />

      <main className="flex w-full flex-1 flex-col">
        <div className="w-full flex-1 px-4 py-4">{children}</div>
      </main>
    </div>
  );
}
