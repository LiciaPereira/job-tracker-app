import React from "react";
import { Navbar } from "../Navbar";
import { useAuth } from "../../hooks/useAuth";
import theme from "../../utils/theme";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {user && <Navbar />}
      <main
        className={`flex-1 ${theme.colors.background.page} ${
          user ? "pt-16" : ""
        }`}
      >
        <div className="min-h-[calc(100vh-4rem)] flex flex-col">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
