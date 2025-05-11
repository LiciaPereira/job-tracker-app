import React from "react";
import { Text } from "./ui";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <div className="text-center py-6">
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-gray-400" aria-hidden="true" />
        </div>
      )}
      <Text variant="h3" className="mb-2">
        {title}
      </Text>
      <Text variant="body" color="primary">
        {description}
      </Text>
    </div>
  );
};
