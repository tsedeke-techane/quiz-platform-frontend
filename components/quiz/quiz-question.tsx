"use client"

import { Button } from "@/components/ui/button"
import MathRenderer from "@/components/ui/math-renderer"

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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
          <MathRenderer text={question.text} className="align-middle" />
        </h3>
        {question.mathText && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-center text-lg">
              <MathRenderer text={question.mathText} displayMode={true} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSelectAnswer(index)}
            variant={selectedAnswer === index ? "default" : "outline"}
            className="w-full justify-start text-left h-auto py-3 px-4 text-base md:text-lg"
          >
            <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
            <MathRenderer text={option} className="text-base md:text-lg" />
          </Button>
        ))}
      </div>
    </div>
  )
}
