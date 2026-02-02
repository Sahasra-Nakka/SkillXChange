"use client";

import ThreeBackground from "@/components/ThreeBackground";
import { useWallet } from "@/context/WalletContext";

export default function Home() {
  const { wallet, connectWallet } = useWallet();

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <ThreeBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6">
        {!wallet ? (
          <button onClick={connectWallet} className="nav-btn">
            Connect Wallet
          </button>
        ) : (
          <div className="text-lg opacity-90">
            Wallet Connected ✔
          </div>
        )}
      </div>
    </div>
  );
}
