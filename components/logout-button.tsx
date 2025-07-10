"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth} from "@/context/auth-context";

export function LogoutButton() {
  const router = useRouter();
  const auth = useAuth();

  const logout = async () => {
    const supabase = createClient();
    auth?.setUser(null);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
