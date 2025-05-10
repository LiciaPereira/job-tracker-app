import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { UTApi } from "uploadthing/server"; //

const utApi = new UTApi();

function extractFileKey(url: string): string | null {
  const match = url.match(/\/f\/(.+)$/);
  return match ? match[1] : null;
}

export async function deleteJobById(jobId: string) {
  const jobRef = doc(db, "jobs", jobId);
  const snapshot = await getDoc(jobRef);
  const jobData = snapshot.data();

  const fileKeysToDelete: string[] = [];

  if (jobData?.resume?.url) {
    const key = extractFileKey(jobData.resume.url);
    if (key) fileKeysToDelete.push(key);
  }

  if (jobData?.coverLetter?.url) {
    const key = extractFileKey(jobData.coverLetter.url);
    if (key) fileKeysToDelete.push(key);
  }

  if (fileKeysToDelete.length > 0) {
    try {
      await utApi.deleteFiles(fileKeysToDelete);
    } catch (error) {
      console.warn("Failed to delete files from UploadThing:", error);
    }
  }

  await deleteDoc(jobRef);
}
