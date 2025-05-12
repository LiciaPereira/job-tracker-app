import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

//reminder type for job follow-ups
export interface Reminder {
  id: string;
  jobId: string;
  userId: string;
  type: "followUp";
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  title?: string;
  company?: string;
}

//create a new reminder for a job
export async function createReminder(
  reminder: Omit<Reminder, "id" | "createdAt">
) {
  return addDoc(collection(db, "reminders"), {
    ...reminder,
    createdAt: Timestamp.now(),
    dueDate: Timestamp.fromDate(reminder.dueDate),
  });
}

//get all active reminders for a user
export async function getActiveReminders(userId: string): Promise<Reminder[]> {
  const q = query(
    collection(db, "reminders"),
    where("userId", "==", userId),
    where("completed", "==", false)
  );

  const snapshot = await getDocs(q);

  const reminders = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const raw = docSnap.data();

      const reminder: Reminder = {
        id: docSnap.id,
        jobId: raw.jobId,
        userId: raw.userId,
        type: raw.type,
        completed: raw.completed,
        dueDate: raw.dueDate.toDate(),
        createdAt: raw.createdAt.toDate(),
      };

      // enrich with job info
      try {
        const jobSnap = await getDoc(doc(db, "jobs", reminder.jobId));
        if (jobSnap.exists()) {
          const jobData = jobSnap.data();
          reminder.title = jobData.title || "";
          reminder.company = jobData.company || "";
        }
      } catch (err) {
        console.warn(`Failed to enrich reminder ${reminder.id}:`, err);
      }

      return reminder;
    })
  );

  return reminders;
}

//mark a reminder as completed
export async function completeReminder(reminderId: string) {
  const ref = doc(db, "reminders", reminderId);
  await updateDoc(ref, { completed: true });
}

export async function updateReminder(
  reminderId: string,
  updates: Partial<Reminder>
) {
  const ref = doc(db, "reminders", reminderId);
  return updateDoc(ref, {
    ...updates,
    dueDate: updates.dueDate ? Timestamp.fromDate(updates.dueDate) : undefined,
  });
}

export async function deleteReminder(reminderId: string) {
  const ref = doc(db, "reminders", reminderId);
  return deleteDoc(ref);
}
