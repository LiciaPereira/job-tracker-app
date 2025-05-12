import React, { JSX } from "react";
import theme from "../../utils/theme";

type TextProps = {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "label" | "small" | "a";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  color?: "primary" | "success" | "error" | "warning" | "default";
  htmlFor?: string;
  id?: string;
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  className = "",
  as,
  color = "default",
  ...props
}) => {
  const Component = as || getDefaultElement(variant);

  const getTextClass = () => {
    const baseStyles = getBaseStyles(variant);
    const colorStyles = getColorStyles(color);
    return `${baseStyles} ${colorStyles} ${className}`;
  };

  return (
    <Component className={getTextClass()} {...props}>
      {children}
    </Component>
  );
};

function getDefaultElement(
  variant: TextProps["variant"]
): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "label":
      return "label";
    case "a":
      return "a";
    default:
      return "p";
  }
}

function getBaseStyles(variant: TextProps["variant"]) {
  switch (variant) {
    case "h1":
      return `text-3xl font-bold tracking-tight ${theme.colors.text.heading}`;
    case "h2":
      return `text-2xl font-semibold tracking-tight ${theme.colors.text.heading}`;
    case "h3":
      return `text-xl font-medium ${theme.colors.text.heading}`;
    case "h4":
      return `text-lg font-medium ${theme.colors.text.heading}`;
    case "label":
      return `text-sm font-medium ${theme.colors.text.label}`;
    case "small":
      return `text-sm ${theme.colors.text.muted}`;
    case "a":
      return `text-sm font-medium underline ${theme.colors.text.link}`;
    case "body":
    default:
      return `text-base leading-relaxed ${theme.colors.text.body}`;
  }
}

function getColorStyles(color: TextProps["color"]) {
  switch (color) {
    case "primary":
      return theme.colors.primary.default;
    case "success":
      return "text-green-600 dark:text-green-400";
    case "error":
      return "text-red-600 dark:text-red-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "";
  }
}

export default Text;
