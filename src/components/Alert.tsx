import { useEffect } from "react";

interface AlertProps {
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Alert({
  type = "info",
  message,
  onClose,
  duration = 5000,
}: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const baseStyle = "px-4 py-3 rounded text-sm font-medium";
  const typeStyle = {
    success: "bg-green-100 text-green-800 border border-green-300",
    error: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
  }[type];

  return (
    <div className={`${baseStyle} ${typeStyle} mt-4`}>
      {message}
      <button
        onClick={onClose}
        className="absolute top-1 right-2 text-xl leading-none focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}
