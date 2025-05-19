// src/app/api/verify-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "Missing UID" }, { status: 400 });
    }

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = docSnap.data();
    const role = data.role;

    const isSubscribed = role === "member" || role === "VIP";

    return NextResponse.json({ isSubscribed });
  } catch (err) {
    console.error("verify-subscription error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
