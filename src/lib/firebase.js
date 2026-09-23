import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA9dpRnJDgTH5mj_CSMISDec-IcRqnSUo0",
  authDomain: "roommate-finder-6bf02.firebaseapp.com",
  projectId: "roommate-finder-6bf02",
  storageBucket: "roommate-finder-6bf02.firebasestorage.app",
  messagingSenderId: "765546672358",
  appId: "1:765546672358:web:7dead985d4953894e78b27",
  measurementId: "G-4NEN1JKXLS",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const rtdb = getDatabase(
  app,
  "https://roommate-finder-6bf02-default-rtdb.asia-southeast1.firebasedatabase.app"
);