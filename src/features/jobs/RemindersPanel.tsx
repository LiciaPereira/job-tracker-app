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

export function RemindersPanel() {
  const { user } = useAuth();
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
    <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Upcoming Follow-ups
      </h3>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {reminders.length === 0 ? (
        <p className="text-sm text-gray-600">No upcoming follow-ups</p>
      ) : (
        <ul className="space-y-3">
          {reminders.map((reminder) => (
            <li
              key={reminder.id}
              className="flex items-center justify-between p-3 bg-white rounded border"
            >
              <div>
                <Link
                  to={`/job/${reminder.jobId}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Follow up due {format(reminder.dueDate, "MMM d")}
                </Link>
              </div>
              <button
                onClick={() => reminder.id && handleComplete(reminder.id)}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Mark as done
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
