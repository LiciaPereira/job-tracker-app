import React, { InputHTMLAttributes } from "react";
import { Text } from "./Text";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
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
      <input
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

export default Input;
