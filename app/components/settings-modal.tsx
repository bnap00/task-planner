"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSettingsContext } from "../contexts/settings-context"

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettingsContext()
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(tempSettings)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pomodoro">Pomodoro Duration (minutes)</Label>
            <Input
              id="pomodoro"
              type="number"
              value={tempSettings.pomodoro}
              onChange={(e) => setTempSettings({ ...tempSettings, pomodoro: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="shortBreak">Short Break Duration (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              value={tempSettings.shortBreak}
              onChange={(e) => setTempSettings({ ...tempSettings, shortBreak: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="longBreak">Long Break Duration (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              value={tempSettings.longBreak}
              onChange={(e) => setTempSettings({ ...tempSettings, longBreak: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoStartBreaks"
              checked={tempSettings.autoStartBreaks}
              onCheckedChange={(checked) => setTempSettings({ ...tempSettings, autoStartBreaks: checked })}
            />
            <Label htmlFor="autoStartBreaks">Auto-start Breaks</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoStartPomodoros"
              checked={tempSettings.autoStartPomodoros}
              onCheckedChange={(checked) => setTempSettings({ ...tempSettings, autoStartPomodoros: checked })}
            />
            <Label htmlFor="autoStartPomodoros">Auto-start Pomodoros</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="startPomodoroOnPip"
              checked={tempSettings.startPomodoroOnPip}
              onCheckedChange={(checked) => setTempSettings({ ...tempSettings, startPomodoroOnPip: checked })}
            />
            <Label htmlFor="startPomodoroOnPip">Start Pomodoro when opening PiP</Label>
          </div>
          <Button type="submit">Save Settings</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

