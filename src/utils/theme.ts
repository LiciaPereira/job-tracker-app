// Theme color constants for consistent styling across the application
export const theme = {
  // Base colors
  colors: {
    // Primary brand colors
    primary: {
      light: "text-indigo-500 dark:text-indigo-400",
      default: "text-indigo-600 dark:text-indigo-500",
      dark: "text-indigo-700 dark:text-indigo-600",
    },
    // Background colors
    background: {
      page: "bg-gradient-to-br from-indigo-50 to-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800",
      card: "bg-white dark:bg-gray-800",
      input: "bg-white dark:bg-gray-700",
    },
    // Text colors
    text: {
      heading: "text-gray-900 dark:text-gray-100",
      body: "text-gray-700 dark:text-gray-300",
      muted: "text-gray-600 dark:text-gray-400",
      label: "text-gray-700 dark:text-gray-300",
    },
    // Border colors
    border: "border-gray-300 dark:border-gray-600",
  },

  // Common element style combinations
  elements: {
    card: "bg-white dark:bg-gray-800 rounded-lg shadow-md",
    input:
      "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md",
    section: "bg-white dark:bg-gray-800 p-6 rounded-lg",
  },
};

export default theme;
