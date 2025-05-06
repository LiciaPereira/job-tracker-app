export interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword?: string; //optional because it's not required in the login
}
