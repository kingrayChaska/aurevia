"use client";

import { useEffect, useState } from "react";
import { getUserWithdrawals } from "@/lib/supabase/queries";
import type { Withdrawal } from "@/types";

export const useWithdrawals = (userId: string | null) => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getUserWithdrawals(userId);
        setWithdrawals(data);
      } catch (err) {
        setError("Failed to load withdrawals.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  const totalApproved = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0);

  return { withdrawals, loading, error, totalApproved };
};
