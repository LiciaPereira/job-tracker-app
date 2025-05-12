import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "../ui";
import { Button } from "../ui";

interface PageHeaderProps {
  title: string;
  description?: any;
  children?: ReactNode;
  backPath?: string;
  actions?: ReactNode;
  showBorder?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  backPath,
  actions,
  showBorder = true,
  className = "",
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`top-0 bg-white dark:bg-gray-900 ${showBorder ? "border-b border-gray-200 dark:border-gray-700" : ""} shadow-sm py-3 z-10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex-1 min-w-0">
            <Text variant="h1" className="truncate">
              {title}
            </Text>
            {description && (
              <Text
                variant="body"
                className="text-gray-600 dark:text-gray-400 mt-1"
              >
                {description}
              </Text>
            )}
          </div>

          {/* Action button group */}
          <div className="flex flex-row gap-2 self-end sm:self-auto">
            {backPath && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => navigate(backPath)}
                icon={
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
                aria-label="Go back"
              />
            )}

            {children}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}
