"use client";

import React, { useMemo } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  authToken?: string;
}

const defaultState: AuthContextType = {
  isLoggedIn: false,
  user: null,
};

interface User {
  username: string;
  id: string;
  role: string;
}

const AuthContext = React.createContext<
  AuthContextType & { login?: (u: User, t: string) => void }
>(defaultState);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = React.useState(defaultState);

  const state = {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    login: (user: User, token: string) => {
      setAuthState({ isLoggedIn: true, user, authToken: token });
      // You can also store the token in localStorage or cookies here
      // sessionStorage.setItem("auth_token", token); // Insecure, for demo only
    },
  };
  return <AuthContext value={state}>{children}</AuthContext>;
};
export { AuthContext, AuthProvider };
