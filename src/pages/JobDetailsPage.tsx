import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  getJobById,
  deleteJobById,
  updateJob,
} from "../features/jobs/services/jobService";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
import { useBlocker } from "../hooks/useBlocker";

interface Job {
  id: string;
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date;
  notes?: string;
  userId: string;
}

interface FormValues {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  notes: string;
}

const schema = yup.object().shape({
  company: yup.string().required("Company is required"),
  title: yup.string().required("Job title is required"),
  status: yup
    .string()
    .oneOf(["applied", "interviewing", "offered", "rejected"])
    .required("Status is required"),
  notes: yup.string().default(""),
}) as yup.ObjectSchema<FormValues>;

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // fetch job details
  useEffect(() => {
    if (!user || !jobId) return;

    const fetchJob = async () => {
      try {
        const data = (await getJobById(jobId)) as Job;
        setJob(data);
        reset({
          company: data.company,
          title: data.title,
          status: data.status,
          notes: data.notes || "",
        });
      } catch (err: any) {
        setAlert({ type: "error", message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [user, jobId, reset]);

  useBlocker({
    when: isDirty,
    message: "You have unsaved changes. Are you sure you want to leave?",
    onConfirm: () => {
      // allow routing to continue (dirty flag will reset on unmount)
    },
    onCancel: () => {
      setAlert({
        type: "info",
        message: "Navigation cancelled. Changes not saved.",
      });
    },
  });

  const handleDelete = async () => {
    if (!jobId || !window.confirm("Are you sure you want to delete this job?"))
      return;

    try {
      await deleteJobById(jobId);
      navigate("/jobs");
    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    }
  };

  const onSubmit = handleSubmit(async (data: FormValues) => {
    if (!jobId || !user) return;

    try {
      await updateJob(jobId, user.uid, {
        company: data.company,
        title: data.title,
        status: data.status,
        notes: data.notes,
      });
      setAlert({ type: "success", message: "Changes saved!" });
      reset(data);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    }
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!job)
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Job not found</h1>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Return to job list
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            {...register("title")}
            className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            {...register("company")}
            className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={4}
            className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {isDirty && (
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-150"
          >
            Save Changes
          </button>
        )}
      </form>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150"
        >
          Delete Job
        </button>
      </div>
    </div>
  );
}
