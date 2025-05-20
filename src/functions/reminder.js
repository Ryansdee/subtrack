const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require('dotenv').config({ path: '.env.local' });


admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
});

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendTestEmail() {
  await transporter.sendMail({
    from: `"Subtrack" <${process.env.MAIL_USER}>`,
    to: process.env.TEST_EMAIL,
    subject: "✅ Test de l’envoi d’e-mail avec Nodemailer",
    text: "Ceci est un e-mail de test pour vérifier que tout fonctionne bien !",
  });

  console.log("✅ E-mail de test envoyé !");
}

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
        from: `"Subtrack" <${process.env.MAIL_USER}>`,
        to: data.userEmail,
        subject: `Rappel : Votre abonnement ${data.name} sera prélevé bientôt`,
        text: `Bonjour, votre abonnement ${data.name} de ${data.price}€ sera prélevé le ${data.billingDate}.`,
      });
      console.log(`Mail envoyé à ${data.userEmail} pour ${data.name}`);
    }
  }
}

sendReminders().catch(console.error);
sendTestEmail().catch(console.error);
