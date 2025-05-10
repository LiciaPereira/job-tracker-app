import { useEffect, useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";
import { Card, Text } from "../components/ui";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Add Feature component before HomePage
interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
        <span className="text-2xl" role="img" aria-label={title}>
          {icon}
        </span>
      </div>
      <div>
        <Text variant="h3" className="mb-1">
          {title}
        </Text>
        <Text variant="body" color="default">
          {description}
        </Text>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleToggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 200);
  };
  return (
    <div className={`min-h-screen ${theme.colors.background.page}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-primary-100/50 to-primary-300/50 dark:from-primary-900/30 dark:to-primary-800/30 transform -skew-x-12" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-primary-100/50 to-primary-300/50 dark:from-primary-900/30 dark:to-primary-800/30 transform skew-x-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left section - Hero/Marketing */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12">
          <div className="max-w-xl">
            <Text
              variant="h1"
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400"
            >
              Organize Your Job Search Journey
            </Text>
            <div className="space-y-4">
              <Feature
                icon="📊"
                title="Track Applications"
                description="Keep all your job applications organized in one place"
              />
              <Feature
                icon="🎯"
                title="Stay on Target"
                description="Set reminders and never miss a follow-up"
              />
              <Feature
                icon="📈"
                title="Monitor Progress"
                description="Visualize your job search progress with insights"
              />
            </div>
          </div>
        </div>

        {/* Right section - Auth form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card
            elevated
            className={`w-full max-w-md p-8 transform transition-all duration-200 ${
              isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-3">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <Text variant="h2" className="mb-2">
                {isLogin ? "Welcome Back!" : "Create Your Account"}
              </Text>
              <Text variant="body" color="primary">
                {isLogin
                  ? "Track your job applications in one place"
                  : "Start organizing your job search today"}
              </Text>
            </div>

            <div
              className={`transform transition-all duration-200 ${
                isAnimating
                  ? "translate-y-2 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              {isLogin ? <LoginForm /> : <SignUpForm />}
            </div>

            <div className="mt-6 text-center">
              <Text variant="small">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={handleToggleForm}
                  className={`${theme.colors.primary.default} hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded transition-all duration-200`}
                  disabled={isAnimating}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
