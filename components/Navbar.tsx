"use client";

import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const router = useRouter();

  return (
    <nav className="fixed top-6 right-6 z-50 flex gap-3">
      {!wallet ? (
        <button onClick={connectWallet} className="nav-btn">Connect</button>
      ) : (
        <>
          <button onClick={() => router.push("/profile")} className="nav-btn">Profile</button>
          <button onClick={disconnectWallet} className="nav-btn">Disconnect</button>
        </>
      )}
    </nav>
  );
}
