import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export interface AppShellProps {
  children: ReactNode;
  /** Optional right-hand rail (desktop only), e.g. trends or leaderboard. */
  rightRail?: ReactNode;
}

/**
 * Application chrome shared by every page: desktop sidebar, mobile top bar
 * and bottom nav, and a centered main column with an optional right rail.
 */
export function AppShell({ children, rightRail }: AppShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl">
      <Sidebar />

      <div className="flex min-w-0 flex-1">
        <main className="min-h-screen w-full border-neutral-200 pb-16 dark:border-neutral-800 md:border-x md:pb-0">
          <Navbar />
          {children}
        </main>

        {rightRail && (
          <div className="sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto p-4 lg:block">
            {rightRail}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
