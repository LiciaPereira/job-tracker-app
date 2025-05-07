import { db } from "../../../lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

//get a job by ID
export async function getJobById(jobId: string) {
  const ref = doc(db, "jobs", jobId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Job not found");
  return { id: snap.id, ...snap.data() };
}

//delete job by ID
export async function deleteJobById(jobId: string) {
  const ref = doc(db, "jobs", jobId);
  await deleteDoc(ref);
}
