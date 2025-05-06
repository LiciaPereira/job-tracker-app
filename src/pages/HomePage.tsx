import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="homepage"
      style={{ maxWidth: 400, margin: "auto", padding: 20 }}
    >
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {isLogin ? <LoginForm /> : <SignUpForm />}
      <p style={{ marginTop: 20 }}>
        {isLogin ? "Don't Have an account?" : "Already have an account?"}{" "}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setIsLogin(!isLogin);
          }}
          style={{ color: "darkgray", background: "none", cursor: "pointer" }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </a>
      </p>
    </div>
  );
}
