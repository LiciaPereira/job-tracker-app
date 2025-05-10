import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { Text } from "./Text";
import { useId } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = "", helperText, required, ...props }, ref) => {
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
          <textarea
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={`${helperText ? descriptionId : ""} ${error ? errorId : ""}`}
            required={required}
            className={`
            w-full px-3 py-2
            bg-white dark:bg-gray-700 
            text-gray-900 dark:text-gray-100 
            border border-gray-200 dark:border-gray-600 
            rounded-lg shadow-sm
            transition-all duration-200
            resize-y min-h-[100px]
            hover:border-gray-300 dark:hover:border-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
            dark:focus:ring-primary-400/20 dark:focus:border-primary-400
            disabled:opacity-60 disabled:cursor-not-allowed
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            ${error ? "border-red-500 dark:border-red-500" : ""}
            ${className}
          `}
            {...props}
          />
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

export default TextArea;
