//utility functions for button styling
import { Theme } from "../types/theme";

export const getUploadButtonStyle = (isUploading: boolean, theme: Theme) => {
  const baseStyle =
    "w-full px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 relative";

  const loadingStyle =
    "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-75";

  const activeStyle = `
    ${theme.colors.background.card} 
    hover:bg-gray-50 dark:hover:bg-gray-700 
    ${theme.colors.text.body} 
    cursor-pointer 
    border ${theme.colors.border}
    shadow-sm hover:shadow-md 
    focus:outline-none focus:ring-2 
    focus:ring-indigo-500 dark:focus:ring-indigo-400 
    focus:border-indigo-500 dark:focus:border-indigo-400
    active:scale-[0.99]
  `;

  return `${baseStyle} ${isUploading ? loadingStyle : activeStyle}`;
};
