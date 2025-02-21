"use client";

import { useEffect, useRef } from "react";
import { useKanbanContext } from "../contexts/kanban-context";
import { useTaskContext } from "../contexts/task-context";

export function useTaskKanbanSync() {
  const { tasks } = useTaskContext();
  const { kanbanState, updateKanbanSettings } = useKanbanContext();
  const prevTasksRef = useRef(tasks);
  const prevKanbanStateRef = useRef(kanbanState);

  useEffect(() => {
    if (
      JSON.stringify(tasks) === JSON.stringify(prevTasksRef.current) &&
      JSON.stringify(kanbanState) === JSON.stringify(prevKanbanStateRef.current)
    ) {
      return; // No changes, skip update
    }

    const updateKanbanState = () => {
      const newState = { ...kanbanState };
      const allTaskIds = tasks
        .filter((task) => !task.hiddenFromKanban)
        .map((task) => task.id);
      const assignedTaskIds = new Set(
        newState.columns.flatMap((column) => column.taskIds)
      );

      // Remove tasks that no longer exist or are hidden
      newState.columns.forEach((column) => {
        column.taskIds = column.taskIds.filter((id) => allTaskIds.includes(id));
      });

      // Add new tasks to Todo column and move completed tasks to Done column
      const todoColumn = newState.columns.find(
        (column) => column.id === "todo"
      );
      const doneColumn = newState.columns.find(
        (column) => column.id === "done"
      );

      if (todoColumn && doneColumn) {
        tasks.forEach((task) => {
          if (!task.hiddenFromKanban && !assignedTaskIds.has(task.id)) {
            if (task.done) {
              doneColumn.taskIds.push(task.id);
            } else {
              todoColumn.taskIds.push(task.id);
            }
          } else if (
            !task.hiddenFromKanban &&
            task.done &&
            !doneColumn.taskIds.includes(task.id)
          ) {
            // Move task to Done column if it's completed but not in the Done column
            newState.columns.forEach((column) => {
              if (column.id !== "done") {
                column.taskIds = column.taskIds.filter((id) => id !== task.id);
              }
            });
            doneColumn.taskIds.push(task.id);
          }
        });
      }

      updateKanbanSettings(newState);
    };

    updateKanbanState();
    prevTasksRef.current = tasks;
    prevKanbanStateRef.current = kanbanState;
  }, [tasks, kanbanState, updateKanbanSettings]);
}
