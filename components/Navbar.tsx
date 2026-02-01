"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-20 left-0 right-0 z-50 w-screen flex justify-center">
      {/* Full-width floating card */}
      <div
        className="flex justify-between items-center"
        style={{
          background: "var(--card-bg)",
          color: "var(--foreground)",
          borderRadius: "24px",
          padding: "1rem 2rem",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)", // strong shadow for floating
          backdropFilter: "blur(12px)", // glassy effect
          maxWidth: "100%",
          boxSizing: "border-box",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Brand Left */}
        <div
          className="text-2xl font-bold tracking-wide cursor-pointer"
          onClick={() => router.push("/")}
        >
          SkillXChange
        </div>

        {/* Navigation Right */}
        <div className="flex items-center text-lg">
        <span
            onClick={() => router.push("/profile")}
            className="font-semibold cursor-pointer hover:opacity-80 transition"
        >
            Profile
        </span>
        </div>
      </div>
    </nav>
  );
}
