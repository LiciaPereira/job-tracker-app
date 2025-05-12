import React, { JSX } from "react";
import theme from "../../utils/theme";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  onClick?: () => void;
  interactive?: boolean;
  elevated?: boolean;
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  as: Component = "div",
  onClick,
  interactive = false,
  elevated = false,
}) => {
  const baseClasses = `
    ${theme.elements.card}
    p-5
    ${elevated ? "shadow-md hover:shadow-lg" : ""}
    ${interactive ? "cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]" : ""}
    ${onClick ? "focus:outline-none focus:ring-2 focus:ring-primary-500/50" : ""}
    ${className}
  `;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </Component>
  );
};

export default Card;
