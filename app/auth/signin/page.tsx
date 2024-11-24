// app/auth/signin/page.tsx
import Image from "next/image"
import { SignInButton } from "@/components/auth/signin-button"
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils/auth.helper";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/settings');
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5FBFF]">
      <div className="w-full max-w-md px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="TaskMaster"
              width={100}
              height={100}
              className="mx-auto"
            />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome to TaskMaster</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in with your university account to get started
            </p>
          </div>

          {/* Sign in button */}
          <SignInButton />

          {/* Terms */}
          <p className="mt-8 text-xs text-center text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}