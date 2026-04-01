import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurevia — Pension & Financial Management",
  description:
    "Secure multi-tenant platform for pension contributions, KYC workflows, withdrawal approvals, and compliance audits.",
  keywords: ["pension management", "KYC", "compliance", "fintech", "multi-tenant"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
