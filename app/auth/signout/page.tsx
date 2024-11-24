// app/auth/signout/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export default function SignOutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const performSignOut = async () => {
      if (status === 'authenticated') {
        try {
          // 1. 清除 localStorage
          localStorage.clear()
          
          // 2. 清除所有 cookies
          const cookies = document.cookie.split(";")
          for (let cookie of cookies) {
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
          }

          // 3. 调用 Google 的登出
          const googleLogoutUrl = "https://www.google.com/accounts/Logout"
          const img = new Image()
          img.src = googleLogoutUrl

          // 4. 执行 NextAuth signOut
          await signOut({
            callbackUrl: '/auth/signin',
            redirect: false
          })

          // 5. 强制刷新页面
          window.location.href = '/auth/signin'
        } catch (error) {
          console.error('Sign out failed:', error)
          router.push('/auth/signin')
        }
      } else if (status === 'unauthenticated') {
        router.push('/auth/signin')
      }
    }

    performSignOut()
  }, [status, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className="ml-2">Signing out...</span>
    </div>
  )
}