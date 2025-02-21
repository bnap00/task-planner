import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { useProjectContext } from "../contexts/project-context";
import { useTaskContext } from "../contexts/task-context";

type ProjectListProps = {
  onFilterChange: (selectedProjects: string[]) => void;
};

export function ProjectList({ onFilterChange }: ProjectListProps) {
  const { projects } = useProjectContext();
  const { tasks } = useTaskContext();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) => {
      const newSelection = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      onFilterChange(newSelection);
      return newSelection;
    });
  };

  const projectsWithTasks = projects.filter((project) =>
    tasks.some((task) => task.projectId === project.id)
  );

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {projectsWithTasks.map((project) => (
        <Badge
          key={project.id}
          variant={
            selectedProjects.includes(project.id) ? "default" : "outline"
          }
          style={{
            backgroundColor: selectedProjects.includes(project.id)
              ? project.color
              : "transparent",
          }}
          onClick={() => toggleProject(project.id)}
        >
          {project.name} &nbsp;
          {selectedProjects.includes(project.id) ? (
            <X />
          ) : (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
          )}
        </Badge>
      ))}
    </div>
  );
}

