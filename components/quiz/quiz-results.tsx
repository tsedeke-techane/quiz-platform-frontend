"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuizResultsProps {
  results: {
    quizTitle: string
    score: number
    totalQuestions: number
    timeSpent?: number
  }
  onBack: () => void
}

export default function QuizResults({ results, onBack }: QuizResultsProps) {
  const percentage = Math.round((results.score / results.totalQuestions) * 100)
  const isPassed = percentage >= 60

  const getResultMessage = () => {
    if (percentage === 100) return "Perfect Score! 🎉"
    if (percentage >= 80) return "Excellent Work! 🌟"
    if (percentage >= 60) return "Good Job! 👍"
    return "Keep Practicing! 💪"
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return "N/A"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{results.quizTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
            <p className="text-xl font-semibold text-gray-700">
              {results.score} out of {results.totalQuestions} correct
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-blue-900">{getResultMessage()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Correct Answers:</span>
              <span className="font-semibold text-green-600">{results.score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Incorrect Answers:</span>
              <span className="font-semibold text-red-600">{results.totalQuestions - results.score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Spent:</span>
              <span className="font-semibold">{formatTime(results.timeSpent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-semibold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                {isPassed ? "Passed" : "Failed"}
              </span>
            </div>
          </div>

          <Button onClick={onBack} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
