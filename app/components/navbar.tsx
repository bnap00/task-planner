import { Button } from "@/components/ui/button"
import { PlusCircle, Moon, Sun, CheckSquare, FolderPlus, Settings } from "lucide-react"
import { useTheme } from "next-themes"

type NavbarProps = {
  onAddTask: () => void
  onViewCompleted: () => void
  onToggleTheme: () => void
  onAddProject: () => void
  onOpenSettings: () => void
}

export function Navbar({ onAddTask, onViewCompleted, onToggleTheme, onAddProject, onOpenSettings }: NavbarProps) {
  const { theme } = useTheme()

  return (
    <nav className="flex justify-between items-center mb-4 p-4 bg-background">
      <div className="space-x-2">
        <Button onClick={onAddTask} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
        <Button onClick={onAddProject} variant="outline">
          <FolderPlus className="mr-2 h-4 w-4" /> Add Project
        </Button>
        <Button onClick={onViewCompleted} variant="outline">
          <CheckSquare className="mr-2 h-4 w-4" /> Completed Tasks
        </Button>
      </div>
      <div className="space-x-2">
        <Button onClick={onOpenSettings} variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
        <Button onClick={onToggleTheme} variant="ghost" size="icon">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </nav>
  )
}

