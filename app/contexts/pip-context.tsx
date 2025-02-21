"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePomodoroContext } from "./pomodoro-context"
import { useTaskContext } from "./task-context"

type PipContextType = {
  pipWindow: Window | null
  openPip: () => Promise<void>
  closePip: () => void
  updatePipContent: () => void
}

const PipContext = createContext<PipContextType | undefined>(undefined)

export const usePipContext = () => {
  const context = useContext(PipContext)
  if (!context) {
    throw new Error("usePipContext must be used within a PipProvider")
  }
  return context
}

export const PipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pipWindow, setPipWindow] = useState<Window | null>(null)
  const { time, isActive, mode, selectedTaskId, toggleTimer } = usePomodoroContext()
  const { tasks } = useTaskContext()

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const updatePipContent = useCallback(() => {
    if (pipWindow) {
      const timerElement = pipWindow.document.getElementById("pip-timer")
      const taskElement = pipWindow.document.getElementById("pip-task")
      const modeElement = pipWindow.document.getElementById("pip-mode")

      if (timerElement) {
        timerElement.textContent = formatTime(time)
      }

      if (taskElement) {
        const selectedTask = tasks.find((task) => task.id === selectedTaskId)
        taskElement.textContent = selectedTask ? selectedTask.title : "No task selected"
      }

      if (modeElement) {
        modeElement.textContent =
          mode === "pomodoro" ? "Focus and work" : `${mode === "shortBreak" ? "Short" : "Long"} break`
      }
    }
  }, [pipWindow, time, mode, selectedTaskId, tasks, formatTime])

  const openPip = async () => {
    if ("documentPictureInPicture" in window) {
      try {
        const pipWin = await window.documentPictureInPicture.requestWindow({
          width: 320,
          height: 240,
        })
        setPipWindow(pipWin)

        const doc = pipWin.document
        doc.body.innerHTML = `
          <div id="pip-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: Arial, sans-serif;">
            <h2 id="pip-timer" style="font-size: 3rem; margin-bottom: 1rem;"></h2>
            <p id="pip-task" style="font-size: 1rem;"></p>
            <p id="pip-mode" style="font-size: 1rem;"></p>
          </div>
        `
        updatePipContent()

        pipWin.addEventListener("pagehide", () => {
          setPipWindow(null)
        })

        if (!isActive) {
          toggleTimer()
        }
      } catch (error) {
        console.error("Failed to open PiP window:", error)
      }
    } else {
      alert("Document PiP is not supported in this browser.")
    }
  }

  const closePip = () => {
    if (pipWindow) {
      pipWindow.close()
      setPipWindow(null)
    }
  }

  useEffect(() => {
    updatePipContent()
  }, [updatePipContent])

  return (
    <PipContext.Provider value={{ pipWindow, openPip, closePip, updatePipContent }}>{children}</PipContext.Provider>
  )
}

