// app/auth/complete-profile/page.tsx
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/utils/auth.helper"
import { CompleteProfileForm } from "@/components/auth/complete-profile-form"
import { prisma } from "@/lib/db"

export default async function CompleteProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }
// 直接检查 schoolId
  const userWithSchoolId = await prisma.user.findUnique({
    where: { id: user.id },
    select: { schoolId: true }
  })

  if (userWithSchoolId?.schoolId) {
    redirect('/schedule')
  }
  // 获取所有学校列表
  const schools = await prisma.school.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="bg-white shadow-sm rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Setup Your Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Add your academic information to get started
            </p>
          </div>

          <CompleteProfileForm schools={schools} />
        </div>
      </div>
    </div>
  )
}