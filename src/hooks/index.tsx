import React from "react";

import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";

interface Props {
    children: React.ReactNode;
    };

const AppProvider: React.FC<Props> = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
};

export default AppProvider;
