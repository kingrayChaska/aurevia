import type { MetricCardProps } from "@/types";

const MetricCard = ({ label, value, sub, delta, accent, icon }: MetricCardProps) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #eae8e4",
      borderRadius: 14,
      padding: 24,
      flex: 1,
      minWidth: 160,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14,
      }}
    >
      <p style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</p>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: `${accent}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
        }}
      >
        {icon}
      </div>
    </div>
    <p
      style={{
        fontSize: 26,
        fontWeight: 600,
        color: "#1a1a1a",
        letterSpacing: "-0.02em",
        marginBottom: 4,
      }}
    >
      {value}
    </p>
    {delta && <p style={{ fontSize: 12, color: "#3a8a5a" }}>↑ {delta}</p>}
    {sub && !delta && <p style={{ fontSize: 12, color: "#aaa" }}>{sub}</p>}
  </div>
);

export default MetricCard;
