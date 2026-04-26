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

interface ProjectItemResponse {
  project: ProjectItem;
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
      const data = await api.get<ProjectsResponse>({ url: "projects" });
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

  async addProject(project: ProjectItem, imageFile?: File | null, techFiles?: Record<number, File>): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("title", project.title);
      if (project.startDate) {
        formData.append("start_date", project.startDate);
      }
      if (project.endDate) {
        formData.append("end_date", project.endDate);
      }
      if (project.status) {
        formData.append("status", project.status);
      }
      if (project.description || project.details?.description) {
        formData.append("description", project.details?.description || project.description || "");
      }
      if (project.details?.website) {
        formData.append("website", project.details.website);
      }
      if (project.source?.name) {
        formData.append("source_name", project.source.name);
      }
      if (project.source?.url) {
        formData.append("source_url", project.source.url);
      }
      if (project.technologies) {
        formData.append("technologies", JSON.stringify(project.technologies));
      }

      if (imageFile) {
        formData.append("image", imageFile, "project.jpg");
      }
      if (techFiles) {
        for (const [index, file] of Object.entries(techFiles)) {
          formData.append(`techImage_${index}`, file, `tech_${index}.jpg`);
        }
      }

      await api.post<ProjectItemResponse>({
        url: "admin/projects",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadPublicProjects();

      const toast = await this.toastController.presentToast({
        message: "Proyecto agregado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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
      await api.delete({
        url: `admin/projects/${id}`,
      });

      await this.loadPublicProjects();

      const toast = await this.toastController.presentToast({
        message: "Proyecto eliminado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
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

  async updateProject(id: string, project: ProjectItem, imageFile?: File | null, techFiles?: Record<number, File>): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("title", project.title);
      if (project.startDate) {
        formData.append("start_date", project.startDate);
      }
      if (project.endDate) {
        formData.append("end_date", project.endDate);
      }
      if (project.status) {
        formData.append("status", project.status);
      }
      if (project.description || project.details?.description) {
        formData.append("description", project.details?.description || project.description || "");
      }
      if (project.details?.website) {
        formData.append("website", project.details.website);
      }
      if (project.source?.name) {
        formData.append("source_name", project.source.name);
      }
      if (project.source?.url) {
        formData.append("source_url", project.source.url);
      }
      if (project.technologies) {
        formData.append("technologies", JSON.stringify(project.technologies));
      }

      if (imageFile) {
        formData.append("image", imageFile, "project.jpg");
      }
      if (techFiles) {
        for (const [index, file] of Object.entries(techFiles)) {
          formData.append(`techImage_${index}`, file, `tech_${index}.jpg`);
        }
      }

      await api.post<ProjectItemResponse>({
        url: `admin/projects/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadPublicProjects();

      const toast = await this.toastController.presentToast({
        message: "Proyecto actualizado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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