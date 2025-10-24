"use client"

import { useState } from "react"


export default function Home() {
  const [currentPage, setCurrentPage] = useState<"hero" | "login" | "signup" | "dashboard">("hero")
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)

  const handleLogin = (email: string) => {
    setUser({
      id: "1",
      name: email.split("@")[0],
      email: email,
    })
    setCurrentPage("dashboard")
  }

  const handleSignup = (email: string, name: string) => {
    setUser({
      id: "1",
      name: name,
      email: email,
    })
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

  return <Dashboard user={user} onLogout={handleLogout} />
}
