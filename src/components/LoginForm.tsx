import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../services/authService";
import { Alert } from "./Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "./ui";

interface LoginFormValues {
  email: string;
  password: string;
}

//validate login form inputs
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export function LoginForm() {
  //setup form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  //handle form submission and authentication
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      setAlert({
        type: "success",
        message: "Login successful!",
      });

      //redirect after successful login
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <div className="w-full">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={5000}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          {...register("email")}
          placeholder="your@email.com"
          error={errors.email?.message}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          {...register("password")}
          placeholder="Enter your password"
          error={errors.password?.message}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
