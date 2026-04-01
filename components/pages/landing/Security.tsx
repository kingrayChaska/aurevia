"use client";

import { SECURITY_FEATURES } from "@/lib/constants";
import Icon from "@/components/ui/Icon";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

// ─── Compliance visual card ───────────────────────────────────────────────────
const ComplianceCard = () => {
  const meters = [
    { label: "KYC Approvals",  value: "94%",   bar: 94,  color: "#c8b89a" },
    { label: "SLA Compliance", value: "99.2%", bar: 99,  color: "#a8bcc8" },
    { label: "Audit Coverage", value: "100%",  bar: 100, color: "#b8c8a8" },
  ];

  const tags = ["SOC 2", "ISO 27001", "GDPR Ready"];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eae8e4",
        borderRadius: 18,
        padding: 30,
        boxShadow: "0 16px 56px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 26,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: "#f5f2ee",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5a4a32",
            flexShrink: 0,
          }}
        >
          <Icon name="shield" size={17} />
        </div>
        <div>
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "#1a1a1a",
              fontFamily: FONT_SANS,
            }}
          >
            Compliance Status
          </p>
          <p style={{ fontSize: 11.5, color: "#aaa", fontFamily: FONT_SANS }}>
            Organization: Pinnacle Trust
          </p>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "#e8f5e8",
            color: "#2d7a3a",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 100,
            fontFamily: FONT_SANS,
          }}
        >
          Active
        </div>
      </div>

      {/* Meters */}
      {meters.map((m) => (
        <div key={m.label} style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12.5, color: "#666", fontFamily: FONT_SANS }}>
              {m.label}
            </span>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#1a1a1a",
                fontFamily: FONT_SANS,
              }}
            >
              {m.value}
            </span>
          </div>
          <div
            style={{
              background: "#f0ece6",
              borderRadius: 100,
              height: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${m.bar}%`,
                height: "100%",
                background: m.color,
                borderRadius: 100,
              }}
            />
          </div>
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: "#eae8e4", margin: "20px 0" }} />

      {/* Certification tags */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#7a6a52",
              background: "#f5f0e8",
              padding: "5px 12px",
              borderRadius: 100,
              border: "1px solid #e5ddd0",
              fontFamily: FONT_SANS,
              letterSpacing: "0.02em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Security section ─────────────────────────────────────────────────────────
export default function Security() {
  const checkItems = [
    "RLS enforced across all database tables",
    "256-bit AES encryption at rest and in transit",
    "Multi-tenant isolation with zero data bleed",
    "Immutable audit logs with actor metadata",
    "Server-side role validation on all mutations",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .sec-feat-card {
          display: flex;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid #eae8e4;
        }
        .sec-feat-card:last-child { border-bottom: none; padding-bottom: 0; }

        @media (max-width: 860px) {
          .sec-two-col { grid-template-columns: 1fr !important; }
          .sec-visual { display: none !important; }
        }
      `}</style>

      <section
        id="security"
        style={{ background: "#f5f2ee", padding: "96px 24px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="sec-two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left: copy + checklist */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  fontFamily: FONT_SANS,
                  marginBottom: 16,
                }}
              >
                Security &amp; compliance
              </p>
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "clamp(28px, 3.5vw, 46px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.022em",
                  color: "#1a1a1a",
                  fontWeight: 400,
                  marginBottom: 20,
                }}
              >
                Built for regulated{" "}
                <em style={{ fontStyle: "italic", color: "#7a6a52" }}>
                  industries
                </em>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#666",
                  lineHeight: 1.7,
                  fontFamily: FONT_SANS,
                  marginBottom: 32,
                  fontWeight: 400,
                }}
              >
                Aurevia enforces Row-Level Security at the database layer,
                ensures complete tenant isolation, and generates immutable audit
                logs for every action — so your organization stays audit-ready,
                always.
              </p>

              {/* Checklist */}
              {checkItems.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 13,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#e8f5e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2d7a3a"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 13.5,
                      color: "#444",
                      fontFamily: FONT_SANS,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}

              {/* Security feature cards */}
              <div style={{ marginTop: 36 }}>
                {SECURITY_FEATURES.slice(0, 2).map((f) => (
                  <div key={f.title} className="sec-feat-card">
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 9,
                        background: "#ede9e3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#5a4a32",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Icon name={f.icon} size={16} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1a1a1a",
                          marginBottom: 4,
                          fontFamily: FONT_SANS,
                        }}
                      >
                        {f.title}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#777",
                          lineHeight: 1.6,
                          fontFamily: FONT_SANS,
                          fontWeight: 400,
                        }}
                      >
                        {f.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual card */}
            <div className="sec-visual">
              <ComplianceCard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
