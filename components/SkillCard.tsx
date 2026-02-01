"use client";

import { useWallet } from "@/context/WalletContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/firebase";

type SkillCardProps = {
  name: string;
  skill: string;
  level: string;
  wallet: string;
};

export default function SkillCard({
  name,
  skill,
  level,
  wallet: ownerWallet,
}: SkillCardProps) {
  const { wallet } = useWallet();

  const requestSwap = async () => {
    if (!wallet || wallet === ownerWallet) return;

    try {
      await addDoc(collection(db, "requests"), {
        fromWallet: wallet,
        toWallet: ownerWallet,
        skill,
        status: "pending",
        seen: false,
        createdAt: new Date().toISOString(),
      });
      alert("Request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  const isOwnSkill = wallet === ownerWallet;

  return (
    <div className="card rounded-2xl p-6 transition-transform transform hover:-translate-y-1">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="mb-1">
        <span className="font-medium">Skill:</span> {skill}
      </p>
      <p>
        <span className="font-medium">Level:</span> {level}
      </p>

      <button
        onClick={requestSwap}
        disabled={!wallet || isOwnSkill}
        className="button mt-4 w-full"
        style={{ opacity: isOwnSkill ? 0.6 : 1, cursor: isOwnSkill ? "not-allowed" : "pointer" }}
      >
        {isOwnSkill ? "Your Skill" : "Request Swap"}
      </button>
    </div>
  );
}
