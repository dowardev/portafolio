import { useExperienceStore } from "@/store/experienceStore";
import type { ExperienceItem } from "@/services/homeApi";
import { ToastController } from "./toastController";

export default class ExperienceController {
  private experienceStore = useExperienceStore();
  private toastController = new ToastController();

  async loadExperiences() {
    if (!this.experienceStore.loaded || this.experienceStore.experiences.length === 0) {
      await this.experienceStore.loadExperiences();
    }
  }

  async loadPublicExperiences() {
    await this.loadExperiences();
  }

  getExperiences(): ExperienceItem[] {
    return this.experienceStore.experiences;
  }

  getExperience(index: number): ExperienceItem | undefined {
    return this.experienceStore.getExperience(index);
  }

  async saveExperience(experience: ExperienceItem, index?: number): Promise<boolean> {
    try {
      if (index !== undefined) {
        this.experienceStore.updateExperience(index, experience);
      } else {
        this.experienceStore.addExperience(experience);
      }
      await this.experienceStore.saveExperiences();
      return true;
    } catch (error) {
      console.error("Error saving experience:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar la experiencia",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteExperience(index: number): Promise<boolean> {
    try {
      this.experienceStore.deleteExperience(index);
      await this.experienceStore.saveExperiences();
      return true;
    } catch (error) {
      console.error("Error deleting experience:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar la experiencia",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async addExperience(experience: ExperienceItem): Promise<boolean> {
    return this.saveExperience(experience);
  }
}