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

interface FreelanceLoadResult {
  freelancePlatforms: FreelancePlatform[];
  freelanceComments: FreelanceComment[];
}

export default class FreelanceController {
  private freelanceStore = useFreelanceStore();
  private toastController = new ToastController();

  async loadFreelance(): Promise<FreelanceLoadResult> {
    this.freelanceStore.setLoading(true);
    try {
      const data = await api.get<FreelancesResponse>({
        url: "freelances",
      });

      const items = data.freelances || [];

      const platforms: FreelancePlatform[] = items
        .filter(item => !item.comment_title && !item.comment_text)
        .map(item => ({
          id: String(item.id || crypto.randomUUID()),
          name: item.name,
          image: item.image,
          url: item.url,
        }));

      const comments: FreelanceComment[] = items
        .filter(item => !!item.comment_title || !!item.comment_text)
        .map(item => ({
          id: String(item.id || crypto.randomUUID()),
          title: item.name,
          text: item.comment_text,
          rating: item.comment_rating,
        }));

      this.freelanceStore.setFreelance(platforms, comments);
      return { freelancePlatforms: platforms, freelanceComments: comments };
    } catch (error) {
      console.error("Error loading freelance:", error);
      return { freelancePlatforms: [], freelanceComments: [] };
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

  async addFreelance(data: FreelanceItem | any, imageFile?: File | null): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.url) {
        formData.append("url", data.url);
      }
      if (imageFile) {
        formData.append("image", imageFile, "freelance.jpg");
      }

      await api.post<FreelanceResponse>({
        url: "admin/profile-platforms",
        data: formData,
        contentType: "multipart/form-data",
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Plataforma agregada",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding platform:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar la plataforma",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async addComment(data: { name: string; comment_text?: string; comment_rating?: number }): Promise<boolean> {
    try {
      await api.post<FreelanceResponse>({
        url: "admin/profile-comments",
        data,
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Comentario agregado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el comentario",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateComment(id: string, data: { name: string; comment_text?: string; comment_rating?: number }): Promise<boolean> {
    try {
      await api.post<FreelanceResponse>({
        url: `admin/profile-comments/${id}`,
        data,
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Comentario actualizado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error updating comment:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el comentario",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async deleteComment(id: string): Promise<boolean> {
    try {
      await api.delete({
        url: `admin/profile-comments/${id}`,
      });

      await this.loadFreelance();

      const toast = await this.toastController.presentToast({
        message: "Comentario eliminado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el comentario",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return false;
    }
  }

  async updateFreelance(id: string, data: FreelanceItem | any, imageFile?: File | null): Promise<boolean> {
    try {
      if (imageFile || (data as FreelanceItem).comment === null) {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.url) {
          formData.append("url", data.url);
        }
        if (imageFile) {
          formData.append("image", imageFile, "freelance.jpg");
        }

        await api.post<FreelanceResponse>({
          url: `admin/profile-platforms/${id}`,
          data: formData,
          contentType: "multipart/form-data",
        });
      }

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
        url: `admin/profile-platforms/${id}`,
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