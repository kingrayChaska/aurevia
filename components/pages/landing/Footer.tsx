"use client";

import Link from "next/link";
import { FOOTER_COLS } from "@/lib/constants";

const FONT_SERIF = "'DM Serif Display', serif";
const FONT_SANS  = "'DM Sans', sans-serif";

const LogoMark = () => (
  <div
    style={{
      width: 30,
      height: 30,
      background: "#faf9f7",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 13H2L8 2Z" fill="#1a1a1a" />
    </svg>
  </div>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display@4..36,400&display=swap');

        .ftr-link {
          font-size: 13.5px;
          color: #555;
          cursor: pointer;
          display: block;
          margin-bottom: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          text-decoration: none;
          transition: color 0.18s;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
        }
        .ftr-link:hover { color: #aaa; }

        .ftr-social {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #555;
          transition: border-color 0.18s, color 0.18s;
        }
        .ftr-social:hover { border-color: rgba(255,255,255,0.2); color: #aaa; }

        @media (max-width: 768px) {
          .ftr-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
          .ftr-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .ftr-grid { grid-template-columns: 1fr !important; }
          .ftr-bottom { flex-direction: column !important; gap: 12px !important; text-align: center; }
        }
      `}</style>

      <footer id="company" style={{ background: "#111", padding: "64px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Grid */}
          <div
            className="ftr-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 48,
              marginBottom: 52,
            }}
          >
            {/* Brand col */}
            <div className="ftr-brand">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 16,
                }}
              >
                <LogoMark />
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: 18,
                    color: "#faf9f7",
                    letterSpacing: "-0.015em",
                    fontWeight: 400,
                  }}
                >
                  Aurevia
                </span>
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#444",
                  lineHeight: 1.7,
                  maxWidth: 260,
                  fontFamily: FONT_SANS,
                  fontWeight: 400,
                  marginBottom: 24,
                }}
              >
                Secure multi-tenant platform for pension and financial management
                teams.
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: 8 }}>
                {/* Twitter / X */}
                <button className="ftr-social" aria-label="Twitter">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                {/* LinkedIn */}
                <button className="ftr-social" aria-label="LinkedIn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </button>
                {/* GitHub */}
                <button className="ftr-social" aria-label="GitHub">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Link cols */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#444",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: FONT_SANS,
                    marginBottom: 20,
                  }}
                >
                  {col.title}
                </p>
                {col.links.map((link) => {
                  const href = ({
                    "Features": "#features",
                    "Security": "#security",
                    "Pricing": "#pricing",
                    "Changelog": "#",
                    "About": "#company",
                    "Blog": "#",
                    "Careers": "#",
                    "Contact": "#",
                    "Privacy": "#",
                    "Terms": "#",
                    "Security Policy": "#security",
                    "GDPR": "#",
                  } as Record<string, string>)[link] ?? "#";
                  return (
                    <a
                      key={link}
                      href={href}
                      className="ftr-link"
                      onClick={(e) => {
                        if (href.startsWith("#") && href.length > 1) {
                          e.preventDefault();
                          const el = document.getElementById(href.slice(1));
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      {link}
                    </a>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{ height: 1, background: "#1e1e1e", marginBottom: 28 }}
          />
          <div
            className="ftr-bottom"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 12.5,
                color: "#333",
                fontFamily: FONT_SANS,
              }}
            >
              © {year} Aurevia. All rights reserved.
            </p>
            <p
              style={{
                fontSize: 12.5,
                color: "#333",
                fontFamily: FONT_SANS,
              }}
            >
              Built with security and scale in mind.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
