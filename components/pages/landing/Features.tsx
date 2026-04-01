"use client";

import { FEATURES } from "@/lib/constants";
import Icon from "@/components/ui/Icon";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

export default function Features() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .feat-card {
          background: #fff;
          border: 1px solid #eae8e4;
          border-radius: 14px;
          padding: 28px;
          transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s;
          cursor: default;
        }
        .feat-card:hover {
          border-color: #c8b89a;
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
          transform: translateY(-3px);
        }

        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        id="features"
        style={{ padding: "96px 24px", background: "#faf9f7" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
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
              Platform capabilities
            </p>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(30px, 4vw, 50px)",
                lineHeight: 1.1,
                letterSpacing: "-0.022em",
                color: "#1a1a1a",
                fontWeight: 400,
                maxWidth: 520,
                margin: "0 auto 18px",
              }}
            >
              Everything compliance demands
            </h2>
            <p
              style={{
                fontSize: 15.5,
                color: "#777",
                fontFamily: FONT_SANS,
                maxWidth: 460,
                margin: "0 auto",
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              From KYC onboarding to audit-ready transaction logs, Aurevia
              covers the full lifecycle of pension and financial management.
            </p>
          </div>

          {/* Feature grid */}
          <div
            className="feat-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card">
                {/* Icon wrapper */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: "#f5f2ee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#5a4a32",
                    marginBottom: 18,
                    flexShrink: 0,
                  }}
                >
                  <Icon name={f.icon} size={19} />
                </div>

                <h3
                  style={{
                    fontSize: 15.5,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    marginBottom: 9,
                    letterSpacing: "-0.01em",
                    fontFamily: FONT_SANS,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#777",
                    lineHeight: 1.65,
                    fontFamily: FONT_SANS,
                    fontWeight: 400,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
