import theme from "../../utils/theme";
import { Text } from "../../components/ui";

interface StatCardProps {
  label: string;
  value: number;
  colorClass?: string;
}

export function StatCard({
  label,
  value,
  colorClass = theme.colors.primary.default,
}: StatCardProps) {
  return (
    <div
      className={`flex-1 min-w-[150px] rounded-lg shadow p-4 ${theme.colors.background.card} text-center`}
    >
      <h2 className={`text-3x1 font-bold ${colorClass}`}>{value}</h2>
      <Text variant="label">{label}</Text>
    </div>
  );
}
