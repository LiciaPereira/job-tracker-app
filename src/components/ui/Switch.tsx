import React from "react";
import clsx from "clsx";

interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export const Switch = ({
  label,
  checked,
  onChange,
  disabled = false,
  id,
}: SwitchProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        id={id}
        type="button"
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-primary-600" : "bg-gray-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={clsx(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
    </div>
  );
};
