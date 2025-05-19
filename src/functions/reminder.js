const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const serviceAccount = require("./serviceAccountKey.json"); // ta clé Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ryan.deschuyteneer@gmail.com",
    pass: "Sarah22Ryan@@",
  },
});

async function sendReminders() {
  const now = new Date();
  const reminderDate = new Date(now);
  reminderDate.setDate(reminderDate.getDate() + 3);

  const day = reminderDate.getDate();
  const month = reminderDate.getMonth() + 1;

  const snapshot = await db.collectionGroup("subscriptions").get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.billingDate || !data.userEmail) continue;

    const billingDate = new Date(data.billingDate);
    if (billingDate.getDate() === day && billingDate.getMonth() + 1 === month) {
      await transporter.sendMail({
        from: '"Subtrack" <ton.email@gmail.com>',
        to: data.userEmail,
        subject: `Rappel : Votre abonnement ${data.name} sera prélevé bientôt`,
        text: `Bonjour, votre abonnement ${data.name} de ${data.price}€ sera prélevé le ${data.billingDate}.`,
      });
      console.log(`Mail envoyé à ${data.userEmail} pour ${data.name}`);
    }
  }
}

sendReminders().catch(console.error);
