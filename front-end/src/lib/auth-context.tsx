"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("authToken");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        error,
        successMessage,
        setToken,
        setError,
        setSuccessMessage,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
