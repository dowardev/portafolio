import { useExperienceStore } from "@/store/experienceStore";
import { storeToRefs } from "pinia";
import type { ExperienceItem, TechnologyItem } from "@/services/types";
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

interface ExperienceApiResponse {
  id: string;
  img: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  website?: string;
  technologies: TechnologyItem[];
}

interface ExperiencesResponse {
  experiences: ExperienceApiResponse[];
}

interface ExperienceApiResponseFull extends ExperienceApiResponse {
  details: {
    description: string;
    website: string;
  };
}

interface ExperienceResponse {
  experience: ExperienceApiResponseFull;
}

export default class ExperienceController {
  experienceStore = useExperienceStore();
  private toastController = new ToastController();

  async loadPublicExperiences(): Promise<ExperienceItem[]> {
    if (this.experienceStore.loaded && this.experienceStore.experiences.length > 0) {
      return this.experienceStore.experiences;
    }
    this.experienceStore.setLoading(true);
    try {
      const data = await api.get<ExperiencesResponse>({ url: "experiences" });
      const experiences: ExperienceItem[] = (data.experiences || []).map(exp => ({
        id: exp.id,
        img: exp.img,
        title: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate,
        technologies: exp.technologies || [],
        details: {
          description: exp.description || "",
          website: exp.website || ""
        }
      }));
      this.experienceStore.setExperiences(experiences);
      return experiences;
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

  async addExperience(experience: ExperienceItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("title", experience.title);
      formData.append("start_date", experience.startDate);
      if (experience.endDate) {
        formData.append("end_date", experience.endDate);
      }
      if (experience.details?.description) {
        formData.append("description", experience.details.description);
      }
      if (experience.details?.website) {
        formData.append("website", experience.details.website);
      }
      if (experience.technologies) {
        formData.append("technologies", JSON.stringify(experience.technologies));
      }

      if (imageFile) {
        formData.append("image", imageFile, "experience.jpg");
      }

      await api.post<ExperienceResponse>({
        url: "admin/experiences",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.experienceStore.addExperience(experience);
      this.experienceStore.setExperiences([...this.experienceStore.experiences]);

      const toast = await this.toastController.presentToast({
        message: "Experiencia agregada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
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
      const index = this.experienceStore.experiences.findIndex((e) => e.id === id);
      if (index === -1) return false;

      await api.delete({
        url: `admin/experiences/${id}`,
      });

      this.experienceStore.deleteExperience(index);
      this.experienceStore.setExperiences([...this.experienceStore.experiences]);

      const toast = await this.toastController.presentToast({
        message: "Experiencia eliminada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
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

  async updateExperience(id: string, experience: ExperienceItem, imageFile?: File | null): Promise<boolean> {
    try {
      const index = this.experienceStore.experiences.findIndex((e) => e.id === id);
      if (index === -1) return false;

      const formData = new FormData();
      formData.append("title", experience.title);
      formData.append("start_date", experience.startDate);
      if (experience.endDate) {
        formData.append("end_date", experience.endDate);
      }
      if (experience.details?.description) {
        formData.append("description", experience.details.description);
      }
      if (experience.details?.website) {
        formData.append("website", experience.details.website);
      }
      if (experience.technologies) {
        formData.append("technologies", JSON.stringify(experience.technologies));
      }

      if (imageFile) {
        formData.append("image", imageFile, "experience.jpg");
      }

      await api.post<ExperienceResponse>({
        url: `admin/experiences/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      this.experienceStore.updateExperience(index, experience);
      this.experienceStore.setExperiences([...this.experienceStore.experiences]);

      const toast = await this.toastController.presentToast({
        message: "Experiencia actualizada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating experience:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar la experiencia",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  get experiences() {
    return storeToRefs(this.experienceStore).experiences;
  }

  get experiencesLoading() {
    return storeToRefs(this.experienceStore).loading;
  }
}