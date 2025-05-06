import { SummaryCards } from "../features/jobs/SummaryCards";
import { RemindersPanel } from "../features/jobs/RemindersPanel";

export default function DashboardPage() {
  const stats = {
    total: 6,
    interviews: 2,
    offers: 1,
    rejections: 1,
  };

  return (
    <div className="p-6">
      <h1 className="text-2x1 font-bold mb-6">Your Dashboard</h1>
      <SummaryCards stats={stats} />
      <RemindersPanel />
    </div>
  );
}
