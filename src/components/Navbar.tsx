import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import { Button } from "./ui";
import { useTheme } from "../hooks/useTheme";

export function Navbar() {
  const { darkMode, toggleDarkMode, theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
      className={`fixed w-full z-50 top-0 backdrop-blur-sm ${theme.colors.background.card}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/dashboard"
                className={`text-xl font-bold ${theme.colors.primary.default} hover:scale-105 transition-transform`}
              >
                JobTracker
              </Link>
            </div>
            {/* Desktop navigation links */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/dashboard"
                className="group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-primary-200"
                aria-current={
                  location.pathname === "/dashboard" ? "page" : undefined
                }
              >
                <span className="relative px-1">
                  Dashboard
                  {location.pathname === "/dashboard" && (
                    <span className="absolute inset-x-1 -bottom-[2px] h-[2px] bg-primary-500 dark:bg-primary-400" />
                  )}
                </span>
              </Link>
              <Link
                to="/jobs"
                className="group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-primary-200"
                aria-current={
                  location.pathname === "/jobs" ? "page" : undefined
                }
              >
                <span className="relative px-1">
                  Jobs
                  {location.pathname === "/jobs" && (
                    <span className="absolute inset-x-1 -bottom-[2px] h-[2px] bg-primary-500 dark:bg-primary-400" />
                  )}
                </span>
              </Link>
              <Link
                to="/add-job"
                className="group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-primary-200"
                aria-current={
                  location.pathname === "/add-job" ? "page" : undefined
                }
              >
                <span className="relative px-1">
                  Add Job
                  {location.pathname === "/add-job" && (
                    <span className="absolute inset-x-1 -bottom-[2px] h-[2px] bg-primary-500 dark:bg-primary-400" />
                  )}
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop user profile section */}
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <span
                  className="text-xl"
                  style={{ filter: "drop-shadow(0px 0px 7px #ffc800)" }}
                >
                  {darkMode ? "🌙" : "🌞"}
                </span>
              </button>
              <Link
                to="/settings"
                className="group inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-primary-200"
              >
                <span className="relative px-1">
                  Settings
                  {location.pathname === "/settings" && (
                    <span className="absolute inset-x-1 -bottom-[2px] h-[2px] bg-primary-500 dark:bg-primary-400" />
                  )}
                </span>
              </Link>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="ml-2"
              >
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Jobs
          </Link>
          <Link
            to="/add-job"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Add Job
          </Link>
          <Link
            to="/settings"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left block px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
