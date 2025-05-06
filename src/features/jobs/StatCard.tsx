interface StatCardProps {
  label: string;
  value: number;
  colorClass?: string;
}

export function StatCard({
  label,
  value,
  colorClass = "#4F46E5",
}: StatCardProps) {
  return (
    <div className="flex-1 min-w-[150px] rounded-lg shadow p-4 bg-white text-center">
      <h2 className={`text-3x1 font-bold ${colorClass}`}>{value}</h2>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}
