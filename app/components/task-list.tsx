import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useTaskContext, type Task } from "../contexts/task-context"
import { useProjectContext } from "../contexts/project-context"
import { Clock } from "lucide-react"
import { TaskInfoModal } from "./task-info-modal"

type TaskListProps = {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const { toggleTaskDone } = useTaskContext()
  const { projects } = useProjectContext()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleToggleTaskDone = (taskId: string) => {
    toggleTaskDone(taskId)
  }

  return (
    <>
      <ul className="space-y-2">
        {tasks.map((task) => {
          const project = projects.find((p) => p.id === task.projectId)
          return (
            <li key={task.id} className="flex items-center space-x-2">
              <Checkbox
                checked={task.done}
                onCheckedChange={() => handleToggleTaskDone(task.id)}
                onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking checkbox
              />
              <span
                className={`cursor-pointer flex-grow ${task.done ? "line-through text-gray-500" : ""}`}
                onClick={() => setSelectedTask(task)}
              >
                {task.title}
              </span>
              {project && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />}
              <div className="flex items-center space-x-1 ml-auto">
                <Clock className="w-4 w-4" />
                <span>
                  {task.pomodorosCompleted}/{task.estimatedPomodoros}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <TaskInfoModal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} task={selectedTask} />
    </>
  )
}

