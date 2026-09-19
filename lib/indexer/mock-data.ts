import type { Post, Pump, User } from '@/types';

/**
 * Fake dataset used until the real indexing service and smart contract are
 * ready. Everything the read-side of the app renders (feed, leaderboard,
 * profiles, pump history) is derived from these fixtures.
 *
 * Timestamps are computed relative to a fixed "now" at module load so the
 * feed looks alive (countdowns, relative ages) without a backend.
 */

const NOW = Date.now();
const HOUR = 60 * 60 * 1000;

function iso(offsetMs: number): string {
  return new Date(NOW + offsetMs).toISOString();
}

/** Supported countries for the country leaderboard selector. */
export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: readonly Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
];

function avatar(seed: string): string {
  // Deterministic placeholder avatars, no external asset pipeline needed.
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
}

export const MOCK_USERS: User[] = [
  {
    id: 'FZ7k...aa01',
    walletAddress: 'FZ7kQ2m9Wn4pX1sTuVbYcErGhJkLmNpQrStUvWxYz01',
    username: 'satoshigirl',
    displayName: 'Satoshi Girl',
    avatarUrl: avatar('satoshigirl'),
    bio: 'Building on Solana. Pumping the culture.',
    countryCode: 'US',
    followers: 12400,
    following: 320,
    createdAt: iso(-90 * 24 * HOUR),
  },
  {
    id: 'Bq3d...bb02',
    walletAddress: 'Bq3dLp8Rf2gH5jKmNqSt7uVwXyZaBcDeFgHiJkLmn02',
    username: 'degenmax',
    displayName: 'Degen Max',
    avatarUrl: avatar('degenmax'),
    bio: 'Full-time degen. Not financial advice.',
    countryCode: 'FR',
    followers: 8900,
    following: 210,
    createdAt: iso(-60 * 24 * HOUR),
  },
  {
    id: 'Cw9f...cc03',
    walletAddress: 'Cw9fMr4Tn6hJ8kLpQsUv1wXyZaBcDeFgHiJkLmNop03',
    username: 'sol_sensei',
    displayName: 'Sol Sensei',
    avatarUrl: avatar('sol_sensei'),
    bio: 'Teaching web3 one thread at a time.',
    countryCode: 'JP',
    followers: 23100,
    following: 88,
    createdAt: iso(-120 * 24 * HOUR),
  },
  {
    id: 'Dx2g...dd04',
    walletAddress: 'Dx2gNs5Uo7iK9lMpRtVw2xYzAbCdEfGhIjKlMnOpq04',
    username: 'pixelqueen',
    displayName: 'Pixel Queen',
    avatarUrl: avatar('pixelqueen'),
    bio: 'Generative art & onchain vibes.',
    countryCode: 'BR',
    followers: 5400,
    following: 640,
    createdAt: iso(-45 * 24 * HOUR),
  },
  {
    id: 'Ey5h...ee05',
    walletAddress: 'Ey5hPt6Vp8jL1mNqSuWx3yZaBcDeFgHiJkLmNoPqr05',
    username: 'chainmonk',
    displayName: 'Chain Monk',
    avatarUrl: avatar('chainmonk'),
    bio: 'Slow is smooth, smooth is fast.',
    countryCode: 'DE',
    followers: 3200,
    following: 150,
    createdAt: iso(-30 * 24 * HOUR),
  },
  {
    id: 'Fz8j...ff06',
    walletAddress: 'Fz8jQu7Wq9kM2nOpRtVx4yZaBcDeFgHiJkLmNoPqs06',
    username: 'ada_lovelace',
    displayName: 'Ada',
    avatarUrl: avatar('ada_lovelace'),
    bio: 'Numbers, art, and a bit of chaos.',
    countryCode: 'NG',
    followers: 15800,
    following: 402,
    createdAt: iso(-75 * 24 * HOUR),
  },
];

