import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import { Button, Text } from "./ui";
import { useTheme } from "../hooks/useTheme";

export function Navbar() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode, theme } = useTheme();

  //handle user logout and clear session
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav
      className={`shadow-md fixed w-full z-10 top-0 ${theme.colors.background.card}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className={`text-xl font-bold ${theme.colors.primary.default}`}
              >
                JobTracker
              </Link>
            </div>
            {/* main navigation links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`border-transparent ${theme.colors.text.body} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className={`border-transparent ${theme.colors.text.body} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Jobs
              </Link>
              <Link
                to="/add-job"
                className={`border-transparent ${theme.colors.text.body} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Add Job
              </Link>
            </div>
          </div>
          {/* user profile section */}
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Text variant="body" className="text-sm content-center">
                {user?.displayName || user?.email}
              </Text>
              <button
                onClick={toggleDarkMode}
                className={`${theme.colors.text.body} hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium`}
                aria-label="Toggle dark mode"
                style={{
                  filter: "drop-shadow(0px 0px 7px #ffc800)", //add a nice shadow to shine the celestial objects!
                }}
              >
                {darkMode ? "🌙" : "🌞"}
              </button>
              <Link
                to="/settings"
                className={`border-transparent ${theme.colors.text.body} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Settings
              </Link>
              <Button onClick={handleLogout} size="sm" className="m-auto ml-4">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
