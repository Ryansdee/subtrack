// lib/subscriptions.ts
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function addSubscription(uid: string, data: any) {
  const ref = collection(db, "users", uid, "subscriptions");
  const doc = await addDoc(ref, data);
  return doc.id;
}
export async function getUserSubscriptions(uid: string) {
  const ref = collection(db, "users", uid, "subscriptions");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
