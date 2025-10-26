export const QUIZZES = [
  {
    id: "algebra",
    title: "Basic Algebra",
    description: "Test your algebra fundamentals with equations and expressions",
    icon: "🔢",
    timeLimit: 10,
    questions: [
      {
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 9", "x = 3", "x = 6"],
        correctAnswer: "x = 4",
      },
      {
        question: "Simplify: 3x^2 + 2x^2 - x",
        options: ["5x^2 - x", "5x - x", "6x^2", "4x^2"],
        correctAnswer: "5x^2 - x",
      },
      {
        question: "What is the value of (2 + 3)^2?",
        options: ["10", "25", "13", "20"],
        correctAnswer: "25",
      },
      {
        question: "Solve: x/3 = 7",
        options: ["x = 21", "x = 10", "x = 7/3", "x = 3/7"],
        correctAnswer: "x = 21",
      },
      {
        question: "Factor: x^2 + 5x + 6",
        options: ["(x+2)(x+3)", "(x+1)(x+6)", "(x+2)(x+2)", "(x+3)(x+3)"],
        correctAnswer: "(x+2)(x+3)",
      },
    ],
  },
  {
    id: "fractions",
    title: "Fractions & Decimals",
    description: "Master fractions, decimals, and their conversions",
    icon: "📊",
    timeLimit: 10,
    questions: [
      {
        question: "What is 1/2 + 1/4?",
        options: ["3/4", "1/6", "2/6", "1/2"],
        correctAnswer: "3/4",
      },
      {
        question: "Convert 0.75 to a fraction",
        options: ["3/4", "1/2", "2/3", "4/5"],
        correctAnswer: "3/4",
      },
      {
        question: "What is 2/3 × 3/4?",
        options: ["1/2", "6/12", "5/7", "2/4"],
        correctAnswer: "1/2",
      },
      {
        question: "Divide: 5/6 ÷ 2/3",
        options: ["5/4", "10/18", "3/2", "1/2"],
        correctAnswer: "5/4",
      },
      {
        question: "What is 0.5 + 0.25?",
        options: ["0.75", "0.25", "1.0", "0.30"],
        correctAnswer: "0.75",
      },
    ],
  },
  {
    id: "calculus",
    title: "Calculus Basics",
    description: "Introduction to derivatives and limits",
    icon: "📈",
    timeLimit: 10,
    questions: [
      {
        question: "What is the derivative of x^2?",
        options: ["2x", "x", "2", "x^3"],
        correctAnswer: "2x",
      },
      {
        question: "Find the derivative of 3x^3 + 2x",
        options: ["9x^2 + 2", "3x^2 + 2", "9x + 2", "6x^2"],
        correctAnswer: "9x^2 + 2",
      },
      {
        question: "What is the limit of 1/x as x approaches infinity?",
        options: ["0", "1", "infinity", "undefined"],
        correctAnswer: "0",
      },
      {
        question: "Find the derivative of sin(x)",
        options: ["cos(x)", "-cos(x)", "sin(x)", "tan(x)"],
        correctAnswer: "cos(x)",
      },
      {
        question: "What is the integral of 2x?",
        options: ["x^2 + C", "2 + C", "x + C", "2x^2 + C"],
        correctAnswer: "x^2 + C",
      },
    ],
  },
]
