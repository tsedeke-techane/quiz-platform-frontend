"use client"

import { useEffect, useState } from "react"
import HeroSection from "@/components/hero-section"
import LoginPage from "@/components/auth/login-page"
import SignupPage from "@/components/auth/signup-page"
import Dashboard from "@/components/dashboard/dashboard"
import { login as apiLogin, signup as apiSignup, getCurrentUser } from "@/lib/api"


export default function Home() {
  const [currentPage, setCurrentPage] = useState<"hero" | "login" | "signup" | "dashboard">("hero")
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)

  // Rehydrate auth on load using token (preferred) or cached user
  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (token) {
        getCurrentUser(token)
          .then((u) => {
            setUser(u)
            localStorage.setItem("currentUser", JSON.stringify(u))
            setCurrentPage("dashboard")
          })
          .catch(() => {
            // token invalid; clear and stay on hero/login
            localStorage.removeItem("authToken")
            localStorage.removeItem("currentUser")
          })
        return
      }
      const cached = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null
      if (cached) {
        const u = JSON.parse(cached)
        setUser(u)
        setCurrentPage("dashboard")
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    const { user, token } = await apiLogin(email, password)
    setUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
    localStorage.setItem("authToken", token)
    setCurrentPage("dashboard")
  }

  const handleSignup = async (email: string, name: string, password: string) => {
    const { user, token } = await apiSignup(name, email, password)
    setUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
    localStorage.setItem("authToken", token)
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("hero")
  }

  if (currentPage === "hero") {
    return <HeroSection onGetStarted={() => setCurrentPage("login")} />
  }

  if (!user) {
    return (
      <>
        {currentPage === "login" && (
          <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage("signup")} />
        )}
        {currentPage === "signup" && (
          <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage("login")} />
        )}
      </>
    )
  }

  return <Dashboard />
}
