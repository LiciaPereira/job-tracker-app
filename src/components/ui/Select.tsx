import React, { SelectHTMLAttributes, forwardRef } from "react";
import { Text } from "./Text";
import { useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  className?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, className = "", helperText, required, ...props },
    ref
  ) => {
    const id = useId();
    const descriptionId = useId();
    const errorId = useId();

    return (
      <div className="mb-4">
        {label && (
          <Text
            variant="label"
            className="mb-1.5 block"
            as="label"
            htmlFor={id}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </Text>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={`${helperText ? descriptionId : ""} ${error ? errorId : ""}`}
            required={required}
            className={`
            w-full px-3 py-2 pr-8
            bg-white dark:bg-gray-700 
            text-gray-900 dark:text-gray-100 
            border border-gray-200 dark:border-gray-600 
            rounded-lg shadow-sm
            transition-all duration-200
            appearance-none
            hover:border-gray-300 dark:hover:border-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
            dark:focus:ring-primary-400/20 dark:focus:border-primary-400
            disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? "border-red-500 dark:border-red-500" : ""}
            ${className}
          `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
          </div>
        </div>
        {helperText && !error && (
          <Text
            id={descriptionId}
            className="mt-1.5 text-gray-500 dark:text-gray-400"
            variant="small"
          >
            {helperText}
          </Text>
        )}
        {error && (
          <Text
            id={errorId}
            className="mt-1.5 flex items-center text-red-500 dark:text-red-400"
            variant="small"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </Text>
        )}
      </div>
    );
  }
);

export default Select;
