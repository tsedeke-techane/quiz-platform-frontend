"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import QuizQuestion from "./quiz-question"
import QuizResults from "./quiz-results"
import { startAttempt, submitAttempt } from "@/lib/api"

interface QuizTakerProps {
  quizId: string
  onComplete: () => void
}

export default function QuizTaker({ quizId, onComplete }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(300)
  const [isComplete, setIsComplete] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; totalQuestions: number; timeSpent: number } | null>(null)
  const [questions, setQuestions] = useState<Array<{ id: string; question: string; options: string[] }>>([])
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [quizTitle, setQuizTitle] = useState<string>("Quiz")
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const token = localStorage.getItem("authToken") || ""
    startAttempt(quizId, token)
      .then((data) => {
        setAttemptId(data.attemptId)
        setTimeLeft(data.timeLimit || 300)
        setQuestions(data.questions)
      })
      .catch(() => {
        // fallback: mark complete to avoid stuck state and call onComplete
        setIsComplete(true)
      })
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    fetch(`${API_BASE}/api/quizzes/${quizId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((q) => q && setQuizTitle(q.title))
      .catch(() => {})
  }, [quizId])

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsComplete(true)
      return
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // When completed, submit answers once and store result
  useEffect(() => {
    if (!isComplete || submitted || !attemptId || questions.length === 0) return
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const token = localStorage.getItem("authToken") || ""
    const answerArray = Object.entries(answers).map(([idx, selected]) => ({
      questionId: questions[Number(idx)].id,
      selectedAnswerIndex: Number(selected),
    }))
    submitAttempt(attemptId, answerArray, token, timeSpent)
      .then((r) => {
        setResult({ score: r.score, totalQuestions: r.totalQuestions, timeSpent })
        setSubmitted(true)
      })
      .catch(() => {
        setResult({ score: 0, totalQuestions: questions.length, timeSpent })
        setSubmitted(true)
      })
  }, [isComplete, submitted, attemptId, questions, answers, startTime])

  if (isComplete) {
    if (!submitted || !result) return <div>Submitting results...</div>
    return <QuizResults results={{ quizTitle, score: result.score, totalQuestions: result.totalQuestions, timeSpent: result.timeSpent }} onBack={onComplete} />
  }

  if (questions.length === 0) {
    return <div>Loading...</div>
  }

  const currentQuestion = questions[currentQuestionIndex]
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const transformedQuestion = {
    id: currentQuestionIndex,
    text: currentQuestion.question,
    options: currentQuestion.options,
  }

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
          <CardTitle>{quizTitle}</CardTitle>
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
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
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
              {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
