import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../features/jobs/services/getJobByUser";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { exportToCSV } from "../utils/csvExport";
import { Card, Text, Button } from "../components/ui";
import { useTheme } from "../hooks/useTheme";
import { PaperclipIcon } from "../components/ui/icons";

interface Job {
  id: string;
  company: string;
  title: string;
  status: string;
  appliedAt?: any;
  notes?: string;
  resume?: { url: string; name: string };
  coverLetter?: { url: string; name: string };
}

export default function JobListPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [highlightFilter, setHighlightFilter] = useState(false);
  // fetch jobs for logged-in user
  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      try {
        const data = await getJobsByUser(user.uid);
        setJobs(data as Job[]);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };

    fetchJobs();
  }, [user]); //set initial filter from navigation state if available and highlight the filter
  useEffect(() => {
    const state = location.state as { initialFilter?: string } | null;
    if (state && state.initialFilter !== undefined) {
      setFilter(state.initialFilter || "");
      setHighlightFilter(true);

      //automatically turn off highlight after 0.75 seconds
      const timer = setTimeout(() => setHighlightFilter(false), 750);

      //clear the state after use to prevent filter persistence on page refreshes
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // filter jobs based on selected status
  const filteredJobs = filter
    ? jobs.filter((job) => job.status === filter)
    : jobs;

  // handle CSV export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = `job-applications-${new Date()
        .toLocaleDateString()
        .replace(/\//g, "-")}.csv`;
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

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header Section */}{" "}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {" "}
              <div>
                <Text variant="h1" className="mb-2">
                  Job Applications
                </Text>
                <Text variant="body" color="primary">
                  {"Total of "}
                  {jobs.length}{" "}
                  {jobs.length === 1 ? "application" : "applications"}
                  {filter && (
                    <>
                      {" - Viewing "}
                      <span className="font-semibold">
                        {filteredJobs.length}
                        {" ("}
                        {
                          statusOptions.find(
                            (option) => option.value === filter
                          )?.label
                        }
                        {")"}
                      </span>
                    </>
                  )}
                </Text>
              </div>{" "}
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-2">
                <div
                  className={`transition-all duration-300 ${
                    highlightFilter
                      ? "ring-2 ring-primary-500 dark:ring-primary-400 rounded-lg shadow-md"
                      : ""
                  }`}
                >
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Filter by status"
                    className={`
                  px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                  dark:focus:ring-primary-400 dark:focus:border-primary-400
                  ${highlightFilter ? "animate-pulse" : ""}
                `}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting || jobs.length === 0}
                  variant="outline"
                  size="md"
                  title="Export to Excel/CSV"
                  aria-label="Export job applications to Excel/CSV file"
                  iconPosition="center"
                  icon={
                    isExporting ? undefined : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    )
                  }
                />
                <Link to="/add-job">
                  <Button
                    variant="primary"
                    size="md"
                    iconPosition="center"
                    title="Add New Job"
                    aria-label="Add a new job application"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                  />
                </Link>
              </div>
            </div>
            {/* Job List */}
            {filteredJobs.length === 0 ? (
              <Card elevated className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <Text variant="h3" className="mb-2">
                    No jobs found
                  </Text>
                  <Text variant="body" color="primary">
                    {filter ? "Try changing your filters or " : "Start by "}
                    <Link
                      to="/add-job"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      adding a new job application
                    </Link>
                  </Text>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    interactive
                    elevated
                    className="group"
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <Text variant="h3" className="mb-1 truncate">
                            {job.title}
                          </Text>
                          <Text variant="body" className="truncate">
                            {job.company}
                          </Text>
                        </div>
                        <div
                          className={`
                      px-2.5 py-1 rounded-full text-xs font-medium
                      ${
                        job.status === "offered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : job.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : job.status === "interviewing"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }
                    `}
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2 justify-between">
                        {job.appliedAt && (
                          <Text variant="small" className="text-gray-500">
                            Applied{" "}
                            {job.appliedAt.toDate().toLocaleDateString()}
                          </Text>
                        )}
                        <div className="inline-flex">
                          {job.resume?.url && (
                            <span
                              title="Resume attached"
                              className="flex items-center text-gray-500"
                            >
                              <PaperclipIcon className="w-4 h-4" />
                            </span>
                          )}
                          {job.coverLetter?.url && (
                            <span
                              title="Cover Letter attached"
                              className="flex items-center text-gray-500"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
