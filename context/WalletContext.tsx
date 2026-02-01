"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { PeraWalletConnect } from "@perawallet/connect";

type WalletContextType = {
  wallet: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const peraWallet = useMemo(() => new PeraWalletConnect(), []);

  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts: string[]) => {
        if (accounts && accounts.length) setWallet(accounts[0]);
      })
      .catch(() => {});
  }, [peraWallet]);

  const connectWallet = async () => {
    try {
      const accounts: string[] = await peraWallet.connect();
      if (accounts && accounts.length) setWallet(accounts[0]);
    } catch (err) {
      console.warn("Wallet connect cancelled or failed", err);
    }
  };

  const disconnectWallet = () => {
    peraWallet.disconnect(); // terminate Pera session
    setWallet(null);         // clear wallet in state
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
