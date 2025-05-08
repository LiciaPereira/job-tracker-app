import React from "react";
import theme from "../../utils/theme";

type TextProps = {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "label" | "small";
  className?: string;
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  className = "",
}) => {
  const getTextClass = () => {
    switch (variant) {
      case "h1":
        return `text-2xl font-bold ${theme.colors.text.heading}`;
      case "h2":
        return `text-xl font-semibold ${theme.colors.text.heading}`;
      case "h3":
        return `text-lg font-medium ${theme.colors.text.heading}`;
      case "h4":
        return `text-base font-medium ${theme.colors.text.heading}`;
      case "label":
        return `text-sm font-medium ${theme.colors.text.label}`;
      case "small":
        return `text-sm ${theme.colors.text.muted}`;
      case "body":
      default:
        return `text-base ${theme.colors.text.body}`;
    }
  };

  return <div className={`${getTextClass()} ${className}`}>{children}</div>;
};

export default Text;
