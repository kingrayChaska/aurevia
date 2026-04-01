"use client";

import { formatInitials } from "@/lib/utils";
import type { NavItem, User } from "@/types";

interface SidebarProps {
  user: Pick<User, "full_name" | "role">;
  organization: string;
  navItems: NavItem[];
  activePage: string;
  onNav: (id: string) => void;
  variant?: "light" | "dark" | "compliance";
}

const VARIANT_STYLES = {
  light: {
    bg: "#fff",
    border: "1px solid #eae8e4",
    text: "#777",
    activeText: "#1a1a1a",
    activeBg: "#f5f2ee",
    activeIcon: "#7a6a52",
    label: "#bbb",
    badgeBg: "#1a1a1a",
    orgBg: "#f5f2ee",
    orgText: "#7a6a52",
    orgBorder: "#e4e0da",
    userBg: "#faf9f7",
    userText: "#1a1a1a",
    footerBorder: "1px solid #eae8e4",
    avatarBg: "#c8b89a",
  },
  dark: {
    bg: "#1a1a1a",
    border: "none",
    text: "#555",
    activeText: "#c8b89a",
    activeBg: "rgba(200,184,154,0.15)",
    activeIcon: "#c8b89a",
    label: "#444",
    badgeBg: "#a8820a",
    orgBg: "rgba(200,184,154,0.12)",
    orgText: "#c8b89a",
    orgBorder: "rgba(200,184,154,0.2)",
    userBg: "rgba(255,255,255,0.04)",
    userText: "#ddd",
    footerBorder: "1px solid rgba(255,255,255,0.06)",
    avatarBg: "#c8b89a",
  },
  compliance: {
    bg: "#fff",
    border: "1px solid #eae8e4",
    text: "#777",
    activeText: "#3a6a8a",
    activeBg: "#eaf0f8",
    activeIcon: "#3a6a8a",
    label: "#bbb",
    badgeBg: "#a8820a",
    orgBg: "#eaf0f8",
    orgText: "#3a6a8a",
    orgBorder: "#c8daea",
    userBg: "#faf9f7",
    userText: "#1a1a1a",
    footerBorder: "1px solid #eae8e4",
    avatarBg: "#3a6a8a",
  },
};

const LogoMark = ({ variant }: { variant: "light" | "dark" | "compliance" }) => (
  <div
    style={{
      width: 30,
      height: 30,
      background: variant === "dark" ? "#faf9f7" : "#1a1a1a",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 13H2L8 2Z" fill={variant === "dark" ? "#1a1a1a" : "#faf9f7"} />
    </svg>
  </div>
);

const Sidebar = ({
  user,
  organization,
  navItems,
  activePage,
  onNav,
  variant = "light",
}: SidebarProps) => {
  const s = VARIANT_STYLES[variant];
  const roleLabel =
    variant === "dark"
      ? "Admin Portal"
      : variant === "compliance"
      ? "Compliance Portal"
      : "Member Portal";

  return (
    <aside
      style={{
        width: 220,
        background: s.bg,
        borderRight: s.border,
        display: "flex",
        flexDirection: "column",
        padding: "0 0 24px",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom:
            variant === "dark"
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid #eae8e4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <LogoMark variant={variant} />
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 17,
              color: variant === "dark" ? "#faf9f7" : "#1a1a1a",
            }}
          >
            Aurevia
          </span>
        </div>
        <div
          style={{
            marginTop: 12,
            background: s.orgBg,
            border: `1px solid ${s.orgBorder}`,
            borderRadius: 8,
            padding: "6px 10px",
          }}
        >
          <p style={{ fontSize: 11, color: s.orgText, fontWeight: 600 }}>{roleLabel}</p>
          <p style={{ fontSize: 11, color: variant === "dark" ? "#555" : "#888" }}>{organization}</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <p
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: s.label,
            padding: "0 8px",
            marginBottom: 8,
          }}
        >
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 10px",
                borderRadius: 9,
                border: "none",
                background: isActive ? s.activeBg : "transparent",
                color: isActive ? s.activeText : s.text,
                fontFamily: "inherit",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                marginBottom: 2,
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  color: isActive ? s.activeIcon : variant === "dark" ? "#444" : "#bbb",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    background: s.badgeBg,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 100,
                    minWidth: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: s.footerBorder,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px",
            borderRadius: 10,
            background: s.userBg,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: s.avatarBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {formatInitials(user.full_name)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: s.userText,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.full_name}
            </p>
            <p style={{ fontSize: 11, color: variant === "dark" ? "#555" : "#aaa" }}>
              {user.role === "compliance_officer" ? "Compliance Officer" : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
