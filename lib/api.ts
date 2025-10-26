const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type User = { id: string; name: string; email: string }

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error("Signup failed")
  return (await res.json()) as { user: User; token: string }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error("Login failed")
  return (await res.json()) as { user: User; token: string }
}

export async function getQuizzes() {
  const res = await fetch(`${API_BASE}/api/quizzes`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch quizzes")
  return (await res.json()) as Array<{
    id: string
    title: string
    description?: string | null
    timeLimit: number
    questions: Array<{ id: string; question: string; options: string[]; correctAnswer: string }>
  }>
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch current user")
  return (await res.json()) as User
}

export async function startAttempt(quizId: string, token: string) {
  const res = await fetch(`${API_BASE}/api/attempts/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ quizId }),
  })
  if (!res.ok) throw new Error("Failed to start attempt")
  return (await res.json()) as { attemptId: string; timeLimit: number; questions: Array<{ id: string; question: string; options: string[] }> }
}

export async function submitAttempt(attemptId: string, answers: Array<{ questionId: string; selectedAnswerIndex: number }>, token: string, timeSpent?: number) {
  const res = await fetch(`${API_BASE}/api/attempts/${attemptId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answers, timeSpent }),
  })
  if (!res.ok) throw new Error("Failed to submit attempt")
  return (await res.json()) as { id: string; score: number; totalQuestions: number }
}

export async function getMyAttempts(token: string) {
  const res = await fetch(`${API_BASE}/api/attempts/user`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch attempts")
  return (await res.json()) as Array<{
    id: string
    quizTitle: string
    quizId: string
    score: number
    totalQuestions: number
    percentage: number
    timeSpent: number
    createdAt: string
  }>
}
