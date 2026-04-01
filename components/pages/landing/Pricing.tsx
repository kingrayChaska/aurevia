"use client";

import Link from "next/link";
import { PRICING } from "@/lib/constants";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

const CheckIcon = ({ highlight }: { highlight: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={highlight ? "#c8b89a" : "#4a8a5a"}
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Pricing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .price-card {
          background: #fff;
          border: 1px solid #eae8e4;
          border-radius: 16px;
          padding: 34px;
          position: relative;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .price-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          transform: translateY(-4px);
        }
        .price-card.highlight {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #faf9f7;
        }

        .price-cta-default {
          width: 100%;
          margin-top: 28px;
          padding: 12px;
          border-radius: 9px;
          border: 1.5px solid #d8d4ce;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #1a1a1a;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: border-color 0.18s, background 0.18s;
        }
        .price-cta-default:hover { border-color: #1a1a1a; background: rgba(26,26,26,0.03); }

        .price-cta-highlight {
          width: 100%;
          margin-top: 28px;
          padding: 12px;
          border-radius: 9px;
          border: none;
          background: #faf9f7;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.18s;
        }
        .price-cta-highlight:hover { background: #f0ece6; }

        @media (max-width: 860px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin: 0 auto !important; }
        }
      `}</style>

      <section
        id="pricing"
        style={{ background: "#faf9f7", padding: "96px 24px" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Heading */}
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
              Pricing
            </p>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(28px, 3.5vw, 46px)",
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
                color: "#1a1a1a",
                fontWeight: 400,
                marginBottom: 14,
              }}
            >
              Simple, transparent pricing
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#777",
                fontFamily: FONT_SANS,
                maxWidth: 400,
                margin: "0 auto",
                fontWeight: 400,
              }}
            >
              Start free. Scale as your organization grows. No surprises.
            </p>
          </div>

          {/* Cards */}
          <div
            className="pricing-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 22,
            }}
          >
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`price-card${plan.highlight ? " highlight" : ""}`}
              >
                {/* Popular badge */}
                {plan.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: -13,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#c8b89a",
                      color: "#fff",
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 100,
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                      fontFamily: FONT_SANS,
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                {/* Plan name */}
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: plan.highlight ? "#666" : "#999",
                    fontFamily: FONT_SANS,
                    marginBottom: 12,
                  }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: 44,
                      letterSpacing: "-0.03em",
                      color: plan.highlight ? "#faf9f7" : "#1a1a1a",
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: plan.highlight ? "#666" : "#aaa",
                      fontFamily: FONT_SANS,
                    }}
                  >
                    / {plan.period}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 13.5,
                    color: plan.highlight ? "#888" : "#777",
                    fontFamily: FONT_SANS,
                    marginBottom: 24,
                    lineHeight: 1.55,
                    fontWeight: 400,
                  }}
                >
                  {plan.desc}
                </p>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: plan.highlight
                      ? "rgba(255,255,255,0.08)"
                      : "#eae8e4",
                    marginBottom: 22,
                  }}
                />

                {/* Feature list */}
                {plan.features.map((feat) => (
                  <div
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <CheckIcon highlight={plan.highlight} />
                    <span
                      style={{
                        fontSize: 13.5,
                        color: plan.highlight ? "#bbb" : "#555",
                        fontFamily: FONT_SANS,
                        fontWeight: 400,
                      }}
                    >
                      {feat}
                    </span>
                  </div>
                ))}

                {/* CTA */}
                <Link
                  href={plan.highlight ? "/auth/login?plan=growth" : plan.name === "Enterprise" ? "/auth/login?plan=enterprise" : "/auth/login?plan=starter"}
                  className={plan.highlight ? "price-cta-highlight" : "price-cta-default"}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
