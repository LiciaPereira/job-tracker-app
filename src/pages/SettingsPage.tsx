import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updatePassword, updateProfile } from "firebase/auth";
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

      //sync changes with firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName: data.firstName,
        lastName: data.lastName,
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
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Text variant="h1" className="mb-2">
              Account Settings
            </Text>
            <Text variant="body" className="text-gray-600 dark:text-gray-400">
              Manage your profile and account preferences
            </Text>
          </div>

          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <div className="grid gap-8">
            {/* Read-only Email Display */}
            <Card elevated className="p-6">
              <Text variant="h3" className="mb-4">
                Account Email
              </Text>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <Text
                    variant="small"
                    className="text-gray-600 dark:text-gray-400 mb-1"
                  >
                    Email Address
                  </Text>
                  <Text
                    variant="body"
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {user?.email}
                  </Text>
                </div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verified
                </div>
              </div>
            </Card>

            {/* Profile Settings */}
            <Card elevated className="p-6">
              <Text variant="h2" className="mb-6">
                Profile Information
              </Text>
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    {...registerProfile("firstName")}
                    error={profileErrors.firstName?.message}
                    placeholder="Enter your first name"
                    required
                  />
                  <Input
                    label="Last Name"
                    {...registerProfile("lastName")}
                    error={profileErrors.lastName?.message}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            {/* Password Settings */}
            <Card elevated className="p-6">
              <Text variant="h2" className="mb-6">
                Security
              </Text>
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <Input
                  label="Current Password"
                  type="password"
                  {...registerPassword("currentPassword")}
                  error={passwordErrors.currentPassword?.message}
                  placeholder="Enter your current password"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="New Password"
                    type="password"
                    {...registerPassword("newPassword")}
                    error={passwordErrors.newPassword?.message}
                    placeholder="Enter new password"
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...registerPassword("confirmPassword")}
                    error={passwordErrors.confirmPassword?.message}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => resetPassword()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    }
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
