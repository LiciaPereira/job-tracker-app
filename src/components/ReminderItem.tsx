import React from "react";
import { format } from "date-fns";
import { Card, Text, Button } from "./ui";
import { Reminder } from "../features/jobs/services/reminderService";

interface ReminderItemProps {
  reminder: Reminder;
  onComplete?: (id: string) => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onComplete,
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <Text variant="h3" className="text-sm font-medium mb-1">
            Follow up
          </Text>
          <Text variant="small" className="text-gray-500">
            Due {format(reminder.dueDate, "MMM d, yyyy")}
          </Text>
        </div>
        {onComplete && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onComplete(reminder.id!)}
          >
            Complete
          </Button>
        )}
      </div>
    </Card>
  );
};
