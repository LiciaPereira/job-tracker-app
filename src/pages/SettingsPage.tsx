import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Alert } from "../components/Alert";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Text, Input, Button } from "../components/ui";
import { useTheme } from "../hooks/useTheme";

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

//validate profile form inputs
const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

//validate password change form inputs
const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  //initialize profile form with user's current data
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.displayName?.split(" ")[0] || "",
      lastName: user?.displayName?.split(" ")[1] || "",
      email: user?.email || "",
    },
  });

  //initialize password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user) return;

      //update firebase auth profile
      const fullName = `${data.firstName} ${data.lastName}`;
      await updateProfile(user, {
        displayName: fullName,
      });

      //update email if changed
      if (data.email !== user.email) {
        await updateEmail(user, data.email);
      }

      //sync changes with firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      setAlert({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Failed to update profile",
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      if (!user) return;

      //update firebase auth password
      await updatePassword(user, data.newPassword);
      resetPassword();
      setAlert({
        type: "success",
        message: "Password updated successfully!",
      });
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Failed to update password",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 rounded-lg">
      <Text variant="h1" className="mb-6">
        Settings
      </Text>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="space-y-8">
        <Card
          className={`${theme.colors.background.card} p-6 rounded-lg shadow`}
        >
          <Text variant="h2" className="mb-4">
            Profile Settings
          </Text>
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="First Name"
                  {...registerProfile("firstName")}
                  error={profileErrors.firstName?.message}
                />
              </div>
              <div>
                <Input
                  label="Last Name"
                  {...registerProfile("lastName")}
                  error={profileErrors.lastName?.message}
                />
              </div>
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                {...registerProfile("email")}
                error={profileErrors.email?.message}
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </Card>

        <Card
          className={`${theme.colors.background.card} p-6 rounded-lg shadow`}
        >
          <Text variant="h2" className="mb-4">
            Change Password
          </Text>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <Input
                label="Current Password"
                type="password"
                {...registerPassword("currentPassword")}
                error={passwordErrors.currentPassword?.message}
              />
            </div>
            <div>
              <Input
                label="New Password"
                type="password"
                {...registerPassword("newPassword")}
                error={passwordErrors.newPassword?.message}
              />
            </div>
            <div>
              <Input
                label="Confirm New Password"
                type="password"
                {...registerPassword("confirmPassword")}
                error={passwordErrors.confirmPassword?.message}
              />
            </div>
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </Card>
  );
}
