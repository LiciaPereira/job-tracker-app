import { useForm } from "react-hook-form";
import { login } from "../services/authService";
import { AuthFormValues } from "../types/AuthFormValues";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().min(8).required(),
});

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      await login(data.email, data.password);
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

      <button type="submit">Login</button>
    </form>
  );
}
