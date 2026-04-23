import { useProjectsStore } from "@/store/projectsStore";
import type { ProjectItem } from "@/services/types";
import { ToastController } from "./toastController";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface ProjectsResponse {
  projects: ProjectItem[];
}

export default class ProjectsController {
  private projectsStore = useProjectsStore();
  private toastController = new ToastController();

  async loadPublicProjects(): Promise<ProjectItem[]> {
    if (this.projectsStore.loaded && this.projectsStore.projects.length > 0) {
      return this.projectsStore.projects;
    }
    this.projectsStore.setLoading(true);
    try {
      const data = await api.get<ProjectsResponse>({ url: "get-projects" });
      this.projectsStore.setProjects(data.projects || []);
      return data.projects || [];
    } catch (error) {
      console.error("Error loading projects:", error);
      this.projectsStore.setProjects([]);
      return [];
    } finally {
      this.projectsStore.setLoading(false);
    }
  }

  async loadProjects(): Promise<void> {
    await this.loadPublicProjects();
  }

  getProjects(): ProjectItem[] {
    return this.projectsStore.projects;
  }

  getProject(index: number): ProjectItem | undefined {
    return this.projectsStore.getProject(index);
  }

  async saveProject(project: ProjectItem, index?: number): Promise<boolean> {
    try {
      this.projectsStore.setSaving(true);
      if (index !== undefined) {
        this.projectsStore.updateProject(index, project);
      } else {
        this.projectsStore.addProject(project);
      }

      const formData = new FormData();
      formData.append("projects", JSON.stringify(this.projectsStore.projects));

      await api.post<ProjectsResponse>({
        url: "admin/update-projects",
        data: formData,
        contentType: "multipart/form-data",
      });
      this.projectsStore.setSaving(false);
      return true;
    } catch (error) {
      this.projectsStore.setSaving(false);
      console.error("Error saving project:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar el proyecto",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteProject(index: number): Promise<boolean> {
    try {
      this.projectsStore.deleteProject(index);

      const formData = new FormData();
      formData.append("projects", JSON.stringify(this.projectsStore.projects));

      await api.post<ProjectsResponse>({
        url: "admin/update-projects",
        data: formData,
        contentType: "multipart/form-data",
      });
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el proyecto",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async addProject(project: ProjectItem): Promise<boolean> {
    return this.saveProject(project);
  }
}