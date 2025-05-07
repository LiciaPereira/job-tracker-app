import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getJobsByUser } from "../features/jobs/services/getJobByUser";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  company: string;
  title: string;
  status: string;
  appliedAt?: any;
}

export default function JobListPage() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("");

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

  if (loading) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Job Applications</h1>

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
