import { db } from "../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface JobData {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date; // Optional and matches FormValues
  notes?: string; // Optional and matches FormValues
}

export async function addJob(userId: string, job: JobData) {
  return addDoc(collection(db, "jobs"), {
    ...job,
    userId,
    appliedAt: job.appliedAt
      ? Timestamp.fromDate(new Date(job.appliedAt))
      : null,
    createdAt: Timestamp.now(),
  });
}
