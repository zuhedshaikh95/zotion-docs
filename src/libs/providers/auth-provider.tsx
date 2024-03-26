"use client";

import { AuthUser } from "@supabase/supabase-js";
import { SubscriptionI } from "../supabase/supabase.types";
import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getUserSubscription } from "../supabase/queries";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user?: AuthUser | null;
  subscription?: SubscriptionI | null;
};

const AuthContext = createContext<AuthContextType>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>();
  const [subscription, setSubscription] = useState<SubscriptionI | null>();
  const { toast } = useToast();

  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      console.log("fetching");
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) return setUser(null);

      if (user) {
        setUser(user);

        const { data, error } = await getUserSubscription(user.id);
        if (data) setSubscription(data);

        if (error) {
          toast({
            title: "Unexpected Error",
            description: "Opps! An unexpected error happened. Try again later.",
          });
        }
      }
      console.log("fetching complete");
    })();
  }, [supabase, toast]);
  return <AuthContext.Provider value={{ user, subscription }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
