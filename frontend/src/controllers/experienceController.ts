import { useExperienceStore } from "@/store/experienceStore";
import type { ExperienceItem } from "@/services/types";
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

interface ExperienceResponse {
  experience: ExperienceItem[];
}

export default class ExperienceController {
  private experienceStore = useExperienceStore();
  private toastController = new ToastController();

  async loadPublicExperiences(): Promise<ExperienceItem[]> {
    if (this.experienceStore.loaded && this.experienceStore.experiences.length > 0) {
      return this.experienceStore.experiences;
    }
    this.experienceStore.setLoading(true);
    try {
      const data = await api.get<ExperienceResponse>({ url: "get-experiences" });
      this.experienceStore.setExperiences(data.experience || []);
      return data.experience || [];
    } catch (error) {
      console.error("Error loading experiences:", error);
      this.experienceStore.setExperiences([]);
      return [];
    } finally {
      this.experienceStore.setLoading(false);
    }
  }

  async loadExperiences(): Promise<void> {
    await this.loadPublicExperiences();
  }

  getExperiences(): ExperienceItem[] {
    return this.experienceStore.experiences;
  }

  getExperience(index: number): ExperienceItem | undefined {
    return this.experienceStore.getExperience(index);
  }

  async saveExperience(experience: ExperienceItem, index?: number): Promise<boolean> {
    try {
      this.experienceStore.setSaving(true);
      if (index !== undefined) {
        this.experienceStore.updateExperience(index, experience);
      } else {
        this.experienceStore.addExperience(experience);
      }

      const formData = new FormData();
      formData.append("experience", JSON.stringify(this.experienceStore.experiences));

      await api.post<ExperienceResponse>({
        url: "admin/update-experiences",
        data: formData,
        contentType: "multipart/form-data",
      });
      this.experienceStore.setSaving(false);
      return true;
    } catch (error) {
      this.experienceStore.setSaving(false);
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

  async addExperience(experience: ExperienceItem): Promise<boolean> {
    try {
      this.experienceStore.setSaving(true);

      const formData = new FormData();
      formData.append("experience", JSON.stringify(experience));

      if (experience.img) {
        const response = await fetch(experience.img);
        const blob = await response.blob();
        formData.append("image", blob, "experience.jpg");
      }

      const data = await api.post<ExperienceResponse>({
        url: "admin/add-experience",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.experienceStore.setExperiences(data.experience || []);
      this.experienceStore.setSaving(false);
      return true;
    } catch (error) {
      this.experienceStore.setSaving(false);
      console.error("Error adding experience:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la experiencia",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteExperience(id: string): Promise<boolean> {
    try {
      const data = await api.post<ExperienceResponse>({
        url: "admin/delete-experience",
        data: { id },
      });

      this.experienceStore.setExperiences(data.experience || []);
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
}