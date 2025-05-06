import { useForm } from "react-hook-form";
import { AuthFormValues } from "../features/auth/AuthFormValues";
import { signUp } from "../services/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Alert } from "./Alert";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

interface Props {
  onSuccess: () => void;
}
export function SignUpForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      confirmPassword: "",
    },
  });

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = async (data: AuthFormValues) => {
    try {
      await signUp(data.email, data.password);
      setAlert({
        message: "Account created successfully! Please log in.",
        type: "success",
      });
      setTimeout(() => {
        onSuccess(); // switches to LoginForm
      }, 2000);
    } catch (error: any) {
      console.log("Sign-up error:", error);
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

        <input
          {...register("confirmPassword")}
          placeholder="Confirm Password"
        />
        <p>{errors.confirmPassword?.message}</p>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
