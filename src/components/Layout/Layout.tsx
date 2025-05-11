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
    <div className="h-screen overflow-hidden flex flex-col">
      {user && <Navbar />}
      <main
        className={`flex-1 ${theme.colors.background.page} ${
          user ? "pt-16" : ""
        } overflow-hidden`}
      >
        <div className="h-full overflow-hidden">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
