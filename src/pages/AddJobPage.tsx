import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addJob } from "../features/jobs/services/addJob";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
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

interface FormValues {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date | null;
  notes?: string;
  resume?: { url: string; name: string } | null;
  coverLetter?: { url: string; name: string } | null;
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
    resolver: yupResolver(schema),
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const resumeRef = useRef<DropzoneRef>(null);
  const [resumePreview, setResumePreview] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const coverLetterRef = useRef<DropzoneRef>(null);
  const [coverLetterPreview, setCoverLetterPreview] = useState<{
    url: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    try {
      const uploadedResume = await resumeRef.current?.uploadManually();
      const uploadedCoverLetter =
        await coverLetterRef.current?.uploadManually();

      const resume = uploadedResume
        ? {
            url: uploadedResume,
            name: resumePreview?.name || "Uploaded Resume",
          }
        : data.resume || null;

      const coverLetter = uploadedCoverLetter
        ? {
            url: uploadedCoverLetter,
            name: coverLetterPreview?.name || "Uploaded Cover Letter",
          }
        : data.coverLetter || null;

      await addJob(user.uid, {
        ...data,
        appliedAt: data.appliedAt || undefined,
        notes: data.notes ?? undefined,
        resume,
        coverLetter,
      });

      setAlert({ type: "success", message: "Job added!" });
      setTimeout(() => navigate("/jobs"), 2000);
    } catch (err: any) {
      console.error("Error adding job:", err);
      setAlert({ type: "error", message: err.message });
    }
  };

  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "interviewing", label: "Interviewing" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <Card className="max-w-md mx-auto">
      <Text variant="h1" className="mb-4">
        Add Job
      </Text>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Company"
          {...register("company")}
          error={errors.company?.message}
        />
        <Input
          label="Job Title"
          {...register("title")}
          error={errors.title?.message}
        />
        <Select
          label="Status"
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />
        <Input
          label="Application Date"
          type="date"
          {...register("appliedAt")}
          defaultValue={new Date().toISOString().split("T")[0]}
        />
        <TextArea label="Notes" rows={4} {...register("notes")} />

        {/* Resume Upload */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume
        </label>
        <Dropzone
          ref={resumeRef}
          endpoint="resumeUploader"
          label="Drag & drop your resume (PDF)"
          variant="default"
          onUploadComplete={(url, name) => {
            setResumePreview({ url, name });
          }}
        />
        {resumePreview && (
          <div className="mt-2">
            <a
              href={resumePreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {resumePreview.name}
            </a>
            <button
              type="button"
              onClick={() => setResumePreview(null)}
              className="text-red-600 text-sm ml-4 hover:underline"
            >
              Delete
            </button>
          </div>
        )}

        {/* Cover Letter Upload */}
        <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
          Cover Letter
        </label>
        <Dropzone
          ref={coverLetterRef}
          endpoint="coverLetterUploader"
          label="Drag & drop your cover letter (PDF)"
          variant="default"
          onUploadComplete={(url, name) => {
            setCoverLetterPreview({ url, name });
          }}
        />
        {coverLetterPreview && (
          <div className="mt-2">
            <a
              href={coverLetterPreview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {coverLetterPreview.name}
            </a>
            <button
              type="button"
              onClick={() => setCoverLetterPreview(null)}
              className="text-red-600 text-sm ml-4 hover:underline"
            >
              Delete
            </button>
          </div>
        )}

        <Button type="submit" className="w-full">
          Add Job
        </Button>
      </form>
    </Card>
  );
}
