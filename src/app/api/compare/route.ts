import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import admin from "@/lib/firebaseAdmin";

async function getUidFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split("Bearer ")[1];
  if (!token) return null;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Erreur de vérification du token Firebase :", error);
    return null;
  }
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const { prompt } = await req.json();

    let finalPrompt = prompt;
    if (!finalPrompt) {
      // si pas de prompt envoyé, on construit la question à partir des abonnements
      const subsSnapshot = await getDocs(collection(db, "users", uid, "subscriptions"));
      const subscriptions: string[] = subsSnapshot.docs.map(doc => doc.data().name);

      if (subscriptions.length === 0) {
        return NextResponse.json({ error: "Aucun abonnement trouvé." }, { status: 404 });
      }

      finalPrompt = `Voici mes abonnements : ${subscriptions.join(", ")}. Dis-moi lequel je peux annuler. Sois bref, clair, et explique pourquoi.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const suggestion = response.text();

    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("Erreur API Gemini :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
