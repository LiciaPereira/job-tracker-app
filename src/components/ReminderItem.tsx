import { format } from "date-fns";
import { Link } from "react-router-dom";
import { CheckIcon, ClockIcon, TrashIcon } from "../components/ui/icons";

interface ReminderItemProps {
  reminder: {
    id: string;
    jobId: string;
    dueDate: Date;
    type: string;
    completed: boolean;
    createdAt: Date;
    company?: string;
    title?: string;
  };
  onComplete: (reminderId: string) => void;
  onDelete?: (reminderId: string) => void;
  onPostpone?: (reminderId: string) => void;
}

export const ReminderItem = ({
  reminder,
  onComplete,
  onDelete,
  onPostpone,
}: ReminderItemProps) => {
  return (
    <li className="bg-white dark:bg-gray-900 shadow-md rounded-md p-4 flex justify-between items-center">
      <Link to={`/jobs/${reminder.jobId}`} className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {reminder.title}
        </p>
        <p className="text-sm text-gray-500">{reminder.company}</p>
        <p className="text-xs text-gray-400 mt-1">
          Due at {format(reminder.dueDate, "MMMM d, yyyy")}
        </p>
      </Link>
      <div className="flex gap-2">
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(reminder.id);
            }}
            title="Delete"
            className="text-red-500 hover:text-red-600 transition"
          >
            <TrashIcon />
          </button>
        )}
        {onPostpone && (
          <button
            onClick={() => onPostpone(reminder.id)}
            title="Postpone"
            className="text-yellow-500 hover:text-yellow-600 transition"
          >
            <ClockIcon />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(reminder.id);
          }}
          title="Complete"
          className="text-green-500 hover:text-green-600 transition"
        >
          <CheckIcon />
        </button>
      </div>
    </li>
  );
};
