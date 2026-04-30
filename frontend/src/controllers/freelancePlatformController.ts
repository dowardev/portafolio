import { useFreelancePlatformStore } from "@/store/freelancePlatformStore";
import { storeToRefs } from "pinia";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import type { FreelancePlatform } from "@/services/types";
import { ToastController } from "./toastController";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface FreelancePlatformsResponse {
  freelancePlatforms: FreelancePlatform[];
}

interface FreelancePlatformResponse {
  freelancePlatform: FreelancePlatform;
}

export default class FreelancePlatformController {
  private freelanceStore = useFreelancePlatformStore();
  private toastController = new ToastController();

  async loadFreelancePlatforms(): Promise<FreelancePlatform[]> {
    this.freelanceStore.setLoading(true);
    try {
      const data = await api.get<FreelancePlatformsResponse>({
        url: "freelance-platforms",
      });
      this.freelanceStore.setFreelancePlatforms(data.freelancePlatforms || []);
      return data.freelancePlatforms || [];
    } catch (error) {
      console.error("Error loading freelance platforms:", error);
      this.freelanceStore.setFreelancePlatforms([]);
      return [];
    } finally {
      this.freelanceStore.setLoading(false);
    }
  }

  getFreelancePlatforms(): FreelancePlatform[] {
    return this.freelanceStore.freelancePlatforms;
  }

  async addFreelancePlatform(platform: FreelancePlatform, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", platform.name);
      if (platform.url) {
        formData.append("url", platform.url);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post<FreelancePlatformResponse>({
        url: "admin/freelance-platforms",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadFreelancePlatforms();

      const toast = await this.toastController.presentToast({
        message: "Plataforma agregada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding freelance platform:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la plataforma",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateFreelancePlatform(id: number, platform: FreelancePlatform, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", platform.name);
      if (platform.url) {
        formData.append("url", platform.url);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post<FreelancePlatformResponse>({
        url: `admin/freelance-platforms/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadFreelancePlatforms();

      const toast = await this.toastController.presentToast({
        message: "Plataforma actualizada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating freelance platform:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar la plataforma",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteFreelancePlatform(id: number): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/freelance-platforms/${id}`,
      });

      await this.loadFreelancePlatforms();

      const toast = await this.toastController.presentToast({
        message: "Plataforma eliminada correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting freelance platform:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar la plataforma",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  get freelancePlatforms() {
    return storeToRefs(this.freelanceStore).freelancePlatforms;
  }
}