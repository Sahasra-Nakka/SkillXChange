"use client";

import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";

export default function Profile() {
  const { wallet, disconnectWallet } = useWallet();
  const [skills, setSkills] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ skill: "", level: "Beginner" });

  useEffect(() => {
    if (!wallet) return;

    const load = async () => {
      const s = await getDocs(
        query(collection(db, "skills"), where("wallet", "==", wallet))
      );
      setSkills(s.docs.map(d => ({ id: d.id, ...d.data() })));

      const r = await getDocs(
        query(collection(db, "requests"), where("toWallet", "==", wallet))
      );
      setRequests(r.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    load();
  }, [wallet]);

  if (!wallet) return null;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl mb-4">Profile</h1>

      <button onClick={disconnectWallet} className="nav-btn mb-6">
        Disconnect
      </button>

      <div className="flex gap-3 mb-6">
        <input
          className="input"
          placeholder="Skill"
          value={newSkill.skill}
          onChange={e => setNewSkill({ ...newSkill, skill: e.target.value })}
        />
        <select
          className="input"
          value={newSkill.level}
          onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button
          className="nav-btn"
          onClick={async () => {
            await addDoc(collection(db, "skills"), {
              wallet,
              skill: newSkill.skill,
              level: newSkill.level,
            });
            setNewSkill({ skill: "", level: "Beginner" });
          }}
        >
          Add
        </button>
      </div>

      {skills.map(s => (
        <div key={s.id} className="mb-2">
          {s.skill} – {s.level}
          <button
            onClick={() => deleteDoc(doc(db, "skills", s.id))}
            className="ml-4 opacity-60"
          >
            delete
          </button>
        </div>
      ))}
    </div>
  );
}
