import type { Metadata } from "next";
import "./globals.css";
import "../styles/fonts.css"; 

import { Header, Footer } from "@/components/layout";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PremiumPopupWrapper from "@/components/PremiumPopupWrapper";

export const metadata: Metadata = {
  title: "VSMI - Chứng khoán",
  description: "Thông tin thị trường chứng khoán Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/fonts/stylesheet.css" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <ProtectedRoute>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <PremiumPopupWrapper delay={3000} showOnce={true} />
          </ProtectedRoute>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
