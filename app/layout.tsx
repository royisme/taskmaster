import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import ErrorBoundary from '@/components/error-boundary';

export const metadata: Metadata = {
  title: "TaskMaster",
  description: "Your personal academic task manager",
};
const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
