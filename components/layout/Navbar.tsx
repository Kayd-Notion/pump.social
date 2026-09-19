'use client';

import Link from 'next/link';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

export interface NavbarProps {
  /** Title shown in the mobile top bar. */
  title?: string;
}

/**
 * Mobile top bar: brand + wallet connect. On desktop the sidebar owns
 * navigation, so this is hidden there.
 */
export function Navbar({ title = 'pump.social' }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-2.5 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90 md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg font-black text-accent">◎</span>
        <span className="font-bold">{title}</span>
      </Link>
      <WalletConnectButton size="sm" />
    </header>
  );
}
