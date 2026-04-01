"use client";

import { useState } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const OFFICER = { fullName: "James Okafor", role: "compliance_officer", organization: "Vantage Pensions", avatar: "JO" };

const KYC_QUEUE = [
  { id: "k1", user: "Chisom Ude",   email: "chisom@org.com",  submitted: "2025-03-18", docs: ["National ID", "Proof of Address"], status: "pending" },
  { id: "k2", user: "Fatima Bello", email: "fatima@org.com",  submitted: "2025-03-20", docs: ["Passport", "Utility Bill"],       status: "pending" },
  { id: "k3", user: "Kemi Adebayo", email: "kemi@org.com",    submitted: "2025-03-22", docs: ["National ID", "Bank Statement"],   status: "pending" },
];

const KYC_HISTORY = [
  { id: "h1", user: "Amara Osei",   email: "amara@org.com",   reviewed: "2025-03-15", status: "approved", reviewer: "James Okafor" },
  { id: "h2", user: "Emeka Nwosu",  email: "emeka@org.com",   reviewed: "2025-03-10", status: "approved", reviewer: "James Okafor" },
  { id: "h3", user: "Ada Okonkwo",  email: "ada@org.com",     reviewed: "2025-03-08", status: "rejected", reviewer: "James Okafor", reason: "Expired ID document" },
  { id: "h4", user: "Bode Martins", email: "bode@org.com",    reviewed: "2025-03-01", status: "approved", reviewer: "James Okafor" },
];

const FLAGGED_TRANSACTIONS = [
  { id: "f1", user: "Emeka Nwosu",   type: "withdrawal", amount: 2500000, date: "2025-03-22", reason: "Amount exceeds monthly threshold" },
  { id: "f2", user: "Kemi Adebayo",  type: "withdrawal", amount: 1800000, date: "2025-03-20", reason: "Multiple requests within 48 hours" },
];

