import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskList } from "./task-list"
import type { Task } from "../contexts/task-context"

type QuadrantProps = {
  title: string
  subtitle: string
  quadrant: Task["quadrant"]
  onAddTask: () => void
  filteredTasks: Task[]
}

export function Quadrant({ title, subtitle, quadrant, onAddTask, filteredTasks }: QuadrantProps) {
  const quadrantTasks = filteredTasks.filter((t) => t.quadrant === quadrant && !t.done)

  return (
    <div className="border p-4 rounded h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <Button onClick={onAddTask} variant="ghost" size="icon">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        <TaskList tasks={quadrantTasks} />
      </div>
    </div>
  )
}

