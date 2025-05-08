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
    <div>
      {user && <Navbar />}
      <main
        className={`min-h-screen ${theme.colors.background.page} ${
          user ? "pt-16" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
