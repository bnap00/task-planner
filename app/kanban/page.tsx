"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Calendar,
  CheckSquare,
  Clock,
  ExternalLink,
  Folder,
  Settings,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CompletedTasksModal } from "../components/completed-tasks-modal";
import { KanbanSettingsModal } from "../components/kanban-settings-modal";
import { ProjectFilter } from "../components/project-filter";
import { useFilterContext } from "../contexts/filter-context";
import { useKanbanContext } from "../contexts/kanban-context";
import { useProjectContext } from "../contexts/project-context";
import { useTaskContext } from "../contexts/task-context";
import { useTaskKanbanSync } from "../hooks/use-task-kanban-sync";

export default function KanbanPage() {
  useTaskKanbanSync();
  const { kanbanState, moveTask } = useKanbanContext();
  const { tasks } = useTaskContext();
  const { projects } = useProjectContext();
  const { selectedProjects } = useFilterContext();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCompletedTasksModalOpen, setIsCompletedTasksModalOpen] =
    useState(false);

  const onDragEnd = useCallback(
    (result: any) => {
      const { destination, source, draggableId } = result;

      if (!destination) {
        return;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    },
    [moveTask]
  );
  
  const getColumnTasks = useCallback(
    (column: any) => {
      return column.taskIds
        .map((taskId: string) => tasks.find((task) => task.id === taskId))
        .filter(Boolean)
        .filter((task: any) => !task.hiddenFromKanban)
        .filter((task: any) =>
          selectedProjects.length === 0
            ? true
            : selectedProjects.includes("untagged")
            ? selectedProjects.includes(task.projectId || "untagged")
            : selectedProjects.includes(task.projectId || "")
        );
    },
    [tasks, selectedProjects]
  );

  const getQuadrantColor = useCallback((quadrant: string) => {
    switch (quadrant) {
      case "do-first":
        return "bg-red-500 text-white";
      case "schedule":
        return "bg-blue-500 text-white";
      case "delegate":
        return "bg-yellow-500 text-black";
      case "dont-do":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }, []);

  const getQuadrantText = useCallback((quadrant: string) => {
    switch (quadrant) {
      case "do-first":
        return "Do First";
      case "schedule":
        return "Schedule";
      case "delegate":
        return "Delegate";
      case "dont-do":
        return "Don't Do";
      default:
        return "Unknown";
    }
  }, []);

  const memoizedColumns = useMemo(() => {
    return kanbanState.columnOrder.map((columnId) => {
      const column = kanbanState.columns.find((col) => col.id === columnId);
      if (!column) return null;

      const columnTasks = getColumnTasks(column);

      return (
        <div
          key={column.id}
          className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.67rem)] xl:w-[calc(25%-0.75rem)]"
        >
          <div className="bg-muted p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="font-semibold">{column.title}</h2>
            <Badge variant="secondary">{columnTasks.length}</Badge>
          </div>
          <Droppable droppableId={column.id} type="task">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-muted/50 p-4 rounded-b-lg min-h-[300px]"
              >
                {columnTasks.map((task: any, index: number) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2 overflow-hidden"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg truncate mr-2">
                              {task.title}
                            </h3>
                            <Badge className={getQuadrantColor(task.quadrant)}>
                              {getQuadrantText(task.quadrant)}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs">
                            {task.deadline && (
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(task.deadline).toLocaleDateString()}
                              </div>
                            )}
                            {task.projectId && (
                              <div className="flex items-center">
                                <Folder className="w-3 h-3 mr-1" />
                                {
                                  projects.find((p) => p.id === task.projectId)
                                    ?.name
                                }
                              </div>
                            )}
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.pomodorosCompleted}/
                              {task.estimatedPomodoros}
                            </div>
                            {task.url && (
                              <a
                                className="flex items-center"
                                href={task.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                URL
                                <ExternalLink className="w-3 h-3 mr-1" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      );
    });
  }, [
    kanbanState,
    getColumnTasks,
    getQuadrantColor,
    projects,
    getQuadrantText,
  ]);

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCompletedTasksModalOpen(true)}>
            <CheckSquare className="mr-2 h-4 w-4" /> Completed Tasks
          </Button>
          <Button onClick={() => setIsSettingsModalOpen(true)}>
            <Settings className="mr-2 h-4 w-4" /> Kanban Column Settings
          </Button>
        </div>
      </div>
      <ProjectFilter />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-4">{memoizedColumns}</div>
      </DragDropContext>
      <KanbanSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <CompletedTasksModal
        isOpen={isCompletedTasksModalOpen}
        onClose={() => setIsCompletedTasksModalOpen(false)}
      />
    </div>
  );
}
