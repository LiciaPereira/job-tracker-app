import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../features/jobs/services/getJobByUser";
import { Link } from "react-router-dom";
import { exportToCSV } from "../utils/csvExport";

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
      const filename = `job-applications-${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
      exportToCSV(filteredJobs, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Job Applications</h1>
        <button
          onClick={handleExport}
          disabled={isExporting || jobs.length === 0}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
            ${jobs.length === 0 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : isExporting
                ? 'bg-indigo-400 cursor-wait text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
        >
          {isExporting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </span>
          ) : 'Export to CSV'}
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li
              key={job.id}
              className="border p-4 rounded hover:shadow transition"
            >
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm mt-1">
                Status: <span className="font-medium">{job.status}</span>
              </p>
              <Link
                to={`/job/${job.id}`}
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                View details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
