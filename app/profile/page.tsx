"use client";

import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/app/firebase";

export default function Profile() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [skills, setSkills] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ skill: "", level: "Beginner", name: "" });

  useEffect(() => {
    if (!wallet) return;

    const loadData = async () => {
      const skillSnap = await getDocs(query(collection(db, "skills"), where("wallet", "==", wallet)));
      setSkills(skillSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const reqSnap = await getDocs(query(collection(db, "requests"), where("toWallet", "==", wallet)));
      setRequests(reqSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadData();
  }, [wallet]);

  const addSkill = async () => {
    if (!wallet || !newSkill.skill) return;
    const docRef = await addDoc(collection(db, "skills"), {
      name: newSkill.name || wallet.slice(0, 6),
      wallet,
      skill: newSkill.skill,
      level: newSkill.level,
    });
    setSkills((s) => [...s, { id: docRef.id, ...newSkill, wallet }]);
    setNewSkill({ skill: "", level: "Beginner", name: "" });
  };

  const removeSkill = async (id: string) => {
    await deleteDoc(doc(db, "skills", id));
    setSkills((s) => s.filter((i) => i.id !== id));
  };

  const respondRequest = async (id: string, status: string) => {
    await updateDoc(doc(db, "requests", id), { status });
    setRequests((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const deleteRequest = async (id: string) => {
    await deleteDoc(doc(db, "requests", id));
    setRequests((r) => r.filter((x) => x.id !== id));
  };

  // --- Conditional rendering: show profile only if wallet connected ---
  if (!wallet) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen w-full px-4">
        <button
          onClick={connectWallet}
          className="button px-12 py-3 rounded-2xl font-bold shadow-lg transition hover:scale-105"
        >
          Connect Wallet
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div
        className="card p-8 rounded-3xl w-full max-w-4xl shadow-xl transition-transform transform hover:-translate-y-1"
        style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="mb-6">Wallet: <span className="font-mono text-sm">{wallet}</span></p>

        {/* Disconnect Wallet */}
        <div className="mb-6">
          <button
            onClick={disconnectWallet}
            className="button bg-red-600 hover:bg-red-700 text-white"
          >
            Disconnect Wallet
          </button>
        </div>

        {/* Add Skill */}
        <div className="flex flex-col gap-4 mb-6">
          <input
            placeholder="Your name"
            className="input w-full"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <div className="flex gap-3">
            <input
              placeholder="Skill"
              className="input flex-1"
              value={newSkill.skill}
              onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
            />
            <select
              className="input w-44"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button onClick={addSkill} className="button">Add Skill</button>
          </div>
        </div>

        {/* Your Skills */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">Your Skills</h2>
        <div className="space-y-3">
          {skills.map((s) => (
            <div key={s.id} className="card flex justify-between items-center p-4">
              <div>
                <div className="font-semibold">{s.skill}</div>
                <div className="text-sm opacity-80">{s.level}</div>
              </div>
              <button onClick={() => removeSkill(s.id)} className="small-button">Delete</button>
            </div>
          ))}
        </div>

        {/* Incoming Requests */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">Incoming Requests</h2>
        <div className="space-y-3">
          {requests.length === 0 && <div className="opacity-70">No pending requests.</div>}

          {requests.map((r) => (
            <div key={r.id} className="card flex flex-wrap gap-3 items-center p-4">
              <div className="flex-1">
                <div className="font-semibold">{r.skill}</div>
                <div className="text-sm opacity-80">From: {r.fromWallet}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => respondRequest(r.id, 'accepted')} className="small-button">Accept</button>
                <button onClick={() => respondRequest(r.id, 'rejected')} className="small-button">Reject</button>
                <button onClick={() => deleteRequest(r.id)} className="small-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
