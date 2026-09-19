import { Connection, clusterApiUrl, type Cluster } from '@solana/web3.js';
import { SOLANA_CLUSTER } from '@/lib/config';

/**
 * Shared RPC connection factory. A custom endpoint can be provided via
 * `NEXT_PUBLIC_SOLANA_RPC`; otherwise we fall back to the public cluster URL.
 */
export function getRpcEndpoint(): string {
  return process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl(SOLANA_CLUSTER as Cluster);
}

let connection: Connection | null = null;

/** Lazily-created singleton connection for read-only chain queries. */
export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(getRpcEndpoint(), 'confirmed');
  }
  return connection;
}
