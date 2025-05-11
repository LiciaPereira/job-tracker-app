import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "center" | "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  icon,
  iconPosition = "center",
  fullWidth = false,
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    const baseClasses =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200";
    const focusClasses =
      "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800";
    const disabledClasses =
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";

    switch (variant) {
      case "primary":
        return `${baseClasses} ${focusClasses} ${disabledClasses} 
          bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 
          text-white shadow-sm hover:shadow-md 
          focus:ring-primary-500 dark:focus:ring-primary-400
          transform hover:-translate-y-0.5 active:translate-y-0`;
      case "secondary":
        return `${baseClasses} ${focusClasses} ${disabledClasses}
          bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
          text-gray-700 dark:text-gray-100 shadow-sm hover:shadow
          focus:ring-gray-500 dark:focus:ring-gray-400
          transform hover:-translate-y-0.5 active:translate-y-0`;
      case "danger":
        return `${baseClasses} ${focusClasses} ${disabledClasses}
          bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600
          text-white shadow-sm hover:shadow-md
          focus:ring-red-500 dark:focus:ring-red-400
          transform hover:-translate-y-0.5 active:translate-y-0`;
      case "success":
        return `${baseClasses} ${focusClasses} ${disabledClasses}
          bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600
          text-white shadow-sm hover:shadow-md
          focus:ring-green-500 dark:focus:ring-green-400
          transform hover:-translate-y-0.5 active:translate-y-0`;
      case "outline":
        return `${baseClasses} ${focusClasses} ${disabledClasses}
          border border-primary-600 dark:border-primary-400
          text-primary-600 dark:text-primary-400
          hover:bg-primary-50 dark:hover:bg-primary-900
          focus:ring-primary-500 dark:focus:ring-primary-400`;
      default:
        return `${baseClasses} ${focusClasses} ${disabledClasses}
          bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600
          text-white shadow-sm hover:shadow-md`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-2.5 py-1.5 text-xs";
      case "sm":
        return "px-3 py-2 text-sm leading-4";
      case "lg":
        return "px-6 py-3 text-base";
      case "md":
      default:
        return "px-4 py-2 text-sm";
    }
  };

  const getLoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  return (
    <button
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()}
        ${fullWidth ? "w-full" : ""}
        rounded-lg min-h-10
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && getLoadingSpinner()}
      {icon && iconPosition === "left" && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      {(!icon || iconPosition !== "center" || isLoading) && (
        <span className={isLoading ? "opacity-75" : ""}>{children}</span>
      )}
      {icon && iconPosition === "center" && !isLoading && !children && (
        <span>{icon}</span>
      )}
      {icon && iconPosition === "center" && !isLoading && children && (
        <div className="flex flex-col items-center">
          <span className="mb-1">{icon}</span>
          <span>{children}</span>
        </div>
      )}
      {icon && iconPosition === "right" && !isLoading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;
