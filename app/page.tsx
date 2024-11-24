// app/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// 引导页内容
const onboardingSlides = [
  {
    id: 1,
    title: "TaskMaster",
    description: "Effortlessly manage your academic tasks",
    image: "/illustrations/team.svg"
  },
  {
    id: 2,
    title: "Stay Organized",
    description: "Keep track of all your assignments and deadlines",
    image: "/illustrations/calendar.svg"
  },
  {
    id: 3,
    title: "Never Miss a Task",
    description: "Get reminders for upcoming assignments",
    image: "/illustrations/notification.svg"
  }
]

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(curr => curr + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1)
    }
  }

  const handleGetStarted = () => {
    
    router.push('/schedule')
  }

  const slide = onboardingSlides[currentSlide]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Top bar with skip button */}
      {currentSlide < onboardingSlides.length - 1 && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setCurrentSlide(onboardingSlides.length - 1)}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            Skip
          </button>
        </div>
      )}

      <div className="w-full max-w-md space-y-8">
        {/* Illustration */}
        <div className="relative w-full h-64 mb-8">
          <Image
            src={slide.image}
            alt="Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {slide.title}
          </h1>
          <p className="text-lg text-gray-600">
            {slide.description}
          </p>
          
          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 py-4">
            {onboardingSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="space-y-4">
            {currentSlide === onboardingSlides.length - 1 ? (
              <button
                onClick={handleGetStarted}
                className="w-full px-6 py-3 text-base font-medium text-white bg-teal-500 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Get Started
              </button>
            ) : (
              <div className="flex gap-4">
                {currentSlide > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 px-6 py-3 text-base font-medium text-teal-600 bg-white border border-teal-500 rounded-full hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 text-base font-medium text-white bg-teal-500 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}