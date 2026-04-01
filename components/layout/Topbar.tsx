"use client";

import { formatInitials } from "@/lib/utils";
import type { User } from "@/types";

interface TopbarProps {
  title: string;
  subtitle?: string;
  user: Pick<User, "full_name" | "kyc_status">;
  badge?: React.ReactNode;
  avatarBg?: string;
}

const Topbar = ({ title, subtitle, user, badge, avatarBg = "#c8b89a" }: TopbarProps) => (
  <header
    style={{
      position: "fixed",
      top: 0,
      left: 220,
      right: 0,
      height: 64,
      background: "rgba(250,249,247,0.94)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderBottom: "1px solid #eae8e4",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      zIndex: 40,
    }}
  >
    <div>
      <h1
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#1a1a1a",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 12, color: "#aaa" }}>{subtitle}</p>
      )}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {badge}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: avatarBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          color: "#fff",
          cursor: "pointer",
          userSelect: "none",
        }}
        title={user.full_name}
      >
        {formatInitials(user.full_name)}
      </div>
    </div>
  </header>
);

export default Topbar;
