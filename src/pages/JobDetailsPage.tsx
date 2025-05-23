import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { onSnapshot, doc } from "firebase/firestore";
import * as yup from "yup";
import { deleteJobById, updateJob } from "../features/jobs/services/jobService";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
import { useBlocker } from "../hooks/useBlocker";
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
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from "../features/jobs/services/reminderService";
import { addDays } from "date-fns";
import { db } from "../lib/firebase";

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
  reminderId?: string;
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
  const formRef = useRef<HTMLFormElement>(null);
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

  //reminders
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDays, setReminderDays] = useState(3);
  const initialReminderDays = useRef(reminderDays);
  const initialReminderEnabled = useRef(false);
  const isReminderDaysChanged = reminderDays !== initialReminderDays.current;
  const isreminderChanged = reminderEnabled !== initialReminderEnabled.current;

  // fetch job details
  useEffect(() => {
    if (!user || !jobId) return;

    const jobRef = doc(db, "jobs", jobId);
    const unsubscribeJob = onSnapshot(jobRef, (docSnap) => {
      if (!docSnap.exists()) {
        setAlert({ type: "error", message: "Job not found" });
        setLoading(false);
        return;
      }

      const data = docSnap.data();

      setJob({ id: docSnap.id, ...(data as Omit<Job, "id">) });
      reset({
        company: data.company,
        title: data.title,
        status: data.status,
        notes: data.notes || "",
        resumeUrl: data.resume?.url || "",
        coverLetterUrl: data.coverLetter?.url || "",
      });

      const reminderExists = !!data.reminderId;
      setReminderEnabled(reminderExists);
      initialReminderEnabled.current = reminderExists;

      setResumeUrl(data.resume?.url || null);
      setResumeName(data.resume?.name || null);
      setCoverLetterUrl(data.coverLetter?.url || null);
      setCoverLetterName(data.coverLetter?.name || null);
      setLoading(false);
    });

    return () => unsubscribeJob();
  }, [user, jobId, reset]);

  useEffect(() => {
    if (!job?.reminderId) return;

    const reminderRef = doc(db, "reminders", job.reminderId);
    const unsubscribeReminder = onSnapshot(reminderRef, (docSnap) => {
      if (docSnap.exists()) {
        const reminderData = docSnap.data();
        const dueDate = reminderData.dueDate.toDate();
        const isCompleted = reminderData.completed;

        if (isCompleted) {
          setReminderEnabled(false); //disable the switch if reminder is complete
          return;
        }
        const daysDiff = Math.round(
          (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) //add a race condition guard
        );
        setReminderDays(daysDiff);
        initialReminderDays.current = daysDiff;
      }
    });

    return () => unsubscribeReminder();
  }, [job?.reminderId]);

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

      const updates = {
        company: data.company,
        title: data.title,
        status: data.status,
        notes: data.notes,
        resumeUrl: uploadedResumeUrl ?? resumeUrl ?? null,
        resumeName: resumeName ?? null,
        coverLetterUrl: uploadedCoverLetterUrl ?? coverLetterUrl ?? null,
        coverLetterName: coverLetterName ?? null,
      };

      // base update
      await updateJob(jobId, user.uid, updates);

      //reminder sync logic
      if (reminderEnabled) {
        if (job?.reminderId) {
          //just update the existing reminder
          await updateReminder(job.reminderId, {
            dueDate: addDays(new Date(), reminderDays),
            completed: false,
          });
        } else {
          //create a new reminder and attach to the job
          const reminderRef = await createReminder({
            jobId,
            userId: user.uid,
            type: "followUp",
            dueDate: addDays(new Date(), reminderDays),
            completed: false,
          });
          await updateJob(jobId, user.uid, { reminderId: reminderRef.id });
        }
      } else if (job?.reminderId) {
        //disable reminder (delete it and unlink from job)
        await deleteReminder(job.reminderId);
        await updateJob(jobId, user.uid, { reminderId: null });
      }

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card elevated className="p-6 text-center">
          <Text variant="h1" className="mb-4">
            Job not found
          </Text>
          <Text variant="body" color="default" className="mb-6">
            This job posting may have been deleted or doesn't exist.
          </Text>
          <Button
            variant="primary"
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center"
            icon={
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            }
          >
            Return to job list
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {" "}
      <PageHeader
        title="Job Details"
        description={job?.company ? `${job.company} - ${job.title}` : undefined}
        backPath="/jobs"
        actions={
          <>
            {(isDirty ||
              isResumeChanged ||
              isCoverLetterChanged ||
              isreminderChanged ||
              isReminderDaysChanged) && (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                onClick={() => formRef.current?.requestSubmit()}
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
                aria-label="Save changes"
              />
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              }
              aria-label="Delete job"
            />
          </>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6">
            <Text variant="body" className="text-gray-600 dark:text-gray-400">
              Manage your application details and documents
            </Text>
          </div>

          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <form ref={formRef} onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column - Job Details */}
              <Card elevated className="p-4 xs:p-5 sm:p-6">
                <Text variant="h2" className="mb-6 text-lg md:text-xl">
                  Job Information
                </Text>
                <div className="space-y-4">
                  <Input
                    label="Job Title"
                    {...register("title")}
                    error={errors.title?.message}
                    placeholder="Enter job title"
                    required
                  />
                  <Input
                    label="Company"
                    {...register("company")}
                    error={errors.company?.message}
                    placeholder="Enter company name"
                    required
                  />
                  <Select
                    label="Application Status"
                    options={statusOptions}
                    {...register("status")}
                    error={errors.status?.message}
                    required
                  />
                  <SwitchWithDays
                    checked={reminderEnabled}
                    onToggle={() => setReminderEnabled(!reminderEnabled)}
                    days={reminderDays}
                    onDaysChange={setReminderDays}
                  />
                  <TextArea
                    label="Notes"
                    rows={4}
                    {...register("notes")}
                    helperText="Add any important details about interviews, contacts, or follow-ups"
                  />
                </div>
              </Card>

              {/* Right Column - Documents */}
              <Card elevated className="p-4 xs:p-5 sm:p-6 mt-6 lg:mt-0">
                <Text variant="h2" className="mb-6 text-lg md:text-xl">
                  Application Documents
                </Text>
                <div className="space-y-6">
                  {/* Resume Section */}
                  <div>
                    <Text variant="h3" className="mb-4">
                      Resume
                    </Text>
                    {resumeUrl ? (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 gap-2">
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
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded transition-colors duration-200"
                          >
                            {resumeName || "View Resume"}
                          </a>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setResumeUrl(null);
                            setResumeName(null);
                            setIsResumeChanged(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null}
                    <Dropzone
                      ref={resumeRef}
                      endpoint="resumeUploader"
                      label="Upload a new resume (PDF)"
                      variant="default"
                      onFileSelected={() => setIsResumeChanged(true)}
                      onUploadComplete={(url, name) => {
                        setResumeUrl(url);
                        setResumeName(name);
                        setIsResumeChanged(true);
                      }}
                    />
                  </div>

                  {/* Cover Letter Section */}
                  <div>
                    <Text variant="h3" className="mb-4">
                      Cover Letter
                    </Text>
                    {coverLetterUrl ? (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 gap-2">
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
                            href={coverLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded transition-colors duration-200"
                          >
                            {coverLetterName || "View Cover Letter"}
                          </a>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setCoverLetterUrl(null);
                            setCoverLetterName(null);
                            setIsCoverLetterChanged(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null}
                    <Dropzone
                      ref={coverLetterRef}
                      endpoint="coverLetterUploader"
                      label="Upload a new cover letter (PDF)"
                      variant="default"
                      onFileSelected={() => setIsCoverLetterChanged(true)}
                      onUploadComplete={(url, name) => {
                        setCoverLetterUrl(url);
                        setCoverLetterName(name);
                        setIsCoverLetterChanged(true);
                      }}
                    />
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
