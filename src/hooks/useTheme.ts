import { useDarkMode } from "./useDarkMode";
import theme from "../utils/theme";

/**
 * Custom hook that combines theme utilities and dark mode management
 * This provides a single source of truth for all theme-related functionality
 */
export const useTheme = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  // Toggle dark mode function with semantic name
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return {
    //theme constants
    theme,
    //dark mode state and functions
    darkMode,
    setDarkMode,
    toggleDarkMode,
    //utility to generate conditional classes based on dark mode
    getConditionalClasses: (lightClasses: string, darkClasses: string) =>
      darkMode ? darkClasses : lightClasses,
  };
};
