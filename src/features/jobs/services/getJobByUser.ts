import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getJobsByUser(userId: string) {
  const q = query(collection(db, "jobs"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
