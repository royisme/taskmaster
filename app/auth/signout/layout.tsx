// app/auth/signout/layout.tsx
"use client"
import { SessionProvider } from "next-auth/react"

export default function SignOutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}