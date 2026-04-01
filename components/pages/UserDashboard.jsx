"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// ─── Helper to generate initials from name
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// ─── Mock data (kept for transactions only) ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  fullName: "Amara Osei",
  email: "amara@pinnacletrust.com",
  role: "user",
  organization: "Pinnacle Trust",
  kyc_status: "approved",
};

const CONTRIBUTIONS = [
  {
    id: "c1",
    amount: 120000,
    status: "approved",
    date: "2025-03-01",
    ref: "CTB-20250301",
  },
  {
    id: "c2",
    amount: 120000,
    status: "approved",
    date: "2025-02-01",
    ref: "CTB-20250201",
  },
  {
    id: "c3",
    amount: 115000,
    status: "approved",
    date: "2025-01-01",
    ref: "CTB-20250101",
  },
  {
    id: "c4",
    amount: 120000,
    status: "pending",
    date: "2025-04-01",
    ref: "CTB-20250401",
  },
];

const WITHDRAWALS = [
  {
    id: "w1",
    amount: 45000,
    status: "approved",
    date: "2025-02-15",
    ref: "WDR-20250215",
  },
  {
    id: "w2",
    amount: 80000,
    status: "rejected",
    date: "2025-01-20",
    ref: "WDR-20250120",
    reason: "Insufficient KYC documentation",
  },
  {
    id: "w3",
    amount: 30000,
    status: "pending",
    date: "2025-03-20",
    ref: "WDR-20250320",
  },
];

const CHART_DATA = [38, 52, 45, 68, 60, 82, 70, 88, 76, 95, 84, 100];
const CHART_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const STATUS_STYLES = {
  approved: { bg: "#e8f5e8", color: "#2d7a3a", label: "Approved" },
  pending: { bg: "#fef9e7", color: "#a8820a", label: "Pending" },
  rejected: { bg: "#fdecea", color: "#c0392b", label: "Rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 100,
        letterSpacing: "0.02em",
      }}
    >
      {s.label}
    </span>
  );
}

