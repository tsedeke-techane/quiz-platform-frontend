"use client"
import { QUIZZES } from "@/lib/quiz-data"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock } from "lucide-react"

interface QuizSelectionProps {
  onSelectQuiz: (quizId: string) => void
  onBack: () => void
}

export default function QuizSelection({ onSelectQuiz, onBack }: QuizSelectionProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="text-blue-600 hover:text-blue-800 hover:underline mb-6 flex items-center gap-2 font-medium"
      >
        ← Back to Home
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Quizzes</h2>
        <p className="text-gray-600">Select a quiz to get started</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZZES.map((quiz) => (
          <div
            key={quiz.id}
            className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Icon */}
            <div className="text-5xl mb-4">{quiz.icon}</div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 flex-grow">{quiz.description}</p>

            {/* Info - Questions and Time */}
            <div className="flex items-center justify-between mb-6 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{quiz.questions.length} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{quiz.timeLimit} min</span>
              </div>
            </div>

            <Button
              onClick={() => onSelectQuiz(quiz.id)}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Start Quiz
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
