"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Helper to format auth errors with user-friendly messages
const formatAuthError = (errorMessage) => {
  if (!errorMessage) return "An error occurred. Please try again.";

  const lowerMsg = errorMessage.toLowerCase();

  if (lowerMsg.includes("rate limit")) {
    return "Too many sign-up attempts. Please wait a few minutes and try again.";
  }
  if (lowerMsg.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  if (lowerMsg.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (lowerMsg.includes("user already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (lowerMsg.includes("weak password")) {
    return "Password is too weak. Please use at least 8 characters with uppercase, numbers, and symbols.";
  }

  return errorMessage;
};

const INPUT_BASE = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #e4e0da",
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 14,
  fontFamily: "inherit",
  color: "#1a1a1a",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const LABEL_STYLE = {
  fontSize: 13,
  fontWeight: 500,
  color: "#555",
  marginBottom: 6,
  display: "block",
  letterSpacing: "0.01em",
};

const IconMail = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLock = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconUser = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBuilding = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

function FormField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={LABEL_STYLE}>
        {label}
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
          style={{
            ...INPUT_BASE,
            paddingLeft: icon ? 42 : 16,
            paddingRight: isPassword ? 44 : 16,
            borderColor: error ? "#e06060" : focused ? "#1a1a1a" : "#e4e0da",
            boxShadow: focused ? "0 0 0 3px rgba(26,26,26,0.06)" : "none",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
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
}

function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setErrors({ submit: error.message });
        setLoading(false);
        return;
      }

      setSuccess(true);
      await new Promise((r) => setTimeout(r, 800));
      router.push("/dashboard/user");
    } catch (err) {
      setErrors({ submit: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        label="Work email"
        id="login-email"
        type="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={set("email")}
        icon={IconMail}
        error={errors.email}
      />
      <FormField
        label="Password"
        id="login-password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={set("password")}
        icon={IconLock}
        error={errors.password}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 24,
          marginTop: -8,
        }}
      >
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: 13,
            color: "#7a6a52",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          Forgot password?
        </button>
      </div>
      {errors.submit && (
        <p
          style={{
            fontSize: 12,
            color: "#e06060",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {errors.submit}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || success}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 10,
          border: "none",
          background: success ? "#4a8a5a" : "#1a1a1a",
          color: "#faf9f7",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: loading || success ? "default" : "pointer",
          transition: "background 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
            Signing in…
          </>
        ) : success ? (
          "✓ Signed in!"
        ) : (
          "Sign in →"
        )}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#888",
          marginTop: 24,
        }}
      >
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: "#1a1a1a",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
          }}
        >
          Create account
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateStep1 = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.organization.trim())
      errs.organization = "Organization name is required";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setStep(2);
      return;
    }

    if (cooldown > 0) {
      setErrors({ submit: `Please wait ${cooldown}s before trying again.` });
      return;
    }

    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            organization: form.organization,
          },
        },
      });

      if (error) {
        const formattedMessage = formatAuthError(error.message);
        setErrors({ submit: formattedMessage });

        // Set cooldown for rate limit errors
        if (error.message.toLowerCase().includes("rate limit")) {
          setCooldown(60);
          const timer = setInterval(() => {
            setCooldown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }

        setLoading(false);
        return;
      }

      setSuccess(true);
      await new Promise((r) => setTimeout(r, 800));
      router.push("/dashboard/user");
    } catch (err) {
      setErrors({ submit: "An error occurred. Please try again." });
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColors = ["", "#e06060", "#d4a050", "#8aaa5a", "#4a8a5a"];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[1, 2].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 100,
              background: s <= step ? "#1a1a1a" : "#eae8e4",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {step === 1 ? (
        <>
          <FormField
            label="Full name"
            id="reg-name"
            placeholder="Amara Osei"
            value={form.fullName}
            onChange={set("fullName")}
            icon={IconUser}
            error={errors.fullName}
          />
          <FormField
            label="Work email"
            id="reg-email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={set("email")}
            icon={IconMail}
            error={errors.email}
          />
          <FormField
            label="Organization name"
            id="reg-org"
            placeholder="Pinnacle Trust Ltd."
            value={form.organization}
            onChange={set("organization")}
            icon={IconBuilding}
            error={errors.organization}
          />
        </>
      ) : (
        <>
          <FormField
            label="Password"
            id="reg-pass"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={set("password")}
            icon={IconLock}
            error={errors.password}
          />
          {form.password && (
            <div style={{ marginTop: -10, marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 100,
                      background:
                        i <= strength ? strengthColors[strength] : "#eae8e4",
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: strengthColors[strength],
                  fontWeight: 500,
                }}
              >
                {["", "Weak", "Fair", "Good", "Strong"][strength]}
              </p>
            </div>
          )}
          <FormField
            label="Confirm password"
            id="reg-confirm"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            icon={IconLock}
            error={errors.confirmPassword}
          />
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            <input
              type="checkbox"
              style={{ marginTop: 2, accentColor: "#1a1a1a" }}
            />
            <span style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>
              I agree to the{" "}
              <span style={{ color: "#7a6a52", fontWeight: 500 }}>
                Terms of Service
              </span>{" "}
              and{" "}
              <span style={{ color: "#7a6a52", fontWeight: 500 }}>
                Privacy Policy
              </span>
            </span>
          </label>
        </>
      )}
      {errors.submit && (
        <p
          style={{
            fontSize: 12,
            color: "#e06060",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {errors.submit}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || success}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 10,
          border: "none",
          background: success ? "#4a8a5a" : "#1a1a1a",
          color: "#faf9f7",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: loading || success ? "default" : "pointer",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
            Creating account…
          </>
        ) : success ? (
          "✓ Account created!"
        ) : step === 1 ? (
          "Continue →"
        ) : (
          "Create account →"
        )}
      </button>

      {step === 2 && (
        <button
          type="button"
          onClick={() => {
            setStep(1);
            setErrors({});
          }}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "12px",
            borderRadius: 10,
            border: "1.5px solid #e4e0da",
            background: "transparent",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
            color: "#555",
          }}
        >
          ← Back
        </button>
      )}

      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "#888",
          marginTop: 20,
        }}
      >
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: "#1a1a1a",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
          }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        display: "flex",
        background: "#faf9f7",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .auth-panel { animation: fadeIn 0.35s ease forwards; }
        @media (max-width: 900px) { .auth-left { display: none !important; } .auth-right { width: 100% !important; } }
      `,
        }}
      />

      {/* Left panel */}
      <div
        className="auth-left"
        style={{
          width: "48%",
          background: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            right: -120,
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(200,184,154,0.14) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "#faf9f7",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="#1a1a1a" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: "#faf9f7",
            }}
          >
            Aurevia
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: 20,
            }}
          >
            Secure · Compliant · Scalable
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(30px, 3vw, 46px)",
              color: "#faf9f7",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            Financial compliance
            <br />
            <em style={{ color: "#c8b89a" }}>made effortless</em>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#555",
              lineHeight: 1.7,
              maxWidth: 360,
            }}
          >
            Manage pension contributions, KYC workflows, withdrawal approvals,
            and audit logs — all in one secure platform.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 32,
            }}
          >
            {[
              "Multi-tenant isolation",
              "Role-based access",
              "Audit logging",
              "KYC workflows",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#c8b89a",
                  background: "rgba(200,184,154,0.1)",
                  border: "1px solid rgba(200,184,154,0.2)",
                  padding: "5px 13px",
                  borderRadius: 100,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: 24,
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#666",
              lineHeight: 1.65,
              marginBottom: 16,
              fontStyle: "italic",
            }}
          >
            "Aurevia cut our compliance review time by 60%. The audit trail
            alone is worth every penny."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#c8b89a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              AO
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#bbb" }}>
                Amara Osei
              </p>
              <p style={{ fontSize: 12, color: "#555" }}>CFO, Pinnacle Trust</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="auth-right"
        style={{
          width: "52%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div
            style={{
              display: "flex",
              background: "#f0ece6",
              borderRadius: 12,
              padding: 4,
              marginBottom: 36,
              gap: 4,
            }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 9,
                  border: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "#1a1a1a" : "#888",
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 30,
                letterSpacing: "-0.02em",
                color: "#1a1a1a",
                marginBottom: 8,
              }}
            >
              {mode === "login" ? "Welcome back" : "Get started"}
            </h1>
            <p style={{ fontSize: 14, color: "#888" }}>
              {mode === "login"
                ? "Sign in to your Aurevia workspace."
                : "Create your organization's Aurevia account."}
            </p>
          </div>

          <div className="auth-panel" key={mode}>
            {mode === "login" ? (
              <LoginForm onSwitch={() => setMode("register")} />
            ) : (
              <RegisterForm onSwitch={() => setMode("login")} />
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#eae8e4" }} />
            <span style={{ fontSize: 12, color: "#aaa", fontWeight: 500 }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: "#eae8e4" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Google", icon: "G" },
              { label: "Microsoft", icon: "M" },
            ].map((p) => (
              <button
                key={p.label}
                style={{
                  flex: 1,
                  padding: "11px",
                  border: "1.5px solid #e4e0da",
                  borderRadius: 10,
                  background: "#fff",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e4e0da";
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    background: "#f0ece6",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7a6a52",
                  }}
                >
                  {p.icon}
                </span>
                {p.label}
              </button>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#bbb",
              marginTop: 32,
            }}
          >
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
}
