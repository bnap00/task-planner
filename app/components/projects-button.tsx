"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ProjectsModal } from "./projects-modal"

export function ProjectsButton() {
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsProjectsModalOpen(true)} variant="outline">
        Projects
      </Button>
      <ProjectsModal isOpen={isProjectsModalOpen} onClose={() => setIsProjectsModalOpen(false)} />
    </>
  )
}

