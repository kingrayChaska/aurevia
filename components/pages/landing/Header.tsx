"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

const SECTION_IDS: Record<string, string> = {
  Features:  "features",
  Security:  "security",
  Pricing:   "pricing",
  Company:   "company",
};

const LogoMark = () => (
  <div style={{ width: 32, height: 32, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 13H2L8 2Z" fill="#faf9f7" />
    </svg>
  </div>
);

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY]   = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrolled = scrollY > 40;

  const handleNavClick = (link: string) => {
    setMenuOpen(false);
    const id = SECTION_IDS[link];
    if (id) scrollToSection(id);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');

        .hdr-nav-link {
          font-size: 13.5px; font-weight: 500; color: #555;
          text-decoration: none; letter-spacing: 0.01em;
          cursor: pointer; transition: color 0.18s;
          font-family: 'DM Sans', sans-serif;
          background: none; border: none; padding: 0;
        }
        .hdr-nav-link:hover { color: #1a1a1a; }

        .hdr-btn-ghost {
          background: none; border: none; font-size: 13.5px;
          font-weight: 500; color: #666; cursor: pointer;
          padding: 9px 16px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.18s, background 0.18s;
          letter-spacing: 0.01em; text-decoration: none;
          display: inline-flex; align-items: center;
        }
        .hdr-btn-ghost:hover { color: #1a1a1a; background: rgba(26,26,26,0.04); }

        .hdr-btn-primary {
          background: #1a1a1a; color: #faf9f7; border: none;
          font-size: 13.5px; font-weight: 500; padding: 9px 20px;
          border-radius: 8px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.01em;
          transition: background 0.18s, transform 0.13s;
          text-decoration: none; display: inline-flex; align-items: center;
        }
        .hdr-btn-primary:hover { background: #2d2d2d; transform: translateY(-1px); }

        .hdr-btn-outline {
          background: transparent; color: #1a1a1a;
          border: 1.5px solid #d8d4ce; font-size: 13.5px;
          font-weight: 500; padding: 13px 20px; border-radius: 8px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: border-color 0.18s, background 0.18s;
          width: 100%; text-decoration: none;
          display: flex; align-items: center; justify-content: center;
        }
        .hdr-btn-outline:hover { border-color: #1a1a1a; background: rgba(26,26,26,0.03); }

        .hdr-mobile-link {
          font-family: 'DM Serif Display', serif; font-size: 30px;
          color: #1a1a1a; text-decoration: none; letter-spacing: -0.02em;
          cursor: pointer; display: block; transition: color 0.15s;
          background: none; border: none; padding: 0; text-align: left;
        }
        .hdr-mobile-link:hover { color: #7a6a52; }

        @media (min-width: 768px) {
          .hdr-desktop { display: flex !important; }
          .hdr-mobile-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .hdr-desktop { display: none !important; }
          .hdr-mobile-btn { display: flex !important; }
        }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px", height: 64, display: "flex", alignItems: "center",
        background: scrolled ? "rgba(250,249,247,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid #eae8e4" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo → home */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <LogoMark />
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, letterSpacing: "-0.02em", color: "#1a1a1a", fontWeight: 400 }}>
              Aurevia
            </span>
          </Link>

          {/* Desktop nav → smooth scroll */}
          <nav className="hdr-desktop" style={{ alignItems: "center", gap: 32 }}>
            {NAV_LINKS.map((link) => (
              <button key={link} className="hdr-nav-link" onClick={() => handleNavClick(link)}>
                {link}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hdr-desktop" style={{ alignItems: "center", gap: 6 }}>
            <Link href="/auth/login" className="hdr-btn-ghost">Sign in</Link>
            <Link href="/auth/login" className="hdr-btn-primary">Get started →</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="hdr-mobile-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#1a1a1a" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#faf9f7", zIndex: 999, display: "flex", flexDirection: "column", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 52 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
              <LogoMark />
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 19, letterSpacing: "-0.02em", color: "#1a1a1a" }}>Aurevia</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#1a1a1a" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
            {NAV_LINKS.map((link) => (
              <button key={link} className="hdr-mobile-link" onClick={() => handleNavClick(link)}>
                {link}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32 }}>
            <Link href="/auth/login" className="hdr-btn-outline" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link href="/auth/login" className="hdr-btn-primary" style={{ width: "100%", padding: "13px", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
              Get started →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
