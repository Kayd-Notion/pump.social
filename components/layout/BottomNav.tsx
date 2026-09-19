'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './navItems';
import { cn } from '@/lib/utils/cn';

/** Mobile bottom navigation bar. Hidden on desktop (md and up). */
export function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.primary);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90 md:hidden">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              'flex flex-1 items-center justify-center py-3 transition',
              active ? 'text-accent' : 'text-neutral-500',
            )}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}

function isActive(pathname: string, href: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  if (href === '/') return p === '/';
  return p === href || p.startsWith(`${href}/`);
}
