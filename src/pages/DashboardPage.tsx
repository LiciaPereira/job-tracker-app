import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../features/jobs/services/getJobByUser";
import { SummaryCards } from "../features/jobs/SummaryCards";
import { RemindersPanel } from "../features/jobs/RemindersPanel";
import { Card, Text } from "../components/ui";
import { useTheme } from "../hooks/useTheme";

interface Stats {
  total: number;
  interviews: number;
  offers: number;
  rejections: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
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
    <Card className="p-6 rounded-lg">
      <Text variant="h1" className="mb-6">
        Your Dashboard
      </Text>
      <SummaryCards stats={stats} />
      <RemindersPanel />
    </Card>
  );
}
