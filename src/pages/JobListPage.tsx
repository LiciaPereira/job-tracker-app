import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../features/jobs/services/getJobByUser";
import { Link } from "react-router-dom";
import { exportToCSV } from "../utils/csvExport";
import { Card, Text, Button, Select } from "../components/ui";
import { useTheme } from "../hooks/useTheme";

interface Job {
  id: string;
  company: string;
  title: string;
  status: string;
  appliedAt?: any;
  notes?: string;
}

export default function JobListPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      const data = await getJobsByUser(user.uid);
      setJobs(data as any);
    };

    fetchJobs();
  }, [user]);

  const filteredJobs = filter
    ? jobs.filter((job) => job.status === filter)
    : jobs;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = `job-applications-${new Date().toLocaleDateString().replace(/\//g, "-")}.csv`;
      exportToCSV(filteredJobs, filename);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const statusOptions = [
    { value: "", label: "All" },
    { value: "applied", label: "Applied" },
    { value: "interviewing", label: "Interviewing" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
  ];

  if (loading) return <div>Loading...</div>;
  return (
    <Card className="max-w-4xl mx-auto p-6 rounded-lg">
      <div
        className={`flex justify-between items-center mb-6 ${theme.colors.text.body}`}
      >
        <Text variant="h1">Your Job Applications</Text>
        <Button
          onClick={handleExport}
          disabled={isExporting || jobs.length === 0}
          variant={jobs.length === 0 ? "secondary" : "primary"}
          size="md"
          className={isExporting ? "cursor-wait" : ""}
        >
          {isExporting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Exporting...
            </span>
          ) : (
            "Export to CSV"
          )}
        </Button>
      </div>

      <div className="mb-4 flex items-center">
        <Text variant="label" className="mr-2">
          Filter by status:
        </Text>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={theme.elements.input}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <Text variant="small">No jobs found.</Text>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li
              key={job.id}
              className={`border ${theme.colors.border} p-4 rounded ${theme.colors.background.card} hover:shadow transition`}
            >
              <Text variant="h3">{job.title}</Text>
              <Text variant="small">{job.company}</Text>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                Status: <span className="font-medium">{job.status}</span>
              </p>
              <Link
                to={`/job/${job.id}`}
                className={`${theme.colors.primary.default} text-sm mt-2 inline-block`}
              >
                View details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
