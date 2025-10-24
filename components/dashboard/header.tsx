"use client"
import { LogOut } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  user: any
  onLogout: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const firstName = user?.name?.split(" ")[0] || "Tsedeke"
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">📐 MathQuiz</h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Hi, {firstName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  onLogout()
                  setShowDropdown(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
