import { useForm } from "react-hook-form";
import { AuthFormValues } from "../types/AuthFormValues";
import { signUp } from "../services/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      await signUp(data.email, data.password);
      //redirect to dashboard later
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input {...register("password")} placeholder="Password" />
      <p>{errors.password?.message}</p>

      <button type="submit">Sign Up</button>
    </form>
  );
}
