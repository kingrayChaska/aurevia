"use client";

import { useState, useEffect } from "react";
import { TESTIMONIALS } from "@/lib/constants";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .test-card {
          background: #fff;
          border: 1px solid #eae8e4;
          border-radius: 16px;
          padding: 32px;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        @media (max-width: 860px) {
          .test-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
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
              What teams say
            </p>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(28px, 3.5vw, 46px)",
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
                color: "#1a1a1a",
                fontWeight: 400,
              }}
            >
              Loved by finance teams
            </h2>
          </div>

          {/* Cards grid */}
          <div
            className="test-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 22,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.initials}
                className="test-card"
                style={{
                  opacity: active === i ? 1 : 0.52,
                  transform: active === i ? "scale(1.02)" : "scale(1)",
                  cursor: "pointer",
                }}
                onClick={() => setActive(i)}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                  {[...Array(5)].map((_, s) => (
                    <svg
                      key={s}
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="#c8b89a"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontSize: 14,
                    color: "#444",
                    lineHeight: 1.7,
                    marginBottom: 24,
                    fontStyle: "italic",
                    fontFamily: FONT_SANS,
                    fontWeight: 400,
                  }}
                >
                  "{t.quote}"
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: t.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: FONT_SANS,
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#1a1a1a",
                        fontFamily: FONT_SANS,
                        marginBottom: 2,
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#999",
                        fontFamily: FONT_SANS,
                      }}
                    >
                      {t.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
            }}
          >
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Testimonial ${i + 1}`}
                style={{
                  width: active === i ? 24 : 8,
                  height: 8,
                  borderRadius: 100,
                  background: active === i ? "#1a1a1a" : "#ddd8d0",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
