import { db } from "../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { createReminder } from "./reminderService";
import { addDays } from "date-fns";

// Update JobData to include resume and coverLetter as objects with url and name
interface JobData {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date;
  notes?: string;
  resume?: { url: string; name: string } | null;
  coverLetter?: { url: string; name: string } | null;
}

export async function addJob(userId: string, job: JobData) {
  console.log("Saving job to Firestore with data:", {
    company: job.company,
    title: job.title,
    status: job.status,
    notes: job.notes ?? "",
    appliedAt: job.appliedAt
      ? Timestamp.fromDate(new Date(job.appliedAt))
      : null,
    createdAt: Timestamp.now(),
    userId,
    resume: job.resume ?? null,
    coverLetter: job.coverLetter ?? null,
  });

  const jobDoc = await addDoc(collection(db, "jobs"), {
    company: job.company,
    title: job.title,
    status: job.status,
    notes: job.notes ?? "",
    appliedAt: job.appliedAt
      ? Timestamp.fromDate(new Date(job.appliedAt))
      : null,
    createdAt: Timestamp.now(),
    userId,
    resume: job.resume ?? null,
    coverLetter: job.coverLetter ?? null,
  });

  console.log("Job successfully saved with ID:", jobDoc.id);

  if (job.status === "applied") {
    await createReminder({
      jobId: jobDoc.id,
      userId,
      type: "followUp",
      dueDate: addDays(new Date(), 3),
      completed: false,
    });
  }

  return jobDoc;
}
