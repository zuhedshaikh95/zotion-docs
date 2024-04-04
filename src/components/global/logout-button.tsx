"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { useAuth } from "@/libs/providers/auth-provider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "..";

interface Props {
  children: React.ReactNode;
}

const LogoutButton: React.FC<Props> = ({ children }) => {
  const { dispatch } = useAppState();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    dispatch({ type: "SET_WORKSPACES", payload: { workspaces: [] } });
  };

  return (
    <Button variant="ghost" size="icon" className="p-0" onClick={logout}>
      {children}
    </Button>
  );
};

export default LogoutButton;
