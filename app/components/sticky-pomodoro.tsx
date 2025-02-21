"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react"
import { PomodoroTimer } from "./pomodoro-timer"
import { usePomodoroContext } from "../contexts/pomodoro-context"
import { usePipContext } from "../contexts/pip-context"
import { useTaskContext } from "../contexts/task-context"

export function StickyPomodoro() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { time, isActive, mode, selectedTaskId, toggleTimer, resetTimer } = usePomodoroContext()
  const { pipWindow, openPip, closePip } = usePipContext()
  const { tasks } = useTaskContext()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const selectedTask = tasks.find((task) => task.id === selectedTaskId)

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-background border-t p-2 transition-all duration-300 ease-in-out ${
        isExpanded ? "h-auto" : "h-16"
      }`}
    >
      {isExpanded ? (
        <div className="container mx-auto">
          <Button onClick={() => setIsExpanded(false)} className="absolute top-2 right-2">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <PomodoroTimer />
        </div>
      ) : (
        <div className="container mx-auto flex justify-between items-center h-full">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">{formatTime(time)}</span>
            <span className="text-sm font-medium capitalize">{mode}</span>
            {selectedTask && (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{selectedTask.title}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={toggleTimer}>
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={resetTimer}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => (pipWindow ? closePip() : openPip())}>
              {pipWindow ? "Close PiP" : "Open PiP"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsExpanded(true)}>
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

