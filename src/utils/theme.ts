// Theme color constants for consistent styling across the application
export const theme = {
  // Base colors
  colors: {
    // Primary brand colors
    primary: {
      light:
        "text-primary-400 dark:text-primary-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors",
      default:
        "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 transition-colors",
      dark: "text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600 transition-colors",
    },
    // Background colors with smooth gradients
    background: {
      page: "bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
      card: "bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90",
      input: "bg-white dark:bg-gray-700 bg-opacity-95 dark:bg-opacity-95",
    },
    // Text colors with improved contrast for accessibility
    text: {
      heading: "text-gray-900 dark:text-gray-50 font-medium",
      body: "text-gray-700 dark:text-gray-200",
      muted: "text-gray-500 dark:text-gray-400",
      label: "text-gray-700 dark:text-gray-200 font-medium",
      link: "text-gray-700 dark:text-gray-200",
    },
    // Border colors with subtle shadows
    border: "border-gray-200 dark:border-gray-700",
  },

  // Common element style combinations with improved focus states and animations
  elements: {
    card: "bg-white dark:bg-gray-800 rounded-xl shadow-soft transition-all duration-200 hover:shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-700",
    input:
      "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400",
    section:
      "bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-soft",
  },
};

export default theme;
