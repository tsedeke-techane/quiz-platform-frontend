"use client"

import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onGetStarted: () => void
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-balance">Master Your Math Skills</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 text-balance">
            Interactive quizzes designed to help you excel in mathematics. Learn, practice, and improve your scores.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Quizzes</h3>
            <p className="text-gray-600">Multiple categories covering algebra, calculus, and more.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Timed Challenges</h3>
            <p className="text-gray-600">Test your speed and accuracy with time-limited quizzes.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement with detailed quiz history.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
