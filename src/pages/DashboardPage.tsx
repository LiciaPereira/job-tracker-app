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
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text variant="h1" className="mb-2">
              Welcome Back
              {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
            </Text>
            <Text variant="body" color="primary" className="mb-6">
              Here's an overview of your job search journey
            </Text>
          </div>
        </div>{" "}
        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-12 h-[calc(100vh-12rem)]">
          {/* Stats Section - Wider Column */}
          <div className="md:col-span-8">
            <Card elevated className="h-full">
              <div className="p-6 h-full flex flex-col">
                <Text variant="h2" className="mb-6">
                  Job Application Stats
                </Text>
                <div className="flex-grow">
                  {isStatsLoading ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <div className="flex-grow overflow-y-auto">
                      {isStatsLoading ? (
                        <div className="h-48 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                        </div>
                      ) : (
                        <SummaryCards stats={stats} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Reminders Section - Narrower Column */}
          <div className="md:col-span-4">
            <Card elevated className="h-full">
              <div className="p-6 h-full flex flex-col">
                <Text variant="h2" className="mb-6">
                  Reminders
                </Text>
                <div className="flex-grow overflow-y-auto">
                  <RemindersPanel />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
