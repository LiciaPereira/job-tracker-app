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
} from "firebase/firestore";

//reminder type for job follow-ups
export interface Reminder {
  id?: string;
  jobId: string;
  userId: string;
  type: "followUp";
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
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
export async function getActiveReminders(userId: string) {
  const q = query(
    collection(db, "reminders"),
    where("userId", "==", userId),
    where("completed", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate.toDate(),
    createdAt: doc.data().createdAt.toDate(),
  })) as Reminder[];
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
