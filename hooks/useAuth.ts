"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as AuthUser, Session } from "@supabase/supabase-js";
import type { User } from "@/types";

interface AuthState {
  authUser: AuthUser | null;
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    authUser: null,
    user: null,
    session: null,
    loading: true,
  });

  const supabase = createClient();

  const fetchUser = useCallback(async (authUser: AuthUser | null) => {
    if (!authUser) {
      setState({ authUser: null, user: null, session: null, loading: false });
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    setState((prev) => ({
      ...prev,
      authUser,
      user: data as User | null,
      loading: false,
    }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({ ...prev, session }));
      fetchUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ...prev, session }));
      fetchUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signOut };
};
