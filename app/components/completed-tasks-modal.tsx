"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useKanbanContext } from "../contexts/kanban-context";
import { useTaskContext } from "../contexts/task-context";

type CompletedTasksModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ITEMS_PER_PAGE = 10;

export function CompletedTasksModal({
  isOpen,
  onClose,
}: CompletedTasksModalProps) {
  const { tasks, toggleTaskDone, deleteTask, toggleHiddenFromKanban } =
    useTaskContext();
  const { kanbanState, updateKanbanSettings } = useKanbanContext();
  const [currentPage, setCurrentPage] = useState(1);

  const completedTasks = tasks.filter((t) => t.done);
  const totalPages = Math.ceil(completedTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = completedTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleHideFromKanban = (taskId: string) => {
    toggleHiddenFromKanban(taskId);
  };

  const handleUndo = (taskId: string) => {
    toggleTaskDone(taskId);
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Completed Tasks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {paginatedTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <span className="truncate mr-2">{task.title}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUndo(task.id)}
                >
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleHideFromKanban(task.id)}
                >
                  {task.hiddenFromKanban
                    ? "Show in Kanban"
                    : "Hide from Kanban"}
                </Button>
              </div>
            </div>
          ))}
          {completedTasks.length === 0 && (
            <div className="text-center text-gray-500">No completed tasks</div>
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
