"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskContext, type Task } from "../contexts/task-context"
import { useProjectContext } from "../contexts/project-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type TaskInfoModalProps = {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

export function TaskInfoModal({ isOpen, onClose, task }: TaskInfoModalProps) {
  const { updateTask, deleteTask } = useTaskContext()
  const { projects } = useProjectContext()
  const [editedTask, setEditedTask] = useState<Task | null>(task)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  if (!isOpen || !editedTask) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedTask) {
      updateTask(editedTask)
      onClose()
    }
  }

  const handleDelete = () => {
    if (editedTask) {
      deleteTask(editedTask.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={editedTask.url || ""}
              onChange={(e) => setEditedTask({ ...editedTask, url: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={editedTask.deadline || ""}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="quadrant">Quadrant</Label>
            <Select
              value={editedTask.quadrant}
              onValueChange={(value: Task["quadrant"]) => setEditedTask({ ...editedTask, quadrant: value })}
            >
              <SelectTrigger id="quadrant">
                <SelectValue placeholder="Select quadrant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="do-first">Do First</SelectItem>
                <SelectItem value="schedule">Schedule</SelectItem>
                <SelectItem value="delegate">Delegate</SelectItem>
                <SelectItem value="dont-do">Don't Do</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="project">Project</Label>
            <Select
              value={editedTask.projectId || ""}
              onValueChange={(value) => setEditedTask({ ...editedTask, projectId: value || undefined })}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="estimatedPomodoros">Estimated Pomodoros</Label>
            <Input
              id="estimatedPomodoros"
              type="number"
              value={editedTask.estimatedPomodoros}
              onChange={(e) => setEditedTask({ ...editedTask, estimatedPomodoros: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <Label>Completed Pomodoros: {editedTask.pomodorosCompleted}</Label>
          </div>
          <div className="flex justify-between">
            <Button type="submit">Update Task</Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

