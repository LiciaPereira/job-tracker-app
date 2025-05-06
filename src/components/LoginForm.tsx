import { useForm } from "react-hook-form";
import { login } from "../services/authService";
import { AuthFormValues } from "../features/auth/AuthFormValues";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert } from "./Alert";

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().min(8).required(),
});

export function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = async (data: AuthFormValues) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error: any) {
      console.log("Login error:", error);
      setAlert({ message: error.message, type: "error" });
    }
  };

  return (
    <div>
      {/* custom alert for general messages */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={5000}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        <p>{errors.email?.message}</p>

        <input {...register("password")} placeholder="Password" />
        <p>{errors.password?.message}</p>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
