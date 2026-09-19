import { PublicKey } from '@solana/web3.js';

/**
 * On-chain program metadata. The pump.social program is not deployed yet;
 * this module centralizes the program id and account-derivation helpers so
 * that wiring the real program later is a localized change.
 */

// Placeholder program id (system program) until the real program is deployed.
export const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

/**
 * Derive the PDA that holds a post's on-chain state. Mirrors the seed layout
 * the smart contract is expected to use (`["post", postId]`).
 */
export function derivePostPda(postId: string): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('post'), Buffer.from(postId)],
    PROGRAM_ID,
  );
  return pda;
}

/** Derive the shared reward-pool PDA (`["pool"]`). */
export function deriveRewardPoolPda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([Buffer.from('pool')], PROGRAM_ID);
  return pda;
}

/** Whether the real program is available. Flips to true once deployed. */
export const PROGRAM_DEPLOYED = false;
