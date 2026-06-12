import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Fragrance Vault — Perfume Collection Tracker",
  description: "Track, rate, and analyze your perfume collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
