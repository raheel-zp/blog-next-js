import { Inter } from "next/font/google";
import './globals.css';

export const metadata = {
  title: 'Blog Explorer',
  description: 'A simple blog app built with Next.js 14 and TypeScript',
};

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>{children}</body>
    </html>
  );
}
