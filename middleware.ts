// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    
    // 1. 只有落地页和登录页是公开的
    const isPublicPath = [
      '/auth/signin',
      '/'  // 落地页
    ].some(path => req.nextUrl.pathname === path);
    
    if (isPublicPath) {
      return NextResponse.next();
    }

    // 2. 未登录用户重定向到登录页
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // // 3. Profile 完整性检查
    // const isProfileIncomplete = !token.schoolId;
    // const isProfilePath = req.nextUrl.pathname === '/auth/complete-profile';
    
    // if (isProfileIncomplete && !isProfilePath) {
    //   return NextResponse.redirect(new URL('/auth/complete-profile', req.url));
    // }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
)

export const config = {
  matcher: [
    '/schedule/:path*',
    '/settings/:path*',
    '/assignments/:path*',
    '/timetable/:path*',
    '/auth/complete-profile',
    '/auth/signout',  // 添加 signout 路径到 matcher
  ]
}