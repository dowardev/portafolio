import { defineStore } from "pinia";
import { ref } from "vue";
import type { ProjectItem } from "@/services/types";

export const useProjectsStore = defineStore("projects", () => {
  const projects = ref<ProjectItem[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  function setProjects(data: ProjectItem[]): void {
    projects.value = data;
    loaded.value = true;
  }

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  function getProject(index: number): ProjectItem | undefined {
    return projects.value[index];
  }

  function addProject(project: ProjectItem): void {
    projects.value.push(project);
  }

  function updateProject(index: number, project: ProjectItem): void {
    if (index >= 0 && index < projects.value.length) {
      projects.value[index] = project;
    }
  }

  function deleteProject(index: number): void {
    if (index >= 0 && index < projects.value.length) {
      projects.value.splice(index, 1);
    }
  }

  function resetProjects(): void {
    projects.value = [];
    loaded.value = false;
  }

  return {
    projects,
    loading,
    loaded,
    setProjects,
    setLoading,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    resetProjects,
  };
});