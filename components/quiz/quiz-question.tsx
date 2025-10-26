"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Question {
  id: number
  text: string
  mathText?: string
  options: string[]
  correctAnswer?: number
}

interface QuizQuestionProps {
  question: Question
  selectedAnswer?: number
  onSelectAnswer: (answerIndex: number) => void
}

export default function QuizQuestion({ question, selectedAnswer, onSelectAnswer }: QuizQuestionProps) {
  useEffect(() => {
    // Load KaTeX
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js"
    script.async = true
    document.head.appendChild(script)

    const linkRel = document.createElement("link")
    linkRel.rel = "stylesheet"
    linkRel.href = "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css"
    document.head.appendChild(linkRel)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(linkRel)
    }
  }, [])

  useEffect(() => {
    if (window.katex) {
      const elements = document.querySelectorAll(".math-content")
      elements.forEach((el) => {
        try {
          window.katex.render(el.textContent || "", el, {
            throwOnError: false,
          })
        } catch (e) {
          console.error("KaTeX rendering error:", e)
        }
      })
    }
  }, [question])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">{question.text}</h3>
        {question.mathText && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="math-content text-center text-lg">{question.mathText}</div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSelectAnswer(index)}
            variant={selectedAnswer === index ? "default" : "outline"}
            className="w-full justify-start text-left h-auto py-3 px-4"
          >
            <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
            <span>{option}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