const AUDIT_LOGS = [
  { id: "a1", actor: "James Okafor", action: "Approved KYC",       entity: "Amara Osei",   time: "2025-03-15 14:22" },
  { id: "a2", actor: "James Okafor", action: "Rejected KYC",       entity: "Ada Okonkwo",  time: "2025-03-08 11:05" },
  { id: "a3", actor: "James Okafor", action: "Flagged transaction", entity: "Emeka Nwosu",  time: "2025-03-22 09:44" },
  { id: "a4", actor: "James Okafor", action: "Reviewed document",  entity: "Chisom Ude",   time: "2025-03-18 16:30" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const STATUS_STYLES = {
  approved: { bg: "#e8f5e8", color: "#2d7a3a", label: "Approved" },
  pending:  { bg: "#fef9e7", color: "#a8820a", label: "Pending"  },
  rejected: { bg: "#fdecea", color: "#c0392b", label: "Rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status];
  return <span style={{ fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 100 }}>{s.label}</span>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview",          icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: "kyc",      label: "KYC Review",        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: "history",  label: "Review History",    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { id: "flagged",  label: "Flagged Items",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: "audit",    label: "Audit Trail",       icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

function Sidebar({ active, onNav }) {
  return (
    <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #eae8e4", display: "flex", flexDirection: "column", padding: "0 0 24px", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #eae8e4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="#faf9f7" /></svg>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#1a1a1a" }}>Aurevia</span>
        </div>
        <div style={{ marginTop: 12, background: "#eaf0f8", border: "1px solid #c8daea", borderRadius: 8, padding: "6px 10px" }}>
          <p style={{ fontSize: 11, color: "#3a6a8a", fontWeight: 600 }}>Compliance Portal</p>
          <p style={{ fontSize: 11, color: "#888" }}>{OFFICER.organization}</p>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#bbb", padding: "0 8px", marginBottom: 8 }}>Compliance</p>
        {NAV.map((item) => {
          const isActive = active === item.id;
          const hasBadge = item.id === "kyc" && KYC_QUEUE.length > 0;
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 9, border: "none", background: isActive ? "#eaf0f8" : "transparent", color: isActive ? "#3a6a8a" : "#777", fontFamily: "inherit", fontSize: 13.5, fontWeight: isActive ? 600 : 400, cursor: "pointer", marginBottom: 2, transition: "all 0.15s", textAlign: "left" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#faf9f7"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ color: isActive ? "#3a6a8a" : "#bbb", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {hasBadge && <span style={{ background: "#a8820a", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 100, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{KYC_QUEUE.length}</span>}
              {item.id === "flagged" && FLAGGED_TRANSACTIONS.length > 0 && <span style={{ background: "#c0392b", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 100, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{FLAGGED_TRANSACTIONS.length}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid #eae8e4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 10, background: "#faf9f7" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#3a6a8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{OFFICER.avatar}</div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{OFFICER.fullName}</p>
            <p style={{ fontSize: 11, color: "#aaa" }}>Compliance Officer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title }) {
  return (
    <header style={{ position: "fixed", top: 0, left: 220, right: 0, height: 64, background: "rgba(250,249,247,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid #eae8e4", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", zIndex: 40 }}>
      <h1 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.01em" }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: "#eaf0f8", color: "#3a6a8a", fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 100 }}>Compliance Officer</div>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "#3a6a8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{OFFICER.avatar}</div>
      </div>
    </header>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview() {
  const approved = KYC_HISTORY.filter(h => h.status === "approved").length;
  const rejected = KYC_HISTORY.filter(h => h.status === "rejected").length;
  const total = approved + rejected + KYC_QUEUE.length;

  const metrics = [
    { label: "Pending KYC", value: KYC_QUEUE.length, color: "#a8820a", bg: "#fef9e7", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: "Approved",    value: approved,          color: "#2d7a3a", bg: "#e8f5e8", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { label: "Rejected",    value: rejected,          color: "#c0392b", bg: "#fdecea", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
    { label: "Flagged",     value: FLAGGED_TRANSACTIONS.length, color: "#c0392b", bg: "#fdecea", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ];

  return (
    <div>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>Compliance dashboard · {OFFICER.organization}</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 24, flex: 1, minWidth: 160 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{m.label}</p>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}>{m.icon}</div>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Compliance rate */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 28 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>KYC Approval Rate</p>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>Total reviewed: {total}</p>
          <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 20px" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#f0ece6" strokeWidth="12" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#2d7a3a" strokeWidth="12"
                strokeDasharray={`${(approved / (total || 1)) * 301.6} 301.6`}
                strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{total > 0 ? Math.round((approved / total) * 100) : 0}%</p>
              <p style={{ fontSize: 11, color: "#aaa" }}>approved</p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#2d7a3a" }}>{approved}</p>
              <p style={{ fontSize: 11, color: "#aaa" }}>Approved</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#c0392b" }}>{rejected}</p>
              <p style={{ fontSize: 11, color: "#aaa" }}>Rejected</p>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 28 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Flagged Transactions</p>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>Require immediate review</p>
          {FLAGGED_TRANSACTIONS.map((f, i) => (
            <div key={f.id} style={{ padding: "14px", background: "#fff9f9", border: "1px solid #fde0de", borderRadius: 10, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{f.user}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>{fmt(f.amount)}</p>
              </div>
              <p style={{ fontSize: 12, color: "#c0392b" }}>{f.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── KYC Review ───────────────────────────────────────────────────────────────
function KycReview() {
  const [queue, setQueue] = useState(KYC_QUEUE);
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null); // "approve" | "reject"
  const [reason, setReason] = useState("");

  const handleAction = (item, act) => {
    setSelected(item);
    setAction(act);
    setReason("");
  };

  const confirm = () => {
    if (action === "reject" && !reason.trim()) return;
    setQueue((prev) => prev.filter((k) => k.id !== selected.id));
    setSelected(null);
    setAction(null);
  };

  return (
    <div>
      {queue.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 64, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#e8f5e8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2d7a3a" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>Queue cleared</p>
          <p style={{ fontSize: 14, color: "#aaa" }}>All KYC submissions have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {queue.map((item) => (
            <div key={item.id} style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: "#f5f2ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#7a6a52" }}>
                    {item.user.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>{item.user}</p>
                    <p style={{ fontSize: 13, color: "#888" }}>{item.email}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status="pending" />
                  <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>Submitted {fmtDate(item.submitted)}</p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Submitted Documents</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {item.docs.map((doc) => (
                    <div key={doc} style={{ display: "flex", alignItems: "center", gap: 8, background: "#faf9f7", border: "1px solid #eae8e4", borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8b89a"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#eae8e4"; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a6a52" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ fontSize: 13, color: "#444" }}>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => handleAction(item, "reject")} style={{ padding: "10px 20px", borderRadius: 9, border: "1.5px solid #fde0de", background: "transparent", color: "#c0392b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Reject
                </button>
                <button onClick={() => handleAction(item, "approve")} style={{ padding: "10px 20px", borderRadius: 9, border: "none", background: "#2d7a3a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Approve KYC
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 36, width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: action === "approve" ? "#e8f5e8" : "#fdecea", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              {action === "approve"
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d7a3a" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a1a1a", marginBottom: 8 }}>
              {action === "approve" ? "Approve KYC" : "Reject KYC"}
            </h2>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
              {action === "approve"
                ? `This will mark ${selected.user}'s identity as verified and allow withdrawals.`
                : `This will notify ${selected.user} of the rejection.`}
            </p>
            {action === "reject" && (
              <>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Rejection reason <span style={{ color: "#c0392b" }}>*</span></label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe why the KYC was rejected…" rows={3}
                  style={{ width: "100%", border: "1.5px solid #e4e0da", borderRadius: 10, padding: "12px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 24 }} />
              </>
            )}
            {action === "approve" && <div style={{ height: 0, marginBottom: 24 }} />}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setSelected(null)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1.5px solid #e4e0da", background: "transparent", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#555" }}>Cancel</button>
              <button onClick={confirm} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: action === "approve" ? "#2d7a3a" : "#c0392b", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                {action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── History ──────────────────────────────────────────────────────────────────
function ReviewHistory() {
  return (
    <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px 200px", padding: "14px 20px", borderBottom: "1px solid #f0ece6", background: "#faf9f7" }}>
        {["Member", "Reviewed", "Status", "Notes"].map((h) => (
          <p key={h} style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</p>
        ))}
      </div>
      {KYC_HISTORY.map((h, i) => (
        <div key={h.id} style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px 200px", padding: "16px 20px", borderBottom: i < KYC_HISTORY.length - 1 ? "1px solid #f5f2ee" : "none", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{h.user}</p>
            <p style={{ fontSize: 12, color: "#aaa" }}>{h.email}</p>
          </div>
          <p style={{ fontSize: 13, color: "#666" }}>{fmtDate(h.reviewed)}</p>
          <StatusBadge status={h.status} />
          <p style={{ fontSize: 12, color: "#aaa" }}>{h.reason || "—"}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Flagged ──────────────────────────────────────────────────────────────────
function FlaggedPage() {
  return (
    <div>
      <div style={{ background: "#fff9f9", border: "1px solid #fde0de", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <p style={{ fontSize: 13, color: "#c0392b", fontWeight: 500 }}>{FLAGGED_TRANSACTIONS.length} transaction{FLAGGED_TRANSACTIONS.length !== 1 ? "s" : ""} flagged for suspicious activity</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {FLAGGED_TRANSACTIONS.map((f) => (
          <div key={f.id} style={{ background: "#fff", border: "1.5px solid #fde0de", borderRadius: 14, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>{f.user}</p>
                  <span style={{ background: "#fdecea", color: "#c0392b", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100 }}>FLAGGED</span>
                </div>
                <p style={{ fontSize: 13, color: "#888" }}>Type: <span style={{ textTransform: "capitalize" }}>{f.type}</span> · {fmtDate(f.date)}</p>
              </div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "#c0392b", letterSpacing: "-0.02em" }}>{fmt(f.amount)}</p>
            </div>
            <div style={{ background: "#fff9f9", border: "1px solid #fde0de", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#c0392b" }}>⚠ {f.reason}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ padding: "9px 18px", borderRadius: 8, border: "1.5px solid #e4e0da", background: "transparent", color: "#555", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Dismiss Flag</button>
              <button style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#1a1a1a", color: "#faf9f7", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Escalate to Admin</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Audit ────────────────────────────────────────────────────────────────────
function AuditTrail() {
  return (
    <div style={{ background: "#fff", border: "1px solid #eae8e4", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0ece6", background: "#faf9f7", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>Compliance Audit Trail</p>
        <span style={{ fontSize: 12, color: "#aaa" }}>Immutable · Read-only</span>
      </div>
      {AUDIT_LOGS.map((log, i) => (
        <div key={log.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: i < AUDIT_LOGS.length - 1 ? "1px solid #f5f2ee" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#eaf0f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#3a6a8a", flexShrink: 0 }}>
              {log.actor.split(" ").map(w => w[0]).join("")}
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#1a1a1a" }}><span style={{ fontWeight: 600 }}>{log.actor}</span> — {log.action}</p>
              <p style={{ fontSize: 11, color: "#bbb" }}>Entity: {log.entity}</p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap", fontFamily: "monospace" }}>{log.time}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const PAGE_TITLES = { overview: "Compliance Overview", kyc: "KYC Review Queue", history: "Review History", flagged: "Flagged Transactions", audit: "Audit Trail" };

export default function ComplianceDashboard() {
  const [activePage, setActivePage] = useState("overview");

  const renderPage = () => {
    switch (activePage) {
      case "overview": return <Overview />;
      case "kyc":      return <KycReview />;
      case "history":  return <ReviewHistory />;
      case "flagged":  return <FlaggedPage />;
      case "audit":    return <AuditTrail />;
      default:         return null;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#faf9f7", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <Sidebar active={activePage} onNav={setActivePage} />
      <Topbar title={PAGE_TITLES[activePage]} />
      <main style={{ marginLeft: 220, paddingTop: 64 }}>
        <div style={{ padding: 32 }}>{renderPage()}</div>
      </main>
    </div>
  );
}
