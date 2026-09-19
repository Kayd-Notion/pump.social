import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { PumpResult } from '@/types';
import { PROGRAM_DEPLOYED } from './program';

/**
 * Write-side (transaction) helpers. Until the smart contract is deployed,
 * these simulate a successful on-chain pump so the full UX flow — amount
 * selection, split preview, confirmation, success — can be exercised.
 *
 * When the program ships, replace the mock body with real instruction
 * building + `sendTransaction`; the signature stays the same.
 */

export interface PumpParams {
  postId: string;
  /** Amount in SOL. */
  amount: number;
  /** Sender wallet address (base58). */
  from: string;
  /** Current total pumped on the post, to compute the new total. */
  currentTotal: number;
}

function fakeSignature(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let sig = '';
  for (let i = 0; i < 64; i++) sig += chars[Math.floor(Math.random() * chars.length)];
  return sig;
}

/**
 * Send a pump transaction. Mocked for now; returns a fake signature after a
 * short delay to emulate confirmation.
 */
export async function sendPump(params: PumpParams): Promise<PumpResult> {
  if (params.amount <= 0) {
    return { success: false, newTotalPumped: params.currentTotal, error: 'Invalid amount.' };
  }

  if (!PROGRAM_DEPLOYED) {
    // Simulated confirmation latency.
    await new Promise((r) => setTimeout(r, 900));
    return {
      success: true,
      signature: fakeSignature(),
      newTotalPumped: Number((params.currentTotal + params.amount).toFixed(3)),
    };
  }

  // TODO: build + send the real pump instruction once the program is live.
  // const lamports = Math.round(params.amount * LAMPORTS_PER_SOL);
  void LAMPORTS_PER_SOL;
  throw new Error('Real pump transaction not implemented yet.');
}

/**
 * Publish a post. Currently the network stores content off-chain metadata;
 * mocked here until the program + storage layer are wired.
 */
export async function sendPost(_text: string, _hasMedia: boolean): Promise<{ id: string }> {
  await new Promise((r) => setTimeout(r, 700));
  return { id: `post_local_${Date.now()}` };
}
