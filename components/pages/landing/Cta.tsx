"use client";

import Link from "next/link";
import { useState } from "react";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

export default function Cta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    // Redirect after brief delay so user sees confirmation
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .cta-email-input {
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.13);
          color: #faf9f7;
          border-radius: 9px;
          padding: 12px 18px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-width: 260px;
        }
        .cta-email-input::placeholder { color: rgba(255,255,255,0.3); }
        .cta-email-input:focus {
          border-color: rgba(200,184,154,0.5);
          box-shadow: 0 0 0 3px rgba(200,184,154,0.1);
        }

        .cta-btn {
          background: #c8b89a;
          color: #1a1a1a;
          border: none;
          padding: 12px 26px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: background 0.18s, transform 0.13s;
          white-space: nowrap;
        }
        .cta-btn:hover { background: #b8a88a; transform: translateY(-1px); }

        @media (max-width: 600px) {
          .cta-form-row { flex-direction: column !important; align-items: stretch !important; }
          .cta-email-input { min-width: unset !important; width: 100% !important; }
          .cta-btn { width: 100% !important; }
        }
      `}</style>

      <section
        style={{
          background: "#1a1a1a",
          padding: "96px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(200,184,154,0.1) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#555",
              fontFamily: FONT_SANS,
              marginBottom: 20,
            }}
          >
            Get started today
          </p>

          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "clamp(30px, 5vw, 58px)",
              color: "#faf9f7",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              marginBottom: 20,
            }}
          >
            Ready to streamline{" "}
            <em style={{ fontStyle: "italic", color: "#c8b89a" }}>
              your compliance?
            </em>
          </h2>

          <p
            style={{
              fontSize: 15.5,
              color: "#666",
              lineHeight: 1.65,
              fontFamily: FONT_SANS,
              marginBottom: 44,
              fontWeight: 400,
            }}
          >
            Join hundreds of organizations using Aurevia to manage pension
            contributions, KYC workflows, and financial compliance at scale.
          </p>

          {submitted ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(72,160,90,0.15)",
                border: "1px solid rgba(72,160,90,0.3)",
                borderRadius: 10,
                padding: "14px 24px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4aa05a"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span
                style={{
                  fontSize: 14,
                  color: "#4aa05a",
                  fontFamily: FONT_SANS,
                  fontWeight: 500,
                }}
              >
                You're on the list! We'll be in touch soon.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="cta-form-row"
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <input
                type="email"
                className="cta-email-input"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="cta-btn">
                Start free trial →
              </button>
            </form>
          )}

          <p
            style={{
              fontSize: 12.5,
              color: "#444",
              fontFamily: FONT_SANS,
              marginTop: submitted ? 20 : 0,
            }}
          >
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
