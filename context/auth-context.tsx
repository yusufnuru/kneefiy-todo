"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {createClient} from "@/lib/supabase/client";
import type {User} from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase =createClient ();
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user ?? null);
        }
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}