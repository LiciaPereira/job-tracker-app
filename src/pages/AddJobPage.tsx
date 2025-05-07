import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addJob } from "../features/jobs/services/addJob";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
import { useState } from "react";

interface FormValues {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date | null;
  notes?: string;
}

const schema = yup.object().shape({
  company: yup.string().required("Company is required"),
  title: yup.string().required("Job title is required"),
  status: yup
    .string()
    .oneOf(["applied", "interviewing", "offered", "rejected"])
    .required("Status is required"),
  appliedAt: yup.date().nullable().optional(),
  notes: yup.string().nullable().optional(),
}) as yup.ObjectSchema<FormValues>;

export default function AddJobPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    try {
      const formattedData = {
        ...data,
        appliedAt: data.appliedAt || undefined,
        notes: data.notes === null ? undefined : data.notes,
      };
      await addJob(user.uid, formattedData);
      setAlert({ type: "success", message: "Job added!" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Job</h1>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Company</label>
          <input
            {...register("company")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.company?.message}</p>
        </div>

        <div>
          <label className="block mb-1">Job Title</label>
          <input {...register("title")} className="w-full border p-2 rounded" />
          <p className="text-red-500 text-sm">{errors.title?.message}</p>
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select {...register("status")} className="w-full border p-2 rounded">
            <option value="">Select...</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
          <p className="text-red-500 text-sm">{errors.status?.message}</p>
        </div>

        <div>
          <label className="block mb-1">Application Date</label>
          <input
            type="date"
            {...register("appliedAt")}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Notes</label>
          <textarea
            {...register("notes")}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Add Job
        </button>
      </form>
    </div>
  );
}
