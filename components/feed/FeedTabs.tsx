'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface TabDef {
  label: string;
  href: string;
}

const TABS: TabDef[] = [
  { label: 'For You', href: '/' },
  { label: 'Following', href: '/following' },
  { label: 'Live', href: '/live' },
];

/**
 * Top-of-feed tab switcher. Uses real routes (route group `(feed)`) so each
 * tab is a linkable, static page.
 */
export function FeedTabs() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 flex border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      {TABS.map((tab) => {
        const active = normalize(pathname) === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'relative flex-1 py-3 text-center text-sm font-medium transition',
              active
                ? 'text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200',
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-12 rounded-full bg-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Treat a trailing slash the same as none, so `/following/` matches `/following`. */
function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}
