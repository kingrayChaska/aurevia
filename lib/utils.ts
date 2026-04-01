import type { KycStatus, WithdrawalStatus, ContributionStatus, UserRole } from "@/types";

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatInitials = (name: string): string =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Status helpers ───────────────────────────────────────────────────────────

export const KYC_STATUS_STYLES: Record<KycStatus, { bg: string; color: string; label: string }> = {
  approved: { bg: "#e8f5e8", color: "#2d7a3a", label: "Approved" },
  pending:  { bg: "#fef9e7", color: "#a8820a", label: "Pending"  },
  rejected: { bg: "#fdecea", color: "#c0392b", label: "Rejected" },
};

export const WITHDRAWAL_STATUS_STYLES: Record<WithdrawalStatus, { bg: string; color: string; label: string }> = {
  approved: { bg: "#e8f5e8", color: "#2d7a3a", label: "Approved" },
  pending:  { bg: "#fef9e7", color: "#a8820a", label: "Pending"  },
  rejected: { bg: "#fdecea", color: "#c0392b", label: "Rejected" },
};

export const CONTRIBUTION_STATUS_STYLES: Record<ContributionStatus, { bg: string; color: string; label: string }> = {
  approved: { bg: "#e8f5e8", color: "#2d7a3a", label: "Approved" },
  pending:  { bg: "#fef9e7", color: "#a8820a", label: "Pending"  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:        "Super Admin",
  admin:              "Admin",
  compliance_officer: "Compliance",
  user:               "Member",
};

export const ROLE_STYLES: Record<UserRole, { bg: string; color: string }> = {
  super_admin:        { bg: "#f0ece6", color: "#5a4a32" },
  admin:              { bg: "#f0ece6", color: "#7a6a52" },
  compliance_officer: { bg: "#eaf0f8", color: "#3a6a8a" },
  user:               { bg: "#f5f5f5", color: "#666"    },
};

// ─── Validation ───────────────────────────────────────────────────────────────

export const isValidEmail = (email: string): boolean =>
  /\S+@\S+\.\S+/.test(email);

export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8)         strength++;
  if (/[A-Z]/.test(password))       strength++;
  if (/[0-9]/.test(password))       strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

export const PASSWORD_STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
export const PASSWORD_STRENGTH_COLORS = ["", "#e06060", "#d4a050", "#8aaa5a", "#4a8a5a"];

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(" ");
