// ─── Auth & Users ────────────────────────────────────────────────────────────

export type UserRole =
  | "super_admin"
  | "admin"
  | "compliance_officer"
  | "user";

export type KycStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: string;
  kyc_status: KycStatus;
  created_at: string;
}

// ─── Organizations ────────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export interface KycDocument {
  id: string;
  user_id: string;
  document_type: string;
  file_url: string;
  status: KycStatus;
  reviewed_by: string | null;
  created_at: string;
}

// ─── Financial ────────────────────────────────────────────────────────────────

export type ContributionStatus = "pending" | "approved";

export interface Contribution {
  id: string;
  user_id: string;
  organization_id: string;
  amount: number;
  status: ContributionStatus;
  approved_by: string | null;
  created_at: string;
}

export type WithdrawalStatus = "pending" | "approved" | "rejected";

export interface Withdrawal {
  id: string;
  user_id: string;
  organization_id: string;
  amount: number;
  status: WithdrawalStatus;
  reviewed_by: string | null;
  rejection_reason?: string;
  created_at: string;
}

export type TransactionType = "deposit" | "withdrawal";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  user_id: string;
  organization_id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference: string;
  created_at: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  delta?: string;
  accent: string;
  icon: React.ReactNode;
}
