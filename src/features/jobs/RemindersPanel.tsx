import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  getActiveReminders,
  completeReminder,
  Reminder,
} from "./services/reminderService";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { Card, Text, Button } from "../../components/ui";
import { ReminderSkeleton } from "../../components/ReminderSkeleton";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { ReminderItem } from "../../components/ReminderItem";
import { EmptyState } from "../../components/EmptyState";

interface RemindersPanelProps {
  // If true, displays the header with title and count. If false, hides the header.
  showHeader?: boolean;
}

// The RemindersPanel component displays a list of active reminders
const RemindersPanel = ({ showHeader = true }: RemindersPanelProps) => {
  // Auth context to get current user ID
  const { user } = useAuth();
  // State for reminders data
  const [reminders, setReminders] = useState<Reminder[]>([]);
  // Alert state for success/error messages
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  // Loading state for showing skeleton while data is fetching
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReminders = async () => {
      try {
        const activeReminders = await getActiveReminders(user.uid);
        setReminders(activeReminders);
      } catch (err: any) {
        setAlert({ type: "error", message: "Failed to load reminders" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, [user]);

  const handleComplete = async (reminderId: string) => {
    try {
      await completeReminder(reminderId);
      setReminders((prevReminders) =>
        prevReminders.filter((reminder) => reminder.id !== reminderId)
      );
      setAlert({ type: "success", message: "Reminder marked as complete!" });
    } catch (err: any) {
      setAlert({ type: "error", message: "Failed to update reminder" });
    }
  };
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 items-baseline">
        <Text variant="h2" className="flex-shrink-0">
          Reminders
        </Text>
        {/* Header section - Only displayed when showHeader is true */}
        {showHeader && (
          <span className="text-sm text-gray-500 dark:text-gray-400 text-right">
            {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}
          </span>
        )}{" "}
      </div>
      {/* Main content area with overflow scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className={`p-2 pl-0 ${alert ? "pt-3" : ""}`}>
          {/* Alert message for operation feedback */}
          {alert && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}
          {isLoading ? (
            <div className="space-y-4">
              <ReminderSkeleton />
              <ReminderSkeleton />
              <ReminderSkeleton />
            </div>
          ) : reminders.length > 0 ? (
            <ul className="space-y-4">
              {" "}
              {reminders.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onComplete={handleComplete}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No reminders"
              description="You don't have any upcoming reminders"
              icon={CalendarIcon}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { RemindersPanel };
