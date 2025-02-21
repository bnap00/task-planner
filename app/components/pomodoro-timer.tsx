"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskContext } from "../contexts/task-context"
import { useSettingsContext } from "../contexts/settings-context"
import { usePomodoroContext } from "../contexts/pomodoro-context"
import { usePipContext } from "../contexts/pip-context"
import { Minimize2, Maximize2, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { SettingsModal } from "./settings-modal"

export function PomodoroTimer() {
  const { settings } = useSettingsContext()
  const { tasks } = useTaskContext()
  const { time, isActive, mode, selectedTaskId, toggleTimer, resetTimer, setMode, setSelectedTaskId } =
    usePomodoroContext()
  const { pipWindow, openPip, closePip } = usePipContext()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [showPipConfirmation, setShowPipConfirmation] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleOpenPip = async () => {
    if (!isActive && !settings.startPomodoroOnPip) {
      setShowPipConfirmation(true)
      return
    }
    await openPip()
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{formatTime(time)}</h2>
        <div className="space-y-2">
          <Button onClick={toggleTimer} className="w-full">
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetTimer} className="w-full">
            Reset
          </Button>
          <Button onClick={pipWindow ? closePip : handleOpenPip} className="w-full">
            {pipWindow ? <Maximize2 className="mr-2 h-4 w-4" /> : <Minimize2 className="mr-2 h-4 w-4" />}
            {pipWindow ? "Close PiP" : "Open PiP"}
          </Button>
          <Button onClick={() => setIsSettingsModalOpen(true)} className="w-full">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
        <Select
          value={mode}
          onValueChange={(value) => {
            const newMode = value as "pomodoro" | "shortBreak" | "longBreak"
            setMode(newMode)
            resetTimer()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pomodoro">Pomodoro</SelectItem>
            <SelectItem value="shortBreak">Short Break</SelectItem>
            <SelectItem value="longBreak">Long Break</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedTaskId || "none"}
          onValueChange={(value) => setSelectedTaskId(value === "none" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a task (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No task</SelectItem>
            {tasks
              .filter((task) => !task.done)
              .map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Dialog open={showPipConfirmation} onOpenChange={setShowPipConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Pomodoro Timer?</DialogTitle>
            <DialogDescription>Opening PiP will start the Pomodoro timer. Do you want to continue?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setShowPipConfirmation(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowPipConfirmation(false)
                openPip()
              }}
            >
              Start Pomodoro and Open PiP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  )
}
