-- ============================================================
-- Aurevia — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Organizations ────────────────────────────────────────────────────────────
CREATE TABLE organizations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL UNIQUE,
  full_name       TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'user'
                  CHECK (role IN ('super_admin','admin','compliance_officer','user')),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  kyc_status      TEXT NOT NULL DEFAULT 'pending'
                  CHECK (kyc_status IN ('pending','approved','rejected')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── KYC Documents ───────────────────────────────────────────────────────────
CREATE TABLE kyc_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','rejected')),
  reviewed_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contributions ────────────────────────────────────────────────────────────
CREATE TABLE contributions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  amount          NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved')),
  approved_by     UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Withdrawals ──────────────────────────────────────────────────────────────
CREATE TABLE withdrawals (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id  UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  amount           NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected')),
  reviewed_by      UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Transactions ─────────────────────────────────────────────────────────────
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('deposit','withdrawal')),
  amount          NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','completed','failed')),
  reference       TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Audit Logs ───────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  entity     TEXT NOT NULL,
  entity_id  TEXT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs are append-only — no UPDATE or DELETE
CREATE RULE audit_logs_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_users_org        ON users(organization_id);
CREATE INDEX idx_contributions_org ON contributions(organization_id);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_withdrawals_org   ON withdrawals(organization_id);
CREATE INDEX idx_withdrawals_user  ON withdrawals(user_id);
CREATE INDEX idx_kyc_user          ON kyc_documents(user_id);
CREATE INDEX idx_audit_actor       ON audit_logs(actor_id);
CREATE INDEX idx_audit_created     ON audit_logs(created_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE organizations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs     ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's organization_id
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── Users policies ───────────────────────────────────────────────────────────
CREATE POLICY "Users can read their own record"
  ON users FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can read org users"
  ON users FOR SELECT
  USING (
    organization_id = get_my_org_id()
    AND get_my_role() IN ('admin','compliance_officer','super_admin')
  );

CREATE POLICY "Admins can update user roles in org"
  ON users FOR UPDATE
  USING (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

-- ─── Organizations policies ───────────────────────────────────────────────────
CREATE POLICY "Users can read their own org"
  ON organizations FOR SELECT
  USING (id = get_my_org_id());

-- ─── KYC policies ────────────────────────────────────────────────────────────
CREATE POLICY "Users can read own KYC docs"
  ON kyc_documents FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own KYC docs"
  ON kyc_documents FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Compliance officers can read org KYC docs"
  ON kyc_documents FOR SELECT
  USING (
    get_my_role() IN ('compliance_officer','admin','super_admin')
    AND user_id IN (SELECT id FROM users WHERE organization_id = get_my_org_id())
  );

CREATE POLICY "Compliance officers can update KYC status"
  ON kyc_documents FOR UPDATE
  USING (get_my_role() IN ('compliance_officer','admin','super_admin'));

-- ─── Contributions policies ───────────────────────────────────────────────────
CREATE POLICY "Users can read own contributions"
  ON contributions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can read org contributions"
  ON contributions FOR SELECT
  USING (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

CREATE POLICY "Admins can insert contributions"
  ON contributions FOR INSERT
  WITH CHECK (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

CREATE POLICY "Admins can approve contributions"
  ON contributions FOR UPDATE
  USING (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

-- ─── Withdrawals policies ─────────────────────────────────────────────────────
CREATE POLICY "Users can read own withdrawals"
  ON withdrawals FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can request withdrawals"
  ON withdrawals FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read org withdrawals"
  ON withdrawals FOR SELECT
  USING (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

CREATE POLICY "Admins can review withdrawals"
  ON withdrawals FOR UPDATE
  USING (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

-- ─── Transactions policies ────────────────────────────────────────────────────
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can read org transactions"
  ON transactions FOR SELECT
  USING (organization_id = get_my_org_id() AND get_my_role() IN ('admin','super_admin'));

-- ─── Audit log policies ───────────────────────────────────────────────────────
CREATE POLICY "Admins and compliance can read audit logs"
  ON audit_logs FOR SELECT
  USING (get_my_role() IN ('admin','compliance_officer','super_admin'));

CREATE POLICY "Any authenticated user can insert audit logs"
  ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── Auth trigger: auto-create user row on signup ────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, kyc_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Storage bucket for KYC docs ─────────────────────────────────────────────
-- Run in Supabase Dashboard > Storage > New Bucket
-- Name: kyc-documents
-- Private: true (RLS enforced)
