import { useFreelanceStore } from "@/store/freelanceStore";
import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import type { FreelancePlatform, FreelanceComment, FreelanceItem } from "@/services/types";
import { ToastController } from "./toastController";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface FreelancesResponse {
  freelances: FreelanceItem[];
}

interface FreelanceResponse {
  freelance: FreelanceItem;
}

export default class FreelanceController {
  private freelanceStore = useFreelanceStore();
  private toastController = new ToastController();

  async loadFreelance(): Promise<FreelancePlatform[]> {
    this.freelanceStore.setLoading(true);
    try {
      const data = await api.get<FreelancesResponse>({
        url: "freelances",
      });

      const items = data.freelances || [];

      const platforms: FreelancePlatform[] = items.map(item => ({
        id: String(item.id || crypto.randomUUID()),
        name: item.name,
        image: item.image,
        url: item.url,
      }));

      const comments: FreelanceComment[] = items
        .filter(item => !!item.comment)
        .map(item => ({
          id: crypto.randomUUID(),
          platformName: item.name,
          title: item.comment!.title,
          text: item.comment!.text,
          rating: item.comment!.rating,
        }));

      this.freelanceStore.setFreelance(platforms, comments);
      return platforms;
    } catch (error) {
      console.error("Error loading freelance:", error);
      return [];
    } finally {
      this.freelanceStore.setLoading(false);
    }
  }

  getPlatforms(): FreelancePlatform[] {
    return this.freelanceStore.platforms;
  }

  getComments(): FreelanceComment[] {
    return this.freelanceStore.comments;
  }

  getPlatform(index: number): FreelancePlatform | undefined {
    return this.freelanceStore.getPlatform(index);
  }

  getComment(index: number): FreelanceComment | undefined {
    return this.freelanceStore.getComment(index);
  }

  async addFreelance(freelance: FreelanceItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", freelance.name);
      if (freelance.url) {
        formData.append("url", freelance.url);
      }
      if (freelance.comment) {
        formData.append("comment_title", freelance.comment.title);
        formData.append("comment_text", freelance.comment.text);
        formData.append("comment_rating", String(freelance.comment.rating));
      }

      if (imageFile) {
        formData.append("image", imageFile, "freelance.jpg");
      }

      await api.post<FreelanceResponse>({
        url: "admin/freelances",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Trabajo freelance agregado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el trabajo freelance",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateFreelance(id: string, freelance: FreelanceItem, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", freelance.name);
      if (freelance.url) {
        formData.append("url", freelance.url);
      }
      if (freelance.comment) {
        formData.append("comment_title", freelance.comment.title);
        formData.append("comment_text", freelance.comment.text);
        formData.append("comment_rating", String(freelance.comment.rating));
      }

      if (imageFile) {
        formData.append("image", imageFile, "freelance.jpg");
      }

      await api.post<FreelanceResponse>({
        url: `admin/freelances/${id}`,
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Trabajo freelance actualizado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el trabajo freelance",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteFreelance(id: string): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/freelances/${id}`,
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Trabajo freelance eliminado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el trabajo freelance",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }
}