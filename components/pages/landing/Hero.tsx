"use client";

import Link from "next/link";
import { TRUSTED_BRANDS } from "@/lib/constants";

// ─── Shared style tokens ──────────────────────────────────────────────────────
const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

// ─── Mini dashboard preview card ─────────────────────────────────────────────
const DashboardPreview = () => {
  const rows = [
    { initials: "JO", name: "James Okafor",   type: "Contribution", amount: "+₦120,000", status: "approved", sBg: "#e8f5e8", sColor: "#2d7a3a" },
    { initials: "AB", name: "Amara Bello",    type: "Withdrawal",   amount: "-₦45,000",  status: "pending",  sBg: "#fef9e7", sColor: "#a8820a" },
    { initials: "CU", name: "Chisom Ude",     type: "KYC Review",   amount: "—",         status: "review",   sBg: "#f0ece6", sColor: "#7a6a52" },
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eae8e4",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.09)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "13px 18px",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
          <div
            key={c}
            style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
          />
        ))}
        <span
          style={{
            color: "#555",
            fontSize: 11.5,
            marginLeft: 8,
            fontFamily: "monospace",
            letterSpacing: "0.02em",
          }}
        >
          aurevia.app/dashboard
        </span>
      </div>

      <div style={{ padding: 22 }}>
        {/* Balance row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div>
            <p style={{ fontSize: 11, color: "#bbb", marginBottom: 3, fontFamily: FONT_SANS }}>
              Total contributions
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
                fontFamily: FONT_SANS,
              }}
            >
              ₦48,240,000
            </p>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: "#e8f5e8",
              color: "#2d7a3a",
              padding: "4px 9px",
              borderRadius: 100,
              fontFamily: FONT_SANS,
            }}
          >
            +12.4%
          </span>
        </div>

        {/* Mini bar chart */}
        <div
          style={{
            display: "flex",
            gap: 5,
            alignItems: "flex-end",
            height: 52,
            marginBottom: 18,
          }}
        >
          {[40, 62, 44, 78, 54, 88, 68, 82, 58, 92, 72, 100].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: i === 11 ? "#c8b89a" : "#f0ece6",
                borderRadius: "3px 3px 0 0",
                transition: "height 0.4s ease",
              }}
            />
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f0ece6", marginBottom: 14 }} />

        {/* Transaction rows */}
        {rows.map((row, i) => (
          <div
            key={row.initials}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 0",
              borderBottom: i < rows.length - 1 ? "1px solid #f8f6f3" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: "#f5f2ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#7a6a52",
                  fontFamily: FONT_SANS,
                  flexShrink: 0,
                }}
              >
                {row.initials}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    marginBottom: 1,
                    fontFamily: FONT_SANS,
                  }}
                >
                  {row.name}
                </p>
                <p style={{ fontSize: 10.5, color: "#bbb", fontFamily: FONT_SANS }}>
                  {row.type}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  marginBottom: 3,
                  fontFamily: FONT_SANS,
                }}
              >
                {row.amount}
              </p>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  background: row.sBg,
                  color: row.sColor,
                  padding: "2px 7px",
                  borderRadius: 100,
                  fontFamily: FONT_SANS,
                }}
              >
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(40px, 6vw, 78px);
          line-height: 1.07;
          letter-spacing: -0.025em;
          color: #1a1a1a;
          font-weight: 400;
          margin: 0;
        }
        .hero-title em {
          font-style: italic;
          color: #7a6a52;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f0ece6;
          border: 1px solid #ddd8d0;
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 500;
          color: #5a5040;
          letter-spacing: 0.02em;
          font-family: 'DM Sans', sans-serif;
        }
        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8b89a;
          display: inline-block;
          flex-shrink: 0;
        }

        .hero-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #aaa;
          font-family: 'DM Sans', sans-serif;
        }
        .hero-trusted-name {
          font-size: 12.5px;
          font-weight: 700;
          color: #ccc;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }

        .hero-btn-primary {
          background: #1a1a1a;
          color: #faf9f7;
          border: none;
          padding: 13px 28px;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: background 0.18s, transform 0.14s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .hero-btn-primary:hover { background: #2d2d2d; transform: translateY(-1px); }

        .hero-btn-outline {
          background: transparent;
          color: #1a1a1a;
          border: 1.5px solid #d8d4ce;
          padding: 13px 24px;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: border-color 0.18s, background 0.18s, transform 0.14s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .hero-btn-outline:hover {
          border-color: #1a1a1a;
          background: rgba(26,26,26,0.03);
          transform: translateY(-1px);
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .h-fu-1 { animation: heroFadeUp 0.65s ease both; animation-delay: 0.05s; opacity: 0; }
        .h-fu-2 { animation: heroFadeUp 0.65s ease both; animation-delay: 0.18s; opacity: 0; }
        .h-fu-3 { animation: heroFadeUp 0.65s ease both; animation-delay: 0.30s; opacity: 0; }
        .h-fu-4 { animation: heroFadeUp 0.65s ease both; animation-delay: 0.42s; opacity: 0; }

        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        @media (max-width: 900px) {
          .hero-two-col { grid-template-columns: 1fr !important; }
          .hero-preview { display: none !important; }
          .hero-cta-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <section
        className="hero-grid-bg"
        style={{
          paddingTop: 140,
          paddingBottom: 100,
          paddingLeft: 24,
          paddingRight: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glows */}
        <div
          style={{
            position: "absolute", top: -100, right: -100,
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(200,184,154,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -50, left: -50,
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(168,188,200,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Badge */}
          <div className="h-fu-1" style={{ marginBottom: 28 }}>
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Multi-tenant pension &amp; financial management
            </span>
          </div>

          {/* Two-column grid */}
          <div
            className="hero-two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 390px",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: copy */}
            <div>
              <h1 className="hero-title h-fu-2" style={{ marginBottom: 26 }}>
                Financial compliance,
                <br />
                <em>built for scale</em>
              </h1>

              <p
                className="h-fu-3"
                style={{
                  fontSize: 17,
                  color: "#666",
                  lineHeight: 1.7,
                  maxWidth: 510,
                  marginBottom: 38,
                  fontFamily: FONT_SANS,
                  fontWeight: 400,
                }}
              >
                Aurevia is the secure multi-tenant platform for organizations
                to manage pension contributions, KYC workflows, withdrawal
                approvals, and compliance audits — all in one place.
              </p>

              {/* CTAs */}
              <div
                className="hero-cta-row h-fu-4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <Link href="/auth/login" className="hero-btn-primary" style={{ textDecoration: "none" }}>
                  Start free trial →
                </Link>
                <button
                  className="hero-btn-outline"
                  onClick={() => {
                    const el = document.getElementById("features");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                  </svg>
                  See features
                </button>
              </div>

              {/* Trusted by */}
              <div
                style={{
                  marginTop: 48,
                  paddingTop: 32,
                  borderTop: "1px solid #eae8e4",
                }}
              >
                <p className="hero-section-label" style={{ marginBottom: 18 }}>
                  Trusted by finance teams at
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    flexWrap: "wrap",
                  }}
                >
                  {TRUSTED_BRANDS.map((name) => (
                    <span key={name} className="hero-trusted-name">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: dashboard preview */}
            <div className="hero-preview">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
