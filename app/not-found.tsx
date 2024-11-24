'use client'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 bg-[#c2f6f6]">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-16 rounded-full bg-white p-3 shadow-sm">
            <Image
              src="/logo.png"
              alt="TaskMaster Logo"
              width={100}
              height={100}
              className="h-full w-full"
            />
          </div>
          <h1 className="text-center text-2xl font-semibold text-gray-900">
            TaskMaster
          </h1>
          <p className="text-center text-gray-600">
          Oopsie! This feature is still baking in the oven, but it'll be ready to play with you soon! 🍰✨
          </p>
          <Link href="/schedule" className="w-full">
            <Button
              className="w-full bg-[#5DCFB1] hover:bg-[#4BB89D]"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}