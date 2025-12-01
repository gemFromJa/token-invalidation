"use client";

import React from "react";

interface AuthDefaultContextType {
  hasError: boolean;
  errorMessage: string;
}

const defaultState: AuthDefaultContextType = {
  hasError: false,
  errorMessage: "",
};

interface AuthContextType extends AuthDefaultContextType {
  setError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = React.createContext<AuthContextType>(
  defaultState as AuthContextType
);

const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errorState, setAuthState] = React.useState(defaultState);

  const state = {
    hasError: errorState.hasError,
    errorMessage: errorState.errorMessage,
    setError: (message: string) => {
      setAuthState({ hasError: true, errorMessage: message });
    },
    clearError: () => {
      setAuthState({ hasError: false, errorMessage: "" });
    },
  };
  return <ErrorContext value={state}>{children}</ErrorContext>;
};

export { ErrorContext, ErrorProvider };
