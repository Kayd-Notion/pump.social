"use client";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { Modal } from "../Modal";
import { useUI } from "@/context/UIContext";

export function ConnectModal() {
  const { wallets, select, connect, connecting, connected, wallet } = useWallet();
  const { connectMessage, closeModal, toast } = useUI();

  // Auto-connect once a wallet is selected (we drive our own UI, not the adapter's).
  useEffect(() => {
    if (wallet && !connected && !connecting) {
      connect().catch((e) => toast(e instanceof Error ? e.message : "Connexion refusée."));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // Wallet Standard wallets that are actually available in this browser.
  const available = wallets.filter(
    (w) =>
      w.readyState === WalletReadyState.Installed ||
      w.readyState === WalletReadyState.Loadable,
  );

  return (
    <Modal title="Connexion requise" onClose={closeModal}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🔐</div>
        <p className="muted">{connectMessage}</p>
      </div>

      {connecting && (
        <div className="loading-state">
          <span className="spinner" style={{ color: "var(--accent)" }} /> Connexion…
        </div>
      )}

      {!connecting && available.length > 0 && (
        <div className="wallet-list">
          {available.map((w) => (
            <button
              key={w.adapter.name}
              className="wallet-option"
              onClick={() => select(w.adapter.name)}
            >
              {w.adapter.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.adapter.icon} alt="" />
              )}
              {w.adapter.name}
              {w.readyState === WalletReadyState.Installed && (
                <span className="wo-tag">détecté</span>
              )}
            </button>
          ))}
        </div>
      )}

      {!connecting && available.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <p className="muted" style={{ marginBottom: 14 }}>
            Aucun wallet Solana détecté. Installe Phantom, Solflare ou Backpack pour continuer.
          </p>
          <div className="wallet-list">
            <a className="wallet-option" href="https://phantom.app/" target="_blank" rel="noreferrer">
              Phantom <span className="wo-tag">installer</span>
            </a>
            <a className="wallet-option" href="https://solflare.com/" target="_blank" rel="noreferrer">
              Solflare <span className="wo-tag">installer</span>
            </a>
            <a className="wallet-option" href="https://backpack.app/" target="_blank" rel="noreferrer">
              Backpack <span className="wo-tag">installer</span>
            </a>
          </div>
        </div>
      )}

      <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={closeModal}>
        Plus tard
      </button>
    </Modal>
  );
}
