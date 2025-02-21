"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProjectContext } from "../contexts/project-context"

type CreateProjectModalProps = {
  isOpen: boolean
  onClose: () => void
}

const predefinedColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
]

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject } = useProjectContext()
  const [name, setName] = useState("")
  const [color, setColor] = useState(predefinedColors[0])
  const [isCustomColor, setIsCustomColor] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProject({ name, color })
    console.log("Adding project:", { name, color })
    onClose()
    setName("")
    setColor(predefinedColors[0])
    setIsCustomColor(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-5 gap-2">
            {predefinedColors.map((c) => (
              <button
                key={c}
                type="button"
                className={`w-8 h-8 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-black" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setColor(c)
                  setIsCustomColor(false)
                }}
              />
            ))}
            <button
              type="button"
              className={`w-8 h-8 rounded-full ${isCustomColor ? "ring-2 ring-offset-2 ring-black" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => setIsCustomColor(true)}
            >
              +
            </button>
          </div>
          {isCustomColor && (
            <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full" />
          )}
          <Button type="submit">Add Project</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

