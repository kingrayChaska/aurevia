"use client";

import { useEffect, useState } from "react";
import { getUserContributions } from "@/lib/supabase/queries";
import type { Contribution } from "@/types";

export const useContributions = (userId: string | null) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getUserContributions(userId);
        setContributions(data);
      } catch (err) {
        setError("Failed to load contributions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  const totalApproved = contributions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + c.amount, 0);

  return { contributions, loading, error, totalApproved };
};
