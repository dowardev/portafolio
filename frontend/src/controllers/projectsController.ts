import { useProjectsStore } from "@/store/projectsStore";
import { storeToRefs } from "pinia";
import type { ProjectItem, TechnologyItem } from "@/services/types";
import { ToastController } from "./toastController";
import { getApiConnector } from "@/apiConnector";
import type { HttpClient } from "@tu-org/sso-client";

interface ProjectApiResponse {
  id: string;
  img: string;
  title: string;
  startDate?: string;
  endDate?: string;
  status: "progress" | "indeterminate" | "finished";
  description?: string;
  website?: string;
  source_name?: string;
  source_url?: string;
  technologies: TechnologyItem[];
}

interface ProjectsResponse {
  projects: ProjectApiResponse[];
}

interface ProjectApiResponseFull extends ProjectApiResponse {
  details: {
    description: string;
    website: string;
  };
  source: {
    name: string;
    url: string;
  };
}

interface ProjectItemResponse {
  project: ProjectApiResponseFull;
}

export default class ProjectsController {
  projectsStore = useProjectsStore();
  private toastController = new ToastController();

  async loadPublicProjects(): Promise<ProjectItem[]> {
    if (this.projectsStore.loaded && this.projectsStore.projects.length > 0) {
      return this.projectsStore.projects;
    }
    this.projectsStore.setLoading(true);
    try {
      const data = await getApiConnector().get<ProjectsResponse>("projects");
      const projects: ProjectItem[] = (data.projects || []).map(project => ({
        id: project.id,
        img: project.img,
        title: project.title,
        startDate: project.start_date,
        endDate: project.end_date,
        status: project.status,
        technologies: project.technologies || [],
        details: {
          description: project.description || "",
          website: project.website || ""
        },
        source: {
          name: project.source_name || "",
          url: project.source_url || ""
        }
      }));
      this.projectsStore.setProjects(projects);
      return projects;
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
      } else {
        formData.append("end_date", "");
      }
      if (project.details?.description) {
        formData.append("description", project.details.description);
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

      await getApiConnector().post<ProjectItemResponse>(
        "admin/projects",
        formData,
      );

      this.projectsStore.addProject(project);
      this.projectsStore.setProjects([...this.projectsStore.projects]);

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
      const index = this.projectsStore.projects.findIndex((p) => p.id === id);
      if (index === -1) return false;

      await getApiConnector().delete(`admin/projects/${id}`);

      this.projectsStore.deleteProject(index);
      this.projectsStore.setProjects([...this.projectsStore.projects]);

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
      const index = this.projectsStore.projects.findIndex((p) => p.id === id);
      if (index === -1) return false;

      const formData = new FormData();
      formData.append("title", project.title);
      if (project.startDate) {
        formData.append("start_date", project.startDate);
      }
      if (project.endDate) {
        formData.append("end_date", project.endDate);
      } else {
        formData.append("end_date", "");
      }
      if (project.details?.description) {
        formData.append("description", project.details.description);
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

      await getApiConnector().post<ProjectItemResponse>(
        `admin/projects/${id}`,
        formData,
      );

      this.projectsStore.updateProject(index, project);
      this.projectsStore.setProjects([...this.projectsStore.projects]);

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

  get projects() {
    return storeToRefs(this.projectsStore).projects;
  }

  get projectsLoading() {
    return storeToRefs(this.projectsStore).loading;
  }
}