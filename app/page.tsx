"use client";

import { Button } from "@/components/ui/button";
import { CheckSquare, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { CompletedTasksModal } from "./components/completed-tasks-modal";
import { CreateTaskModal } from "./components/create-task-modal";
import { ProjectFilter } from "./components/project-filter";
import { ProjectsButton } from "./components/projects-button";
import { Quadrant } from "./components/quadrant";
import { SettingsModal } from "./components/settings-modal";
import { useFilterContext } from "./contexts/filter-context";
import { PipProvider } from "./contexts/pip-context";
import { PomodoroProvider } from "./contexts/pomodoro-context";
import { ProjectProvider } from "./contexts/project-context";
import { SettingsProvider } from "./contexts/settings-context";
import {
  TaskProvider,
  useTaskContext,
  type Task,
} from "./contexts/task-context";
import { useTaskKanbanSync } from "./hooks/use-task-kanban-sync";

function EisenhowerMatrixContent() {
  useTaskKanbanSync();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [preSelectedQuadrant, setPreSelectedQuadrant] = useState<
    Task["quadrant"] | undefined
  >(undefined);
  const { tasks } = useTaskContext();

  const { selectedProjects } = useFilterContext();

  const filteredTasks = useMemo(() => {
    if (selectedProjects.length === 0) {
      return tasks;
    }
    return tasks.filter((task) =>
      selectedProjects.includes("untagged")
        ? task.projectId === undefined ||
          selectedProjects.includes(task.projectId)
        : selectedProjects.includes(task.projectId || "")
    );
  }, [tasks, selectedProjects]);

  const handleAddTask = (quadrant: Task["quadrant"]) => {
    setPreSelectedQuadrant(quadrant);
    setIsCreateTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <div className="flex flex-wrap justify-end items-center mb-4 gap-2">
          <Button
            onClick={() => setIsCreateTaskModalOpen(true)}
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
          </Button>
          <Button
            onClick={() => setIsCompletedModalOpen(true)}
            variant="outline"
          >
            <CheckSquare className="mr-2 h-4 w-4" /> Completed Tasks
          </Button>
          <ProjectsButton />
        </div>
        <ProjectFilter />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
          <Quadrant
            title="Do First"
            subtitle="Urgent & Important"
            quadrant="do-first"
            onAddTask={() => handleAddTask("do-first")}
            filteredTasks={filteredTasks}
          />
          <Quadrant
            title="Schedule"
            subtitle="Not Urgent & Important"
            quadrant="schedule"
            onAddTask={() => handleAddTask("schedule")}
            filteredTasks={filteredTasks}
          />
          <Quadrant
            title="Delegate"
            subtitle="Urgent & Not Important"
            quadrant="delegate"
            onAddTask={() => handleAddTask("delegate")}
            filteredTasks={filteredTasks}
          />
          <Quadrant
            title="Don't Do"
            subtitle="Not Urgent & Not Important"
            quadrant="dont-do"
            onAddTask={() => handleAddTask("dont-do")}
            filteredTasks={filteredTasks}
          />
        </div>
      </main>
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setPreSelectedQuadrant(undefined);
        }}
        preSelectedQuadrant={preSelectedQuadrant}
      />
      <CompletedTasksModal
        isOpen={isCompletedModalOpen}
        onClose={() => setIsCompletedModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export default function EisenhowerMatrix() {
  return (
    <SettingsProvider>
      <ProjectProvider>
        <TaskProvider>
          <PomodoroProvider>
            <PipProvider>
              <EisenhowerMatrixContent />
            </PipProvider>
          </PomodoroProvider>
        </TaskProvider>
      </ProjectProvider>
    </SettingsProvider>
  );
}
