"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuizQuestion from "./quiz-question"
import QuizResults from "./quiz-results"
import { QUIZZES } from "@/lib/quiz-data"

interface QuizTakerProps {
  quizId: string
  onComplete: () => void
}

export default function QuizTaker({ quizId, onComplete }: QuizTakerProps) {
  const quiz = QUIZZES.find((q) => q.id === quizId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isComplete, setIsComplete] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<(typeof quiz)["questions"]>([])

  useEffect(() => {
    if (quiz) {
      // Shuffle questions
      const shuffled = [...quiz.questions].sort(() => Math.random() - 0.5)
      setShuffledQuestions(shuffled)
    }
  }, [quiz])

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsComplete(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  if (!quiz || shuffledQuestions.length === 0) {
    return <div>Loading...</div>
  }

  if (isComplete) {
    const score = Object.entries(answers).filter(
      ([index, answerIndex]) => shuffledQuestions[Number.parseInt(index)].correctAnswer === answerIndex,
    ).length

    return (
      <QuizResults
        quizTitle={quiz.title}
        score={score}
        totalQuestions={shuffledQuestions.length}
        onComplete={onComplete}
      />
    )
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const transformedQuestion = {
    id: currentQuestionIndex,
    text: currentQuestion.question,
    options: currentQuestion.options,
    correctAnswer: currentQuestion.options.indexOf(currentQuestion.correctAnswer),
  }

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : ""}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <QuizQuestion
            question={transformedQuestion}
            selectedAnswer={answers[currentQuestionIndex]}
            onSelectAnswer={handleAnswer}
          />

          <div className="flex gap-4 mt-8">
            <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
              Previous
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {currentQuestionIndex === shuffledQuestions.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
