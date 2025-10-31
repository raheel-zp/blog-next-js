'use client';
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
