// src/lib/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6strQM6NVPSveDf90nsAw1xqiFrbCNkY",
  authDomain: "subtrack-2fe6f.firebaseapp.com",
  projectId: "subtrack-2fe6f",
  storageBucket: "subtrack-2fe6f.firebasestorage.app",
  messagingSenderId: "68638166803",
  appId: "1:68638166803:web:d821838c4375f37e3214e6",
  measurementId: "G-0ZZDVMEPR8"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

async function createUserInFirestore(uid: string, email: string, role = "member") {
  await setDoc(doc(db, "users", uid), {
    email,
    role,
    createdAt: new Date(),
  });
}

export { auth, db, createUserInFirestore, firebaseConfig, getAuth };