function MetricCard({ label, value, sub, accent, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eae8e4",
        borderRadius: 14,
        padding: "24px",
        flex: 1,
        minWidth: 180,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</p>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: accent + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}
        >
          {icon}
        </div>
      </div>
      <p
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#1a1a1a",
          letterSpacing: "-0.02em",
          marginBottom: 4,
        }}
      >
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: "#aaa" }}>{sub}</p>}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "contributions",
    label: "Contributions",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "kyc",
    label: "KYC Status",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function Sidebar({ active, onNav, user }) {
  const avatar = user?.user?.full_name ? getInitials(user.user.full_name) : "?";
  const fullName = user?.user?.full_name || "User";

  return (
    <aside
      style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #eae8e4",
        display: "flex",
        flexDirection: "column",
        padding: "0 0 24px",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{ padding: "24px 20px 20px", borderBottom: "1px solid #eae8e4" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              background: "#1a1a1a",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="#faf9f7" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 17,
              color: "#1a1a1a",
              letterSpacing: "-0.01em",
            }}
          >
            Aurevia
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#bbb",
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 10px",
              borderRadius: 9,
              border: "none",
              background: active === item.id ? "#f5f2ee" : "transparent",
              color: active === item.id ? "#1a1a1a" : "#777",
              fontFamily: "inherit",
              fontSize: 13.5,
              fontWeight: active === item.id ? 600 : 400,
              cursor: "pointer",
              marginBottom: 2,
              transition: "all 0.15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (active !== item.id)
                e.currentTarget.style.background = "#faf9f7";
            }}
            onMouseLeave={(e) => {
              if (active !== item.id)
                e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              style={{
                color: active === item.id ? "#7a6a52" : "#aaa",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid #eae8e4" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px",
            borderRadius: 10,
            background: "#faf9f7",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#c8b89a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {avatar}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a1a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fullName}
            </p>
            <p style={{ fontSize: 11, color: "#aaa" }}>Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle, user }) {
  const avatar = user?.user?.full_name ? getInitials(user.user.full_name) : "?";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 220,
        right: 0,
        height: 64,
        background: "rgba(250,249,247,0.92)",
        backdropFilter: "blur(10px)",
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
        {subtitle && <p style={{ fontSize: 12, color: "#aaa" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            background: "#e8f5e8",
            color: "#2d7a3a",
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          KYC Verified
        </div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "#c8b89a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {avatar}
        </div>
      </div>
    </header>
  );
}

// ─── Page views ───────────────────────────────────────────────────────────────
function DashboardHome({ user }) {
  const totalContributions = CONTRIBUTIONS.filter(
    (c) => c.status === "approved",
  ).reduce((a, c) => a + c.amount, 0);
  const totalWithdrawn = WITHDRAWALS.filter(
    (w) => w.status === "approved",
  ).reduce((a, w) => a + w.amount, 0);
  const balance = totalContributions - totalWithdrawn;
  const fullName = user?.user?.full_name || "there";
  const firstName = fullName.split(" ")[0];

  return (
    <div>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>
        Welcome back, {firstName} 👋
      </p>

      {/* Metrics */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}
      >
        <MetricCard
          label="Total Balance"
          value={fmt(balance)}
          sub="Updated just now"
          accent="#7a6a52"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
        <MetricCard
          label="Total Contributed"
          value={fmt(totalContributions)}
          sub={`${CONTRIBUTIONS.filter((c) => c.status === "approved").length} payments`}
          accent="#3a8a5a"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <MetricCard
          label="Total Withdrawn"
          value={fmt(totalWithdrawn)}
          sub={`${WITHDRAWALS.filter((w) => w.status === "approved").length} withdrawals`}
          accent="#a06030"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
        <MetricCard
          label="Pending Items"
          value={
            CONTRIBUTIONS.filter((c) => c.status === "pending").length +
            WITHDRAWALS.filter((w) => w.status === "pending").length
          }
          sub="Awaiting approval"
          accent="#c8b89a"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
      </div>

      {/* Chart + Recent activity */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #eae8e4",
            borderRadius: 14,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: 2,
                }}
              >
                Contribution History
              </p>
              <p style={{ fontSize: 12, color: "#aaa" }}>Monthly overview</p>
            </div>
            <span
              style={{
                fontSize: 12,
                background: "#f5f2ee",
                color: "#7a6a52",
                padding: "4px 12px",
                borderRadius: 100,
                fontWeight: 500,
              }}
            >
              2025
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              height: 100,
            }}
          >
            {CHART_DATA.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    background: i === 11 ? "#c8b89a" : "#f0ece6",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      i === 11 ? "#b8a88a" : "#e0d8cc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      i === 11 ? "#c8b89a" : "#f0ece6";
                  }}
                />
                <p style={{ fontSize: 9, color: "#ccc", textAlign: "center" }}>
                  {CHART_MONTHS[i]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #eae8e4",
            borderRadius: 14,
            padding: 24,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 4,
            }}
          >
            Recent Activity
          </p>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>
            Latest transactions
          </p>
          {[...CONTRIBUTIONS.slice(0, 2), ...WITHDRAWALS.slice(0, 2)]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4)
            .map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 0",
                  borderBottom: i < 3 ? "1px solid #f5f2ee" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: item.id.startsWith("c")
                        ? "#e8f5e8"
                        : "#fef9e7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.id.startsWith("c") ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2d7a3a"
                        strokeWidth="2"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a8820a"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#1a1a1a",
                      }}
                    >
                      {item.id.startsWith("c") ? "Contribution" : "Withdrawal"}
                    </p>
                    <p style={{ fontSize: 11, color: "#bbb" }}>
                      {fmtDate(item.date)}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: item.id.startsWith("c") ? "#2d7a3a" : "#c0392b",
                    }}
                  >
                    {item.id.startsWith("c") ? "+" : "-"}
                    {fmt(item.amount)}
                  </p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ContributionsPage() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 13, color: "#aaa" }}>
          {CONTRIBUTIONS.length} total contributions
        </p>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #eae8e4",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 140px 120px",
            padding: "14px 20px",
            borderBottom: "1px solid #f0ece6",
            background: "#faf9f7",
          }}
        >
          {["Reference", "Amount", "Date", "Status"].map((h) => (
            <p
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#aaa",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </p>
          ))}
        </div>
        {CONTRIBUTIONS.map((c, i) => (
          <div
            key={c.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 140px 120px",
              padding: "16px 20px",
              borderBottom:
                i < CONTRIBUTIONS.length - 1 ? "1px solid #f5f2ee" : "none",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#faf9f7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <p style={{ fontSize: 13, color: "#444", fontFamily: "monospace" }}>
              {c.ref}
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              {fmt(c.amount)}
            </p>
            <p style={{ fontSize: 13, color: "#666" }}>{fmtDate(c.date)}</p>
            <StatusBadge status={c.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function WithdrawalsPage() {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 13, color: "#aaa" }}>
          {WITHDRAWALS.length} withdrawal requests
        </p>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#1a1a1a",
            color: "#faf9f7",
            border: "none",
            padding: "10px 20px",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + New Request
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eae8e4",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 140px 120px",
            padding: "14px 20px",
            borderBottom: "1px solid #f0ece6",
            background: "#faf9f7",
          }}
        >
          {["Reference", "Amount", "Date", "Status"].map((h) => (
            <p
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#aaa",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </p>
          ))}
        </div>
        {WITHDRAWALS.map((w, i) => (
          <div key={w.id}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 140px 120px",
                padding: "16px 20px",
                borderBottom: "1px solid #f5f2ee",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#faf9f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <p
                style={{ fontSize: 13, color: "#444", fontFamily: "monospace" }}
              >
                {w.ref}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                {fmt(w.amount)}
              </p>
              <p style={{ fontSize: 13, color: "#666" }}>{fmtDate(w.date)}</p>
              <StatusBadge status={w.status} />
            </div>
            {w.reason && (
              <div
                style={{
                  padding: "8px 20px 12px",
                  background: "#fff9f9",
                  borderBottom: "1px solid #f5f2ee",
                }}
              >
                <p style={{ fontSize: 12, color: "#c0392b" }}>
                  Rejection reason: {w.reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Withdrawal modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 24,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 36,
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 24,
                color: "#1a1a1a",
                marginBottom: 6,
              }}
            >
              Request Withdrawal
            </h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
              Requests require admin approval before processing.
            </p>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#555",
                display: "block",
                marginBottom: 6,
              }}
            >
              Amount (₦)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                border: "1.5px solid #e4e0da",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 15,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 24,
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  border: "1.5px solid #e4e0da",
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  border: "none",
                  background: "#1a1a1a",
                  color: "#faf9f7",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KycPage() {
  const steps = [
    { label: "Document Submitted", done: true, date: "12 Jan 2025" },
    { label: "Under Review", done: true, date: "13 Jan 2025" },
    { label: "Identity Verified", done: true, date: "14 Jan 2025" },
    { label: "KYC Approved", done: true, date: "15 Jan 2025" },
  ];

  return (
    <div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #eae8e4",
          borderRadius: 16,
          padding: 32,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#e8f5e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d7a3a"
              strokeWidth="1.8"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: 4,
              }}
            >
              KYC Status: Approved
            </h2>
            <p style={{ fontSize: 13, color: "#888" }}>
              Your identity has been successfully verified.
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <StatusBadge status="approved" />
          </div>
        </div>

        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div
            style={{
              position: "absolute",
              left: 11,
              top: 8,
              bottom: 8,
              width: 2,
              background: "#eae8e4",
            }}
          />
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                paddingBottom: i < steps.length - 1 ? 24 : 0,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: step.done ? "#2d7a3a" : "#eae8e4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginLeft: -11,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.done && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: step.done ? "#1a1a1a" : "#aaa",
                  }}
                >
                  {step.label}
                </p>
                <p style={{ fontSize: 12, color: "#bbb" }}>{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #eae8e4",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 20,
          }}
        >
          Submitted Documents
        </h3>
        {[
          { type: "National ID Card", date: "12 Jan 2025" },
          { type: "Proof of Address", date: "12 Jan 2025" },
        ].map((doc) => (
          <div
            key={doc.type}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid #f5f2ee",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#f5f2ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7a6a52"
                  strokeWidth="1.8"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>
                  {doc.type}
                </p>
                <p style={{ fontSize: 12, color: "#aaa" }}>
                  Uploaded {doc.date}
                </p>
              </div>
            </div>
            <StatusBadge status="approved" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: { title: "Dashboard", subtitle: "Pinnacle Trust · Member Portal" },
  contributions: {
    title: "Contributions",
    subtitle: "Your contribution history",
  },
  withdrawals: { title: "Withdrawals", subtitle: "Manage withdrawal requests" },
  kyc: { title: "KYC Status", subtitle: "Identity verification" },
  profile: { title: "Profile", subtitle: "Account settings" },
};

export default function UserDashboard() {
  const { authUser, user, loading } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  useEffect(() => {
    setMounted(true);
  }, []);

  // During hydration, render a minimal version to match server
  if (!mounted) {
    return (
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: "#faf9f7",
          minHeight: "100vh",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        `,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <p style={{ fontSize: 14, color: "#888" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#faf9f7",
        }}
      >
        <p style={{ fontSize: 14, color: "#888" }}>Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#faf9f7",
        }}
      >
        <p style={{ fontSize: 14, color: "#888" }}>
          Please sign in to access the dashboard.
        </p>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome user={authUser} />;
      case "contributions":
        return <ContributionsPage />;
      case "withdrawals":
        return <WithdrawalsPage />;
      case "kyc":
        return <KycPage />;
      default:
        return <p style={{ color: "#aaa", fontSize: 14 }}>Coming soon.</p>;
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#faf9f7",
        minHeight: "100vh",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `,
        }}
      />
      <Sidebar active={activePage} onNav={setActivePage} user={authUser} />
      <Topbar title={title} subtitle={subtitle} user={authUser} />
      <main style={{ marginLeft: 220, paddingTop: 64 }}>
        <div style={{ padding: 32 }}>{renderPage()}</div>
      </main>
    </div>
  );
}
