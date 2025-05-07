import { useEffect } from "react";
import { useBeforeUnload } from "react-router-dom";

interface BlockerOptions {
  when: boolean;
  message?: string;
}

//prevent the user of leaving with unsaved changes
export function useBlocker({
  when,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: BlockerOptions) {
  useBeforeUnload((event) => {
    if (when) {
      event.preventDefault();
      event.returnValue = message;
    }
  });

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [when, message]);
}
