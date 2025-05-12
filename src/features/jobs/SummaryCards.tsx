import { StatCard } from "./StatCard";
import { useNavigate } from "react-router-dom";

interface SummaryCardsProps {
  stats: {
    total: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const navigate = useNavigate();

  const navigateToFilteredJobs = (filter: string | null) => {
    navigate("/jobs", { state: { initialFilter: filter } });
  };
  return (
    <div className="inline-flex w-full justify-evenly p-2 gap-2 flex-wrap">
      {/* All cards in one line for small/medium screens, with appropriate sizing */}
      <div>
        <StatCard
          label="Total"
          value={stats.total}
          onClick={() => navigateToFilteredJobs(null)}
        />
      </div>
      <div>
        <StatCard
          label="Interviews"
          value={stats.interviews}
          colorClass="text-blue-600"
          onClick={() => navigateToFilteredJobs("interviewing")}
        />
      </div>
      <div>
        <StatCard
          label="Offers"
          value={stats.offers}
          colorClass="text-green-600"
          onClick={() => navigateToFilteredJobs("offered")}
        />
      </div>
      <div>
        <StatCard
          label="Rejections"
          value={stats.rejections}
          colorClass="text-red-600"
          onClick={() => navigateToFilteredJobs("rejected")}
        />
      </div>
    </div>
  );
}
