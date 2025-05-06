import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../services/getJobByUser";
import { SummaryCards } from "../features/jobs/SummaryCards";
import { RemindersPanel } from "../features/jobs/RemindersPanel";

interface Stats {
  total: number;
  interviews: number;
  offers: number;
  rejections: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    interviews: 0,
    offers: 0,
    rejections: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const jobs = await getJobsByUser(user.uid);
      const statusCount = {
        total: jobs.length,
        interviews: jobs.filter((job) => (job as any).status === "interviewing")
          .length,
        offers: jobs.filter((job) => (job as any).status === "offered").length,
        rejections: jobs.filter((job) => (job as any).status === "rejected")
          .length,
      };
      setStats(statusCount);
    };

    fetchStats();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2x1 font-bold mb-6">Your Dashboard</h1>
      <SummaryCards stats={stats} />
      <RemindersPanel />
    </div>
  );
}
