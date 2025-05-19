
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

