import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signUp } from "../services/authService";
import { Alert } from "./Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Input, Button } from "./ui";

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  onSuccess?: () => void;
}

//validate signup form inputs
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  //setup form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      //create firebase auth account
      const userCredential = await signUp(data.email, data.password);
      const user = userCredential.user;

      //set display name in firebase auth
      const fullName = `${data.firstName} ${data.lastName}`;
      await updateProfile(user, {
        displayName: fullName,
      });

      //store additional user data in firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date(),
      });

      setAlert({
        type: "success",
        message: "Account created successfully!",
      });

      //redirect after successful signup
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="First Name"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
          </div>

          <div>
            <Input
              label="Last Name"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>
        </div>

        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
