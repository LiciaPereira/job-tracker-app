import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
import {
  Card,
  Text,
  Input,
  Button,
  Select,
  TextArea,
  Dropzone,
  DropzoneRef,
} from "../components/ui";

interface Job {
  id: string;
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date;
  notes?: string;
  userId: string;
  resumeUrl?: string;
}

interface FormValues {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  notes: string;
  resumeUrl: string;
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

  //store uploaded resume URL
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  //ref to trigger manual upload on save
  const resumeRef = useRef<DropzoneRef>(null);

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
        //set resume if it exists
        setResumeUrl(data.resumeUrl || null);
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
      //upload resume if needed
      if (resumeRef.current) {
        await resumeRef.current.uploadManually();
      }
      console.log("Uploading job with resumeUrl:", resumeUrl);
      await updateJob(jobId, user.uid, {
        company: data.company,
        title: data.title,
        status: data.status,
        notes: data.notes,
        resumeUrl: resumeUrl || null, //save resume
      });

      setAlert({ type: "success", message: "Changes saved!" });
      reset(data);
      setResumeUrl(resumeUrl);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    }
  });

  // define status options for the select component
  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "interviewing", label: "Interviewing" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!job)
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <Text variant="h1">Job not found</Text>
        <Button
          variant="secondary"
          onClick={() => navigate("/jobs")}
          className="mt-4"
        >
          Return to job list
        </Button>
      </Card>
    );

  return (
    <Card className="max-w-2xl mx-auto">
      <Text variant="h1" className="mb-6">
        Edit Job
      </Text>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Job Title"
          {...register("title")}
          error={errors.title?.message}
        />

        <Input
          label="Company"
          {...register("company")}
          error={errors.company?.message}
        />

        <Select
          label="Status"
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />

        <TextArea label="Notes" rows={4} {...register("notes")} />

        {resumeUrl && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resume:
            </p>
            <a
              href={resumeUrl || job.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View Current Resume
            </a>
            <button
              onClick={() => {
                setResumeUrl(null); //remove resume
              }}
              className="text-red-600 text-sm ml-4 hover:underline"
            >
              Delete Resume
            </button>
          </div>
        )}

        {/* dropzone to upload or replace resume */}
        <Dropzone
          ref={resumeRef}
          endpoint="resumeUploader"
          label={job.resumeUrl ? "Replace Resume" : "Upload Resume"}
          variant="default"
          onUploadComplete={(url) => {
            setResumeUrl(url); //save uploaded file
          }}
        />

        {isDirty && (
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        )}
      </form>

      <div className="flex gap-4 mt-6">
        <Button variant="danger" onClick={handleDelete} className="flex-1">
          Delete Job
        </Button>
      </div>
    </Card>
  );
}
