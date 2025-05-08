import React, { TextareaHTMLAttributes } from "react";
import { Text } from "./Text";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <Text variant="label" className="mb-1 block">
          {label}
        </Text>
      )}
      <textarea
        className={`w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
          border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
          focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
        {...props}
      />
      {error && (
        <Text className="mt-1 text-red-600" variant="small">
          {error}
        </Text>
      )}
    </div>
  );
};

export default TextArea;
