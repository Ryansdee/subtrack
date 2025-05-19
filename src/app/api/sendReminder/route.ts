// pages/api/sendReminder.ts

import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import nodemailer from "nodemailer";

export default async function handler(req: { method: string; body: { userId: any; userEmail: any; userName: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; end: { (): any; new(): any; }; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { userId, userEmail, userName } = req.body;

  if (!userId || !userEmail) {
    return res.status(400).json({ error: "Missing user data" });
  }

  try {
    const subsSnapshot = await getDocs(collection(db, "users", userId, "subscriptions"));
    let message = `Bonjour ${userName || "Utilisateur"},\n\nVoici un rappel de vos abonnements :\n\n`;

    subsSnapshot.forEach((doc) => {
      const sub = doc.data();
      message += `- Service : ${sub.name}\n  Prix : ${sub.price} €\n  Date de prélèvement : ${sub.billingDate}\n\n`;
    });

    // Configuration du transporteur SMTP (exemple Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Rappel de vos abonnements",
      text: message,
    });

    res.status(200).json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi du mail" });
  }
}
