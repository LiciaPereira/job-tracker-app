import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addJob } from "../features/jobs/services/addJob";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
import { PageHeader } from "../components/Layout";
import {
  Card,
  Text,
  Input,
  Button,
  Select,
  TextArea,
  Dropzone,
  DropzoneRef,
  SwitchWithDays,
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
  const formRef = useRef<HTMLFormElement>(null); //add form reference
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

  //for reminders
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);

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
        reminderEnabled,
        reminderDays,
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
    <div className="h-full w-full flex flex-col overflow-hidden">
      <PageHeader
        title="Add New Job"
        description="Track your new job application and related documents"
        backPath="/jobs"
        actions={
          <Button
            type="submit"
            form="add-job-form"
            variant="primary"
            size="sm"
            icon={
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
            aria-label="Save job"
          />
        }
      />{" "}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <form
            id="add-job-form"
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Job Details */}
              <Card elevated className="p-4 xs:p-5 sm:p-6">
                <Text variant="h2" className="mb-6 text-lg md:text-xl">
                  Job Details
                </Text>
                <div className="space-y-4">
                  <Input
                    label="Company"
                    {...register("company")}
                    error={errors.company?.message}
                    required
                  />
                  <Input
                    label="Job Title"
                    {...register("title")}
                    error={errors.title?.message}
                    required
                  />
                  <Select
                    label="Status"
                    options={statusOptions}
                    {...register("status")}
                    error={errors.status?.message}
                    required
                  />
                  <Input
                    label="Application Date"
                    type="date"
                    {...register("appliedAt")}
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                  <TextArea
                    label="Notes"
                    rows={4}
                    {...register("notes")}
                    helperText="Add any important details about the role or company"
                  />
                  <SwitchWithDays
                    checked={reminderEnabled}
                    onToggle={() => setReminderEnabled(!reminderEnabled)}
                    days={reminderDays}
                    onDaysChange={setReminderDays}
                  />
                </div>
              </Card>

              {/* Right Column - Documents */}
              <Card elevated className="p-4 xs:p-5 sm:p-6 mt-6 lg:mt-0">
                <Text variant="h2" className="mb-6 text-lg md:text-xl">
                  Documents
                </Text>
                <div className="space-y-6">
                  {/* Resume Section */}
                  <div>
                    <Text variant="h3" className="mb-4">
                      Resume
                    </Text>
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
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 gap-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-5 h-5 text-gray-500 group-hover:text-primary-500 transition-colors duration-200"
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
                          <a
                            href={resumePreview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded transition-colors duration-200"
                          >
                            {resumePreview.name}
                          </a>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setResumePreview(null)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter Section */}
                  <div>
                    <Text variant="h3" className="mb-4">
                      Cover Letter
                    </Text>
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
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 gap-2">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-5 h-5 text-gray-500 group-hover:text-primary-500 transition-colors duration-200"
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
                          <a
                            href={coverLetterPreview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded transition-colors duration-200"
                          >
                            {coverLetterPreview.name}
                          </a>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setCoverLetterPreview(null)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
