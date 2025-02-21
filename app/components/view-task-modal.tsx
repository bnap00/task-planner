"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from "../contexts/task-context"

type ViewTaskModalProps = {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onUpdateTask: (task: Task) => void
}

export function ViewTaskModal({ isOpen, onClose, task, onUpdateTask }: ViewTaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  if (!editedTask) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedTask) {
      onUpdateTask(editedTask)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View/Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            required
          />
          <Textarea
            placeholder="Description"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
          <Input
            type="url"
            placeholder="URL (optional)"
            value={editedTask.url || ""}
            onChange={(e) => setEditedTask({ ...editedTask, url: e.target.value })}
          />
          <Input
            type="date"
            placeholder="Deadline (optional)"
            value={editedTask.deadline || ""}
            onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
          />
          <Select
            value={editedTask.quadrant}
            onValueChange={(value: Task["quadrant"]) => setEditedTask({ ...editedTask, quadrant: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quadrant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent-important">Urgent & Important</SelectItem>
              <SelectItem value="not-urgent-important">Not Urgent & Important</SelectItem>
              <SelectItem value="urgent-not-important">Urgent & Not Important</SelectItem>
              <SelectItem value="not-urgent-not-important">Not Urgent & Not Important</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Update Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

