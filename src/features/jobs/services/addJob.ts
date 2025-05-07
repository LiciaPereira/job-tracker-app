import { db } from "../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { createReminder } from "./reminderService";
import { addDays } from "date-fns";

interface JobData {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date;
  notes?: string;
}

export async function addJob(userId: string, job: JobData) {
  const jobDoc = await addDoc(collection(db, "jobs"), {
    ...job,
    userId,
    appliedAt: job.appliedAt
      ? Timestamp.fromDate(new Date(job.appliedAt))
      : null,
    createdAt: Timestamp.now(),
  });

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
