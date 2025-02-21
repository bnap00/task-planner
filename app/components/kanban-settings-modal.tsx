"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useKanbanContext } from "../contexts/kanban-context"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

type KanbanSettingsModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function KanbanSettingsModal({ isOpen, onClose }: KanbanSettingsModalProps) {
  const { kanbanState, updateKanbanSettings } = useKanbanContext()
  const [columns, setColumns] = useState(kanbanState.columns)
  const [columnOrder, setColumnOrder] = useState(kanbanState.columnOrder)
  const [newColumnTitle, setNewColumnTitle] = useState("")

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: `column-${Date.now()}`,
        title: newColumnTitle.trim(),
        taskIds: [],
      }
      setColumns([...columns, newColumn])
      setColumnOrder([...columnOrder, newColumn.id])
      setNewColumnTitle("")
    }
  }

  const handleRemoveColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId))
    setColumnOrder(columnOrder.filter((id) => id !== columnId))
  }

  const handleSave = () => {
    updateKanbanSettings({
      columns,
      columnOrder,
    })
    onClose()
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.index === source.index) return

    const newColumnOrder = Array.from(columnOrder)
    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    setColumnOrder(newColumnOrder)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kanban Column Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="New column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <Button onClick={handleAddColumn}>Add</Button>
          </div>
          <i>use drag and drop to reorder</i>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {columnOrder.map((columnId, index) => {
                    const column = columns.find((col) => col.id === columnId)
                    if (!column) return null

                    return (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <span>{column.title}</span>
                            {column.id !== "todo" && column.id !== "done" && (
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveColumn(column.id)}>
                                Remove
                              </Button>
                            )}
                          </li>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

