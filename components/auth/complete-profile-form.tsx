// components/setup/setup-profile-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SchoolType } from "@prisma/client"
import { useSession } from "next-auth/react"
import { completeUserProfile } from "@/app/auth/complete-profile/actions"

interface School {
  id: string
  name: string
  type: SchoolType
}
  
export function CompleteProfileForm({ schools }: { schools: School[] }) {
  const router = useRouter();
  const { data: session, status, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSchoolType, setSelectedSchoolType] = useState<SchoolType | null>(null)
  const [formData, setFormData] = useState({
    studentNumber: "",
    schoolId: "",
    programName: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 根据类型过滤学校列表
  const filteredSchools = schools.filter(school => 
    selectedSchoolType ? school.type === selectedSchoolType : true
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await completeUserProfile(formData)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      if (status === "authenticated" && update) {
        await update()
      }
      
      router.push('/schedule')
      
    } catch (error) {
      setErrors({ 
        submit: error instanceof Error ? error.message : "Update failed" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Student Number <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={formData.studentNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Enter your student number"
        />
      </div>

      {/* School Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          School Type <span className="text-gray-400">(optional)</span>
        </label>
        <select
          value={selectedSchoolType || ""}
          onChange={(e) => {
            const value = e.target.value as SchoolType || null
            setSelectedSchoolType(value)
            setFormData(prev => ({ ...prev, schoolId: "" }))
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select type</option>
          <option value="University">University</option>
          <option value="College">College</option>
        </select>
      </div>

      {/* School Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          School <span className="text-gray-400">(optional)</span>
        </label>
        <select
          value={formData.schoolId}
          onChange={(e) => setFormData(prev => ({ ...prev, schoolId: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          disabled={!selectedSchoolType}
        >
          <option value="">Select school</option>
          {filteredSchools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
      </div>

      {/* Program Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Program Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={formData.programName}
          onChange={(e) => setFormData(prev => ({ ...prev, programName: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="E.g., Computer Science, Business"
        />
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="text-sm text-red-600">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-4">
        {/* Skip Button */}
        <button
          type="button"
          onClick={() => router.push('/schedule')}
          className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Skip for now
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  )
}