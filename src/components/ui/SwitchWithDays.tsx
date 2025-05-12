import { useId } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface SwitchWithDaysProps {
  checked: boolean;
  onToggle: () => void;
  days: number;
  onDaysChange: (newDays: number) => void;
  name?: string;
  register?: UseFormRegisterReturn;
}

export function SwitchWithDays({
  checked,
  onToggle,
  days,
  onDaysChange,
}: SwitchWithDaysProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      {/* Toggle */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-purple-600" : "bg-gray-400"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {/* Label + conditional input */}
      <label
        htmlFor={id}
        className="text-sm text-white flex items-center gap-1"
      >
        Enable Reminder{" "}
        {checked && (
          <>
            in
            <input
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => onDaysChange(Number(e.target.value))}
              className="w-8 text-center bg-transparent border-b border-gray-400 text-white px-1 py-0.5 text-sm focus:outline-none"
            />
            days
          </>
        )}
      </label>
    </div>
  );
}
