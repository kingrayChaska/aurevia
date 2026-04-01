"use client";

import { useState } from "react";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
}

const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  required,
}: FormFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#555",
          marginBottom: 6,
          display: "block",
          letterSpacing: "0.01em",
        }}
      >
        {label}
        {required && <span style={{ color: "#c0392b", marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "#7a6a52" : "#bbb",
              transition: "color 0.2s",
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={isPassword ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          style={{
            width: "100%",
            background: "#fff",
            border: `1.5px solid ${error ? "#e06060" : focused ? "#1a1a1a" : "#e4e0da"}`,
            borderRadius: 10,
            padding: "12px 16px",
            paddingLeft: icon ? 42 : 16,
            paddingRight: isPassword ? 44 : 16,
            fontSize: 14,
            fontFamily: "inherit",
            color: "#1a1a1a",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(26,26,26,0.06)" : "none",
            boxSizing: "border-box",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            aria-label={showPass ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#aaa",
              padding: 0,
              display: "flex",
            }}
          >
            {showPass ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#e06060", marginTop: 5 }}>{error}</p>
      )}
    </div>
  );
};

export default FormField;
