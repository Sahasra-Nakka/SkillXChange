"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

const WalletContext = createContext<any>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const pera = useMemo(() => new PeraWalletConnect(), []);

  useEffect(() => {
    pera.reconnectSession().then(acc => acc?.length && setWallet(acc[0]));
  }, [pera]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet: async () => {
          const acc = await pera.connect();
          setWallet(acc[0]);
        },
        disconnectWallet: () => {
          pera.disconnect();
          setWallet(null);
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
