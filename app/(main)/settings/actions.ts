// app/(main)/settings/actions.ts
"use server"

import { signOut } from "@/app/auth"
import { cookies } from "next/headers"

export async function handleSignOut() {
  const cookieStore = cookies()
  cookieStore.getAll().forEach(cookie => {
    cookieStore.delete(cookie.name)
  })

  await signOut({ 
    redirect: true,
    redirectTo: "/auth/signin"
  })
}