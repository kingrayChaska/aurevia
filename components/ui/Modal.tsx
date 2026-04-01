"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconBg = "#f5f2ee",
  children,
  maxWidth = 420,
}: ModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 36,
          width: "100%",
          maxWidth,
          boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.2s ease",
        }}
      >
        {icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {icon}
          </div>
        )}
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "#1a1a1a",
            marginBottom: subtitle ? 8 : 24,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
