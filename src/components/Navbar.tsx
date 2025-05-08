import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import { useState, useEffect } from "react";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  //check if route is active
  const isActive = (path: string) => location.pathname === path;

  //handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //close mobile menu on navigation and window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //close mobile menu on navigation
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white shadow-lg"
          : "bg-gradient-to-r from-indigo-600/95 to-purple-600/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className={`text-xl font-bold transition-colors duration-200 ${
                isScrolled ? "text-indigo-600" : "text-white"
              }`}
              onClick={handleNavigation}
            >
              Job Tracker
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/dashboard")
                      ? isScrolled
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-700 text-white"
                      : isScrolled
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-indigo-700/50"
                  }`}
                  onClick={handleNavigation}
                >
                  Dashboard
                </Link>
                <Link
                  to="/jobs"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/jobs")
                      ? isScrolled
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-700 text-white"
                      : isScrolled
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-indigo-700/50"
                  }`}
                  onClick={handleNavigation}
                >
                  Job List
                </Link>
                <Link
                  to="/add-job"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/add-job")
                      ? isScrolled
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-indigo-700 text-white"
                      : isScrolled
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-indigo-700/50"
                  }`}
                  onClick={handleNavigation}
                >
                  Add Job
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <span
                className={`text-sm ${
                  isScrolled ? "text-gray-600" : "text-white/90"
                }`}
              >
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-white hover:bg-indigo-700/50"
                }`}
              >
                Logout
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  isScrolled
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-white hover:bg-indigo-700/50"
                }`}
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div
          className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
            isScrolled ? "bg-white" : "bg-indigo-700"
          }`}
        >
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive("/dashboard")
                ? isScrolled
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-indigo-800 text-white"
                : isScrolled
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-white hover:bg-indigo-800"
            }`}
            onClick={handleNavigation}
          >
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive("/jobs")
                ? isScrolled
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-indigo-800 text-white"
                : isScrolled
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-white hover:bg-indigo-800"
            }`}
            onClick={handleNavigation}
          >
            Job List
          </Link>
          <Link
            to="/add-job"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive("/add-job")
                ? isScrolled
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-indigo-800 text-white"
                : isScrolled
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-white hover:bg-indigo-800"
            }`}
            onClick={handleNavigation}
          >
            Add Job
          </Link>
          <div className="px-3 py-2">
            <span
              className={`block text-sm mb-2 ${
                isScrolled ? "text-gray-600" : "text-white/90"
              }`}
            >
              {user.email}
            </span>
            <button
              onClick={() => {
                handleLogout();
                handleNavigation();
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isScrolled
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-white hover:bg-indigo-800"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
