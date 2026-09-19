import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WalletProvider } from '@/components/wallet/WalletProvider';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'pump.social',
  description:
    'A Solana social network where you pump the posts you love — sponsoring creators in SOL to push them up the board and extend their life.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

/**
 * Root layout. Wraps the whole app in the wallet context (so connection
 * state is global) and the shared chrome (sidebar / bottom nav). Individual
 * pages render inside the main column.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <AppShell>{children}</AppShell>
        </WalletProvider>
      </body>
    </html>
  );
}
