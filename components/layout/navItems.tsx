import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  /** Show in the mobile bottom nav (space is limited there). */
  primary?: boolean;
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Central navigation definition, shared by Sidebar and BottomNav. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    primary: true,
    icon: <Icon><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Icon>,
  },
  {
    label: 'Explore',
    href: '/explore',
    primary: true,
    icon: <Icon><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>,
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    primary: true,
    icon: <Icon><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>,
  },
  {
    label: 'Notifications',
    href: '/notifications',
    primary: true,
    icon: <Icon><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>,
  },
  {
    label: 'Wallet',
    href: '/wallet',
    primary: true,
    icon: <Icon><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20" /></Icon>,
  },
];
