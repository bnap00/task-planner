"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskContext, type Task } from "../contexts/task-context"
import { useProjectContext } from "../contexts/project-context"

type CreateTaskModalProps = {
  isOpen: boolean
  onClose: () => void
  preSelectedQuadrant?: Task["quadrant"]
}

export function CreateTaskModal({ isOpen, onClose, preSelectedQuadrant }: CreateTaskModalProps) {
  const { addTask } = useTaskContext()
  const { projects } = useProjectContext()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [deadline, setDeadline] = useState("")
  const [quadrant, setQuadrant] = useState<Task["quadrant"]>("do-first")
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)

  useEffect(() => {
    if (preSelectedQuadrant) {
      setQuadrant(preSelectedQuadrant)
    }
  }, [preSelectedQuadrant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask({ title, description, url, deadline, quadrant, projectId, estimatedPomodoros })
    onClose()
    setTitle("")
    setDescription("")
    setUrl("")
    setDeadline("")
    setQuadrant("do-first")
    setProjectId(undefined)
    setEstimatedPomodoros(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="url" placeholder="URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Input
            type="date"
            placeholder="Deadline (optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <Select value={quadrant} onValueChange={(value: Task["quadrant"]) => setQuadrant(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select quadrant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="do-first">Do First</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="delegate">Delegate</SelectItem>
              <SelectItem value="dont-do">Don't Do</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select project (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Unassigned</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Estimated Pomodoros"
            value={estimatedPomodoros}
            onChange={(e) => setEstimatedPomodoros(Number.parseInt(e.target.value))}
            min={1}
          />
          <Button type="submit">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

