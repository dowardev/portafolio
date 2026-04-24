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

  async addProject(project: ProjectItem): Promise<boolean> {
    try {
      this.projectsStore.setSaving(true);

      const formData = new FormData();
      formData.append("project", JSON.stringify(project));

      if (project.img) {
        const response = await fetch(project.img);
        const blob = await response.blob();
        formData.append("image", blob, "project.jpg");
      }

      const data = await api.post<ProjectsResponse>({
        url: "admin/add-project",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.projectsStore.setProjects(data.projects || []);
      this.projectsStore.setSaving(false);
      return true;
    } catch (error) {
      this.projectsStore.setSaving(false);
      console.error("Error adding project:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el proyecto",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const data = await api.post<ProjectsResponse>({
        url: "admin/delete-project",
        data: { id },
      });

      this.projectsStore.setProjects(data.projects || []);
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

  async updateProject(id: string, project: ProjectItem): Promise<boolean> {
    try {
      this.projectsStore.setSaving(true);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("project", JSON.stringify(project));

      if (project.img) {
        const response = await fetch(project.img);
        const blob = await response.blob();
        formData.append("image", blob, "project.jpg");
      }

      const data = await api.post<ProjectsResponse>({
        url: "admin/update-project",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.projectsStore.setProjects(data.projects || []);
      this.projectsStore.setSaving(false);
      return true;
    } catch (error) {
      this.projectsStore.setSaving(false);
      console.error("Error updating project:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el proyecto",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }
}