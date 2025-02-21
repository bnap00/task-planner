"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useFilterContext } from "../contexts/filter-context";
import { useProjectContext } from "../contexts/project-context";
import { useTaskContext } from "../contexts/task-context";

export function ProjectFilter() {
  const { projects } = useProjectContext();
  const { tasks } = useTaskContext();
  const { selectedProjects, setSelectedProjects, showFilters, setShowFilters } =
    useFilterContext();

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const projectsWithTasks = [
    { id: "untagged", name: "Untagged" },
    ...projects.filter((project) =>
      tasks.some((task) => task.projectId === project.id)
    ),
  ];

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {projectsWithTasks.map((project) => (
          <Badge
            key={project.id}
            variant={
              selectedProjects.includes(project.id) ? "default" : "outline"
            }
            style={{
              backgroundColor: selectedProjects.includes(project.id)
                ? project.id === "untagged"
                  ? "gray"
                  : projects.find((p) => p.id === project.id)?.color
                : "transparent",
            }}
            onClick={() => toggleProject(project.id)}
          >
            {project.name} &nbsp;
            {selectedProjects.includes(project.id) ? (
              <X className="h-3 w-3" />
            ) : (
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    project.id === "untagged"
                      ? "gray"
                      : projects.find((p) => p.id === project.id)?.color,
                }}
              />
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}
