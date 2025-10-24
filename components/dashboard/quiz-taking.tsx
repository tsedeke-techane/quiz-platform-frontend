"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuizQuestion from "../quiz/quiz-question"
import { QUIZZES } from "@/lib/quiz-data"

interface QuizTakingProps {
  quizId: string
  onComplete: (results: any) => void
  onBack: () => void
}

export default function QuizTaking({ quizId, onComplete, onBack }: QuizTakingProps) {
  const quiz = QUIZZES.find((q) => q.id === quizId)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(300)
  const [isComplete, setIsComplete] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([])
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (quiz) {
      const shuffled = [...quiz.questions]
        .map((q) => {
          const optionsWithIndices = q.options.map((opt, idx) => ({ opt, idx }))
          const shuffledOptions = optionsWithIndices.sort(() => Math.random() - 0.5)

          return {
            ...q,
            options: shuffledOptions.map((o) => o.opt),
            originalCorrectIndex: shuffledOptions.findIndex((o) => o.opt === q.correctAnswer),
          }
        })
        .sort(() => Math.random() - 0.5)

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

  useEffect(() => {
    if (isComplete && shuffledQuestions.length > 0) {
      const score = Object.entries(answers).filter(
        ([index, answerIndex]) =>
          shuffledQuestions[Number.parseInt(index)].options[answerIndex] ===
          shuffledQuestions[Number.parseInt(index)].correctAnswer,
      ).length

      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      onComplete({
        quizTitle: quiz?.title,
        score,
        totalQuestions: shuffledQuestions.length,
        timeSpent,
      })
    }
  }, [isComplete, shuffledQuestions, answers, onComplete, quiz?.title, startTime])

  if (!quiz || shuffledQuestions.length === 0) {
    return <div>Loading...</div>
  }

  if (isComplete) {
    return null
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const transformedQuestion = {
    id: currentQuestionIndex,
    text: currentQuestion.question,
    options: currentQuestion.options,
    correctAnswer: currentQuestion.originalCorrectIndex,
  }

  const handleAnswer = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answerIndex,
    })
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
