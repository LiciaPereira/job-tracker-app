import { StatCard } from "./StatCard";

interface SummaryCardsProps {
  stats: {
    total: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-1">
      <StatCard label="Applications Sent" value={stats.total} />
      <StatCard
        label="Interviews"
        value={stats.interviews}
        colorClass="text-blue-600"
      />
      <StatCard
        label="Offers"
        value={stats.offers}
        colorClass="text-green-600"
      />
      <StatCard
        label="Rejections"
        value={stats.rejections}
        colorClass="text-red-600"
      />
    </div>
  );
}
