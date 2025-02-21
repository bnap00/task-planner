"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useProjectContext } from "../contexts/project-context";
import { useTaskContext, type Task } from "../contexts/task-context";

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
};

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { updateTask, deleteTask } = useTaskContext();
  const { projects } = useProjectContext();
  const [editedTask, setEditedTask] = useState<Task | null>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!editedTask) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTask) {
      updateTask(editedTask);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editedTask) {
      deleteTask(editedTask.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            required
          />
          <Textarea
            placeholder="Description"
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
          <Input
            type="date"
            value={editedTask.deadline || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, deadline: e.target.value })
            }
          />
          <Select
            value={editedTask.quadrant}
            onValueChange={(value: Task["quadrant"]) =>
              setEditedTask({ ...editedTask, quadrant: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quadrant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="do-first">Do First</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="delegate">Delegate</SelectItem>
              <SelectItem value="dont-do">Don&apos;t Do</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={editedTask.projectId || ""}
            onValueChange={(value) =>
              setEditedTask({ ...editedTask, projectId: value || undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Project</SelectItem>
            </SelectContent>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-between">
            <Button type="submit">Update Task</Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
