import APIController from "./APIController";
import ServerConfig from "./serverConfigController";
import Cookies from "js-cookie";
import type { FreelancePlatform, FreelanceComment, FreelanceItem } from "@/services/types";
import { useFreelanceStore } from "@/store/freelanceStore";
import { ToastController } from "./toastController";

const userToken = Cookies.get("user-token");
const config = new ServerConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  accessToken: userToken ?? "",
});
const api = new APIController(config);

interface FreelanceData {
  freelancePlatforms: FreelancePlatform[];
  freelanceComments: FreelanceComment[];
}

export default class FreelanceController {
  private freelanceStore = useFreelanceStore();
  private toastController = new ToastController();

  async loadFreelance(): Promise<FreelanceData> {
    this.freelanceStore.setLoading(true);
    try {
      const data = await api.get<{ freelance: FreelanceItem[] }>({
        url: "get-freelance",
      });

      const freelanceItems = data.freelance || [];
      const platforms: FreelancePlatform[] = freelanceItems.map(item => ({
        id: item.id || crypto.randomUUID(),
        name: item.name,
        image: item.image,
        url: item.url,
      }));
      const comments: FreelanceComment[] = freelanceItems
        .filter(item => !!item.comment)
        .map(item => ({
          id: crypto.randomUUID(),
          platformName: item.name,
          title: item.comment!.title,
          text: item.comment!.text,
          rating: item.comment!.rating,
        }));

      this.freelanceStore.setPlatforms(platforms);
      this.freelanceStore.setComments(comments);

      return { freelancePlatforms: platforms, freelanceComments: comments };
    } catch (error) {
      console.error("Error loading freelance:", error);
      return { freelancePlatforms: [], freelanceComments: [] };
    } finally {
      this.freelanceStore.setLoading(false);
    }
  }

  async saveFreelance(
    platforms: FreelancePlatform[],
    comments: FreelanceComment[],
    files?: Record<string, File>,
  ): Promise<void> {
    this.freelanceStore.setSaving(true);
    try {
      const formData = new FormData();
      formData.append("freelance", JSON.stringify(
        platforms.map((platform) => ({
          name: platform.name,
          image: platform.image,
          url: platform.url,
          comment: comments.find(c => c.platformName === platform.name) || null,
        }))
      ));

      if (files) {
        Object.entries(files).forEach(([key, file]) => {
          formData.append(key, file);
        });
      }

      await api.post({
        url: "admin/update-freelance",
        data: formData,
        contentType: "multipart/form-data",
      });

      this.freelanceStore.setPlatforms(platforms);
      this.freelanceStore.setComments(comments);
      const toast = await this.toastController.presentToast({
        message: "Guardado correctamente",
        duration: 2000,
        color: "success",
      });
      await toast.present();
    } catch (error) {
      console.error("Error saving freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al guardar",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  async addFreelance(freelance: FreelanceItem, imageFile?: File | null): Promise<FreelanceData> {
    this.freelanceStore.setSaving(true);
    try {
      const formData = new FormData();
      formData.append("freelance", JSON.stringify(freelance));

      if (imageFile) {
        formData.append("image", imageFile, "freelance.jpg");
      }

      const data = await api.post<{ freelance: FreelanceItem[] }>({
        url: "admin/add-freelance",
        data: formData,
        contentType: "multipart/form-data",
      });

      const result = this.setStoreFromData(data.freelance || []);
      const toast = await this.toastController.presentToast({
        message: "Trabajo freelance agregado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return result;
    } catch (error) {
      console.error("Error adding freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al agregar el trabajo freelance",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return { freelancePlatforms: [], freelanceComments: [] };
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  async updateFreelance(id: string, freelance: FreelanceItem, imageFile?: File | null): Promise<FreelanceData> {
    this.freelanceStore.setSaving(true);
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("freelance", JSON.stringify(freelance));

      if (imageFile) {
        formData.append("image", imageFile, "freelance.jpg");
      }

      const data = await api.post<{ freelance: FreelanceItem[] }>({
        url: "admin/update-freelance",
        data: formData,
        contentType: "multipart/form-data",
      });

      const result = this.setStoreFromData(data.freelance || []);
      const toast = await this.toastController.presentToast({
        message: "Trabajo freelance actualizado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return result;
    } catch (error) {
      console.error("Error updating freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al actualizar el trabajo freelance",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return { freelancePlatforms: [], freelanceComments: [] };
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  async deleteFreelance(id: string): Promise<FreelanceData> {
    this.freelanceStore.setSaving(true);
    try {
      const data = await api.post<{ freelance: FreelanceItem[] }>({
        url: "admin/delete-freelance",
        data: { id },
      });

      const result = this.setStoreFromData(data.freelance || []);
      const toast = await this.toastController.presentToast({
        message: "Trabajo freelance eliminado",
        duration: 2000,
        color: "success",
      });
      await toast.present();
      return result;
    } catch (error) {
      console.error("Error deleting freelance:", error);
      const toast = await this.toastController.presentToast({
        message: "Error al eliminar el trabajo freelance",
        duration: 2000,
        color: "danger",
      });
      await toast.present();
      return { freelancePlatforms: [], freelanceComments: [] };
    } finally {
      this.freelanceStore.setSaving(false);
    }
  }

  private setStoreFromData(items: FreelanceItem[]): FreelanceData {
    const platforms: FreelancePlatform[] = items.map(item => ({
      id: item.id || crypto.randomUUID(),
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

    this.freelanceStore.setPlatforms(platforms);
    this.freelanceStore.setComments(comments);

    return { freelancePlatforms: platforms, freelanceComments: comments };
  }
}