import { NextApiRequest, NextApiResponse } from "next";
import { TextServiceClient } from "@google-ai/generativelanguage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Requête reçue !");
  console.log("Clé API:", process.env.GOOGLE_API_KEY ? "OK" : "Manquante");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subscriptions } = req.body;
  if (!subscriptions || !Array.isArray(subscriptions)) {
    return res.status(400).json({ error: "Invalid subscriptions data" });
  }

  try {
    const client = new TextServiceClient({
      apiKey: process.env.GOOGLE_API_KEY || "",
    });

    const prompt = `Voici mes abonnements : ${subscriptions.join(", ")}. Donne-moi une suggestion pour optimiser mes abonnements.`;

    const [response] = await client.generateText({
      model: "models/chat-bison-001",
      prompt: { text: prompt },
    });

    console.log("Réponse IA reçue:", response);

    const suggestion = response?.candidates?.[0]?.output || "Pas de suggestion disponible.";

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Erreur API IA :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
