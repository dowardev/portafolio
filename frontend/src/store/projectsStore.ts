import { defineStore } from "pinia";
import { ref } from "vue";
import type { ProjectItem } from "@/services/homeApi";
import homeApi from "@/services/homeApi";

export const useProjectsStore = defineStore("projects", () => {
  const projects = ref<ProjectItem[]>([]);
  const loading = ref(false);
  const saving = ref(false);
  const loaded = ref(false);

  async function loadProjects(): Promise<void> {
    if (loaded.value && projects.value.length > 0) return;

    loading.value = true;
    try {
      const data = await homeApi.getPublic();
      projects.value = data.projects || [];
      loaded.value = true;
    } catch (error) {
      console.error("Error loading projects:", error);
      projects.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function saveProjects(): Promise<void> {
    saving.value = true;
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify({ projects: projects.value }));
      await homeApi.update(formData);
    } catch (error) {
      console.error("Error saving projects:", error);
      throw error;
    } finally {
      saving.value = false;
    }
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
    saving,
    loaded,
    loadProjects,
    saveProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    resetProjects,
  };
});