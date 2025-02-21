"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";

export type Task = {
  id: string;
  title: string;
  description: string;
  url?: string;
  deadline?: string;
  quadrant: "do-first" | "schedule" | "delegate" | "dont-do";
  done: boolean;
  projectId?: string;
  pomodorosCompleted: number;
  estimatedPomodoros: number;
  hiddenFromKanban: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (
    task: Omit<Task, "id" | "done" | "pomodorosCompleted" | "hiddenFromKanban">
  ) => void;
  updateTask: (task: Task) => void;
  toggleTaskDone: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  incrementPomodoro: (taskId: string) => void;
  toggleHiddenFromKanban: (taskId: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("eisenhowerTasks", []);

  const toggleTaskDone = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const addTask = (
    task: Omit<Task, "id" | "done" | "pomodorosCompleted" | "hiddenFromKanban">
  ) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      done: false,
      pomodorosCompleted: 0,
      hiddenFromKanban: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const incrementPomodoro = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
          : task
      )
    );
  };

  const toggleHiddenFromKanban = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, hiddenFromKanban: !task.hiddenFromKanban }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        toggleTaskDone,
        deleteTask,
        incrementPomodoro,
        toggleHiddenFromKanban,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
