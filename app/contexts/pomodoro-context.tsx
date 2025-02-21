"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSettingsContext } from "./settings-context"

type PomodoroContextType = {
  time: number
  isActive: boolean
  mode: "pomodoro" | "shortBreak" | "longBreak"
  selectedTaskId: string | null
  toggleTimer: () => void
  resetTimer: () => void
  setMode: (mode: "pomodoro" | "shortBreak" | "longBreak") => void
  setSelectedTaskId: (taskId: string | null) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider")
  }
  return context
}

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettingsContext()
  const [time, setTime] = useState(settings.pomodoro * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
      if (mode === "pomodoro") {
        setMode("shortBreak")
        setTime(settings.shortBreak * 60)
        if (settings.autoStartBreaks) setIsActive(true)
      } else {
        setMode("pomodoro")
        setTime(settings.pomodoro * 60)
        if (settings.autoStartPomodoros) setIsActive(true)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, mode, settings])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(settings.pomodoro * 60)
    setMode("pomodoro")
  }

  return (
    <PomodoroContext.Provider
      value={{
        time,
        isActive,
        mode,
        selectedTaskId,
        toggleTimer,
        resetTimer,
        setMode,
        setSelectedTaskId,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

