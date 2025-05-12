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
    <div className="flex flex-wrap justify-center gap-4 p-1">
      <div
        title="View all applications"
        aria-label="Click to view all applications"
      >
        <StatCard
          label="Total"
          value={stats.total}
          onClick={() => navigateToFilteredJobs(null)}
        />
      </div>
      <div
        title="View interview applications"
        aria-label="Click to view applications in interview stage"
      >
        <StatCard
          label="Interviews"
          value={stats.interviews}
          colorClass="text-blue-600"
          onClick={() => navigateToFilteredJobs("interviewing")}
        />
      </div>
      <div
        title="View job offers"
        aria-label="Click to view applications with offers"
      >
        <StatCard
          label="Offers"
          value={stats.offers}
          colorClass="text-green-600"
          onClick={() => navigateToFilteredJobs("offered")}
        />
      </div>
      <div
        title="View rejected applications"
        aria-label="Click to view rejected applications"
      >
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
