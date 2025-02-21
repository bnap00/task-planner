"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useLocalStorage } from "../hooks/use-local-storage"

export type Project = {
  id: string
  name: string
  color: string
}

type ProjectContextType = {
  projects: Project[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (project: Project) => void
  deleteProject: (projectId: string) => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const useProjectContext = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider")
  }
  return context
}

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useLocalStorage<Project[]>("eisenhowerProjects", [])

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: Date.now().toString() }
    setProjects((prevProjects) => [...prevProjects, newProject])
  }

  const updateProject = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
    )
  }

  const deleteProject = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId))
  }

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

