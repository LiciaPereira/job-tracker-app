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
  resume?: { url: string; name: string };
  coverLetter?: { url: string; name: string };
}

interface FormValues {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  notes: string;
  resumeUrl: string;
  coverLetterUrl?: string;
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
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  //files
  const resumeRef = useRef<DropzoneRef>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const coverLetterRef = useRef<DropzoneRef>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);
  const [coverLetterName, setCoverLetterName] = useState<string | null>(null);
  const [isResumeChanged, setIsResumeChanged] = useState(false);
  const [isCoverLetterChanged, setIsCoverLetterChanged] = useState(false);

  // fetch job details
  useEffect(() => {
    if (!user || !jobId) return;
    const fetchJob = async () => {
      try {
        console.log("Fetching job with ID:", jobId);
        const data = (await getJobById(jobId)) as Job;
        console.log("Fetched job data:", data);

        setJob(data);
        reset({
          company: data.company,
          title: data.title,
          status: data.status,
          notes: data.notes || "",
          resumeUrl: data.resume?.url || "",
          coverLetterUrl: data.coverLetter?.url || "",
        });

        setResumeUrl(data.resume?.url || null);
        setResumeName(data.resume?.name || null);
        setCoverLetterUrl(data.coverLetter?.url || null);
        setCoverLetterName(data.coverLetter?.name || null);

        console.log("State updated with job data");
      } catch (err: any) {
        console.error("Error fetching job:", err);
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
    onConfirm: () => {},
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
      const uploadedResumeUrl = await resumeRef.current?.uploadManually();
      const uploadedCoverLetterUrl =
        await coverLetterRef.current?.uploadManually();

      if (uploadedResumeUrl) setResumeUrl(uploadedResumeUrl);
      if (uploadedCoverLetterUrl) setCoverLetterUrl(uploadedCoverLetterUrl);

      await updateJob(jobId, user.uid, {
        company: data.company,
        title: data.title,
        status: data.status,
        notes: data.notes,
        resumeUrl: uploadedResumeUrl ?? resumeUrl ?? null,
        resumeName: resumeName ?? null,
        coverLetterUrl: uploadedCoverLetterUrl ?? coverLetterUrl ?? null,
        coverLetterName: coverLetterName ?? null,
      });

      setAlert({ type: "success", message: "Changes saved!" });
      setIsResumeChanged(false);
      setIsCoverLetterChanged(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
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
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <Text variant="h1" className="mb-6">
        Job Details
      </Text>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {resumeUrl && (
        <div className="mt-4">
          <Text className="text-sm font-medium text-gray-700">Resume:</Text>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {resumeName || "View Resume"}
          </a>
        </div>
      )}

      {coverLetterUrl && (
        <div className="mt-4">
          <Text className="text-sm font-medium text-gray-700">
            Cover Letter:
          </Text>
          <a
            href={coverLetterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {coverLetterName || "View Cover Letter"}
          </a>
        </div>
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

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Resume
        </Text>
        {resumeUrl && (
          <div className="mt-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {resumeName || "View Resume"}
            </a>
            <button
              type="button"
              onClick={() => {
                setResumeUrl(null);
                setResumeName(null);
              }}
              className="text-red-600 text-sm ml-4 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
        <Dropzone
          ref={resumeRef}
          endpoint="resumeUploader"
          label="Upload Resume"
          variant="default"
          onFileSelected={() => setIsResumeChanged(true)}
          onUploadComplete={(url, name) => {
            setResumeUrl(url);
            setResumeName(name);
            setIsResumeChanged(true);
          }}
        />

        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-6 mb-1">
          Cover Letter
        </Text>
        {coverLetterUrl && (
          <div className="mt-2">
            <a
              href={coverLetterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {coverLetterName || "View Cover Letter"}
            </a>
            <button
              type="button"
              onClick={() => {
                setCoverLetterUrl(null);
                setCoverLetterName(null);
              }}
              className="text-red-600 text-sm ml-4 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
        <Dropzone
          ref={coverLetterRef}
          endpoint="coverLetterUploader"
          label="Upload Cover Letter"
          variant="default"
          onFileSelected={() => setIsCoverLetterChanged(true)}
          onUploadComplete={(url, name) => {
            setCoverLetterUrl(url);
            setCoverLetterName(name);
            setIsCoverLetterChanged(true);
          }}
        />

        {(isDirty || isResumeChanged || isCoverLetterChanged) && (
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
