import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const { user } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());

    // Sync with Firebase if user is logged in
    if (user) {
      const userRef = doc(db, "users", user.uid);
      updateDoc(userRef, { darkMode }).catch(console.error);
    }
  }, [darkMode, user]);

  return { darkMode, setDarkMode };
};
