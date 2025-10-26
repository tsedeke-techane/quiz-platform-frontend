"use client"

import { useState, useEffect } from "react"
import QuizSelection from "./quiz-selection"
import QuizTaking from "./quiz-taking"
import QuizResults from "./quiz-results"
import QuizHistory from "./quiz-history"
import Header from "./header"

type Page = "home" | "quiz-selection" | "quiz-taking" | "results" | "history"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [lastResults, setLastResults] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId)
    setCurrentPage("quiz-taking")
  }

  const handleQuizComplete = (results: any) => {
    setLastResults(results)
    setCurrentPage("results")
  }

  const handleViewHistory = () => {
    setCurrentPage("history")
  }

  const handleBackHome = () => {
    setCurrentPage("home")
    setSelectedQuizId(null)
  }

  return (
    <div className="min-h-screen bg-muted-bg">
      <Header
        user={user}
        onLogout={() => {
          localStorage.removeItem("currentUser")
          localStorage.removeItem("authToken")
          window.location.reload()
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === "home" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to MathQuiz</h1>
              <p className="text-lg text-muted-foreground">Challenge yourself with our math quizzes</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentPage("quiz-selection")}
                className="card border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer text-left bg-white rounded-lg p-6"
              >
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Take a Quiz</h2>
                <p className="text-muted-foreground">Test your math knowledge with our interactive quizzes</p>
              </button>

              <button
                onClick={handleViewHistory}
                className="card border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer text-left bg-white rounded-lg p-6"
              >
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">View History</h2>
                <p className="text-muted-foreground">Check your past quiz attempts and scores</p>
              </button>
            </div>
          </div>
        )}

        {currentPage === "quiz-selection" && <QuizSelection onSelectQuiz={handleStartQuiz} onBack={handleBackHome} />}

        {currentPage === "quiz-taking" && selectedQuizId && (
          <QuizTaking quizId={selectedQuizId} onComplete={handleQuizComplete} onBack={handleBackHome} />
        )}

        {currentPage === "results" && lastResults && <QuizResults results={lastResults} onBack={handleBackHome} />}

        {currentPage === "history" && <QuizHistory onBack={handleBackHome} />}
      </main>
    </div>
  )
}
