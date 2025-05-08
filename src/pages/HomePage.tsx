import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";
import { Card, Text } from "../components/ui";
import { useTheme } from "../hooks/useTheme";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme } = useTheme();

  const handleToggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div
      className={`min-h-screen ${theme.colors.background.page} flex items-center justify-center px-4 sm:px-6 lg:px-8`}
    >
      <Card
        className={`p-8 w-full max-w-md transform transition-all duration-200 ${
          isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
        }`}
      >
        <div className="text-center mb-8">
          <Text variant="h1" className="mb-2">
            Job Tracker
          </Text>
          <Text variant="body">
            {isLogin
              ? "Track your job applications in one place"
              : "Create an account to get started"}
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
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={handleToggleForm}
              className={`${theme.colors.primary.default} hover:underline font-medium focus:outline-none transition-colors duration-200`}
              disabled={isAnimating}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </Text>
        </div>
      </Card>
    </div>
  );
}
