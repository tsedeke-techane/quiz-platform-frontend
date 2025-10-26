"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMyAttempts } from "@/lib/api"

interface QuizHistoryProps {
  onBack: () => void
}

export default function QuizHistory({ onBack }: QuizHistoryProps) {
  const [historyData, setHistoryData] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("authToken") || ""
    if (!token) return
    getMyAttempts(token)
      .then((data) => {
        const formatted = data.map((a) => ({
          id: a.id,
          quizTitle: a.quizTitle,
          score: a.score,
          totalQuestions: a.totalQuestions,
          date: a.createdAt,
          time: `${Math.floor((a.timeSpent || 0) / 60)}:${((a.timeSpent || 0) % 60)
            .toString()
            .padStart(2, "0")}`,
        }))
        setHistoryData(formatted)
      })
      .catch(() => setHistoryData([]))
  }, [])

  const calculatePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Back
      </Button>

      <div>
        <h2 className="text-2xl font-bold mb-2">Quiz History</h2>
        <p className="text-muted-foreground">View your past quiz attempts and scores</p>
      </div>

      <div className="grid gap-4">
        {historyData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No quiz attempts yet. Start taking quizzes to build your history!
          </p>
        ) : (
          historyData.map((attempt) => {
            const percentage = calculatePercentage(attempt.score, attempt.totalQuestions)
            return (
              <Card key={attempt.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{attempt.quizTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(attempt.date).toLocaleDateString()} at {new Date(attempt.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</div>
                      <p className="text-sm text-muted-foreground">
                        {attempt.score}/{attempt.totalQuestions} correct
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Time: {attempt.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