/** Look up a mock user by username. */
export function findUserByUsername(username: string): User | undefined {
  return MOCK_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

interface PostSeed {
  id: string;
  authorIndex: number;
  text: string;
  media?: Post['media'];
  ageHours: number;
  lifetimeHours: number;
  totalPumped: number;
  pumpCount: number;
  commentCount: number;
}

function image(seed: string): Post['media'] {
  return {
    type: 'image',
    url: `https://picsum.photos/seed/${seed}/800/600`,
    alt: 'Placeholder image',
  };
}

const POST_SEEDS: PostSeed[] = [
  {
    id: 'post_01', authorIndex: 2,
    text: 'gm. The chain never sleeps and neither do we. What are you building today?',
    ageHours: 2, lifetimeHours: 96, totalPumped: 342.5, pumpCount: 1280, commentCount: 210,
  },
  {
    id: 'post_02', authorIndex: 0,
    text: 'Just shipped a new feature. Pumped posts now extend their lifetime by tiers — no ceiling. 🚀',
    media: image('pumpfeature'),
    ageHours: 5, lifetimeHours: 72, totalPumped: 210.75, pumpCount: 890, commentCount: 134,
  },
  {
    id: 'post_03', authorIndex: 5,
    text: 'The most beautiful thing about onchain social is that value flows to creators directly.',
    ageHours: 9, lifetimeHours: 120, totalPumped: 512.0, pumpCount: 2010, commentCount: 340,
  },
  {
    id: 'post_04', authorIndex: 3,
    text: 'New generative piece dropped. 1/1, fully onchain. Pump it to the moon 🌙',
    media: image('genart'),
    ageHours: 12, lifetimeHours: 48, totalPumped: 88.2, pumpCount: 410, commentCount: 76,
  },
  {
    id: 'post_05', authorIndex: 1,
    text: 'unpopular opinion: the best alpha is just shipping consistently.',
    ageHours: 14, lifetimeHours: 36, totalPumped: 45.9, pumpCount: 233, commentCount: 51,
  },
  {
    id: 'post_06', authorIndex: 4,
    text: 'Meditation on markets: you do not control the candles, only your position size.',
    ageHours: 18, lifetimeHours: 30, totalPumped: 27.4, pumpCount: 141, commentCount: 39,
  },
  {
    id: 'post_07', authorIndex: 2,
    text: 'Thread 🧵 on how pump.social distributes rewards: ~70% creator, ~30% shared pool for the top of the board.',
    ageHours: 21, lifetimeHours: 60, totalPumped: 176.1, pumpCount: 705, commentCount: 98,
  },
  {
    id: 'post_08', authorIndex: 0,
    text: 'Weekend hack: a static-exported Next.js app running fully on IPFS. Zero servers.',
    media: image('ipfs'),
    ageHours: 26, lifetimeHours: 24, totalPumped: 12.0, pumpCount: 64, commentCount: 20,
  },
  {
    id: 'post_09', authorIndex: 5,
    text: 'If you could redistribute all attention on the internet, would you make it fairer?',
    ageHours: 30, lifetimeHours: 48, totalPumped: 99.9, pumpCount: 512, commentCount: 143,
  },
  {
    id: 'post_10', authorIndex: 3,
    text: 'Testing video posts. Motion changes everything on a feed.',
    media: {
      type: 'video',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      posterUrl: 'https://picsum.photos/seed/videoposter/800/600',
      alt: 'Sample video',
    },
    ageHours: 33, lifetimeHours: 40, totalPumped: 63.2, pumpCount: 288, commentCount: 44,
  },
  {
    id: 'post_11', authorIndex: 1,
    text: 'Pumped my first post to the top 30 today. The dopamine is real.',
    ageHours: 40, lifetimeHours: 28, totalPumped: 33.3, pumpCount: 170, commentCount: 22,
  },
  {
    id: 'post_12', authorIndex: 4,
    text: 'A calm feed is a rare feed. Curate who you follow.',
    ageHours: 44, lifetimeHours: 26, totalPumped: 8.5, pumpCount: 47, commentCount: 12,
  },
  {
    id: 'post_13', authorIndex: 2,
    text: 'Reminder: your keys, your posts. Own your social graph.',
    media: image('keys'),
    ageHours: 52, lifetimeHours: 72, totalPumped: 145.6, pumpCount: 601, commentCount: 87,
  },
  {
    id: 'post_14', authorIndex: 0,
    text: 'Building in public is the ultimate cheat code. Share the messy middle.',
    ageHours: 60, lifetimeHours: 30, totalPumped: 19.8, pumpCount: 102, commentCount: 31,
  },
  {
    id: 'post_15', authorIndex: 5,
    text: 'Late-night thought: the leaderboard is a story of what a community values.',
    ageHours: 70, lifetimeHours: 48, totalPumped: 77.7, pumpCount: 333, commentCount: 58,
  },
];

export const MOCK_POSTS: Post[] = POST_SEEDS.map((seed) => {
  const author = MOCK_USERS[seed.authorIndex]!;
  return {
    id: seed.id,
    author,
    text: seed.text,
    media: seed.media,
    createdAt: iso(-seed.ageHours * HOUR),
    expiresAt: iso((seed.lifetimeHours - seed.ageHours) * HOUR),
    totalPumped: seed.totalPumped,
    pumpCount: seed.pumpCount,
    commentCount: seed.commentCount,
    countryCode: author.countryCode ?? 'US',
    pumpedByViewer: false,
  } satisfies Post;
});

/** A handful of recent pumps per post, for the pump history list. */
export const MOCK_PUMPS: Pump[] = MOCK_POSTS.flatMap((post, postIndex) => {
  const contributors = MOCK_USERS.filter((u) => u.id !== post.author.id).slice(0, 4);
  return contributors.map((from, i) => ({
    id: `pump_${post.id}_${i}`,
    postId: post.id,
    from,
    amount: Number((post.totalPumped / (10 + postIndex) / (i + 1)).toFixed(3)),
    createdAt: iso(-(i + 1) * 0.5 * HOUR),
  }));
});
