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
import { useTheme } from "../../hooks/useTheme";

export function RemindersPanel() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  //fetch active reminders for the current user
  useEffect(() => {
    if (!user) return;

    const fetchReminders = async () => {
      try {
        const activeReminders = await getActiveReminders(user.uid);
        setReminders(activeReminders);
      } catch (err: any) {
        setAlert({ type: "error", message: "Failed to load reminders" });
      }
    };

    fetchReminders();
  }, [user]);

  //handle marking a reminder as complete
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
    <>
      <Text variant="h3" className="mb-4">
        Upcoming Follow-ups ({reminders.length})
      </Text>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {reminders.length === 0 ? (
        <Text variant="small">No upcoming follow-ups</Text>
      ) : (
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 h-[calc(100vh-20rem)]">
          <ul className="space-y-3 pr-2">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className={`flex items-center justify-between p-3 ${theme.colors.background.card} rounded ${theme.colors.border}`}
              >
                <div>
                  <Link
                    to={`/job/${reminder.jobId}`}
                    className={`text-sm font-medium ${theme.colors.primary.default} hover:underline`}
                  >
                    Follow up due {format(reminder.dueDate, "MMM d")}
                  </Link>
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => reminder.id && handleComplete(reminder.id)}
                  className="text-sm"
                >
                  Mark as done
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
