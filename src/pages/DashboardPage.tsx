import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../features/jobs/services/getJobByUser";
import { SummaryCards } from "../features/jobs/SummaryCards";
import { RemindersPanel } from "../features/jobs/RemindersPanel";
import { Card, Text } from "../components/ui";

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
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const jobs = await getJobsByUser(user.uid);
        const statusCount = {
          total: jobs.length,
          interviews: jobs.filter(
            (job) => (job as any).status === "interviewing"
          ).length,
          offers: jobs.filter((job) => (job as any).status === "offered")
            .length,
          rejections: jobs.filter((job) => (job as any).status === "rejected")
            .length,
        };
        setStats(statusCount);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col overflow-x-hidden overflow-y-auto">
      {/* Header Section */}
      <div className="py-4 flex-shrink-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text variant="h1" className="mb-1 text-2xl md:text-3xl">
              Welcome Back
              {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
            </Text>
            <Text variant="body" color="primary">
              Here's an overview of your job search journey
            </Text>
          </div>
        </div>
      </div>
      {/* Content Grid - Using remaining height */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-12 flex-1 min-h-0 pb-4 overflow-hidden">
        {/* Stats Column */}
        <div className="md:col-span-8 flex flex-col min-h-0 overflow-hidden">
          <Card elevated className="flex-1 overflow-hidden min-h-[300px]">
            <div className="h-full flex flex-col p-2 sm:p-4 overflow-hidden">
              <Text
                variant="h2"
                className="mb-4 flex-shrink-0 text-lg md:text-xl"
              >
                Job Application Stats
              </Text>
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {isStatsLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <SummaryCards stats={stats} />
                    <div className="h-[180px] xs:h-[220px] md:h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg p-2 md:p-4">
                      {/* Placeholder for future chart/graph */}
                      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs xs:text-sm md:text-base">
                        Chart Coming Soon
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        {/* Reminders Column */}
        <div className="md:col-span-4 flex flex-col min-h-0 overflow-hidden mt-4 md:mt-0">
          <Card
            elevated
            className="flex-1 overflow-hidden min-h-[180px] xs:min-h-[220px] md:min-h-[200px]"
          >
            <div className="h-full flex flex-col p-2 sm:p-4 overflow-hidden">
              <RemindersPanel />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
