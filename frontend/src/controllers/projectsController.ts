import { useProjectsStore } from "@/store/projectsStore";
import type { ProjectItem } from "@/services/homeApi";
import { ToastController } from "./toastController";

export default class ProjectsController {
  private projectsStore = useProjectsStore();
  private toastController = new ToastController();

  async loadProjects() {
    if (!this.projectsStore.loaded || this.projectsStore.projects.length === 0) {
      await this.projectsStore.loadProjects();
    }
  }

  async loadPublicProjects() {
    await this.loadProjects();
  }

  getProjects(): ProjectItem[] {
    return this.projectsStore.projects;
  }

  getProject(index: number): ProjectItem | undefined {
    return this.projectsStore.getProject(index);
  }

  async saveProject(project: ProjectItem, index?: number): Promise<boolean> {
    try {
      if (index !== undefined) {
        this.projectsStore.updateProject(index, project);
      } else {
        this.projectsStore.addProject(project);
      }
      await this.projectsStore.saveProjects();
      return true;
    } catch (error) {
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
      await this.projectsStore.saveProjects();
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