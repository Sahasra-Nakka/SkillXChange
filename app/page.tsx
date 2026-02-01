"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import SkillCard from "@/components/SkillCard";
import { useWallet } from "@/context/WalletContext";

export default function Home() {
  const { wallet, connectWallet } = useWallet();
  const [skills, setSkills] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    getDocs(collection(db, "skills")).then((snap) =>
      setSkills(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const filtered = skills.filter(
    (s) =>
      s.skill.toLowerCase().includes(search.toLowerCase()) &&
      (level === "all" || s.level === level)
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      {/* Centered block: Title + Tagline + Search Card */}
      <div className="flex flex-col items-center w-full max-w-4xl gap-8">
        {/* Title and Tagline */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">SkillXChange</h1>
          <p className="text-lg opacity-80 mt-2">
            Exchange skills. Learn together. Grow together.
          </p>
        </div>

        {/* Wallet Connect or Floating Search Card */}
        {!wallet ? (
          <button
            onClick={connectWallet}
            className="button px-12 py-3 rounded-3xl font-bold shadow-lg transition hover:scale-105"
          >
            Connect Wallet
          </button>
        ) : (
          <div
            className="flex w-full gap-4 p-6 rounded-3xl transition-transform transform hover:-translate-y-1"
            style={{
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)", // floating shadow
            }}
          >
            {/* Search Input */}
            <input
              className="input flex-1 rounded-3xl placeholder-placeholder-muted focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Level Filter */}
            <select
              className="input w-44 rounded-3xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        )}
      </div>

      {/* Skill Cards */}
      {wallet && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-10 pb-20">
          {filtered.map((s) => (
            <SkillCard key={s.id} {...s} />
          ))}
        </div>
      )}
    </main>
  );
}
