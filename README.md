# pump.social

A crypto social network on **Solana** where users **pump** (financially sponsor, in SOL)
each other's posts to push them up a global leaderboard and extend their lifetime.
The UX borrows from Twitter/X (feed, media, interactions) with a crypto layer on top.

This repository is the **web frontend**, built first, ahead of the native app.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript** (strict)
- **Tailwind CSS** — neutral gray/black/white design with a single swappable accent
- **Solana wallet** integration via `@solana/wallet-adapter-react` (Wallet Standard +
  WalletConnect-compatible wallets)
- **Static export** (`output: 'export'`) for future decentralized hosting (IPFS / Arweave)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build + static export to ./out
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Product rules reflected in the UI

1. **Visitor mode** — the feed is fully browsable without a wallet. Connecting is only
   required to *act* (pump, post, comment, follow). See `VisitorBanner`.
2. **Posts** — text + photo/video, each with a live expiry gauge (minimum 24h,
   extended in tiers by pumps, no ceiling). See `ExpiryBar`, `usePostExpiry`.
3. **Pump** — quick amounts (0.01 / 0.1 / 1 SOL) or a custom amount; total shown like a
   like counter. See `PumpButton`, `PumpAmountPicker`.
4. **Split** — the pump confirmation shows the ~70% creator / ~30% shared-pool split
   before signing (the real split is enforced on-chain). See `PumpConfirmModal`,
   `lib/config.ts` (`PUMP_SPLIT`).
5. **Leaderboard** — top 30 worldwide + top 30 per country, by all-time cumulative
   pumped total. See `LeaderboardTable`, `CountrySelector`.
6. **Identity** — after first connection, users pick a pseudo (`onboarding`). Profiles
   show the pseudo, not just the address.
7. **Moderation** — every post has a report affordance. See `ReportButton`.

## Architecture & separation of concerns

- **UI** — `components/` (feed, pump, leaderboard, wallet, profile, moderation, layout, ui)
- **Wallet logic** — `components/wallet/WalletProvider.tsx` (global connected/disconnected
  state) + `lib/solana/` (connection, program, transactions, wallet adapter config)
- **Data (read)** — `lib/indexer/` — currently a **mock indexer** (`api.ts` +
  `mock-data.ts`). All reads go through these async functions, so wiring the real
  indexing service later is a localized change.
- **Data (write)** — `lib/solana/transactions.ts` — pump/post are **mocked** (simulated
  confirmation) until the smart contract ships; the function signatures won't change.
- **Hooks** — `hooks/` glue UI to data/wallet (`useWallet`, `useFeed`, `usePump`,
  `useLeaderboard`, `usePostExpiry`).
- **Types** — `types/` (`post`, `user`, `pump`).

### Re-skinning

The design is intentionally neutral and decoupled from structure. The single brand accent
is defined once as CSS variables in `app/globals.css` (`--color-accent*`) and exposed to
Tailwind as `accent` / `accent-fg`. Change those variables to re-theme the whole app.

## Status

Frontend scaffold with mock data. Not yet wired to a deployed program or a real indexer;
those integration points are stubbed and clearly marked (`TODO`) in `lib/solana/` and
`lib/indexer/`.
