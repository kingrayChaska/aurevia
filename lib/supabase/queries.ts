"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  User,
  Contribution,
  Withdrawal,
  KycDocument,
  AuditLog,
  Organization,
  KycStatus,
  UserRole,
} from "@/types";

const supabase = createClient();

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
  organizationName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, organization_name: organizationName },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as User | null;
};

export const getOrganizationUsers = async (organizationId: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as User[];
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  const { data, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
};

// ─── Organizations ────────────────────────────────────────────────────────────

export const getOrganization = async (id: string): Promise<Organization | null> => {
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();
  return data as Organization | null;
};

// ─── Contributions ────────────────────────────────────────────────────────────

export const getUserContributions = async (userId: string): Promise<Contribution[]> => {
  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Contribution[];
};

export const getOrganizationContributions = async (
  organizationId: string,
  status?: string
): Promise<Contribution[]> => {
  let query = supabase
    .from("contributions")
    .select("*, users(full_name, email)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Contribution[];
};

export const approveContribution = async (contributionId: string, approvedBy: string) => {
  const { data, error } = await supabase
    .from("contributions")
    .update({ status: "approved", approved_by: approvedBy })
    .eq("id", contributionId)
    .select()
    .single();
  return { data, error };
};

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export const getUserWithdrawals = async (userId: string): Promise<Withdrawal[]> => {
  const { data, error } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Withdrawal[];
};

export const getOrganizationWithdrawals = async (
  organizationId: string,
  status?: string
): Promise<Withdrawal[]> => {
  let query = supabase
    .from("withdrawals")
    .select("*, users(full_name, email, kyc_status)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Withdrawal[];
};

export const requestWithdrawal = async (
  userId: string,
  organizationId: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from("withdrawals")
    .insert({ user_id: userId, organization_id: organizationId, amount, status: "pending" })
    .select()
    .single();
  return { data, error };
};

export const reviewWithdrawal = async (
  withdrawalId: string,
  status: "approved" | "rejected",
  reviewedBy: string,
  rejectionReason?: string
) => {
  const { data, error } = await supabase
    .from("withdrawals")
    .update({
      status,
      reviewed_by: reviewedBy,
      ...(rejectionReason ? { rejection_reason: rejectionReason } : {}),
    })
    .eq("id", withdrawalId)
    .select()
    .single();
  return { data, error };
};

// ─── KYC ─────────────────────────────────────────────────────────────────────

export const getKycDocuments = async (userId: string): Promise<KycDocument[]> => {
  const { data, error } = await supabase
    .from("kyc_documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as KycDocument[];
};

export const getPendingKycDocuments = async (
  organizationId: string
): Promise<KycDocument[]> => {
  const { data, error } = await supabase
    .from("kyc_documents")
    .select("*, users!inner(full_name, email, organization_id)")
    .eq("status", "pending")
    .eq("users.organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as KycDocument[];
};

export const reviewKycDocument = async (
  documentId: string,
  userId: string,
  status: KycStatus,
  reviewedBy: string
) => {
  // Update doc status
  const { error: docError } = await supabase
    .from("kyc_documents")
    .update({ status, reviewed_by: reviewedBy })
    .eq("id", documentId);

  if (docError) return { error: docError };

  // Update user kyc_status
  const { data, error } = await supabase
    .from("users")
    .update({ kyc_status: status })
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
};

export const uploadKycDocument = async (
  userId: string,
  documentType: string,
  file: File
) => {
  const fileName = `${userId}/${documentType}-${Date.now()}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("kyc-documents")
    .upload(fileName, file, { upsert: true });

  if (uploadError) return { error: uploadError };

  const { data: { publicUrl } } = supabase.storage
    .from("kyc-documents")
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from("kyc_documents")
    .insert({
      user_id: userId,
      document_type: documentType,
      file_url: publicUrl,
      status: "pending",
    })
    .select()
    .single();

  return { data, error };
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const getAuditLogs = async (
  organizationId: string,
  limit = 50
): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as AuditLog[];
};

export const createAuditLog = async (
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  metadata: Record<string, unknown> = {}
) => {
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId,
    metadata,
  });
  return { error };
};
