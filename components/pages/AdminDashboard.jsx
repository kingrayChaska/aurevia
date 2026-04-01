"use client";

import { useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const ADMIN = { fullName: "Tunde Adeyemi", role: "admin", organization: "Vantage Pensions", avatar: "TA" };

const USERS = [
  { id: "u1", fullName: "Amara Osei",     email: "amara@org.com",   role: "user",              kyc_status: "approved", joined: "2025-01-10", contributions: 3, balance: 315000 },
  { id: "u2", fullName: "Chisom Ude",     email: "chisom@org.com",  role: "user",              kyc_status: "pending",  joined: "2025-02-01", contributions: 1, balance: 120000 },
  { id: "u3", fullName: "James Okafor",   email: "james@org.com",   role: "compliance_officer",kyc_status: "approved", joined: "2024-11-15", contributions: 5, balance: 600000 },
  { id: "u4", fullName: "Fatima Bello",   email: "fatima@org.com",  role: "user",              kyc_status: "rejected", joined: "2025-03-05", contributions: 0, balance: 0 },
  { id: "u5", fullName: "Emeka Nwosu",    email: "emeka@org.com",   role: "admin",             kyc_status: "approved", joined: "2024-10-01", contributions: 8, balance: 960000 },
];

const PENDING_CONTRIBUTIONS = [
  { id: "pc1", user: "Amara Osei",   amount: 120000, date: "2025-04-01", ref: "CTB-20250401" },
  { id: "pc2", user: "Chisom Ude",   amount: 120000, date: "2025-04-01", ref: "CTB-20250402" },
  { id: "pc3", user: "Fatima Bello", amount:  95000, date: "2025-03-28", ref: "CTB-20250328" },
];

const PENDING_WITHDRAWALS = [
  { id: "pw1", user: "Amara Osei",   amount: 30000, date: "2025-03-20", ref: "WDR-20250320", kyc: "approved" },
  { id: "pw2", user: "James Okafor", amount: 80000, date: "2025-03-18", ref: "WDR-20250318", kyc: "approved" },
];

const AUDIT_LOGS = [
  { id: "a1", actor: "Tunde Adeyemi", action: "Approved contribution",    entity: "CTB-20250301", time: "2 hours ago" },
  { id: "a2", actor: "Tunde Adeyemi", action: "Rejected withdrawal",      entity: "WDR-20250120", time: "5 hours ago" },
  { id: "a3", actor: "James Okafor",  action: "Submitted KYC documents",  entity: "KYC-U3",       time: "Yesterday"   },
  { id: "a4", actor: "Amara Osei",    action: "Requested withdrawal",      entity: "WDR-20250320", time: "Yesterday"   },
  { id: "a5", actor: "Tunde Adeyemi", action: "Approved KYC",             entity: "KYC-U1",       time: "2 days ago"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const KYC_STYLES  = { approved: { bg: "#e8f5e8", color: "#2d7a3a" }, pending: { bg: "#fef9e7", color: "#a8820a" }, rejected: { bg: "#fdecea", color: "#c0392b" } };
const ROLE_STYLES = { admin: { bg: "#f0ece6", color: "#7a6a52" }, compliance_officer: { bg: "#eaf0f8", color: "#3a6a8a" }, user: { bg: "#f5f5f5", color: "#666" } };
const ROLE_LABELS = { admin: "Admin", compliance_officer: "Compliance", user: "Member" };

function Badge({ text, bg, color }) {
  return <span style={{ fontSize: 11, fontWeight: 600, background: bg, color, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>{text}</span>;
}

function MetricCard({ label, value, delta, accent, icon }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 24, flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</p>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>{icon}</div>
      </div>
      <p style={{ fontSize: 28, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em", marginBottom: 4 }}>{value}</p>
      {delta && <p style={{ fontSize: 12, color: "#3a8a5a" }}>↑ {delta}</p>}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview",      label: "Overview",       icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: "users",         label: "Users",          icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: "contributions", label: "Contributions",  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: "withdrawals",   label: "Withdrawals",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: "audit",         label: "Audit Logs",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

function Sidebar({ active, onNav }) {
  return (
    <aside style={{ width: 220, background: "#1a1a1a", borderRight: "none", display: "flex", flexDirection: "column", padding: "0 0 24px", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, background: "#faf9f7", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="#1a1a1a" /></svg>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#faf9f7" }}>Aurevia</span>
        </div>
        <div style={{ marginTop: 12, background: "rgba(200,184,154,0.12)", border: "1px solid rgba(200,184,154,0.2)", borderRadius: 8, padding: "6px 10px" }}>
          <p style={{ fontSize: 11, color: "#c8b89a", fontWeight: 600 }}>Admin Portal</p>
          <p style={{ fontSize: 11, color: "#555" }}>{ADMIN.organization}</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", padding: "0 8px", marginBottom: 8 }}>Management</p>
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 9, border: "none", background: isActive ? "rgba(200,184,154,0.15)" : "transparent", color: isActive ? "#c8b89a" : "#555", fontFamily: "inherit", fontSize: 13.5, fontWeight: isActive ? 600 : 400, cursor: "pointer", marginBottom: 2, transition: "all 0.15s", textAlign: "left" }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#aaa"; }}}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; }}}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.04)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#c8b89a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{ADMIN.avatar}</div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#ddd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ADMIN.fullName}</p>
            <p style={{ fontSize: 11, color: "#555" }}>Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, pendingCount }) {
  return (
    <header style={{ position: "fixed", top: 0, left: 220, right: 0, height: 64, background: "rgba(250,249,247,0.94)", backdropFilter: "blur(10px)", borderBottom: "1px solid #eae8e4", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", zIndex: 40 }}>
      <h1 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.01em" }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {pendingCount > 0 && (
          <div style={{ background: "#fef9e7", color: "#a8820a", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a8820a", display: "inline-block" }} />
            {pendingCount} pending approvals
          </div>
        )}
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "#c8b89a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>{ADMIN.avatar}</div>
      </div>
    </header>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview() {
  const totalBalance = USERS.reduce((a, u) => a + u.balance, 0);
  const totalContributions = USERS.reduce((a, u) => a + u.contributions, 0);

  return (
    <div>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>Organization overview for {ADMIN.organization}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <MetricCard label="Total AUM" value={fmt(totalBalance)} delta="12.4% this month" accent="#7a6a52"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} />
        <MetricCard label="Total Members" value={USERS.length} delta="2 this month" accent="#3a6a8a"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} />
        <MetricCard label="Contributions" value={totalContributions} delta="this year" accent="#3a8a5a"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <MetricCard label="Pending Actions" value={PENDING_CONTRIBUTIONS.length + PENDING_WITHDRAWALS.length} accent="#c8b89a"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
      </div>

      {/* KYC status summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>KYC Breakdown</p>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>Member verification status</p>
          {[
            { label: "Approved", count: USERS.filter(u => u.kyc_status === "approved").length, color: "#2d7a3a", bg: "#e8f5e8" },
            { label: "Pending",  count: USERS.filter(u => u.kyc_status === "pending").length,  color: "#a8820a", bg: "#fef9e7" },
            { label: "Rejected", count: USERS.filter(u => u.kyc_status === "rejected").length, color: "#c0392b", bg: "#fdecea" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: 13, color: "#555" }}>{s.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 100, height: 6, borderRadius: 100, background: "#f0ece6", overflow: "hidden" }}>
                  <div style={{ width: `${(s.count / USERS.length) * 100}%`, height: "100%", background: s.color, borderRadius: 100 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", minWidth: 16 }}>{s.count}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Recent Audit Activity</p>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Latest system actions</p>
          {AUDIT_LOGS.slice(0, 4).map((log, i) => (
            <div key={log.id} style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid #f5f2ee" : "none" }}>
              <p style={{ fontSize: 13, color: "#333", marginBottom: 2 }}><span style={{ fontWeight: 600 }}>{log.actor}</span> — {log.action}</p>
              <p style={{ fontSize: 11, color: "#bbb" }}>{log.entity} · {log.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
function UsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const filtered = USERS.filter(u =>
    (filterRole === "all" || u.role === filterRole) &&
    (u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members…"
          style={{ flex: 1, minWidth: 200, border: "1.5px solid #e4e0da", borderRadius: 9, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }} />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          style={{ border: "1.5px solid #e4e0da", borderRadius: 9, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff", cursor: "pointer" }}>
          <option value="all">All roles</option>
          <option value="user">Member</option>
          <option value="admin">Admin</option>
          <option value="compliance_officer">Compliance</option>
        </select>
      </div>

      <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 120px 100px 100px", padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#faf9f7" }}>
          {["Member", "Email", "KYC", "Role", "Balance"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>
        {filtered.map((u, i) => {
          const kyc = KYC_STYLES[u.kyc_status];
          const role = ROLE_STYLES[u.role];
          return (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 180px 120px 100px 100px", padding: "16px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f5f2ee" : "none", alignItems: "center", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#faf9f7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f0ece6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#7a6a52", flexShrink: 0 }}>
                  {u.fullName.split(" ").map(w => w[0]).join("")}
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{u.fullName}</p>
              </div>
              <p style={{ fontSize: 12, color: "#888" }}>{u.email}</p>
              <Badge text={u.kyc_status} bg={kyc.bg} color={kyc.color} />
              <Badge text={ROLE_LABELS[u.role]} bg={role.bg} color={role.color} />
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{fmt(u.balance)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Contributions approval ───────────────────────────────────────────────────
function ContributionsPage() {
  const [items, setItems] = useState(PENDING_CONTRIBUTIONS);

  const approve = (id) => setItems((prev) => prev.filter((c) => c.id !== id));
  const reject = (id) => setItems((prev) => prev.filter((c) => c.id !== id));

  return (
    <div>
      <div style={{ background: "#fef9e7", border: "1px solid #f0d890", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a8820a" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p style={{ fontSize: 13, color: "#a8820a", fontWeight: 500 }}>{items.length} contribution{items.length !== 1 ? "s" : ""} awaiting your approval</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 180px", padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#faf9f7" }}>
          {["Member", "Amount", "Date", "Actions"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>
        {items.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#bbb" }}>All contributions reviewed. ✓</p>
          </div>
        ) : items.map((c, i) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 180px", padding: "16px 20px", borderBottom: i < items.length - 1 ? "1px solid #f5f2ee" : "none", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{c.user}</p>
              <p style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>{c.ref}</p>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{fmt(c.amount)}</p>
            <p style={{ fontSize: 13, color: "#666" }}>{fmtDate(c.date)}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => approve(c.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#e8f5e8", color: "#2d7a3a", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Approve</button>
              <button onClick={() => reject(c.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#fdecea", color: "#c0392b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Withdrawals approval ─────────────────────────────────────────────────────
function WithdrawalsPage() {
  const [items, setItems] = useState(PENDING_WITHDRAWALS);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const approve = (id) => setItems((prev) => prev.filter((w) => w.id !== id));
  const confirmReject = () => {
    if (!rejectReason.trim()) return;
    setItems((prev) => prev.filter((w) => w.id !== selectedId));
    setSelectedId(null);
    setRejectReason("");
  };

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 140px 200px", padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#faf9f7" }}>
          {["Member", "Amount", "KYC", "Date", "Actions"].map((h) => (
            <p key={h} style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</p>
          ))}
        </div>
        {items.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#bbb" }}>No pending withdrawals. ✓</p>
          </div>
        ) : items.map((w, i) => {
          const kyc = KYC_STYLES[w.kyc];
          return (
            <div key={w.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 140px 200px", padding: "16px 20px", borderBottom: i < items.length - 1 ? "1px solid #f5f2ee" : "none", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{w.user}</p>
                <p style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>{w.ref}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{fmt(w.amount)}</p>
              <Badge text={w.kyc} bg={kyc.bg} color={kyc.color} />
              <p style={{ fontSize: 13, color: "#666" }}>{fmtDate(w.date)}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => approve(w.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#e8f5e8", color: "#2d7a3a", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Approve</button>
                <button onClick={() => setSelectedId(w.id)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#fdecea", color: "#c0392b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Reject</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rejection modal */}
      {selectedId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a1a1a", marginBottom: 8 }}>Reject Withdrawal</h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Provide a reason. This will be shared with the member.</p>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Rejection reason</label>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Insufficient KYC documentation" rows={3}
              style={{ width: "100%", border: "1.5px solid #e4e0da", borderRadius: 10, padding: "12px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 24 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSelectedId(null)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid #e4e0da", background: "transparent", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#555" }}>Cancel</button>
              <button onClick={confirmReject} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: "#c0392b", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────
function AuditPage() {
  return (
    <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0ece6", background: "#faf9f7", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>System Audit Logs</p>
        <span style={{ fontSize: 12, color: "#aaa" }}>Immutable · Read-only</span>
      </div>
      {AUDIT_LOGS.map((log, i) => (
        <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: i < AUDIT_LOGS.length - 1 ? "1px solid #f5f2ee" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#7a6a52", flexShrink: 0 }}>
              {log.actor.split(" ").map(w => w[0]).join("")}
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#1a1a1a" }}><span style={{ fontWeight: 600 }}>{log.actor}</span> {log.action}</p>
              <p style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>{log.entity}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>{log.time}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const PAGE_TITLES = { overview: "Overview", users: "User Management", contributions: "Contribution Approvals", withdrawals: "Withdrawal Approvals", audit: "Audit Logs" };

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const pendingCount = PENDING_CONTRIBUTIONS.length + PENDING_WITHDRAWALS.length;

  const renderPage = () => {
    switch (activePage) {
      case "overview":      return <Overview />;
      case "users":         return <UsersPage />;
      case "contributions": return <ContributionsPage />;
      case "withdrawals":   return <WithdrawalsPage />;
      case "audit":         return <AuditPage />;
      default:              return null;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#faf9f7", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <Sidebar active={activePage} onNav={setActivePage} />
      <Topbar title={PAGE_TITLES[activePage]} pendingCount={pendingCount} />
      <main style={{ marginLeft: 220, paddingTop: 64 }}>
        <div style={{ padding: 32 }}>{renderPage()}</div>
      </main>
    </div>
  );
}
