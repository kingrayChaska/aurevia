"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/constants";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target }: { target: string }) {
  const [display, setDisplay] = useState<string>(target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) {
      // Non-numeric value (e.g. "SOC 2") — just show it immediately
      setDisplay(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const steps = 55;
          const inc = numeric / steps;
          let current = 0;
          const prefix = target.replace(/[0-9.<>%]+/, "");
          const suffix = target.replace(/[^%]+/, "") || "";

          const timer = setInterval(() => {
            current = Math.min(current + inc, numeric);
            // Reconstruct original format
            const formatted = target.startsWith("<")
              ? `<${Math.round(current)}${suffix}`
              : `${Number.isInteger(numeric) ? Math.round(current) : (Math.round(current * 10) / 10)}${target.replace(/[^%a-z]/gi, "")}`;
            setDisplay(formatted);
            if (current >= numeric) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.6 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}</span>;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export default function Stats() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=DM+Serif+Display@4..36,400&display=swap');
        @media (max-width: 640px) {
          .stats-inner { grid-template-columns: 1fr 1fr !important; }
          .stats-divider { display: none !important; }
        }
      `}</style>

      <div style={{ background: "#1a1a1a", padding: "0 24px" }}>
        <div
          className="stats-inner"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "30px 20px",
                textAlign: "center",
                borderRight:
                  i < STATS.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
              }}
            >
              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 32,
                  color: "#faf9f7",
                  marginBottom: 6,
                  letterSpacing: "-0.02em",
                  fontWeight: 400,
                }}
              >
                <AnimatedCounter target={s.value} />
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#666",
                  fontFamily: FONT_SANS,
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
