import theme from "../../utils/theme";
import { Text } from "../../components/ui";

interface StatCardProps {
  label: string;
  value: number;
  colorClass?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  colorClass = theme.colors.primary.default,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`h-full w-full rounded-lg shadow p-3 xs:p-4 ${theme.colors.background.card} text-center 
      ${onClick ? "cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-md active:scale-95 hover:border-primary-300 dark:hover:border-primary-700 border-2 border-transparent" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {" "}
      <h2 className={`text-lg xs:text-2xl font-bold ${colorClass}`}>{value}</h2>
      <Text variant="label" className="whitespace-nowrap">
        {label}
      </Text>
    </div>
  );
}
