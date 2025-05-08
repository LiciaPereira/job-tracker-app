import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className={`bg-white rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all duration-200 ${
          isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Tracker</h1>
          <p className="text-gray-600">
            {isLogin
              ? "Track your job applications in one place"
              : "Create an account to get started"}
          </p>
        </div>

        <div
          className={`transform transition-all duration-200 ${
            isAnimating
              ? "translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignUpForm onSuccess={() => setIsLogin(true)} />
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={handleToggleForm}
              className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:underline transition-colors duration-200"
              disabled={isAnimating}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
