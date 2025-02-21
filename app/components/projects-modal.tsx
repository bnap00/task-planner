"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProjectContext } from "../contexts/project-context"
import { CreateProjectModal } from "./create-project-modal"

type ProjectsModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ITEMS_PER_PAGE = 10

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const { projects } = useProjectContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)
  const paginatedProjects = projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Projects</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={() => setIsCreateProjectModalOpen(true)}>Add Project</Button>
          {paginatedProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between">
              <span>{project.name}</span>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: project.color }} />
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
      <CreateProjectModal isOpen={isCreateProjectModalOpen} onClose={() => setIsCreateProjectModalOpen(false)} />
    </Dialog>
  )
}

