"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  full_name?: string;
  // Add other properties as needed
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (user: User, role: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load from LocalStorage on mount
    const storedUser = localStorage.getItem("app_user");
    const storedRole = localStorage.getItem("app_role");

    if (storedUser && storedRole) {
      try {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem("app_user");
        localStorage.removeItem("app_role");
      }
    }
    setLoading(false);
  }, []);

  const signIn = (userData: User, userRole: string) => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem("app_user", JSON.stringify(userData));
    localStorage.setItem("app_role", userRole);
  };

  const signOut = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("app_user");
    localStorage.removeItem("app_role");
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
