import type { Metadata } from "next";

import "../globals.css";
import MobileLayout from "@/components/layouts/mobile-layout";
import { getCurrentUser } from "@/lib/utils/auth.helper";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/components/auth/auth-provider";
import ErrorBoundary from "@/components/error-boundary";
export const metadata: Metadata = {
  title: "TaskMaster",
  description: "Your personal academic task manager",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/signin')
  }
  
  return (
    <ErrorBoundary>
      <AuthProvider>  
        <MobileLayout>{children}</MobileLayout>
      </AuthProvider>
    </ErrorBoundary>
  );
}