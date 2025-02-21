"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useTaskContext } from "./task-context"
import { useLocalStorage } from "../hooks/use-local-storage"

type Column = {
  id: string
  title: string
  taskIds: string[]
}

type KanbanState = {
  columns: Column[]
  columnOrder: string[]
}

type KanbanContextType = {
  kanbanState: KanbanState
  addColumn: (title: string) => void
  removeColumn: (columnId: string) => void
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void
  updateKanbanSettings: (newSettings: KanbanState) => void
  updateColumnOrder: (newOrder: string[]) => void
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined)

export const useKanbanContext = () => {
  const context = useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanbanContext must be used within a KanbanProvider")
  }
  return context
}

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tasks, toggleTaskDone } = useTaskContext()
  const [kanbanState, setKanbanState] = useLocalStorage<KanbanState>("kanbanState", {
    columns: [
      { id: "todo", title: "Todo", taskIds: [] },
      { id: "done", title: "Done", taskIds: [] },
    ],
    columnOrder: ["todo", "done"],
  })

  useEffect(() => {
    const updateKanbanState = () => {
      const newState = { ...kanbanState }
      const allTaskIds = tasks.map((task) => task.id)
      const assignedTaskIds = new Set(newState.columns.flatMap((column) => column.taskIds))

      // Remove tasks that no longer exist
      newState.columns.forEach((column) => {
        column.taskIds = column.taskIds.filter((id) => allTaskIds.includes(id))
      })

      // Add new tasks to Todo column
      const newTaskIds = allTaskIds.filter((id) => !assignedTaskIds.has(id))
      if (newTaskIds.length > 0) {
        newState.columns[0].taskIds.push(...newTaskIds)
        setKanbanState(newState)
      }
    }

    updateKanbanState()
  }, [tasks, kanbanState, setKanbanState])

  const addColumn = (title: string) => {
    const newColumnId = `column-${Date.now()}`
    setKanbanState((prevState) => ({
      columns: [...prevState.columns, { id: newColumnId, title, taskIds: [] }],
      columnOrder: [...prevState.columnOrder, newColumnId],
    }))
  }

  const removeColumn = (columnId: string) => {
    setKanbanState((prevState) => {
      const columnIndex = prevState.columnOrder.indexOf(columnId)
      if (columnIndex === -1) return prevState

      const newColumns = prevState.columns.filter((column) => column.id !== columnId)
      const newColumnOrder = prevState.columnOrder.filter((id) => id !== columnId)
      const removedColumn = prevState.columns.find((column) => column.id === columnId)

      if (removedColumn) {
        newColumns[0].taskIds = [...newColumns[0].taskIds, ...removedColumn.taskIds]
      }

      return { columns: newColumns, columnOrder: newColumnOrder }
    })
  }

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string, toIndex: number) => {
    setKanbanState((prevState) => {
      const newColumns = prevState.columns.map((column) => {
        if (column.id === fromColumnId) {
          return { ...column, taskIds: column.taskIds.filter((id) => id !== taskId) }
        }
        if (column.id === toColumnId) {
          const newTaskIds = Array.from(column.taskIds)
          newTaskIds.splice(toIndex, 0, taskId)
          return { ...column, taskIds: newTaskIds }
        }
        return column
      })

      // Update task status when moved from/to "Done" column
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        if (fromColumnId === "done" && toColumnId !== "done") {
          toggleTaskDone(taskId) // Mark as not done
        } else if (fromColumnId !== "done" && toColumnId === "done") {
          toggleTaskDone(taskId) // Mark as done
        }
      }

      return { ...prevState, columns: newColumns }
    })
  }

  const updateKanbanSettings = (newSettings: KanbanState) => {
    setKanbanState((prevState) => ({
      ...prevState,
      columns: newSettings.columns,
      columnOrder: newSettings.columnOrder,
    }))
  }

  const updateColumnOrder = (newOrder: string[]) => {
    setKanbanState((prevState) => ({
      ...prevState,
      columnOrder: newOrder,
    }))
  }

  return (
    <KanbanContext.Provider
      value={{
        kanbanState,
        addColumn,
        removeColumn,
        moveTask,
        updateKanbanSettings,
        updateColumnOrder,
      }}
    >
      {children}
    </KanbanContext.Provider>
  )
}

