import type { KycStatus, WithdrawalStatus, ContributionStatus } from "@/types";
import { KYC_STATUS_STYLES, WITHDRAWAL_STATUS_STYLES, CONTRIBUTION_STATUS_STYLES } from "@/lib/utils";

type Status = KycStatus | WithdrawalStatus | ContributionStatus;

interface StatusBadgeProps {
  status: Status;
  type?: "kyc" | "withdrawal" | "contribution";
}

const StatusBadge = ({ status, type = "kyc" }: StatusBadgeProps) => {
  const styleMap =
    type === "withdrawal"
      ? WITHDRAWAL_STATUS_STYLES
      : type === "contribution"
      ? CONTRIBUTION_STATUS_STYLES
      : KYC_STATUS_STYLES;

  const style = styleMap[status as keyof typeof styleMap] ?? {
    bg: "#f5f5f5",
    color: "#666",
    label: status,
  };

  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        background: style.bg,
        color: style.color,
        padding: "3px 10px",
        borderRadius: 100,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {style.label}
    </span>
  );
};

export default StatusBadge;
