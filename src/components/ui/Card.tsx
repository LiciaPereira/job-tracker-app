import React from "react";
import theme from "../../utils/theme";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`${theme.elements.card} p-6 ${className}`}>{children}</div>
  );
};

export default Card;
