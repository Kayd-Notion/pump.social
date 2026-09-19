'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './navItems';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { useWallet } from '@/hooks/useWallet';
import { cn } from '@/lib/utils/cn';

/** Desktop left sidebar navigation. Hidden on small screens. */
export function Sidebar() {
  const pathname = usePathname();
  const { connected, username } = useWallet();

  return (
    <aside className="sticky top-0 hidden h-screen w-16 flex-col justify-between border-r border-neutral-200 px-2 py-4 dark:border-neutral-800 md:flex lg:w-60 lg:px-4">
      <div>
        <Link href="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="text-xl font-black text-accent">◎</span>
          <span className="hidden text-lg font-bold lg:inline">pump.social</span>
        </Link>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 rounded-full px-2 py-2.5 transition lg:px-4',
                  active
                    ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                )}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}

          {connected && username && (
            <Link
              href={`/profile/${username}`}
              className={cn(
                'flex items-center gap-4 rounded-full px-2 py-2.5 transition lg:px-4',
                isActive(pathname, `/profile/${username}`)
                  ? 'font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
              )}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden lg:inline">Profile</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="hidden lg:block">
        <WalletConnectButton fullWidth />
      </div>
    </aside>
  );
}

function isActive(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (href === '/') return p === '/';
  return p === href || p.startsWith(`${href}/`);
}
