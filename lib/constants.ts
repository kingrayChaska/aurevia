// lib/constants.ts

// -----------------------------
// NAVIGATION
// -----------------------------
export const NAV_LINKS = [
  "Features",
  "Security",
  "Pricing",
  "Company",
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

// -----------------------------
// FEATURES
// -----------------------------
export type IconKey =
  | "lock"
  | "shield"
  | "currency"
  | "activity"
  | "document"
  | "grid"
  | "check"
  | "alert";

export interface Feature {
  title: string;
  desc: string;
  icon: IconKey;
}

export const FEATURES: Feature[] = [
  {
    icon: "lock",
    title: "Role-Based Access",
    desc: "Granular permissions across super admins, admins, compliance officers, and users. Every action scoped to your organization.",
  },
  {
    icon: "shield",
    title: "KYC Compliance",
    desc: "End-to-end identity verification workflows with document upload, review queues, and automated status tracking.",
  },
  {
    icon: "currency",
    title: "Contribution Tracking",
    desc: "Automated pension contribution entries, approval workflows, and real-time balance updates across all members.",
  },
  {
    icon: "activity",
    title: "Withdrawal Lifecycle",
    desc: "Multi-stage withdrawal approvals with admin gates, compliance checks, and full audit trail on every transaction.",
  },
  {
    icon: "document",
    title: "Audit Logging",
    desc: "Immutable logs for every actor action — who approved what, when, and why. Built for regulators and internal audits.",
  },
  {
    icon: "grid",
    title: "Multi-Tenant Architecture",
    desc: "Each organization operates in a fully isolated environment with shared infrastructure but zero data bleed.",
  },
];

// -----------------------------
// STATS
// -----------------------------
export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "SOC 2", label: "Compliance Ready" },
  { value: "256-bit", label: "AES Encryption" },
  { value: "<50ms", label: "Query Response" },
];

// -----------------------------
// TESTIMONIALS
// -----------------------------
export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  initials: string;
  color: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Aurevia transformed how we manage pension contributions. The compliance workflow alone saves our team 12 hours a week.",
    name: "Amara Osei",
    title: "CFO, Pinnacle Trust",
    initials: "AO",
    color: "#c8b89a",
  },
  {
    quote:
      "The KYC module is exceptional. We onboarded 400 members in a week with zero compliance issues.",
    name: "Tunde Adeyemi",
    title: "Head of Operations, Vantage Pensions",
    initials: "TA",
    color: "#a8bcc8",
  },
  {
    quote:
      "Finally, a platform that understands multi-tenancy correctly. Our data is isolated, auditable, and always accessible.",
    name: "Chioma Eze",
    title: "CTO, Nexus Financial",
    initials: "CE",
    color: "#b8c8a8",
  },
];

// -----------------------------
// PRICING
// -----------------------------
export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

export const PRICING: PricingPlan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "Free forever",
    desc: "Perfect for small organizations getting started.",
    features: [
      "Up to 50 members",
      "Basic KYC workflow",
      "Contribution tracking",
      "Email support",
    ],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$149",
    period: "per month",
    desc: "For growing organizations that need full compliance.",
    features: [
      "Up to 500 members",
      "Full KYC + compliance module",
      "Withdrawal approvals",
      "Audit logging",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    desc: "For large-scale multi-tenant deployments.",
    features: [
      "Unlimited members",
      "Custom roles & permissions",
      "Dedicated infrastructure",
      "SLA guarantee",
      "White-label option",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

// -----------------------------
// SECURITY FEATURES
// -----------------------------
export interface SecurityFeature {
  title: string;
  description: string;
  icon: IconKey;
}

export const SECURITY_FEATURES: SecurityFeature[] = [
  {
    icon: "lock",
    title: "End-to-End Encryption",
    description:
      "All data encrypted in transit and at rest using AES-256. No plaintext ever leaves our infrastructure.",
  },
  {
    icon: "check",
    title: "SOC 2 Compliance",
    description:
      "Certified security controls and audit readiness. We maintain continuous compliance monitoring.",
  },
  {
    icon: "shield",
    title: "Multi-Factor Authentication",
    description:
      "Protect every account with TOTP-based MFA. Enforce it org-wide as a policy.",
  },
  {
    icon: "document",
    title: "Immutable Audit Trail",
    description:
      "Every action is permanently recorded with actor, timestamp, and metadata. No deletions allowed.",
  },
];

// -----------------------------
// TRUSTED BRANDS
// -----------------------------
export const TRUSTED_BRANDS = [
  "Pinnacle Trust",
  "Vantage Pensions",
  "Nexus Financial",
  "Summit Capital",
] as const;

// -----------------------------
// FOOTER LINKS
// -----------------------------
export const FOOTER_COLS = [
  {
    title: "Product",
    links: ["Features", "Security", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security Policy", "GDPR"],
  },
] as const;
