import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BlockerOptions {
  when: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

//prevent the user of leaving with unsaved changes
export function useBlocker({
  when,
  message,
  onConfirm,
  onCancel,
}: BlockerOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  const lastLocation = useRef(location.pathname);

  useEffect(() => {
    if (!when) return;

    const unblock = () => {
      //this logic only runs if they confirm the leave
      onConfirm();
    };

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message || "";
    };

    const checkLocationChange = () => {
      if (location.pathname !== lastLocation.current) {
        const confirmLeave = window.confirm(message || "Leave without saving?");
        if (confirmLeave) {
          unblock();
        } else {
          if (onCancel) onCancel();
          navigate(lastLocation.current, { replace: true });
        }
      } else {
        lastLocation.current = location.pathname;
      }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);
    const interval = setInterval(checkLocationChange, 100);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      clearInterval(interval);
    };
  }, [when, location.pathname, message, onConfirm, onCancel, navigate]);
}
